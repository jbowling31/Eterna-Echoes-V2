// docs/js/battle/battle.ui.js
// Final-Fantasy-style battle UI:
// - Two vertical columns on the battlefield (heroes left, enemies right).
// - Command window (Attack/Skills/Items/Guard/Flee) for the active hero.
// - Skill submenu (Basic + S1 + S2 + Ultimate) then target select then Execute.
// - Auto toggle applies to everyone.
//
// Contract with story.runner.js:
// - startBattle(battleId) opens UI
// - dispatches EE_BATTLE_RESOLVED and EE_STORY_BATTLE_RESULT when finished.

function getStatusInfo(statusOrName){
  const isObj = (statusOrName && typeof statusOrName === "object");
  const name  = isObj ? (statusOrName.name || "") : String(statusOrName || "");
  const n     = name.toLowerCase();

  const pctRaw = isObj ? Number(statusOrName?.meta?.pct) : NaN;
  const turns  = isObj ? Number(statusOrName?.turns) : NaN;

  const pctTxt   = Number.isFinite(pctRaw) ? ` (${pctRaw}%)` : "";
  const turnsTxt = Number.isFinite(turns) ? ` • ${turns}t` : "";

  const map = {
    "burn":   `Burn${turnsTxt}: takes damage over time at end of the unit's turn.`,
    "freeze": `Freeze${turnsTxt}: can’t act for its duration (consumed on the unit’s turn).`,
    "stun":   `Stun${turnsTxt}: loses a turn when it comes up (consumed on the unit’s turn).`,
    "slow":   `Slow${pctTxt}${turnsTxt}: acts less frequently (reduced speed).`,
    "taunt":  `Taunt${turnsTxt}: enemies are more likely to target this unit.`,
    "evasion":`Evasion${pctTxt}${turnsTxt}: increased chance to dodge incoming attacks.`,
    "reflect":`Reflect${pctTxt}${turnsTxt}: returns a portion of damage taken back to the attacker.`,

    "def up":   `DEF Up${pctTxt}${turnsTxt}: increases DEF (damage mitigation).`,
    "resist up":`Resist Up${pctTxt}${turnsTxt}: increases chance to resist negative status effects.`,
    "atk down": `ATK Down${pctTxt}${turnsTxt}: reduces ATK for the duration.`
  };

  return map[n] || `No description yet.${turnsTxt}`;
}




import { getBattleDef } from "./battles.ch01.js";
import { createBattleEngine } from "./battle.engine.js";
import { HEROES } from "../heroes/heroes.data.js";
import { isUnlocked } from "../heroes/hero.progress.state.js";
import { getSkillDef } from "../skills/skills.data.js";
import { openModal, closeModal } from "../ui/ui.modal.js";
import { openTeamBuilder } from "../ui/team.builder.ui.js";
import { getTeam, setTeam, setActiveMode, TEAM_MODES, validateTeam } from "../teams/team.builder.state.js";
import { applyRewards } from "../economy/rewards.apply.logic.js";
import { playActionFX, loadBattleFXEnabled, saveBattleFXEnabled } from "./battle.fx.js";

const HERO_ART_BASE = "./assets/heroes/portraits/";
const HERO_ART_TEMPLATE = "hero_{id}_p.png";

let UI = null;
let engine = null;
let battleCtx = null; // { battleId, mode, teamIds }
let rewardsApplied = false;

// UI flow state
let uiMode = "cmd"; // cmd | skills | target | flee
let pendingAction = null; // { kind, skillId?, label }
let selectedTarget = { side: "enemy", idx: 0, mode: "single" }; // mode: single | all_enemies | all_allies
let autoOn = false;
let autoTimer = null;

// Battle FX toggle + pacing
let animsOn = loadBattleFXEnabled();
let fxBusy = false;

// Local popup state (status inspector)
let statusOpen = null; // { name }
let inspectOpen = null; // { side:"hero"|"enemy", idx:number }

/* =========================
   AOE helpers (minimal add)
========================= */
function isAoeMode(m){ return m === "all_enemies" || m === "all_allies"; }
function isAllEnemiesSkill(def){
  const t = String(def?.target ?? def?.mode ?? "").toLowerCase().trim();
  const txt = String(def?.text || def?.desc || "").toLowerCase();
  return (
    !!def?.dmgAll ||
    t === "all_enemies" || t === "all_enemy" ||
    includesAny(txt, ["all enemies","all foes","all opponents","each enemy","every enemy","hit all enemies"])
  );
}

function isAllAlliesSkill(def){
  const t = String(def?.target ?? def?.mode ?? "").toLowerCase().trim();
  const txt = String(def?.text || def?.desc || "").toLowerCase();
  return (
    !!def?.healAll || !!def?.shieldAll || !!def?.buffAll ||
    t === "all_allies" || t === "all_players" || t === "all_heroes" || t === "party" || t === "team" ||
    includesAny(txt, ["all allies","all heroes","entire party","whole party","party","team","heal all"])
  );
}

function includesAny(hay, arr){
  const s = String(hay || "").toLowerCase();
  return arr.some(x => s.includes(String(x).toLowerCase()));
}

// More forgiving target inference so Sirenia (heal/buff) works even if target fields are missing.
function getSkillTargetSpec(def){
  const kind = String(def?.kind || "").toLowerCase();
  const txt = String(def?.text || def?.desc || "").toLowerCase();

  // 0) HARD AOE FLAGS FIRST (most reliable)
  if (def?.dmgAll) return "all_enemies";
  if (def?.healAll || def?.shieldAll || def?.buffAll) return "all_allies";

  // 1) Explicit fields for MAIN targeting (mode/target)
  const raw = def?.target ?? def?.mode ?? "";
  const t = String(raw || "").toLowerCase().trim();

  if (["all_allies","all_players","all_heroes","all_party","all_team","team","party"].includes(t)) return "all_allies";
  if (["all_enemies","all_enemy"].includes(t)) return "all_enemies";
  if (["self","me"].includes(t)) return "self";
  if (t.includes("ally")) return "ally";

  // 2) Text hints
  const saysAlliesAll = includesAny(txt, ["all allies","all heroes","entire party","whole party","party","team","all party","all team"]);
  const saysEnemiesAll = includesAny(txt, ["all enemies","all foes","all opponents","each enemy","every enemy","hit all enemies"]);

  if (saysEnemiesAll) return "all_enemies";

  if (kind === "heal"){
    if (saysAlliesAll || txt.includes("heal all")) return "all_allies";
    return "ally";
  }

  if (kind === "buff" || kind === "support" || kind === "utility"){
    if (saysAlliesAll || txt.includes("allies") || txt.includes("party") || txt.includes("team")) return "all_allies";
    return "ally";
  }

  return "enemy";
}



function inferTargetSideForSkill(def){
  const t = getSkillTargetSpec(def);
  if (t === "self") return "hero";
  if (t === "all_allies") return "hero";
  if (t === "ally") return "hero";
  return "enemy";
}

function currentSkillAllowsDeadTargets(){
  if (uiMode !== "target") return false;
  if (pendingAction?.kind !== "skill") return false;
  const def = getSkillDef(pendingAction.skillId);
  return !!def?.canTargetDead;
}

function firstDeadHeroIndex(){
  const st = engine?.state;
  if (!st) return 0;
  const i = st.heroes.findIndex(h => h.hp <= 0);
  return i >= 0 ? i : 0;
}

export function ensureBattleHost(){
  if (document.getElementById("eeBattleHost")) return;

  const host = document.createElement("div");
  host.id = "eeBattleHost";
  host.innerHTML = `
    <div class="eeB" role="dialog" aria-modal="true" aria-label="Battle">
      <div class="eeBTop">
        <div class="eeBTitleWrap">
          <div class="eeBTitle" id="eeBTitle">Battle</div>
          <div class="eeBSub" id="eeBSub">—</div>
        </div>

        <div class="eeBTopRight">
          <button class="eeBMini" id="eeBAuto" title="Auto (applies to everyone)">AUTO: OFF</button>
          <button class="eeBMini" id="eeBAnims" title="Toggle battle animations">ANIMS: ON</button>
          <button class="eeBMini" id="eeBLogBtn" title="Toggle log">LOG</button>
          <button class="eeBX" id="eeBClose" aria-label="Close">✕</button>
        </div>
      </div>

      <div class="eeBStage" id="eeBStage">
        <div class="eeBBackdrop" id="eeBBackdrop"></div>
        <div class="eeBShade"></div>

        <div class="eeBFX" id="eeBFX" aria-hidden="true"></div>

        <div class="eeBArena">
          <div class="eeBCol eeBColHeroes" id="eeBHeroes"></div>
          <div class="eeBCol eeBColEnemies" id="eeBEnemies"></div>
        </div>

        <div class="eeBCommand">
          <div class="eeBActive" id="eeBActive"></div>
          <div class="eeBWindow" id="eeBWindow"></div>
        </div>

        <div class="eeBLog" id="eeBLog" style="display:none"></div>

        <div class="eeBEnd" id="eeBEnd" style="display:none;">
          <div class="eeBEndTitle" id="eeBEndTitle">Victory</div>
          <div class="eeBEndDesc" id="eeBEndDesc"></div>
          <button class="eeBBtn primary" id="eeBEndContinue">Continue</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(host);
  injectStyles();
}

export function startBattle(battleId){
  ensureBattleHost();

  const def = getBattleDef(battleId);
  if (!def){
    console.warn("[BATTLE] Unknown battleId:", battleId);
    dispatchResolved(battleId, { won:true, winner:"heroes", devSkip:true });
    return;
  }

  // Story battles should always confirm team selection so rewards/XPs apply to the right heroes.
  const mode = TEAM_MODES.GLOBAL;

  openConfirmTeamForBattle({ battleId, def, mode });
}
function getEffectiveStatsUI(u){
  let atk = Math.floor(u.atk || 0);
  let def = Math.floor(u.def || 0);
  let spd = Math.floor(u.spd || 0);

  const sts = u.statuses || [];

  const sumPct = (name, fallback=0) => {
    let s = 0;
    for (const st of sts){
      if (!st || st.turns <= 0 || st.name !== name) continue;
      const p = Number(st?.meta?.pct);
      s += Number.isFinite(p) ? p : fallback;
    }
    return s;
  };

  const atkDown = sumPct("ATK Down", 30);
  if (atkDown) atk = Math.max(0, Math.ceil(atk * (1 - atkDown/100)));

  const defUp = sumPct("DEF Up", 30);
  if (defUp) def = Math.max(0, Math.ceil(def * (1 + defUp/100)));

  return { atk, def, spd };
}

function openConfirmTeamForBattle({ battleId, def, mode }){
  const idsRaw = (getTeam(mode) || []).filter(Boolean);
  const isStoryBattle = true;
  const ids = idsRaw.filter(id => !isStoryBattle || isUnlocked(id));

  const listHtml = renderConfirmHeroList(ids);
  const title = "Confirm Team";

  openModal(title, `
    <div class="card">
      <div class="spread">
        <div>
          <div class="h2">${escapeHtml(def.name || "Battle")}</div>
          <div class="muted">Pick your party, then start.</div>
          <div class="muted" style="margin-top:6px;">Mode: <b>${escapeHtml(String(mode))}</b> • Party size: 1–5</div>
        </div>
      </div>
    </div>
    <div style="height:12px"></div>
    ${listHtml}
    <div style="height:12px"></div>
    <div class="row wrap">
      <button class="btn" data-edit-team>Edit Team</button>
      <button class="btn" data-cancel>Cancel</button>
      <button class="btn primary" data-start ${ids.length < 1 ? "disabled" : ""}>Start Battle</button>
    </div>
    ${ids.length < 1 ? `<div style="height:10px"></div><div class="muted">Pick at least 1 unlocked hero to start.</div>` : ``}
  `);

  const host = document.getElementById("modalHost");

  host?.querySelector("[data-cancel]")?.addEventListener("click", () => {
    closeModal();
    dispatchResolved(battleId, { canceled:true, aborted:true });
  });

  host?.querySelector("[data-edit-team]")?.addEventListener("click", () => {
    closeModal();
    openTeamBuilder({
      mode,
      onDone: () => openConfirmTeamForBattle({ battleId, def, mode }),
    });
  });

  host?.querySelector("[data-start]")?.addEventListener("click", () => {
    const idsNow = (getTeam(mode) || [])
      .filter(Boolean)
      .filter(id => isUnlocked(id))
      .slice(0, 5);

    const v = validateTeam ? validateTeam(idsNow, mode) : { ok: idsNow.length > 0 };
    if (!v.ok) {
      const reason = v.reason || "Invalid team.";
      const warn = document.createElement("div");
      warn.className = "muted";
      warn.style.marginTop = "10px";
      warn.innerHTML = `⚠️ ${escapeHtml(reason)}`;
      host?.querySelector(".modalBody")?.appendChild(warn);
      return;
    }

    closeModal();
    beginBattle({ battleId, def, mode, teamIds: idsNow });
  });
}

function renderConfirmHeroList(ids){
  if (!ids?.length) return `<div class="card"><div class="muted">No heroes selected.</div></div>`;
  return `
    <div class="card">
      <div class="muted">Selected (${ids.length}):</div>
      <div style="height:8px"></div>
      ${ids.map(id => {
        const h = (HEROES || []).find(x => x.id === id);
        return `<div class="muted">• <b>${escapeHtml(h?.name || id)}</b></div>`;
      }).join("")}
    </div>
  `;
}

function beginBattle({ battleId, def, mode, teamIds }){
  setActiveMode?.(mode);
  setTeam?.(teamIds, mode);

  battleCtx = { battleId, mode, teamIds };
  rewardsApplied = false;

  engine = createBattleEngine({ battleDef: def, teamIds });

  UI = {
    host: document.getElementById("eeBattleHost"),
    title: document.getElementById("eeBTitle"),
    sub: document.getElementById("eeBSub"),
    close: document.getElementById("eeBClose"),
    auto: document.getElementById("eeBAuto"),
    anims: document.getElementById("eeBAnims"),
    logBtn: document.getElementById("eeBLogBtn"),
    stage: document.getElementById("eeBStage"),
    fx: document.getElementById("eeBFX"),
    backdrop: document.getElementById("eeBBackdrop"),
    heroes: document.getElementById("eeBHeroes"),
    enemies: document.getElementById("eeBEnemies"),
    active: document.getElementById("eeBActive"),
    window: document.getElementById("eeBWindow"),
    log: document.getElementById("eeBLog"),
    end: document.getElementById("eeBEnd"),
    endTitle: document.getElementById("eeBEndTitle"),
    endDesc: document.getElementById("eeBEndDesc"),
    endContinue: document.getElementById("eeBEndContinue"),
  };

  UI.title.textContent = def.name || "Battle";
  UI.backdrop.style.backgroundImage = `url("${def.backdrop}")`;

  UI.host.classList.add("on");

  UI.close.onclick = () => {
    stopAuto();
    UI.host.classList.remove("on");
    dispatchResolved(battleId, { canceled:true, aborted:true });
  };

  UI.logBtn.onclick = () => {
    const show = UI.log.style.display === "none";
    UI.log.style.display = show ? "block" : "none";
  };

  UI.auto.onclick = () => {
    autoOn = !autoOn;
    UI.auto.textContent = autoOn ? "AUTO: ON" : "AUTO: OFF";
    if (autoOn) tickAuto();
    else stopAuto();
    render();
  };

  // Animations toggle (persists)
  if (UI.anims){
    UI.anims.textContent = animsOn ? "ANIMS: ON" : "ANIMS: OFF";
    UI.anims.onclick = () => {
      animsOn = !animsOn;
      saveBattleFXEnabled(animsOn);
      UI.anims.textContent = animsOn ? "ANIMS: ON" : "ANIMS: OFF";
    };
  }

  // Click targets when we're in target mode (ignore clicks if AoE is selected)
UI.enemies.onclick = (ev) => {
  // Status tag click (always allowed)
  const tag = ev.target.closest(".eeTag[data-status]");
  if (tag){
    const stName = tag.getAttribute("data-status") || "";
    const uEl = tag.closest("[data-eidx]");
    const idx = uEl ? Number(uEl.getAttribute("data-eidx")) : NaN;

    const u = (engine?.state?.enemies && Number.isFinite(idx))
      ? engine.state.enemies[idx]
      : null;

    // Find the live status object on that unit (so we can read meta.pct, turns, etc.)
    const stObj = u?.statuses?.find(s => s && s.turns > 0 && s.name === stName) || null;

    statusOpen = { name: stName, st: stObj, side: "enemy", idx };
    render();
    return;
  }

    const el = ev.target.closest("[data-eidx]");
    if (!el) return;
    // If we're NOT picking a target right now, clicking a unit opens Inspect.
if (uiMode !== "target"){
  const idx = Number(el.getAttribute("data-eidx"));
  if (!Number.isFinite(idx)) return;
  inspectOpen = { side:"enemy", idx };
  statusOpen = null;
  render();
  return;
}

    if (uiMode !== "target") return;
    if (isAoeMode(selectedTarget?.mode)) return;

const idx = Number(el.getAttribute("data-eidx"));
if (!Number.isFinite(idx)) return;

const unit = engine?.state?.enemies?.[idx];
if (!unit) return;

const canPickDead =
  pendingAction?.kind === "skill" &&
  (() => {
    const def = getSkillDef(pendingAction.skillId);
    return !!def?.canTargetDead;
  })();

if (unit.hp <= 0 && !canPickDead) return;

selectedTarget = { side:"enemy", idx, mode:"single" };
render();

  };

UI.heroes.onclick = (ev) => {
  // Status tag click (always allowed)
  const tag = ev.target.closest(".eeTag[data-status]");
  if (tag){
    const stName = tag.getAttribute("data-status") || "";
    const uEl = tag.closest("[data-hidx]");
    const idx = uEl ? Number(uEl.getAttribute("data-hidx")) : NaN;

    const u = (engine?.state?.heroes && Number.isFinite(idx))
      ? engine.state.heroes[idx]
      : null;

    // Find the live status object on that unit (meta.pct, turns, etc.)
    const stObj = u?.statuses?.find(s => s && s.turns > 0 && s.name === stName) || null;

    statusOpen = { name: stName, st: stObj, side: "hero", idx };
    render();
    return;
  }

    const el = ev.target.closest("[data-hidx]");
    if (!el) return;
    if (uiMode !== "target"){
  const idx = Number(el.getAttribute("data-hidx"));
  if (!Number.isFinite(idx)) return;
  inspectOpen = { side:"hero", idx };
  statusOpen = null;
  render();
  return;
}

    if (uiMode !== "target") return;
    if (isAoeMode(selectedTarget?.mode)) return;

    const idx = Number(el.getAttribute("data-hidx"));
    if (!Number.isFinite(idx)) return;

    if (!engine?.state?.heroes?.[idx]) return;
    const allowDead = currentSkillAllowsDeadTargets();
    if (engine.state.heroes[idx].hp <= 0 && !allowDead) return;

    selectedTarget = { side:"hero", idx, mode:"single" };
    render();
  };

  UI.endContinue.onclick = () => {
    stopAuto();

    if (!rewardsApplied){
      rewardsApplied = true;
      const r = normalizeRewards(engine?.state?.reward);
      if (r && (r.gold || r.accountXP || r.heroXP || (r.gearDrops||[]).length)){
        applyRewards(r, { teamMode: battleCtx?.mode || TEAM_MODES.GLOBAL });
        window.EE_TICK?.();
      }
    }

    UI.host.classList.remove("on");

    dispatchResolved(battleId, {
      winner: engine?.state?.winner,
      won: engine?.state?.winner === "heroes",
      reward: engine?.state?.reward || null,
    });
  };

  // reset UI flow
  uiMode = "cmd";
  pendingAction = null;
  selectedTarget = { side:"enemy", idx:firstLivingEnemyIndex(), mode:"single" };
  autoOn = false;
  UI.auto.textContent = "AUTO: OFF";
  statusOpen = null;

  render();
  stepIfNeeded();
}

function normalizeRewards(reward){
  if (!reward) return null;
  if (typeof reward.heroXP === "number" || typeof reward.accountXP === "number" || Array.isArray(reward.gearDrops)){
    return {
      gold: Number(reward.gold||0) || 0,
      accountXP: Number(reward.accountXP||0) || 0,
      heroXP: Number(reward.heroXP||0) || 0,
      gearDrops: Array.isArray(reward.gearDrops) ? reward.gearDrops : [],
    };
  }

  const xp = Number(reward.xp || 0) || 0;
  return {
    gold: Number(reward.gold||0) || 0,
    accountXP: xp,
    heroXP: xp,
    gearDrops: [],
  };
}
function fmtPct(x){
  const n = Number(x);
  if (!Number.isFinite(n)) return "";
  return (n <= 1 ? Math.round(n * 100) : Math.round(n)) + "%";
}

function renderStatuses(u){
  const list = (u?.statuses || []).filter(s => s && s.turns > 0);
  if (!list.length) return `<div class="eeWinMuted">No active buffs/debuffs.</div>`;

  return `
    <div style="display:grid; gap:6px; margin-top:8px;">
      ${list.map(s => {
        const meta = s.meta ? JSON.stringify(s.meta) : "";
        return `
          <div style="display:flex; justify-content:space-between; gap:10px;">
            <div><b>${escapeHtml(s.name)}</b>${meta ? ` <span class="eeWinMuted">${escapeHtml(meta)}</span>` : ""}</div>
            <div class="eeWinMuted">${s.turns}t</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderSkills(u){
  const ids = Array.isArray(u?.skillIds) ? u.skillIds : [];
  if (!ids.length) return `<div class="eeWinMuted">No skills listed.</div>`;

  return `
    <div style="display:grid; gap:8px; margin-top:8px;">
      ${ids.map(id => {
        const def = getSkillDef(id);
        if (!def) return `<div class="eeWinMuted">${escapeHtml(id)} (missing def)</div>`;

        const cd = Math.max(0, Math.floor(def.cdTurns || 0));
        const cost = Math.max(0, Math.floor(def.energyCost || 0));
        const tgt = String(def.target || def.mode || "single").toLowerCase();

        return `
          <div style="border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:10px; background:rgba(0,0,0,.18);">
            <div style="display:flex; justify-content:space-between; gap:10px;">
              <div><b>${escapeHtml(def.name || id)}</b> <span class="eeWinMuted">(${escapeHtml(def.slot || def.kind || "skill")})</span></div>
              <div class="eeWinMuted">CD ${cd}${cost ? ` • EN ${cost}` : ""}</div>
            </div>
            <div class="eeWinMuted" style="margin-top:6px;">
              Target: ${escapeHtml(tgt)}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderInspectWindow(){
  const st = engine?.state;
  if (!st || !inspectOpen) return "";

  const list = inspectOpen.side === "hero" ? st.heroes : st.enemies;
  const u = list?.[inspectOpen.idx];
  if (!u) return "";

  const baseAtk = Math.floor(u.atk || 0);
  const baseDef = Math.floor(u.def || 0);
  const baseSpd = Math.floor(u.spd || 0);
  const eff = getEffectiveStatsUI(u);

  const fmtStat = (val, base) =>
    val === base
      ? String(val)
      : `${val} <span style="opacity:.65;font-size:12px">(${base})</span>`;

  const sh = Math.max(0, Math.floor(u.shield || 0));
  const hp = Math.max(0, Math.floor(u.hp || 0));
  const maxHp = Math.max(1, Math.floor(u.maxHp || 1));
  const hpPct = Math.max(0, Math.min(1, hp / maxHp));
  const shPct = Math.max(0, Math.min(1, sh / maxHp));

  return `
    <div class="eeCard eeWin" style="max-width:560px;">
      <div class="eeWinTitle">Inspect: ${escapeHtml(u.name || "—")}</div>
      <div class="eeWinMuted" style="margin-top:4px;">
        ${inspectOpen.side === "hero" ? "Hero" : "Enemy"} • SPD ${Math.floor(u.spd || 0)} • EN ${Math.floor(u.energy || 0)}
      </div>

      <div style="margin-top:12px;">
        <div class="eeWinMuted">HP</div>
        <div class="eeHP" style="margin-top:6px;">
          <div class="eeHPFill" style="width:${Math.round(hpPct*100)}%"></div>
        </div>
        <div class="eeSH" style="margin-top:6px; opacity:${sh > 0 ? 1 : 0.35}">
          <div class="eeSHFill" style="width:${Math.round(shPct*100)}%"></div>
        </div>
        <div class="eeWinMuted" style="margin-top:6px;">
          ${hp}/${maxHp}${sh ? ` • SH ${sh}` : ""}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-top:12px;">
        <div class="eePill">ATK <b>${fmtStat(eff.atk, baseAtk)}</b></div>
        <div class="eePill">DEF <b>${fmtStat(eff.def, baseDef)}</b></div>
        <div class="eePill">SPD <b>${fmtStat(eff.spd, baseSpd)}</b></div>
        <div class="eePill">LV <b>${Math.floor(u.level||1)}</b></div>
      </div>

      <div style="margin-top:14px;">
        <div class="eeWinTitle" style="font-size:14px;">Buffs / Debuffs</div>
        ${renderStatuses(u)}
      </div>

      <div style="margin-top:14px;">
        <div class="eeWinTitle" style="font-size:14px;">Skills</div>
        ${renderSkills(u)}
      </div>

      <div class="eeWinBtns" style="margin-top:14px;">
        <button class="eeBtn" data-cmd="closeInspect">Close</button>
      </div>
    </div>
  `;
}


function render(){
  if (!UI || !engine) return;

  const st = engine.state;

  const a = st.active || { side:"hero", idx:0 };
  const turnLabel = a.side === "hero" ? "Your turn" : "Enemy turn";
  UI.sub.textContent = `${turnLabel} • ${st.turnLabel}`;

  UI.heroes.innerHTML = st.heroes.map((h, i) => renderUnit("hero", i, h, a)).join("");
  UI.enemies.innerHTML = st.enemies.map((e, i) => renderUnit("enemy", i, e, a)).join("");

  UI.log.innerHTML = st.log.slice(-10).map(line => `<div class="eeLogLine">${escapeHtml(line)}</div>`).join("");

  if (st.winner){
    UI.end.style.display = "flex";
    UI.endTitle.textContent = st.winner === "heroes" ? "Victory" : "Defeat";
    const r = st.reward;
    UI.endDesc.textContent = r ? `Rewards: +${r.xp} XP, +${r.gold} Gold` : "";
  } else {
    UI.end.style.display = "none";
  }

  UI.active.innerHTML = renderActivePanel();
  UI.window.innerHTML = renderWindow();

  if (uiMode === "target"){
    selectedTarget = normalizeSelectedTarget(selectedTarget);
  }
}


function renderUnit(side, idx, u, active){
  const isDead = u.hp <= 0;
  const isActive = active?.side === side && active?.idx === idx;

  // AOE highlight: if mode is all_enemies/all_allies, highlight all living units on that side
  let isTarget = false;
  if (uiMode === "target"){
    const allowDead = currentSkillAllowsDeadTargets();
    if (selectedTarget?.mode === "all_enemies" && side === "enemy" && !isDead) isTarget = true;
    else if (selectedTarget?.mode === "all_allies" && side === "hero" && (!isDead || allowDead)) isTarget = true;
    else isTarget = (selectedTarget.side === side && selectedTarget.idx === idx);
  }

  const pct = u.maxHp > 0 ? Math.max(0, Math.min(1, u.hp / u.maxHp)) : 0;
  const hpTxt = `${Math.max(0, Math.floor(u.hp))}/${u.maxHp}`;
  const sh = Math.max(0, Math.floor(u.shield || 0));
  const shPct = u.maxHp > 0 ? Math.max(0, Math.min(1, sh / u.maxHp)) : 0;

  const portrait = side === "hero" ? resolveHeroPortrait(u.id) : resolveEnemyPortrait(u);

  const attr = side === "hero" ? `data-hidx="${idx}"` : `data-eidx="${idx}"`;
  const cls = ["eeUnit", side === "hero" ? "hero" : "enemy", isDead ? "dead" : "", isActive ? "active" : "", isTarget ? "target" : ""]
    .filter(Boolean).join(" ");

  return `
    <div class="${cls}" ${attr}>
      <div class="eePortrait">
        <img src="${portrait}" alt="${escapeAttr(u.name)}" loading="eager" decoding="async" fetchpriority="high" />
      </div>
      <div class="eeMeta">
        <div class="eeName">${escapeHtml(u.name)}</div>
        <div class="eeBars">
          <div class="eeHPWrap">
            <div class="eeHP">
              <div class="eeHPFill" style="width:${Math.round(pct*100)}%"></div>
            </div>
            <div class="eeSH" style="opacity:${sh > 0 ? 1 : 0.35}">
  <div class="eeSHFill" style="width:${Math.round(shPct*100)}%"></div>
</div>

          </div>
          <div class="eeTiny">${hpTxt}${sh > 0 ? ` • SH ${sh}` : ``}</div>
        </div>
        <div class="eeTinyRow">
          <span class="eeTiny">SPD ${u.spd}</span>
          <span class="eeTiny">EN ${u.energy}</span>
          ${u.statuses?.length ? `<span class="eeTags">${
            u.statuses.map(s=>{
              const nm = s?.name || String(s);
              return `<button type="button" class="eeTag" data-status="${escapeAttr(nm)}">${escapeHtml(nm)}${s?.turns?` ${s.turns}`:""}</button>`;
            }).join("")
          }</span>` : ``}
        </div>
      </div>
    </div>
  `;
}

function renderActivePanel(){
  const st = engine.state;
  if (!st.active) return "";
  const a = st.active;
  const u = a.side === "hero" ? st.heroes[a.idx] : st.enemies[a.idx];
  if (!u) return "";

  return `
    <div class="eeActiveHdr">Active</div>
    <div class="eeActiveName">${escapeHtml(u.name)}</div>
    <div class="eeTiny">${a.side === "hero" ? "Hero" : "Enemy"} • SPD ${u.spd} • EN ${u.energy}</div>
  `;
}

function renderWindow(){
  const st = engine.state;
// Inspect target popup
if (inspectOpen){
  return renderInspectWindow();
}

  // Status info popup
  if (statusOpen){
    const title = escapeHtml(statusOpen.name || "");
    const body = escapeHtml(getStatusInfo(statusOpen.name));
    return `
      <div class="eeCard eeWin" style="max-width:520px;">
        <div class="eeWinTitle">${title}</div>
        <div class="eeWinText" style="margin-top:8px; white-space:pre-wrap;">${body}</div>
        <div class="eeWinBtns" style="margin-top:14px;">
          <button class="eeBtn" data-cmd="closeStatus">Close</button>
        </div>
      </div>
    `;
  }

  // Between-wave narrative/interlude
  if (st.interlude){
    const title = escapeHtml(st.interlude.title || "…");
    const text = escapeHtml(st.interlude.text || "");
    return `
      <div class="eeCard eeWin" style="max-width:520px;">
        <div class="eeWinTitle">${title}</div>
        <div class="eeWinText" style="margin-top:8px; white-space:pre-wrap;">${text}</div>
        <div class="eeWinBtns" style="margin-top:14px;">
          <button class="eeBtn" data-cmd="interlude">Continue</button>
        </div>
      </div>
    `;
  }

  const a = st.active;

  if (st.winner){
    return `<div class="eeWinMuted">Battle finished.</div>`;
  }

  if (a?.side === "enemy"){
    return `<div class="eeWinMuted">Enemy is thinking…</div>`;
  }

  if (uiMode === "cmd"){
    return `
      <div class="eeWinTitle">Command</div>
      <button class="eeBBtn" data-cmd="attack">Attack</button>
      <button class="eeBBtn" data-cmd="skills">Skills</button>
      <button class="eeBBtn" data-cmd="items" disabled title="Inventory not wired yet">Items</button>
      <button class="eeBBtn" data-cmd="guard">Guard</button>
      <button class="eeBBtn" data-cmd="flee">Flee</button>
    `;
  }

  if (uiMode === "skills"){
    const list = engine.getHeroSkillMenu(a.idx);

    return `
      <div class="eeWinTitle">Skills</div>
      ${list.map(s => {
        const dis = !s.usable;
        const def = getSkillDef(s.skillId);
        const descRaw = def?.text || def?.desc || "";
        const desc = escapeHtml(descRaw);
        const lbl = `${escapeHtml(s.name)}${s.cdLeft>0 ? ` (CD ${s.cdLeft})` : ``}${s.energyNeed>0 ? ` (EN ${s.energyNeed})` : ``}`;

        return `
          <div class="eeSkillRow">
            <button
              class="eeBBtn"
              data-skill="${escapeAttr(s.skillId)}"
              ${dis ? "disabled" : ""}
              title="${escapeAttr(descRaw)}"
            >${lbl}</button>
            ${descRaw ? `<div class="eeSkillDesc">${desc}</div>` : ``}
          </div>
        `;
      }).join("")}
      <div class="eeWinRow">
        <button class="eeBBtn ghost" data-back>Back</button>
      </div>
    `;
  }

  if (uiMode === "target"){
    const label = pendingAction?.label || "Action";

    let tgt = "—";
    if (selectedTarget?.mode === "all_enemies") tgt = "All Enemies";
    else if (selectedTarget?.mode === "all_allies") tgt = "All Allies";
    else {
      tgt = selectedTarget.side === "enemy"
        ? (st.enemies[selectedTarget.idx]?.name || "—")
        : (st.heroes[selectedTarget.idx]?.name || "—");
    }

    return `
      <div class="eeWinTitle">Target</div>
      <div class="eeWinMuted">${escapeHtml(label)}</div>
      <div class="eeTargetPick">Selected: <b>${escapeHtml(tgt)}</b></div>

      <div class="eeWinRow">
        <button class="eeBBtn ghost" data-back>Back</button>
        <button class="eeBBtn primary" data-exec>Execute</button>
      </div>
      <div class="eeWinHint">${
        isAoeMode(selectedTarget?.mode)
          ? "This skill hits everyone on that side."
          : (currentSkillAllowsDeadTargets() ? "Tap a hero portrait to choose who to revive." : "Tap a hero/enemy portrait to change target.")
      }</div>
    `;
  }

  if (uiMode === "flee"){
    return `
      <div class="eeWinTitle">Flee?</div>
      <div class="eeWinMuted">This counts as cancel/abort for now.</div>
      <div class="eeWinRow">
        <button class="eeBBtn ghost" data-back>No</button>
        <button class="eeBBtn" data-flee-yes>Yes, flee</button>
      </div>
    `;
  }

  return ``;
}

function bindWindowEvents(){
  if (!UI) return;

  UI.window.onclick = (ev) => {
    const btn = ev.target.closest("button");   // <-- btn defined here (fix)
    if (!btn || btn.disabled) return;

    // Back button
    if (btn.hasAttribute("data-back")){
      if (uiMode === "skills") uiMode = "cmd";
      else if (uiMode === "target") uiMode = (pendingAction?.kind === "skill" ? "skills" : "cmd");
      else if (uiMode === "flee") uiMode = "cmd";

      pendingAction = null;
      selectedTarget = { side:"enemy", idx:firstLivingEnemyIndex(), mode:"single" };
      render();
      return;
    }

    // Command buttons
    const cmd = btn.getAttribute("data-cmd");
    if (cmd){
      if (cmd === "closeStatus"){
        statusOpen = null;
        render();
        return;
      }
if (cmd === "closeInspect"){
  inspectOpen = null;
  render();
  return;
}

      if (cmd === "interlude"){
        engine?.advanceInterlude?.();
        if (engine?.state?.interlude) engine.state.interlude = null;
        render();
        stepIfNeeded();
        return;
      }

      if (cmd === "attack"){
        pendingAction = { kind:"attack", label:"Attack" };
        uiMode = "target";
        selectedTarget = { side:"enemy", idx:firstLivingEnemyIndex(), mode:"single" };
        render();
        return;
      }

      if (cmd === "skills"){
        uiMode = "skills";
        pendingAction = null;
        render();
        return;
      }

      if (cmd === "guard"){
        doExecute({ kind:"guard", label:"Guard" }, null);
        return;
      }

      if (cmd === "flee"){
        uiMode = "flee";
        pendingAction = null;
        render();
        return;
      }

      // items not wired
      return;
    }

    // Skill button
    const skillId = btn.getAttribute("data-skill");
    if (skillId){
      const skillDef = getSkillDef(skillId);      // <-- FIX: define skillDef
      const label = skillDef?.name || "Skill";

      const allEnemies = isAllEnemiesSkill(skillDef);
      const allAllies  = isAllAlliesSkill(skillDef);

      let sel;
      if (allEnemies){
        sel = { side:"enemy", idx:firstLivingEnemyIndex(), mode:"all_enemies" };
      } else if (allAllies){
        sel = { side:"hero", idx:firstLivingHeroIndex(), mode:"all_allies" };
      } else {
        const side = inferTargetSideForSkill(skillDef);
        sel = {
          side,
          idx: side === "hero" ? firstLivingHeroIndex() : firstLivingEnemyIndex(),
          mode:"single"
        };

        // Explicit self target
        const t = String(skillDef?.target ?? skillDef?.mode ?? "").toLowerCase().trim();
        if (t === "self"){
          const a = engine?.state?.active;
          sel = { side:"hero", idx: a?.idx ?? firstLivingHeroIndex(), mode:"single" };
        }
      }

      pendingAction = { kind:"skill", skillId, label };
      uiMode = "target";
      selectedTarget = sel;
      render();
      return;
    }

    // Execute
    if (btn.hasAttribute("data-exec")){
      doExecute(pendingAction, selectedTarget);
      return;
    }

    // Flee confirm
    if (btn.hasAttribute("data-flee-yes")){
      doFlee();
      return;
    }
  };
}



// Play FX (movement, flashes, floating numbers) based on engine-provided summary.
async function runFxMaybe(res){
  if (!animsOn) return;
  if (!res?.fx) return;
  if (!UI?.stage) return;
  if (fxBusy) return;
  fxBusy = true;
  try {
    await playActionFX({ stageEl: UI.stage, fx: res.fx });
  } finally {
    fxBusy = false;
  }
}

async function doExecute(action, target){
  if (!engine || !action) return;
  if (fxBusy) return;
  const st = engine.state;
  const a = st.active;
  if (!a || a.side !== "hero") return;

  let res = null;

  if (action.kind === "skill") {
    const def = getSkillDef(action.skillId);
    const tSpec = getSkillTargetSpec(def);

 let payload;

// HARD FORCE AOE (no matter what the UI selected)
if (isAllEnemiesSkill(def)) {
  payload = { side:"enemy", mode:"all_enemies" };
}
else if (isAllAlliesSkill(def)) {
  payload = { side:"hero", mode:"all_allies" };
}
else {
  // normal single-target behavior
  const t = String(def?.target ?? def?.mode ?? "").toLowerCase().trim();
  if (t === "self") payload = { side:"hero", idx: a.idx };
  else if (target && target.side) payload = { side: target.side, idx: target.idx };
  else {
    const side = inferTargetSideForSkill(def);
    payload = { side, idx: side === "hero" ? firstLivingHeroIndex() : firstLivingEnemyIndex() };
  }
}

res = engine.heroUseSkill(action.skillId, payload);

  }

  if (action.kind === "attack"){
    const idx = target?.idx ?? firstLivingEnemyIndex();
    res = engine.heroAttack(idx);
  }

  if (action.kind === "guard"){
    res = engine.heroGuard();
  }

  uiMode = "cmd";
  pendingAction = null;
  selectedTarget = { side:"enemy", idx:firstLivingEnemyIndex(), mode:"single" };
  render();

  await runFxMaybe(res);
  render();
  stepIfNeeded();
}

function doFlee(){
  if (!UI || !engine) return;
  const bid = engine.state.battleId;
  stopAuto();
  UI.host.classList.remove("on");
  dispatchResolved(bid, { canceled:true, aborted:true });
}

function stepIfNeeded(){
  if (!engine || engine.state.winner) return;

  bindWindowEvents();

  if (engine.state.active?.side === "enemy"){
    // If FX are mid-flight, wait a beat so turns don't overlap.
    if (fxBusy){
      setTimeout(stepIfNeeded, 120);
      return;
    }
    setTimeout(async () => {
      const res = engine.stepEnemy();
      render();
      await runFxMaybe(res);
      render();
      stepIfNeeded();
    }, 380);
    return;
  }

  if (engine.state.active?.side === "hero" && autoOn){
    tickAuto();
  }
}

function tickAuto(){
  stopAuto();
  if (!engine || engine.state.winner) return;

  autoTimer = setTimeout(async () => {
    if (!engine || engine.state.winner) return;

    // Don't overlap turns with FX
    if (fxBusy){
      tickAuto();
      return;
    }

    const st = engine.state;
    const a = st.active;

    if (a?.side === "hero"){
      let res = null;
      const skills = engine.getHeroSkillMenu(a.idx);
      const pick =
        skills.find(s => s.usable && !s.isUltimate && s.skillId.endsWith("_s1")) ||
        skills.find(s => s.usable && !s.isUltimate && s.skillId.endsWith("_s2")) ||
        skills.find(s => s.usable && !s.isUltimate) ||
        skills.find(s => s.usable) ||
        null;

      if (pick){
        const def = getSkillDef(pick.skillId);
        const tSpec = getSkillTargetSpec(def);

        if (tSpec === "all_enemies") res = engine.heroUseSkill(pick.skillId, { side:"enemy", mode:"all_enemies" });
        else if (tSpec === "all_allies") res = engine.heroUseSkill(pick.skillId, { side:"hero", mode:"all_allies" });
        else if (tSpec === "self") res = engine.heroUseSkill(pick.skillId, { side:"hero", idx:a.idx });
        else {
          const side = inferTargetSideForSkill(def);
          res = engine.heroUseSkill(pick.skillId, { side, idx: side === "hero" ? firstLivingHeroIndex() : firstLivingEnemyIndex() });
        }
      } else {
        res = engine.heroAttack(firstLivingEnemyIndex());
      }

      render();
      await runFxMaybe(res);
      render();
      stepIfNeeded();
      return;
    }

    if (a?.side === "enemy"){
      const res = engine.stepEnemy();
      render();
      await runFxMaybe(res);
      render();
      stepIfNeeded();
    }

  }, 420);
}

function stopAuto(){
  if (autoTimer){
    clearTimeout(autoTimer);
    autoTimer = null;
  }
}

function dispatchResolved(battleId, result){
  window.dispatchEvent(new CustomEvent("EE_BATTLE_RESOLVED", {
    detail: { battleId, result }
  }));

  if (result?.won === true || result?.winner === "heroes"){
    window.dispatchEvent(new CustomEvent("EE_STORY_BATTLE_RESULT", {
      detail: { battleId, won:true }
    }));
  } else if (result?.won === false || result?.winner === "enemies"){
    window.dispatchEvent(new CustomEvent("EE_STORY_BATTLE_RESULT", {
      detail: { battleId, won:false }
    }));
  } else {
    window.dispatchEvent(new CustomEvent("EE_STORY_BATTLE_RESULT", {
      detail: { battleId, canceled:true }
    }));
  }
}

function firstLivingEnemyIndex(){
  const st = engine?.state;
  if (!st) return 0;
  const i = st.enemies.findIndex(e => e.hp > 0);
  return i >= 0 ? i : 0;
}

function firstLivingHeroIndex(){
  const st = engine?.state;
  if (!st) return 0;
  const i = st.heroes.findIndex(h => h.hp > 0);
  return i >= 0 ? i : 0;
}

function normalizeSelectedTarget(sel){
  const st = engine?.state;
  if (!st) return sel;

  if (sel?.mode === "all_enemies"){
    return { side:"enemy", idx:firstLivingEnemyIndex(), mode:"all_enemies" };
  }
  if (sel?.mode === "all_allies"){
    return { side:"hero", idx:firstLivingHeroIndex(), mode:"all_allies" };
  }

  const side = sel?.side || "enemy";
  const idx = Number(sel?.idx ?? 0);

  if (side === "enemy"){
    if (st.enemies[idx] && st.enemies[idx].hp > 0) return { side:"enemy", idx, mode:"single" };
    return { side:"enemy", idx:firstLivingEnemyIndex(), mode:"single" };
  }

  if (side === "hero"){
    const allowDead = currentSkillAllowsDeadTargets();
    if (st.heroes[idx] && (allowDead ? true : st.heroes[idx].hp > 0)) return { side:"hero", idx, mode:"single" };
    return { side:"hero", idx:(allowDead ? firstDeadHeroIndex() : firstLivingHeroIndex()), mode:"single" };
  }

  return { side:"enemy", idx:firstLivingEnemyIndex(), mode:"single" };
}

function resolveHeroPortrait(heroId){
  const id = String(heroId || "").trim();
  return HERO_ART_BASE + HERO_ART_TEMPLATE.replace("{id}", id);
}

function resolveEnemyPortrait(enemy){
  if (enemy?.art) return enemy.art;
  const id = String(enemy?.id || "enemy").trim();
  return `./assets/enemies/portraits/enemy_${id}.png`;
}

function escapeHtml(s){
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(s){
  return escapeHtml(s).replaceAll("'", "&#39;");
}

function injectStyles(){
  if (document.getElementById("eeBattleFFStyles")) return;
  const st = document.createElement("style");
  st.id = "eeBattleFFStyles";
  st.textContent = `
    #eeBattleHost{position:fixed; inset:0; z-index:9999; display:none;}
    #eeBattleHost.on{display:block;}

    .eeB{position:absolute; inset:0; display:flex; flex-direction:column; background: rgba(0,0,0,.72); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);}

    .eeBTop{display:flex; align-items:center; justify-content:space-between; padding:14px 14px; gap:12px;}
    .eeBTitle{font-weight:900; letter-spacing:.3px; font-size:18px;}
    .eeBSub{opacity:.85; font-size:12px; margin-top:2px;}
    .eeBTopRight{display:flex; align-items:center; gap:8px;}

    .eeBMini{border:1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.06); color:#fff; padding:8px 10px; border-radius:12px; font-weight:800; font-size:12px;}
    .eeBX{border:1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.06); color:#fff; width:38px; height:38px; border-radius:14px; font-size:18px;}

    .eeBStage{position:relative; flex:1; overflow:hidden;}
    .eeBBackdrop{position:absolute; inset:0; background-size:cover; background-position:center; transform: scale(1.04); filter: saturate(1.05) contrast(1.05) brightness(.85);}
    .eeBShade{position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.78));}

    .eeBArena{position:absolute; inset:64px 0 170px 0; display:flex; justify-content:space-between; padding:0 14px; gap:12px;}

    .eeBCol{display:flex; flex-direction:column; gap:10px; width:min(46vw, 320px);}
    .eeBColEnemies{align-items:flex-end;}

    .eeUnit{display:flex; align-items:center; gap:10px; width:100%; max-width:320px; padding:8px 10px; border-radius:16px; border:1px solid rgba(255,255,255,.10); background: rgba(10,12,22,.45); box-shadow: 0 8px 30px rgba(0,0,0,.28);}
    .eeUnit.enemy{flex-direction:row-reverse; text-align:right;}

    .eeUnit.dead{opacity:.35; filter: grayscale(1);}
    .eeUnit.active{outline:2px solid rgba(180,220,255,.55); box-shadow: 0 0 0 6px rgba(120,162,255,.12), 0 10px 35px rgba(0,0,0,.35);}
    .eeUnit.target{outline:2px solid rgba(255,220,120,.7); box-shadow: 0 0 0 6px rgba(255,220,120,.15);}

    .eePortrait{width:54px; height:54px; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04);}
    .eePortrait img{width:100%; height:100%; object-fit:cover; display:block;}

    .eeMeta{flex:1; min-width:0;}
    .eeName{font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
    .eeBars{margin-top:6px; display:flex; flex-direction:column; align-items:stretch; gap:4px;}
    .eeHP{position:relative; flex:1; height:8px; border-radius:10px; background: rgba(255,255,255,.08); overflow:hidden;}
    .eeHPFill{height:100%; background: rgba(120,200,255,.75);}

    .eeHPWrap{display:flex; flex-direction:column; gap:4px;}
    .eeSH{position:relative; flex:1; height:6px; border-radius:10px; background: rgba(255,255,255,.06); overflow:hidden;}
    .eeSHFill{height:100%; background: rgba(200,160,255,.65);}

    .eeTinyRow{display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:6px;}
    .eeTiny{font-size:11px; opacity:.85;}

    .eeTags{display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end;}
    .eeTag{
      font-size:10px; padding:3px 7px; border-radius:999px;
      border:1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.05);
      color:#fff; cursor:pointer;
    }

    .eeBCommand{position:absolute; left:0; right:0; bottom:0; padding:12px 14px; display:flex; gap:12px; align-items:flex-end;}

    .eeBActive{width:170px; min-width:170px; padding:12px 12px; border-radius:18px; border:1px solid rgba(255,255,255,.10); background: rgba(10,12,22,.58); box-shadow: 0 10px 30px rgba(0,0,0,.35);}
    .eeActiveHdr{font-size:11px; opacity:.75; font-weight:800;}
    .eeActiveName{font-size:14px; font-weight:900; margin-top:6px;}

    .eeBWindow{flex:1; max-width:320px; padding:12px 12px; border-radius:18px; border:1px solid rgba(255,255,255,.10); background: rgba(10,12,22,.65); box-shadow: 0 10px 30px rgba(0,0,0,.35); display:flex; flex-direction:column; gap:8px;}

    .eeWinTitle{font-weight:900; font-size:12px; opacity:.9; margin-bottom:2px;}
    .eeWinMuted{font-size:12px; opacity:.85;}
    .eeWinHint{font-size:11px; opacity:.75; margin-top:6px;}
    .eeTargetPick{font-size:12px; opacity:.92; margin: 4px 0 6px 0;}

    .eeWinRow{display:flex; gap:8px; margin-top:6px;}

    .eeBBtn{border:1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.06); color:#fff; padding:10px 12px; border-radius:14px; font-weight:900; font-size:13px; text-align:left;}
    .eeBBtn.primary{border-color: rgba(140,200,255,.35); background: rgba(90,140,255,.18);}
    .eeBBtn.ghost{background: transparent;}
    .eeBBtn:disabled{opacity:.45;}

    /* Skill description rows */
    .eeSkillRow{display:flex; flex-direction:column; gap:6px; margin-bottom:6px;}
    .eeSkillDesc{font-size:11px; opacity:.82; line-height:1.25; padding-left:6px;}

    .eeBLog{position:absolute; right:14px; top:64px; width:min(360px, 92vw); max-height:45vh; overflow:auto; padding:12px 12px; border-radius:18px; border:1px solid rgba(255,255,255,.10); background: rgba(10,12,22,.72); box-shadow: 0 10px 35px rgba(0,0,0,.35);}
    .eeLogLine{font-size:12px; opacity:.9; padding:6px 0; border-bottom:1px dashed rgba(255,255,255,.08);}
    .eeLogLine:last-child{border-bottom:none;}

    .eeBEnd{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background: rgba(0,0,0,.72);}
    .eeBEndTitle{font-size:22px; font-weight:1000;}
    .eeBEndDesc{font-size:13px; opacity:.85;}

    @media (max-width: 520px){
      .eeBActive{display:none;}
      .eeBCommand{align-items:stretch;}
      .eeBWindow{max-width:none;}
      .eeBArena{inset:64px 0 190px 0;}
     /* -----------------------
   Battle FX Layer
------------------------ */
.eeBFX{
  position:absolute;
  inset:0;
  pointer-events:none;
  z-index:6; /* above arena + command */
}

.eeFxFlash{
  position:absolute;
  border-radius:18px;
  mix-blend-mode: screen;
  filter: blur(0.2px);
}

.eeFxFlash.vibeDmg{
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(255,90,90,.55), transparent 70%),
    radial-gradient(85% 70% at 45% 45%, rgba(255,255,255,.35), transparent 72%);
}
.eeFxFlash.vibeHeal{
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(80,255,210,.55), transparent 70%),
    radial-gradient(85% 70% at 45% 45%, rgba(255,255,255,.28), transparent 72%);
}
.eeFxFlash.vibeShield{
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(90,170,255,.55), transparent 70%),
    radial-gradient(85% 70% at 45% 45%, rgba(255,255,255,.22), transparent 72%);
}
.eeFxFlash.vibeBuff{
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(255,210,90,.55), transparent 70%),
    radial-gradient(85% 70% at 45% 45%, rgba(255,255,255,.22), transparent 72%);
}
.eeFxFlash.vibeDebuff{
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(180,90,255,.55), transparent 70%),
    radial-gradient(85% 70% at 45% 45%, rgba(255,255,255,.18), transparent 72%);
}

.eeFxRing{
  position:absolute;
  border-radius:22px;
  border:2px solid rgba(255,255,255,.22);
  background:
    radial-gradient(closest-side, transparent 62%, rgba(255,255,255,.08) 70%, transparent 78%);
  mix-blend-mode: screen;
  filter: blur(0.15px);
}

.eeFxRing.vibeDmg{ border-color: rgba(255,90,90,.55); box-shadow: 0 0 18px rgba(255,90,90,.30); }
.eeFxRing.vibeHeal{ border-color: rgba(80,255,210,.55); box-shadow: 0 0 18px rgba(80,255,210,.26); }
.eeFxRing.vibeShield{ border-color: rgba(90,170,255,.55); box-shadow: 0 0 18px rgba(90,170,255,.26); }
.eeFxRing.vibeBuff{ border-color: rgba(255,210,90,.55); box-shadow: 0 0 18px rgba(255,210,90,.22); }
.eeFxRing.vibeDebuff{ border-color: rgba(180,90,255,.55); box-shadow: 0 0 18px rgba(180,90,255,.26); }

.eeFxFloat{
  position:absolute;
  transform: translate(-50%, -50%);
  font-weight:1000;
  letter-spacing:.2px;
  text-shadow: 0 6px 18px rgba(0,0,0,.55);
  padding:2px 6px;
  border-radius:10px;
  background: rgba(0,0,0,.18);
  border: 1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  white-space:nowrap;
  z-index:7;
  font-size:14px;
}

.eeFxFloat.fxDmg{ color: rgba(255,120,120,.98); }
.eeFxFloat.fxHeal{ color: rgba(120,255,220,.98); }
.eeFxFloat.fxShield{ color: rgba(140,190,255,.98); }
.eeFxFloat.fxBuff{ color: rgba(255,220,140,.98); }
.eeFxFloat.fxDebuff{ color: rgba(200,150,255,.98); }
 
    }
  `;
  document.head.appendChild(st);

  setTimeout(bindWindowEvents, 0);
}
