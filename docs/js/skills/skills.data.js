// Skill catalog with scaling + inspect metadata.
// Scaling model (prototype):
// - Damage: scales by ATK%
// - Healing: scales by ATK%
// - Shields: scales by DEF%
// - Debuffs: use chance/duration fields, can scale later
//
// Flat per-level increments for now.

export const SKILL_MAX_LEVEL = 10;

export const SKILLS = Object.freeze({
  // ===== Arlen =====
  arlen_basic: {
    id:"arlen_basic", heroId:"arlen", slot:"Basic", name:"Flicker Bolt",
    kind:"damage", scaleStat:"ATK", basePct:75, perLevelPct:6,
    text:"Minor fire damage. Small chance to buff a random ally’s Speed.",
    status:{ chance:15, name:"Haste", turns:1, target:"ally_random" },
  },
  arlen_s1:{
    id:"arlen_s1", heroId:"arlen", slot:"Skill 1", name:"Kindle Hope",
    kind:"heal", scaleStat:"ATK", basePct:95, perLevelPct:7,
    cdTurns:2, energyCost:0,
    text:"Heals the lowest-HP ally. If attacked next, attacker takes a small Burn DoT.",
    status:{ name:"Burn", chance:100, turns:2, target:"attacker_on_hit" },
  },
  arlen_s2:{
    id:"arlen_s2", heroId:"arlen", slot:"Skill 2", name:"Fire Glyph",
    kind:"buff", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    target:"all_allies",
    text:"Buffs allies: Magic Attack and Accuracy for 2 turns.",
    status:{ name:"Fire Glyph", chance:100, turns:2, target:"all_allies" },
  },
  arlen_u:{
    id:"arlen_u", heroId:"arlen", slot:"Ultimate", name:"Rewrite Fate",
    kind:"support", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:4, energyCost:100,
    text:"Rewinds an ally’s last taken damage (negates the last hit).",
  },

  // ===== Nyxa =====
  nyxa_basic:{
    id:"nyxa_basic", heroId:"nyxa", slot:"Basic", name:"Quick Jab",
    kind:"damage", scaleStat:"ATK", basePct:70, perLevelPct:6,
    text:"Fast hit with increased crit chance.",
  },
  nyxa_s1:{
    id:"nyxa_s1", heroId:"nyxa", slot:"Skill 1", name:"Time Grenade",
    kind:"damage", scaleStat:"ATK", basePct:90, perLevelPct:7,
    cdTurns:2, energyCost:0,
    text:"Explodes after 2 turns, dealing damage and disrupting enemy skills.",
    status:{ name:"Disrupt", chance:100, turns:1, target:"enemy" },
  },
  nyxa_s2:{
    id:"nyxa_s2", heroId:"nyxa", slot:"Skill 2", name:"Loop Skim",
    kind:"utility", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    text:"Gains stealth; cannot be targeted next turn.",
    status:{ name:"Stealth", chance:100, turns:1, target:"self" },
  },
  nyxa_u:{
    id:"nyxa_u", heroId:"nyxa", slot:"Ultimate", name:"Paradox Trap",
    kind:"debuff", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:4, energyCost:100,
    target:"all_enemies",
    text:"Removes all buffs and locks ultimate abilities for 2 turns.",
    status:{ name:"Ult Lock", chance:100, turns:2, target:"all_enemies" },
  },

  // ===== Dorun =====
  dorun_basic:{
    id:"dorun_basic", heroId:"dorun", slot:"Basic", name:"Crag Bash",
    kind:"damage", scaleStat:"ATK", basePct:65, perLevelPct:6,
    text:"Small AoE with a chance to Taunt.",
    status:{ name:"Taunt", chance:15, turns:1, target:"enemy" },
  },
dorun_s1:{
  id:"dorun_s1", heroId:"dorun", slot:"Skill 1", name:"Hardened Howl",
  kind:"buff",
  scaleStat:"DEF",        // makes UI show DEF% scaling
  basePct:20,             // Lv1 = +20% DEF
  perLevelPct:2,          // +2% per skill level (Lv10 => +38%)
  cdTurns:2, energyCost:0,
  text:"Gain +{pct}% DEF and Taunt for 1 turn.",
  status:{ name:"Taunt", chance:100, turns:1, target:"self" },
},

  dorun_s2:{
    id:"dorun_s2", heroId:"dorun", slot:"Skill 2", name:"Time Eater",
    kind:"heal", scaleStat:"ATK", basePct:55, perLevelPct:5,
    cdTurns:2, energyCost:0,
    text:"Absorbs the next debuff and converts it into healing.",
  },
  dorun_u:{
    id:"dorun_u", heroId:"dorun", slot:"Ultimate", name:"Living Wall",
    kind:"utility", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:4, energyCost:100,
    text:"Immune to damage for 1 turn and Taunts all enemies.",
    status:{ name:"Invulnerable", chance:100, turns:1, target:"self" },
  },

  // ===== Elya =====
  elya_basic:{
    id:"elya_basic", heroId:"elya", slot:"Basic", name:"Ice Tap",
    kind:"damage", scaleStat:"ATK", basePct:70, perLevelPct:6,
    text:"Hit that slows the target.",
    status:{ name:"Slow", chance:35, turns:1, target:"enemy" },
  },
  elya_s1:{
    id:"elya_s1", heroId:"elya", slot:"Skill 1", name:"Fracture Waltz",
    kind:"debuff", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    target:"all_enemies",
    text:"Area slow and skill delay.",
    status:{ name:"Slow", chance:100, turns:1, target:"all_enemies" },
  },
  elya_s2:{
    id:"elya_s2", heroId:"elya", slot:"Skill 2", name:"Mirror Freeze",
    kind:"utility", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    text:"Reflects the first skill targeting her.",
    status:{ name:"Reflect", chance:100, turns:1, target:"self" },
  },
  elya_u:{
    id:"elya_u", heroId:"elya", slot:"Ultimate", name:"Glacial Timefall",
    kind:"control", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:4, energyCost:100,
    target:"all_enemies",
    text:"Freezes all enemies (skip 1 turn).",
    status:{ name:"Freeze", chance:100, turns:1, target:"all_enemies" },
  },

  // ===== Solen =====
  solen_basic:{
    id:"solen_basic", heroId:"solen", slot:"Basic", name:"Flame Lunge",
    kind:"damage", scaleStat:"ATK", basePct:78, perLevelPct:6,
    text:"Direct fire damage.",
  },
  solen_s1:{
    id:"solen_s1", heroId:"solen", slot:"Skill 1", name:"Combustion Drive",
    kind:"damage", scaleStat:"ATK", basePct:110, perLevelPct:8,
    cdTurns:2, energyCost:0,
    text:"Ignores some DEF and applies Burn.",
    status:{ name:"Burn", chance:60, turns:2, target:"enemy" },
  },
  solen_s2:{
    id:"solen_s2", heroId:"solen", slot:"Skill 2", name:"Ignition Sweep",
    kind:"damage", scaleStat:"ATK", basePct:95, perLevelPct:7,
    cdTurns:2, energyCost:0,
    text:"Hits enemies in a line and lowers resistance.",
    status:{ name:"Res Down", chance:60, turns:2, target:"enemy" },
  },
  solen_u:{
    id:"solen_u", heroId:"solen", slot:"Ultimate", name:"Cataclysm Spear",
    kind:"damage", scaleStat:"ATK", basePct:140, perLevelPct:9,
    cdTurns:4, energyCost:100,
    target:"all_enemies",
    text:"Heavy AoE fire attack. Chance to Burn each target.",
    status:{ name:"Burn", chance:30, turns:2, target:"all_enemies" },
  },

  // ===== Vireon (SR) =====
  vireon_basic:{
    id:"vireon_basic", heroId:"vireon", slot:"Basic", name:"Scorching Strike",
    kind:"damage", scaleStat:"ATK", basePct:75, perLevelPct:6,
    text:"Moderate fire damage. 10% chance to Burn.",
    status:{ name:"Burn", chance:10, turns:2, target:"enemy" },
  },
vireon_s1:{
  id:"vireon_s1", heroId:"vireon", slot:"Skill 1", name:"Magma Aegis",
  kind:"utility",
  cdTurns:3,
  target:"self",
  shield:{ base: 18, hpPct: 0.08 },  // whatever you use
  reflectPct: 0.20,                 // 20% reflect
  reflectTurns: 2,                  // how long reflect lasts
  text:"Gain a Fire Shield and reflect 20% damage for 2 turns."
},

  vireon_s2:{
    id:"vireon_s2", heroId:"vireon", slot:"Skill 2", name:"Flame Pulse",
    kind:"damage", scaleStat:"ATK", basePct:85, perLevelPct:7,
    cdTurns:2, energyCost:0,
    target:"all_enemies",
    text:"Small AoE damage and reduces enemy Attack for 1 turn.",
    status:{ name:"ATK Down", chance:100, turns:1, target:"all_enemies" },
  },
vireon_u:{
  id:"vireon_u", heroId:"vireon", slot:"Ultimate", name:"Phoenix Barrier",
  kind:"hybrid",
  cdTurns:4, energyCost:100,

  // Mechanics (used by battle.engine.js)
  target:"all_enemies",        // purely UI hint
  dmgAll: {                    // damage ALL enemies
    base: 28,                  // tweak: base damage
    atkPct: 0.85               // tweak: scales from Vireon's ATK
  },
  shieldAll: {                 // shield ALL allies
    base: 22,                  // tweak: flat shield
    hpPct: 0.10                // tweak: scales from Vireon's max HP
  },

  text:"Blasts all enemies and grants a Phoenix Shield to all allies.",
},


  // ===== Sirenia (SR) =====
  sirenia_basic:{
    id:"sirenia_basic", heroId:"sirenia", slot:"Basic", name:"Water Jet",
    kind:"damage", scaleStat:"ATK", basePct:70, perLevelPct:6,
    text:"Light water damage to one enemy.",
  },
  sirenia_s1:{
    id:"sirenia_s1", heroId:"sirenia", slot:"Skill 1", name:"Echo Restoration",
    kind:"heal", scaleStat:"ATK", basePct:100, perLevelPct:7,
    cdTurns:2, energyCost:0,
    target:"all_allies",
    text:"Heals all allies and removes 1 debuff.",
  },
sirenia_s2:{
  id:"sirenia_s2", heroId:"sirenia", slot:"Skill 2", name:"Tidal Blessing",
  kind:"buff", cdTurns:2, energyCost:0, target:"all_allies",
  text:"Buffs DEF and RESIST for 2 turns.",
  statuses:[
    { name:"DEF Up",    chance:100, turns:2, target:"all_allies", meta:{ pct:20 } },
    { name:"Resist Up", chance:100, turns:2, target:"all_allies", meta:{ pct:30 } },
  ],
},




sirenia_u:{
  id:"sirenia_u", heroId:"sirenia", slot:"Ultimate", name:"Moonwake Revival",
  kind:"support", basePct:0, perLevelPct:0,
  cdTurns:4, energyCost:100,
  mode:"single_ally",
  canTargetDead:true,
  revivePct:50,
  grantExtraTurn:true,
  text:"Revive one fallen ally with 50% HP."
},

  // ===== Caelum (SR) =====
  caelum_basic:{
    id:"caelum_basic", heroId:"caelum", slot:"Basic", name:"Twin Slash",
    kind:"damage", scaleStat:"ATK", basePct:45, perLevelPct:4,
    text:"Hits twice with light wind damage.",
  },
  caelum_s1:{
    id:"caelum_s1", heroId:"caelum", slot:"Skill 1", name:"Spiral Dash",
    kind:"damage", scaleStat:"ATK", basePct:95, perLevelPct:7,
    cdTurns:2, energyCost:0,
        self: { shieldPctAtk: 60, turns: 2 },
    text: "Dash through an enemy for heavy Wind damage, then gain a shield (60% ATK) for 2 turns.",
    status:{ name:"Evasion", chance:100, turns:1, target:"self" },
  },
caelum_s2:{
  id:"caelum_s2", heroId:"caelum", slot:"Skill 2", name:"Wind Shear",
  kind:"damage", scaleStat:"ATK", basePct:80, perLevelPct:6,
  cdTurns:2, energyCost:0,

  // ✅ This makes the skill itself AOE in your UI + engine payload routing
  target:"all_enemies",

  text:"AoE attack that lowers enemy Speed.",

  // ✅ Keep the status as all_enemies too (redundant but fine)
  status:{ name:"Slow", chance:70, turns:2, target:"all_enemies" },
},

  caelum_u:{
    id:"caelum_u", heroId:"caelum", slot:"Ultimate", name:"Tempest Waltz",
    kind:"damage", scaleStat:"ATK", basePct:130, perLevelPct:8,
    cdTurns:4, energyCost:100,
    text:"Heavy damage to all enemies; 50% chance to reset cooldowns.",
  },

  // ===== Morgrin (SR) =====
  morgrin_basic:{
    id:"morgrin_basic", heroId:"morgrin", slot:"Basic", name:"Vine Whip",
    kind:"damage", scaleStat:"ATK", basePct:70, perLevelPct:6,
    text:"Light damage and a small chance to Entangle (delay turn).",
    status:{ name:"Entangle", chance:10, turns:1, target:"enemy" },
  },
  morgrin_s1:{
    id:"morgrin_s1", heroId:"morgrin", slot:"Skill 1", name:"Grasping Roots",
    kind:"debuff", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    text:"Area debuff reducing enemy Speed and Accuracy.",
  },
  morgrin_s2:{
    id:"morgrin_s2", heroId:"morgrin", slot:"Skill 2", name:"Spores of Dread",
    kind:"debuff", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    text:"Chance to Silence and weaken skill power.",
    status:{ name:"Silence", chance:35, turns:1, target:"enemy" },
  },
  morgrin_u:{
    id:"morgrin_u", heroId:"morgrin", slot:"Ultimate", name:"Nature’s Lock",
    kind:"control", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:4, energyCost:100,
    text:"Locks enemy abilities (no skill use) for 1 turn (3 targets).",
  },

  // ===== Thalor (SR) =====
  thalor_basic:{
    id:"thalor_basic", heroId:"thalor", slot:"Basic", name:"Dual Reflection",
    kind:"damage", scaleStat:"ATK", basePct:45, perLevelPct:4,
    text:"Hits twice; second hit stronger if your HP is higher than the target.",
  },
  thalor_s1:{
    id:"thalor_s1", heroId:"thalor", slot:"Skill 1", name:"Echo Cut",
    kind:"damage", scaleStat:"ATK", basePct:90, perLevelPct:7,
    cdTurns:2, energyCost:0,
    text:"Attacks then repeats after a 1-turn delay.",
  },
  thalor_s2:{
    id:"thalor_s2", heroId:"thalor", slot:"Skill 2", name:"Aqua Blink",
    kind:"utility", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    text:"Dodges next attack and counters.",
  },
  thalor_u:{
    id:"thalor_u", heroId:"thalor", slot:"Ultimate", name:"Tidal Rift",
    kind:"damage", scaleStat:"ATK", basePct:150, perLevelPct:9,
    cdTurns:4, energyCost:100,
    text:"Massive single-target damage; doubles if cast again in same loop.",
  },
});

export function getSkillDef(skillId){ return SKILLS[skillId]; }

// ==============================
// Enemy skill catalog (seed)
// ==============================
// NOTE: This is intentionally small and battle-focused.
// You can grow this per enemy type over time.

export const ENEMY_SKILLS = Object.freeze({
  // ===== Shroudspawn =====
  e_shroudspawn_claw: {
    id:"e_shroudspawn_claw",
    ownerId:"shroudspawn_grunt",
    name:"Claw Swipe",
    kind:"damage",
    basePct:85,
    perLevelPct:0,
    cdTurns:0,
    energyCost:0,
    text:"A brutal swipe at a single target.",
    status:{ name:"Bleed", chance:15, turns:2, target:"enemy" },
  },

  e_shroudspawn_void_spit: {
    id:"e_shroudspawn_void_spit",
    ownerId:"shroudspawn_grunt",
    name:"Void Spit",
    kind:"damage",
    basePct:95,
    perLevelPct:0,
    cdTurns:2,
    energyCost:0,
    text:"A corrosive spit that can ignite the target's nerves.",
    status:{ name:"Burn", chance:35, turns:2, target:"enemy" },
  },

  e_shroudspawn_pack_howl: {
    id:"e_shroudspawn_pack_howl",
    ownerId:"shroudspawn_grunt",
    name:"Pack Howl",
    kind:"buff",
    basePct:0,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    targetMode:"all_enemies",
    text:"Rallies allies, raising their Defense briefly.",
    status:{ name:"DEF Up", chance:100, turns:1, target:"all_enemies" },
  },

  e_scout_pounce: {
    id:"e_scout_pounce",
    ownerId:"shroudspawn_scout",
    name:"Pounce",
    kind:"damage",
    basePct:90,
    perLevelPct:0,
    cdTurns:2,
    energyCost:0,
    text:"A fast lunge that can stun.",
    status:{ name:"Stun", chance:25, turns:1, target:"enemy" },
  },

  // ===== Ghosts / Wraiths =====
  e_ghost_drain: {
    id:"e_ghost_drain",
    ownerId:"spawn_ghost",
    name:"Soul Drain",
    kind:"damage",
    basePct:85,
    perLevelPct:0,
    cdTurns:2,
    energyCost:0,
    lifestealPct: 0.35,
    text:"Drains vitality and heals for a percent of damage dealt.",
  },

  e_ghost_wail: {
    id:"e_ghost_wail",
    ownerId:"spawn_ghost",
    name:"Hollow Wail",
    kind:"damage",
    basePct:70,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    targetMode:"all_enemies",
    text:"A wail that hits all enemies and weakens them.",
    status:{ name:"ATK Down", chance:50, turns:1, target:"all_enemies" },
  },

  e_wraith_lament: {
    id:"e_wraith_lament",
    ownerId:"echo_wraith",
    name:"Wraith Lament",
    kind:"damage",
    basePct:75,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    targetMode:"all_enemies",
    text:"Sends a wave of memory fog through all enemies.",
    status:{ name:"ATK Down", chance:35, turns:1, target:"all_enemies" },
  },

  e_wraith_freeze_touch: {
    id:"e_wraith_freeze_touch",
    ownerId:"echo_wraith",
    name:"Cold Touch",
    kind:"damage",
    basePct:85,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    text:"A chilling strike that can freeze.",
    status:{ name:"Freeze", chance:25, turns:1, target:"enemy" },
  },

  // ===== Echo Leaper =====
  e_leaper_dive: {
    id:"e_leaper_dive",
    ownerId:"echo_leaper",
    name:"Sky Dive",
    kind:"damage",
    basePct:115,
    perLevelPct:0,
    cdTurns:2,
    energyCost:0,
    text:"A high-speed dive from above.",
  },

  e_leaper_trip: {
    id:"e_leaper_trip",
    ownerId:"echo_leaper",
    name:"Trip Slash",
    kind:"damage",
    basePct:85,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    text:"A low slash that can stun.",
    status:{ name:"Stun", chance:20, turns:1, target:"enemy" },
  },

  // ===== Glyphspawn =====
  e_glyph_pulse: {
    id:"e_glyph_pulse",
    ownerId:"glyphspawn_elite",
    name:"Glyph Pulse",
    kind:"damage",
    basePct:80,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    targetMode:"all_enemies",
    text:"A pulsing shockwave across the field.",
  },

  e_glyph_ult_lock: {
    id:"e_glyph_ult_lock",
    ownerId:"glyphspawn_elite",
    name:"Seal the Echo",
    kind:"debuff",
    basePct:0,
    perLevelPct:0,
    cdTurns:4,
    energyCost:0,
    targetMode:"all_enemies",
    text:"Temporarily locks enemy ultimates.",
    status:{ name:"Ult Lock", chance:100, turns:1, target:"all_enemies" },
  },

  // ===== Spore Beast =====
  e_spore_bloom: {
    id:"e_spore_bloom",
    ownerId:"spore_beast",
    name:"Toxic Bloom",
    kind:"damage",
    basePct:75,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    targetMode:"all_enemies",
    text:"Releases spores that sting the lungs.",
    status:{ name:"ATK Down", chance:40, turns:1, target:"all_enemies" },
  },

  e_spore_shield: {
    id:"e_spore_shield",
    ownerId:"spore_beast",
    name:"Spore Shield",
    kind:"buff",
    basePct:0,
    perLevelPct:0,
    cdTurns:4,
    energyCost:0,
    text:"Hardens into a protective spore shell.",
    shield:{ base: 40, hpPct: 0.06 },
    status:{ name:"DEF Up", chance:100, turns:1, target:"self" },
    targetMode:"self",
  },

  // ===== Hatchlings / Casters =====
  e_hatchling_bite: {
    id:"e_hatchling_bite",
    ownerId:"shroud_hatchling",
    name:"Razor Bite",
    kind:"damage",
    basePct:95,
    perLevelPct:0,
    cdTurns:1,
    energyCost:0,
    text:"A quick bite that can cause bleeding.",
    status:{ name:"Bleed", chance:25, turns:2, target:"enemy" },
  },

  e_caster_hex: {
    id:"e_caster_hex",
    ownerId:"shroud_caster",
    name:"Hex Bolt",
    kind:"damage",
    basePct:95,
    perLevelPct:0,
    cdTurns:2,
    energyCost:0,
    text:"A bolt that scrambles timing and weakens attack.",
    status:{ name:"ATK Down", chance:40, turns:1, target:"enemy" },
  },

  e_caster_barrier: {
    id:"e_caster_barrier",
    ownerId:"shroud_caster",
    name:"Barrier Sigil",
    kind:"support",
    basePct:0,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    text:"Raises a protective barrier on an ally.",
    shield:{ base: 55, hpPct: 0.04 },
  },

  // ===== Mirrorforms =====
  e_mirror_reflect: {
    id:"e_mirror_reflect",
    ownerId:"mirrorling",
    name:"Reflect Stance",
    kind:"utility",
    basePct:0,
    perLevelPct:0,
    cdTurns:4,
    energyCost:0,
    text:"Takes a stance that reflects a portion of incoming damage.",
    reflectPct: 0.20,
    targetMode:"self",
  },

  e_mirror_burst: {
    id:"e_mirror_burst",
    ownerId:"mirrorling",
    name:"Echo Burst",
    kind:"damage",
    basePct:78,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    targetMode:"all_enemies",
    text:"A burst of refracted force hits all enemies.",
  },

  // ===== Broodmother =====
  e_broodmother_slam: {
    id:"e_broodmother_slam",
    ownerId:"shroud_broodmother",
    name:"Nest Slam",
    kind:"damage",
    basePct:110,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    text:"A crushing slam that can stun.",
    status:{ name:"Stun", chance:20, turns:1, target:"enemy" },
  },

  e_broodmother_spawn: {
    id:"e_broodmother_spawn",
    ownerId:"shroud_broodmother",
    name:"Eggburst",
    kind:"buff",
    basePct:0,
    perLevelPct:0,
    cdTurns:4,
    energyCost:0,
    text:"Fortifies itself as the nest surges.",
    status:{ name:"DEF Up", chance:100, turns:1, target:"self" },
    targetMode:"self",
    shield:{ base: 80, hpPct: 0.05 },
  },

  // ===== Glitchspawn =====
  e_glitch_rewrite_blast: {
    id:"e_glitch_rewrite_blast",
    ownerId:"glitchspawn_caster",
    name:"Rewrite Blast",
    kind:"damage",
    basePct:95,
    perLevelPct:0,
    cdTurns:1,
    energyCost:0,
    targetMode:"all_enemies",
    text:"A repeating blast that interferes with skills.",
    status:{ name:"Loop Lock", chance:25, turns:1, target:"all_enemies" },
  },

  // ===== Warden =====
  e_warden_cleave: {
    id:"e_warden_cleave",
    ownerId:"shroud_warden",
    name:"Warden Cleave",
    kind:"damage",
    basePct:105,
    perLevelPct:0,
    cdTurns:2,
    energyCost:0,
    text:"A heavy cleave at a single target.",
  },

  e_warden_guard: {
    id:"e_warden_guard",
    ownerId:"shroud_warden",
    name:"Fortify",
    kind:"buff",
    basePct:0,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    text:"Raises defenses and gains a shield.",
    targetMode:"self",
    status:{ name:"DEF Up", chance:100, turns:1, target:"self" },
    shield:{ base: 90, hpPct: 0.05 },
  },

  e_warden_stun_slam: {
    id:"e_warden_stun_slam",
    ownerId:"shroud_warden",
    name:"Shock Slam",
    kind:"damage",
    basePct:95,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    text:"A ground slam that can stun.",
    status:{ name:"Stun", chance:30, turns:1, target:"enemy" },
  },

  // ===== Herald =====
  e_herald_void_lance: {
    id:"e_herald_void_lance",
    ownerId:"shroud_herald",
    name:"Void Lance",
    kind:"damage",
    basePct:120,
    perLevelPct:0,
    cdTurns:2,
    energyCost:0,
    text:"A spear of void energy through a single target.",
  },

  e_herald_loop_lock: {
    id:"e_herald_loop_lock",
    ownerId:"shroud_herald",
    name:"Loop Lock",
    kind:"debuff",
    basePct:0,
    perLevelPct:0,
    cdTurns:4,
    energyCost:0,
    targetMode:"all_enemies",
    text:"Disrupts the loop, preventing non-basic skills briefly.",
    status:{ name:"Loop Lock", chance:100, turns:1, target:"all_enemies" },
  },

  e_herald_nova: {
    id:"e_herald_nova",
    ownerId:"shroud_herald",
    name:"Herald Nova",
    kind:"damage",
    basePct:85,
    perLevelPct:0,
    cdTurns:3,
    energyCost:0,
    targetMode:"all_enemies",
    text:"A nova of corruption hits all enemies.",
    status:{ name:"ATK Down", chance:30, turns:1, target:"all_enemies" },
  },

  e_herald_ult_lock: {
    id:"e_herald_ult_lock",
    ownerId:"shroud_herald",
    name:"Silence the Ultimate",
    kind:"debuff",
    basePct:0,
    perLevelPct:0,
    cdTurns:5,
    energyCost:0,
    targetMode:"all_enemies",
    text:"Locks enemy ultimates.",
    status:{ name:"Ult Lock", chance:100, turns:1, target:"all_enemies" },
  },
});


export function getEnemySkillDef(skillId){ return ENEMY_SKILLS[skillId]; }
