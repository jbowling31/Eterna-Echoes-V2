// docs/js/battle/battle.engine.js
// Final-Fantasy style battle engine (Speed / Initiative).
//
// Goals (what you asked for):
// - Speed-based action bar (initiative): whoever's up is auto-selected.
// - Commands: Attack / Skills / Items (wired later) / Guard / Flee.
// - Skills: Basic + Skill1 + Skill2 + Ultimate (locked until ready).
// - Cooldown only (no mana), target then confirm/execute.
// - Enemies have skills + status effects.
// - Future-proof for >2 enemies.

import { HEROES } from "../heroes/heroes.data.js";
import { getHeroLevel } from "../heroes/hero.progress.state.js";
import { getSkillDef, getEnemySkillDef } from "../skills/skills.data.js";

// Tunables
const ENERGY_MAX = 100;
const BASE_TICK = 1000; // initiative distance per action; lower = faster turns

// Lightweight status helpers
const STATUS = {
  BURN: "Burn",
  ATK_DOWN: "ATK Down",
  DEF_UP: "DEF Up",
  TAUNT: "Taunt",
  STEALTH: "Stealth",
  FREEZE: "Freeze",
  STUN: "Stun",
  LOOP_LOCK: "Loop Lock",
  INVULN: "Invulnerable",
  REFLECT: "Reflect",
  ULT_LOCK: "Ult Lock",
};

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function irand(n){ return Math.floor(Math.random() * n); }
function chance(pct){
  const p = Number(pct || 0);
  // Support 0–1 OR 0–100 inputs; your skill data mostly uses 0–100.
  const normalized = p <= 1 ? (p * 100) : p;
  return Math.random() * 100 < normalized;
}

function statScale(level){
  // prototype scaling. You can replace with your real stat system later.
  const L = Math.max(1, Math.floor(level || 1));
  return {
    maxHp: 95 + L * 14,
    atk:  14 + L * 3.3,
    def:   7 + L * 2.0,
    spd:  95 + L * 1.2,
  };
}

function makeHeroUnit(heroId){
  const h = (HEROES || []).find(x => x.id === heroId) || { id: heroId, name: heroId, skills: [] };
  const lvl = getHeroLevel(heroId);
  const base = statScale(lvl);

  return {
    side: "hero",
    id: h.id,
    name: h.name,
    level: lvl,
    element: h.element || "",
    role: h.role || "",

    maxHp: Math.floor(base.maxHp),
    hp: Math.floor(base.maxHp),
    atk: Math.floor(base.atk),
    def: Math.floor(base.def),
    spd: Math.floor(base.spd),

    energy: 0,

    // cooldowns: { skillId: turnsRemaining }
    cds: {},

    // statuses: [{name, turns, meta?}]
    statuses: [],

    // initiative
    nextActAt: Math.random() * 250,

    // skills
    skillIds: buildHeroSkillIds(h.id, h.skills),
  };
}

function buildHeroSkillIds(heroId, listed){
  const out = [];
  // Basic (if exists)
  const basicId = `${heroId}_basic`;
  if (getSkillDef(basicId)) out.push(basicId);
  // Provided skills (Skill1/Skill2/Ultimate)
  for (const id of (listed || [])){
    if (getSkillDef(id)) out.push(id);
  }
  return out;
}

function makeEnemyUnit(enemyDef, idx, scaleMult=1){
  const e = enemyDef || {};
  const spd = Math.max(40, Math.floor(e.spd ?? (92 + irand(18))));
  return {
    side: "enemy",
    id: e.id || `enemy_${idx}`,
    name: e.name || e.id || `Enemy ${idx+1}`,
    element: e.element || "",

    maxHp: Math.floor((e.maxHp ?? 80) * scaleMult),
    hp: Math.floor((e.maxHp ?? 80) * scaleMult),
    atk: Math.floor((e.atk ?? 12) * scaleMult),
    def: Math.floor((e.def ?? 6) * scaleMult),
    spd,

    energy: 0,
    cds: {},
    statuses: [],
    nextActAt: Math.random() * 250,

    // Enemy skill IDs (structured)
    skillIds: Array.isArray(e.skillIds) ? e.skillIds.slice() : [],

    // For UI art fallback
    art: e.art,
  };
}

function isAlive(u){ return (u?.hp ?? 0) > 0; }

function hasStatus(u, name){
  return (u?.statuses || []).some(s => s.name === name && s.turns > 0);
}

function addStatus(u, name, turns, meta){
  if (!u) return;
  const t = Math.max(0, Math.floor(turns || 0));
  if (!t) return;

  // refresh if exists
  const ex = (u.statuses || []).find(s => s.name === name);
  if (ex){
    ex.turns = Math.max(ex.turns, t);
    if (meta) ex.meta = { ...(ex.meta || {}), ...meta };
    return;
  }
  u.statuses.push({ name, turns: t, meta: meta || null });
}

function tickStatusesEndOfTurn(u, state){
  if (!u) return;

  // Burn DoT ticks at end of unit's turn (simple)
  const burn = (u.statuses || []).find(s => s.name === STATUS.BURN && s.turns > 0);
  if (burn){
    const dmg = Math.max(1, Math.floor(u.maxHp * 0.05));
    applyDamage(state, u, dmg, { source: "Burn" });
    log(state, `${u.name} takes ${dmg} Burn damage.`);
  }

  // Decrement durations
  for (const s of (u.statuses || [])){
    if (s.turns > 0) s.turns -= 1;
  }

  // cleanup
  u.statuses = (u.statuses || []).filter(s => s.turns > 0);
}

function tickCooldownsOnOwnTurn(u){
  if (!u?.cds) return;
  for (const k of Object.keys(u.cds)){
    u.cds[k] = Math.max(0, Math.floor(u.cds[k] - 1));
    if (u.cds[k] <= 0) delete u.cds[k];
  }
}

function log(state, msg){
  state.log.push(String(msg));
  if (state.log.length > 120) state.log.shift();
}

function applyDamage(state, target, amount, meta={}) {
  if (!target || !isAlive(target)) return 0;
  if (hasStatus(target, STATUS.INVULN)){
    log(state, `${target.name} ignores the hit.`);
    return 0;
  }

  const raw = Math.max(1, Math.floor(amount || 1));

  // ✅ OPTION A: reflect is based on incoming damage BEFORE shield
  const incomingForReflect = raw;

  let dmg = raw;

  // Shields absorb damage first
  const sh = Math.max(0, Math.floor(target.shield || 0));
  if (sh > 0){
    const absorb = Math.min(sh, dmg);
    target.shield = sh - absorb;
    dmg -= absorb;
    if (absorb > 0) log(state, target.name + "'s shield absorbs " + absorb + ".");
  }

  // Gain energy when hit (even if shield absorbed it all)
  target.energy = clamp(target.energy + 10, 0, ENERGY_MAX);

  // ✅ Reflect: bounce a % of INCOMING (pre-shield) damage back to attacker
  const refl = (target.statuses || []).find(s => s.name === STATUS.REFLECT && s.turns > 0);
  if (refl && meta?.attacker && isAlive(meta.attacker)) {
    const rawPct = Number(refl.meta?.pct ?? 0.20);
    const pct = rawPct <= 1 ? rawPct : (rawPct / 100);
    const ref = Math.max(1, Math.floor(incomingForReflect * pct));
    meta.attacker.hp = Math.max(0, meta.attacker.hp - ref);
    log(state, `${target.name} reflects ${ref} damage back to ${meta.attacker.name}.`);
  }

  // If shield absorbed everything, HP takes 0 — but reflect already happened
  if (dmg <= 0) return 0;

  target.hp = Math.max(0, target.hp - dmg);

  if (target.hp <= 0){
    log(state, `${target.name} was defeated.`);
  }

  return dmg;
}

function computeDamage(attacker, target, pct){
  let aAtk = Math.max(1, attacker?.atk || 1);
  let tDef = Math.max(0, target?.def || 0);

  // ATK Down reduces attacker output
  if (hasStatus(attacker, STATUS.ATK_DOWN)) {
    aAtk = Math.max(1, Math.floor(aAtk * 0.70));
  }

  // DEF Up increases defender mitigation (uses meta.pct if present, defaults to 30%)
  const defUp = (target?.statuses || []).find(s => s.name === STATUS.DEF_UP && s.turns > 0);
  if (defUp){
    const pctUp = Number(defUp.meta?.pct ?? 30);
    tDef = Math.floor(tDef * (1 + (pctUp / 100)));
  }

  // prototype formula
  const base = aAtk * (pct / 100);
  const reduced = base * (100 / (100 + tDef * 4));

  return Math.max(1, Math.floor(reduced));
}

function getTauntTarget(state, enemySide){
  // If anyone on enemySide has Taunt, must target them.
  const list = enemySide === "enemy" ? state.enemies : state.heroes;
  const idx = list.findIndex(u => isAlive(u) && hasStatus(u, STATUS.TAUNT));
  return idx >= 0 ? idx : -1;
}

function listLivingIndices(list){
  const out = [];
  for (let i=0;i<list.length;i++) if (isAlive(list[i])) out.push(i);
  return out;
}

function pickNextActor(state){
  const all = [];
  for (let i=0;i<state.heroes.length;i++) if (isAlive(state.heroes[i])) all.push({ side:"hero", idx:i, at: state.heroes[i].nextActAt });
  for (let i=0;i<state.enemies.length;i++) if (isAlive(state.enemies[i])) all.push({ side:"enemy", idx:i, at: state.enemies[i].nextActAt });
  if (!all.length) return null;

  all.sort((a,b) => a.at - b.at);
  return { side: all[0].side, idx: all[0].idx };
}

function advanceActorTime(state, actor){
  const u = actor.side === "hero" ? state.heroes[actor.idx] : state.enemies[actor.idx];
  if (!u) return;
  const spd = Math.max(1, u.spd || 1);
  u.nextActAt += (BASE_TICK / spd) * 100; // scaled so numbers feel nice
}

function checkWinner(state){
  const heroesAlive = state.heroes.some(isAlive);
  const enemiesAlive = state.enemies.some(isAlive);

  if (!heroesAlive && enemiesAlive) return "enemies";
  if (heroesAlive && !enemiesAlive) return "heroes";
  if (!heroesAlive && !enemiesAlive) return "draw";
  return null;
}

function canUseSkill(state, actorUnit, skillId){
  if (!actorUnit || !skillId) return { ok:false, reason:"No skill" };

  const def = actorUnit.side === "enemy" ? (getEnemySkillDef(skillId) || getSkillDef(skillId)) : getSkillDef(skillId);
  if (!def) return { ok:false, reason:"Unknown skill" };
  // loop lock disables non-basic skills (basic attack still allowed)
  const isBasic = String(def.slot || "").toLowerCase().includes("basic");
  if (!isBasic && hasStatus(actorUnit, STATUS.LOOP_LOCK)) return { ok:false, reason:"Loop locked" };


  // cooldown
  const cdLeft = actorUnit.cds?.[skillId] || 0;
  if (cdLeft > 0) return { ok:false, reason:`Cooldown ${cdLeft}` };

  // ult lock status
  const isUlt = String(def.slot || "").toLowerCase().includes("ultimate") || (def.energyCost || 0) >= 100;
  if (isUlt && hasStatus(actorUnit, STATUS.ULT_LOCK)) return { ok:false, reason:"Ult locked" };

  // energy
  const cost = Math.max(0, Math.floor(def.energyCost || 0));
  if (cost > 0 && actorUnit.energy < cost) return { ok:false, reason:"Not ready" };

  return { ok:true, def };
}

function applySkill(state, actor, actorUnit, skillId, target){
  const chk = canUseSkill(state, actorUnit, skillId);
  if (!chk.ok) return { ok:false, reason: chk.reason };

  const def = chk.def;
  actorUnit.lastSkillId = skillId;
  const cost = Math.max(0, Math.floor(def.energyCost || 0));

  // spend energy
  if (cost > 0) actorUnit.energy = clamp(actorUnit.energy - cost, 0, ENERGY_MAX);

  // set cooldown
  const cd = Math.max(0, Math.floor(def.cdTurns || 0));
  if (cd > 0) actorUnit.cds[skillId] = cd;

  // basic energy gain (prototype): using a skill builds meter
  actorUnit.energy = clamp(actorUnit.energy + 20, 0, ENERGY_MAX);

  // Resolve target group
  const tgt = target || {};

  const logUse = (extra="") => {
    log(state, `${actorUnit.name} uses ${def.name}${extra}`.trim());
  };

  const doDamageTo = (tUnit, pct) => {
    const dmg = computeDamage(actorUnit, tUnit, pct);
    const dealt = applyDamage(state, tUnit, dmg, { attacker: actorUnit, skillId });
    log(state, `${actorUnit.name} hits ${tUnit.name} for ${dealt}.`);
    // lifesteal: heal % of actual HP damage dealt (post-shield)
    const ls = Number(def.lifestealPct ?? def.lifesteal ?? 0);
    if (ls > 0 && dealt > 0){
      const pctLS = ls <= 1 ? ls : (ls / 100);
      const healAmt = Math.max(1, Math.floor(dealt * pctLS));
      actorUnit.hp = Math.min(actorUnit.maxHp, actorUnit.hp + healAmt);
      log(state, `${actorUnit.name} steals ${healAmt} HP.`);
    }
  };

  const doFlatDamageTo = (tUnit, flat) => {
    const dmg = Math.max(1, Math.floor(flat || 1));
    const dealt = applyDamage(state, tUnit, dmg, { attacker: actorUnit, skillId });
    log(state, `${actorUnit.name} hits ${tUnit.name} for ${dealt}.`);
    const ls = Number(def.lifestealPct ?? def.lifesteal ?? 0);
    if (ls > 0 && dealt > 0){
      const pctLS = ls <= 1 ? ls : (ls / 100);
      const healAmt = Math.max(1, Math.floor(dealt * pctLS));
      actorUnit.hp = Math.min(actorUnit.maxHp, actorUnit.hp + healAmt);
      log(state, `${actorUnit.name} steals ${healAmt} HP.`);
    }
  };

  const doHealTo = (tUnit, pct) => {
    const aAtk = Math.max(1, actorUnit.atk || 1);
    const heal = Math.max(1, Math.floor(aAtk * (pct / 100)));
    tUnit.hp = Math.min(tUnit.maxHp, tUnit.hp + heal);
    log(state, `${actorUnit.name} heals ${tUnit.name} for ${heal}.`);
  };

  const addShieldPts = (tUnit, pts) => {
    const add = Math.max(1, Math.floor(pts || 1));
    const cap = Math.floor((tUnit.maxHp || 100) * 2);
    tUnit.shield = Math.min(cap, Math.floor((tUnit.shield || 0) + add));
    log(state, `${tUnit.name} gains ${add} Shield.`);
  };

  const doShieldTo = (tUnit, pct) => {
    // Legacy "kind: shield" path: DEF-scaling-ish prototype.
    const aDef = Math.max(1, actorUnit.def || 1);
    const shield = Math.max(1, Math.floor(aDef * (pct / 100) * 12));
    addShieldPts(tUnit, shield);
  };

  const applyExtraFieldsSingleTarget = () => {
    // Supports skill defs with def.shield / def.reflectPct even if kind is utility/buff.
    let u = actorUnit;
    if (String(def.target || '').toLowerCase() === 'self') {
      u = actorUnit;
    } else {
      u = resolveSingleTarget(state, actorUnit, tgt) || actorUnit;
    }

    if (def.shield) {
      const base = Number(def.shield.base || 0);
      const hpPct = Number(def.shield.hpPct || 0);
      const pts = Math.max(1, Math.floor(base + (u.maxHp || actorUnit.maxHp || 100) * hpPct));
      addShieldPts(u, pts);
    }

    if (def.reflectPct) {
      const turns = Math.max(1, Math.floor(def.reflectTurns || 1));
      addStatus(u, STATUS.REFLECT, turns, { pct: def.reflectPct });
      log(state, `${u.name} gains Reflect (${turns}t).`);
    }
  };

  // ===== main effect =====
  const pct = Number(def.basePct || 0);

  if (def.kind === "damage"){
    logUse();
    if (tgt.mode === "all_enemies"){
      const list = actorUnit.side === "hero" ? state.enemies : state.heroes;
      for (const u of list) if (isAlive(u)) doDamageTo(u, pct);
    } else {
      const u = resolveSingleTarget(state, actorUnit, tgt);
      if (u) doDamageTo(u, pct);
    }

  } else if (def.kind === "heal"){
    logUse();
    if (tgt.mode === "all_allies"){
      const list = actorUnit.side === "hero" ? state.heroes : state.enemies;
      for (const u of list) if (isAlive(u)) doHealTo(u, pct);

    } else if (tgt.mode === "lowest_ally"){
      const list = actorUnit.side === "hero" ? state.heroes : state.enemies;
      let best = null;
      for (const u of list){
        if (!isAlive(u)) continue;
        const frac = u.hp / u.maxHp;
        if (!best || frac < (best.hp / best.maxHp)) best = u;
      }
      if (best) doHealTo(best, pct);

    } else {
      const u = resolveSingleTarget(state, actorUnit, tgt);
      if (u) doHealTo(u, pct);
    }

  } else if (def.kind === "shield"){
    logUse();
    const u = resolveSingleTarget(state, actorUnit, tgt) || actorUnit;
    doShieldTo(u, pct);

  } else if (def.kind === "hybrid"){
    // e.g. Vireon_u (Phoenix Barrier): damage ALL enemies + shield ALL allies.
    logUse();

    if (def.dmgAll){
      const list = actorUnit.side === "hero" ? state.enemies : state.heroes;
      const base = Number(def.dmgAll.base || 0);
      const atkPct = Number(def.dmgAll.atkPct || 0);
      for (const u of list){
        if (!isAlive(u)) continue;
        const flat = base + (actorUnit.atk || 0) * atkPct;
        doFlatDamageTo(u, flat);
      }
    }

    if (def.shieldAll){
      const list = actorUnit.side === "hero" ? state.heroes : state.enemies;
      const base = Number(def.shieldAll.base || 0);
      const hpPct = Number(def.shieldAll.hpPct || 0);
      for (const u of list){
        if (!isAlive(u)) continue;
        const pts = base + (u.maxHp || 0) * hpPct;
        addShieldPts(u, pts);
      }
    }

    // Hybrid skills can also carry status payloads, handled below.

  } else if (def.kind === "buff" || def.kind === "utility" || def.kind === "support" || def.kind === "control" || def.kind === "debuff"){
    logUse();
    // Let status payload do most work; also support custom shield/reflect fields.
    applyExtraFieldsSingleTarget();

  } else {
    logUse();
  }

  // apply status payload if any
  if (def.status){
    applyStatusPayload(state, actorUnit, def.status, tgt);
  }

  // Apply extra fields even for damage/heal/etc if present (e.g. utility shield without kind=shield)
  if ((def.shield || def.reflectPct) && def.kind !== 'buff' && def.kind !== 'utility' && def.kind !== 'support' && def.kind !== 'control' && def.kind !== 'debuff'){
    applyExtraFieldsSingleTarget();
  }

  return { ok:true, def };
}

function resolveSingleTarget(state, actorUnit, tgt){
  if (!tgt) return null;
  if (tgt.mode === "self") return actorUnit;

  // If taunt exists, override single-target selection.
  if (actorUnit.side === "hero" && tgt.side === "enemy"){
    const forced = getTauntTarget(state, "enemy");
    if (forced >= 0) return state.enemies[forced];
  }
  if (actorUnit.side === "enemy" && tgt.side === "hero"){
    const forced = getTauntTarget(state, "hero");
    if (forced >= 0) return state.heroes[forced];
  }

  if (tgt.side === "enemy") return state.enemies[tgt.idx];
  if (tgt.side === "hero") return state.heroes[tgt.idx];
  return null;
}

function applyStatusPayload(state, actorUnit, status, tgt){
  const name = status.name || "Status";
  const turns = Math.max(1, Math.floor(status.turns || 1));
  const target = status.target || "enemy";
  const pct = status.chance ?? 100;

  if (!chance(pct)){
    log(state, `${name} failed to apply.`);
    return;
  }

  const applyTo = (u) => {
    if (!u || !isAlive(u)) return;
    // Stealth: just flag it; targeting logic can respect later.
    addStatus(u, name, turns);
    log(state, `${u.name} gains ${name} (${turns}t).`);
  };

  if (target === "self"){
    applyTo(actorUnit);
    return;
  }

  if (target === "enemy"){
    const u = resolveSingleTarget(state, actorUnit, tgt);
    if (u) applyTo(u);
    return;
  }

  if (target === "all_enemies"){
    const list = actorUnit.side === "hero" ? state.enemies : state.heroes;
    for (const u of list) applyTo(u);
    return;
  }

  if (target === "all_allies"){
    const list = actorUnit.side === "hero" ? state.heroes : state.enemies;
    for (const u of list) applyTo(u);
    return;
  }

  if (target === "ally_random"){
    const list = actorUnit.side === "hero" ? state.heroes : state.enemies;
    const living = listLivingIndices(list);
    if (!living.length) return;
    applyTo(list[living[irand(living.length)]]);
    return;
  }

  // Not implemented but won't crash
  log(state, `[TODO] Status target '${target}' not implemented yet.`);
}

function enemyChooseAction(state, enemy){
  // Simple AI:
  // - If ai === "repeat", strongly prefer repeating the last used skill when available.
  // - Otherwise: try a random usable skill ~35% of the time; else basic attack.
  const skills = (enemy.skillIds || enemy.skills || []).slice();

  // repeat AI
  if ((enemy.ai || "") === "repeat" && enemy.lastSkillId){
    const chk = canUseSkill(state, enemy, enemy.lastSkillId);
    if (chk.ok && Math.random() < 0.75){
      return { type:"skill", skillId: enemy.lastSkillId };
    }
  }

  const usable = [];
  for (const sid of skills){
    const chk = canUseSkill(state, enemy, sid);
    if (chk.ok) usable.push({ sid, def: chk.def });
  }

  let pick = null;
  if (usable.length && Math.random() < 0.35){
    pick = usable[irand(usable.length)];
  }

  if (pick){
    return { type:"skill", skillId: pick.sid };
  }
  return { type:"attack" };
}

function pickHeroTargetForEnemy(state){
  // Taunt handling
  const forced = getTauntTarget(state, "hero");
  if (forced >= 0) return forced;

  const living = listLivingIndices(state.heroes);
  if (!living.length) return -1;
  // small bias to lowest HP
  living.sort((a,b) => (state.heroes[a].hp/state.heroes[a].maxHp) - (state.heroes[b].hp/state.heroes[b].maxHp));
  return living[0];
}

export function createBattleEngine({ battleDef, teamIds }){
  const def = battleDef || {};

  const heroes = (teamIds || []).filter(Boolean).slice(0, 4).map(makeHeroUnit);
  const avgLvl = heroes.length ? (heroes.reduce((a,h)=>a+(h.level||1),0) / heroes.length) : 1;
  const enemyScaleMult = clamp(0.85 + avgLvl * 0.04, 0.85, 3.5);

  const waves = Array.isArray(def.waves) && def.waves.length ? def.waves : null;
  const enemies = (waves ? (waves[0] || []) : (def.enemies || [])).map((e,i)=>makeEnemyUnit(e,i,enemyScaleMult));

  const state = {
    battleId: def.id || "battle",
    name: def.name || "Battle",
    reward: def.reward || null,

    heroes,
    enemies,

    waves,
    waveIndex: waves ? 0 : -1,

    // actor that currently has the turn
    active: null, // { side, idx }

    waitingForInput: false,
    winner: null,

    log: [],
  };

  log(state, `Battle start: ${state.name}`);

  function begin(){
    // pick first actor
    state.active = pickNextActor(state);
    state.waitingForInput = state.active?.side === "hero";

    // If first is enemy, auto-run until hero input required.
    runEnemyAutoUntilInput();
  }


  function spawnWave(nextIndex){
    if (!waves) return false;
    const idx = Math.max(0, Math.floor(nextIndex));
    if (idx < 0 || idx >= waves.length) return false;
    state.waveIndex = idx;
    state.enemies = (waves[idx] || []).map((e,i)=>makeEnemyUnit(e,i,enemyScaleMult));
    // reset enemy time so they enter fairly
    for (const u of state.enemies){ u.t = 0; }
    log(state, `Wave ${idx+1}/${waves.length} begins.`);
    // pick next actor fresh
    state.active = pickNextActor(state);
    state.waitingForInput = state.active?.side === "hero";
    return true;
  }

  function maybeAdvanceWave(){
    if (!waves) return false;
    const enemiesAlive = state.enemies.some(isAlive);
    const heroesAlive = state.heroes.some(isAlive);
    if (heroesAlive && !enemiesAlive){
      const next = (state.waveIndex ?? 0) + 1;
      if (next < waves.length){
        return spawnWave(next);
      }
    }
    return false;
  }

  function runEnemyAutoUntilInput(){
    // keep resolving enemy turns until it's hero input or battle ends
    let guard = 0;
    while (!state.winner && state.active && state.active.side === "enemy" && guard < 50){
      enemyTurn();
      guard++;
    }
  }

  function endTurnForActive(){
    const a = state.active;
    if (!a) return;

    const u = a.side === "hero" ? state.heroes[a.idx] : state.enemies[a.idx];

    tickStatusesEndOfTurn(u, state);
    tickCooldownsOnOwnTurn(u);

    // wave/winner check
    if (maybeAdvanceWave()){
      return;
    }
    const w = checkWinner(state);
    if (w){
      state.winner = w;
      state.waitingForInput = false;
      return;
    }

    advanceActorTime(state, a);
    state.active = pickNextActor(state);
    state.waitingForInput = state.active?.side === "hero";

    if (state.active?.side === "enemy") runEnemyAutoUntilInput();
  }

  function heroAttack(targetIdx){
    if (!state.active || state.active.side !== "hero" || state.winner) return { ok:false };
    const hero = state.heroes[state.active.idx];
    const enemy = state.enemies[targetIdx];
    if (!hero || !isAlive(hero) || !enemy || !isAlive(enemy)) return { ok:false };

    // freeze check
    if (hasStatus(hero, STATUS.FREEZE) || hasStatus(hero, STATUS.STUN)){
      log(state, `${hero.name} is frozen and cannot act.`);
      endTurnForActive();
      return { ok:true, skipped:true };
    }

    const dmg = computeDamage(hero, enemy, 100);
    applyDamage(state, enemy, dmg, { attacker: hero, skillId: "attack" });
    hero.energy = clamp(hero.energy + 18, 0, ENERGY_MAX);
    log(state, `${hero.name} attacks ${enemy.name} for ${dmg}.`);

    endTurnForActive();
    return { ok:true };
  }

  function heroGuard(){
    if (!state.active || state.active.side !== "hero" || state.winner) return { ok:false };
    const hero = state.heroes[state.active.idx];
    if (!hero || !isAlive(hero)) return { ok:false };

    addStatus(hero, STATUS.DEF_UP, 1, { pct: 30 });
    hero.energy = clamp(hero.energy + 12, 0, ENERGY_MAX);
    log(state, `${hero.name} guards.`);

    endTurnForActive();
    return { ok:true };
  }

  function heroUseSkill(skillId, target){
    if (!state.active || state.active.side !== "hero" || state.winner) return { ok:false };
    const hero = state.heroes[state.active.idx];
    if (!hero || !isAlive(hero)) return { ok:false };

    if (hasStatus(hero, STATUS.FREEZE) || hasStatus(hero, STATUS.STUN)){
      log(state, `${hero.name} is frozen and cannot act.`);
      endTurnForActive();
      return { ok:true, skipped:true };
    }

    const res = applySkill(state, state.active, hero, skillId, target);
    if (!res.ok){
      log(state, `${res.reason || "Can't use that."}`);
      return res;
    }

    endTurnForActive();
    return res;
  }

  function heroFlee(){
    if (state.winner) return;
    state.winner = "enemies";
    state.waitingForInput = false;
    log(state, `You fled.`);
  }

  function enemyTurn(){
    if (!state.active || state.active.side !== "enemy" || state.winner) return { ok:false };

    const enemy = state.enemies[state.active.idx];
    if (!enemy || !isAlive(enemy)){
      endTurnForActive();
      return { ok:true };
    }

    // freeze
    if (hasStatus(enemy, STATUS.FREEZE) || hasStatus(enemy, STATUS.STUN)){
      log(state, `${enemy.name} is frozen and loses a turn.`);
      endTurnForActive();
      return { ok:true, skipped:true };
    }

    const action = enemyChooseAction(state, enemy);
    const tIdx = pickHeroTargetForEnemy(state);
    const hero = state.heroes[tIdx];
    if (!hero){
      endTurnForActive();
      return { ok:true };
    }

    if (action.type === "skill"){
      // infer target mode for enemy skills from def
      const def = getEnemySkillDef(action.skillId) || getSkillDef(action.skillId);
      const tgt = inferTargetFromDef(def, "enemy", tIdx);
      const res = applySkill(state, state.active, enemy, action.skillId, tgt);
      if (!res.ok){
        // fallback to attack
        const dmg = computeDamage(enemy, hero, 100);
        applyDamage(state, hero, dmg, { attacker: enemy, skillId: "attack" });
        enemy.energy = clamp(enemy.energy + 16, 0, ENERGY_MAX);
        log(state, `${enemy.name} attacks ${hero.name} for ${dmg}.`);
      }
    } else {
      const dmg = computeDamage(enemy, hero, 100);
      // Guard effect via DEF_UP reduces dmg slightly
      const defUp = hasStatus(hero, STATUS.DEF_UP) ? 0.78 : 1;
      applyDamage(state, hero, Math.floor(dmg * defUp), { attacker: enemy, skillId: "attack" });
      enemy.energy = clamp(enemy.energy + 16, 0, ENERGY_MAX);
      log(state, `${enemy.name} attacks ${hero.name} for ${Math.floor(dmg * defUp)}.`);
    }

    endTurnForActive();
    return { ok:true };
  }

  function inferTargetFromDef(def, actorSide, fallbackIdx){
    // Used by UI and enemy AI. Returns a target descriptor.
    const slot = String(def?.slot || "");
    const kind = String(def?.kind || "");

    // Explicit targetMode override
    const tm = def?.targetMode || def?.target;
    if (tm === "all_enemies") return { side: actorSide === "hero" ? "enemy" : "hero", mode: "all_enemies" };
    if (tm === "all_allies") return { side: actorSide, mode: "all_allies" };
    if (tm === "self") return { side: actorSide, mode: "self" };

    // If status target says all_enemies/all_allies, use that
    const st = def?.status?.target;
    if (st === "all_enemies") return { side: actorSide === "hero" ? "enemy" : "hero", mode: "all_enemies" };
    if (st === "all_allies") return { side: actorSide, mode: "all_allies" };

    // Heals default to allies
    if (kind === "heal") return { side: actorSide, idx: fallbackIdx, mode: "single" };

    // Default: single target enemy
    return { side: actorSide === "hero" ? "enemy" : "hero", idx: fallbackIdx, mode: "single" };
  }

  function getUIState(){
    // small helper the UI can use
    const a = state.active;
    const activeUnit = a?.side === "hero" ? state.heroes[a.idx] : state.enemies[a.idx];

    return {
      battleId: state.battleId,
      name: state.name,
      reward: state.reward,
      winner: state.winner,

      heroes: state.heroes,
      enemies: state.enemies,

      active: state.active,
      activeUnit,
      waitingForInput: state.waitingForInput,

      log: state.log,
    };
  }

  // start immediately
  begin();

  // UI helper: build the hero's Skills submenu (excludes basic attack).
  // Returns: [{ skillId, name, usable, cdLeft, energyNeed }]
  function getHeroSkillMenu(heroIdx){
    const hero = state.heroes?.[heroIdx];
    if (!hero) return [];

    const ids = (hero.skillIds || []).filter(id => {
      const sid = String(id || "");
      // treat *_basic as the separate Attack command
      if (sid.endsWith("_basic")) return false;
      return true;
    });

    return ids.map(skillId => {
      const def = getSkillDef(skillId) || getEnemySkillDef(skillId);
      const name = def?.name || skillId;
      const cdLeft = hero.cds?.[skillId] || 0;
      const cost = Math.max(0, Math.floor(def?.energyCost || 0));
      const chk = canUseSkill(state, hero, skillId);
      const usable = !!chk.ok;
      const energyNeed = (cost > 0 && hero.energy < cost) ? cost : 0;
      return { skillId, name, usable, cdLeft, energyNeed };
    });
  }

  return {
    state,
    getUIState,

    // Turn methods
    heroAttack,
    heroGuard,
    heroUseSkill,
    heroFlee,

    // For UI helpers
    canUseSkill: (skillId) => {
      const a = state.active;
      if (!a || a.side !== "hero") return { ok:false, reason:"Not your turn" };
      const u = state.heroes[a.idx];
      return canUseSkill(state, u, skillId);
    },
    inferTargetFromDef,

    // UI menus
    getHeroSkillMenu,

    // Enemy auto (UI may call this if it wants animation pacing)
    enemyTurn,
    stepEnemy: enemyTurn,
  };
}
