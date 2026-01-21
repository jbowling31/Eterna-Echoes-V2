// docs/js/enemies/enemies.data.js
// Enemy compendium (Chapter 1 seed + shipped portrait roster).
// Auto-seeded from Chapter_1_Full_Enemy_Stats.csv and local portrait files.
// Canonical portraits live in: ./assets/enemies/portraits/enemy_<id>.png

export const ENEMIES = Object.freeze(
  [
    {id:"shroudspawn", name:"Shroudspawn", maxHp:120, atk:18, def:10, skills:["Claw Swipe (basic)", "Lurk (evasion buff)"], notes:"Standard melee, tutorial use", portraitId:"shroudspawn_grunt"},
    {id:"corrupted_river_beast", name:"Corrupted River Beast", maxHp:160, atk:22, def:12, skills:["Water Slam (splash AoE)", "Soak Field (healing reduction)"], notes:"Water theme, terrain synergy", portraitId:"mirrorform_unit"},
    {id:"echo_rusher", name:"Echo Rusher", maxHp:100, atk:26, def:6, skills:["Quick Slash (strike + speed up)", "Fading Step (evasion boost)"], notes:"Fast, high burst unit", portraitId:"echo_leaper"},
    {id:"spore_beast", name:"Spore Beast", maxHp:220, atk:20, def:18, skills:["Toxic Bloom (AoE poison)", "Spore Shield (DEF up)"], notes:"Persistent damage, slows player"},
    {id:"mirrorling", name:"Mirrorling", maxHp:150, atk:20, def:15, skills:["Reflect Stance (copy skill)", "Echo Burst (mirror magic)"], notes:"Copies recent player skill"},
    {id:"elite_shroud_warrior", name:"Elite Shroud Warrior", maxHp:240, atk:30, def:20, skills:["Overwhelm (strike + team buff)", "Unbreakable (DEF buff to allies)"], notes:"Fights in tandem, must be focus-targeted", portraitId:"shroud_warden"},
    {id:"glitch_echo", name:"Glitch Echo", maxHp:210, atk:28, def:14, skills:["Temporal Slash (disrupt turn order)", "Loop Spike (repeats last ally move)"], notes:"Time-warp based", portraitId:"glitchspawn_caster"},
    {id:"fractured_arlen", name:"Fractured Arlen", maxHp:260, atk:30, def:20, skills:["Burn Rewrite (AoE + confuse)", "Time Loop (revive self with reduced HP)"], notes:"Mini-boss, thematically mirrors Arlen"},
    {id:"glyph_guardian", name:"Glyph Guardian", maxHp:300, atk:25, def:28, skills:["Shield Pulse (team shield)", "Phase Lock (delays enemy turn)", "Glyph Beam"], notes:"Guardian of the Shroud Core, supports it", portraitId:"glyphspawn_elite"},
    {id:"shroud_core", name:"Shroud Core", maxHp:350, atk:0, def:40, skills:["Power Transfer (buffs allies)", "Glyph Overload (self-destruct)"], notes:"Does not attack directly; supports battlefield", portraitId:"shroud_herald"},
    {id:"fire_wraith", name:"Fire Wraith", maxHp:180, atk:32, def:10, skills:["Burning Lunge (bleed)", "Ember Chain (spread burn)"], notes:"Mob-style DPS, fast turns", portraitId:"echo_wraith"},
    {id:"shroud_elite_flame_resistant", name:"Shroud Elite – Flame Resistant", maxHp:300, atk:35, def:25, skills:["Flame Shield (reflect fire)", "Breakline Smash (push + debuff)"], notes:"Anti-fire design, Solen intro battle", portraitId:"shroud_warden"},
    {id:"shroudspawn_grunt", name:"Shroudspawn Grunt", maxHp:90, atk:14, def:8, skills:["Claw Swipe (basic)"], notes:"Variant of Shroudspawn (auto-generated from CSV baseline).", portraitId:"shroudspawn_grunt"},
    {id:"shroudspawn_scout", name:"Shroudspawn Scout", maxHp:84, atk:16, def:6, skills:["Claw Swipe (basic)"], notes:"Variant of Shroudspawn (auto-generated from CSV baseline).", portraitId:"shroudspawn_scout"},
    {id:"echo_leaper", name:"Echo Leaper", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"echo_leaper"},
    {id:"echo_wraith", name:"Echo Wraith", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"echo_wraith"},
    {id:"glitchspawn_caster", name:"Glitchspawn Caster", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"glitchspawn_caster"},
    {id:"glyphspawn_elite", name:"Glyphspawn Elite", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"glyphspawn_elite"},
    {id:"mirrorform_unit", name:"Mirrorform Unit", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"mirrorform_unit"},
    {id:"shroud_broodmother", name:"Shroud Broodmother", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"shroud_broodmother"},
    {id:"shroud_caster", name:"Shroud Caster", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"shroud_caster"},
    {id:"shroud_hatchling", name:"Shroud Hatchling", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"shroud_hatchling"},
    {id:"shroud_herald", name:"Shroud Herald", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"shroud_herald"},
    {id:"shroud_warden", name:"Shroud Warden", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"shroud_warden"},
    {id:"spawn_ghost", name:"Spawn Ghost", maxHp:100, atk:12, def:6, skills:[], notes:"Placeholder stats (no CSV row yet).", portraitId:"spawn_ghost"},
  ]
);

window.__ENEMIES = ENEMIES;
console.log("Exposed __ENEMIES", ENEMIES.length);

export function getEnemyDef(enemyId){
  const id = String(enemyId || "").trim();
  return (ENEMIES || []).find(e => e.id === id) || null;
}

export function enemyPortraitCandidates(enemyId){
  const def = getEnemyDef(enemyId);
  const id = String(def?.portraitId || enemyId || "enemy");
  const base = "./assets/enemies/portraits/";
  // main convention (your repo): enemy_<id>.png
  const a = base + `enemy_${id}.png`;
  // common alternates we might have used earlier
  const b = base + `enemy_${id}_p.png`;
  const c = base + `${id}.png`;
  // legacy fallback folders (safe to keep; no renames)
  const d = `./assets/enemies/enemy_${id}.png`;
  const e = `./assets/story/enemies/enemy_${id}.png`;
  const f = `./assets/story/enemies/enemy_${id}_p.png`;
  return [a,b,c,d,e,f].filter(Boolean);
}

export function makeEnemyInstance(enemyId, overrides={}){
  const def = getEnemyDef(enemyId) || { id: String(enemyId), name: String(enemyId) };
  const base = {
    id: def.id,
    name: def.name,
    maxHp: def.maxHp ?? 100,
    atk: def.atk ?? 10,
    def: def.def ?? 5,
    skills: Array.isArray(def.skills) ? def.skills.slice() : [],
    notes: def.notes || "",
    portraitId: def.portraitId,
  };
  return { ...base, ...overrides };
}
