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
    kind:"shield", scaleStat:"DEF", basePct:60, perLevelPct:6,
    cdTurns:2, energyCost:0,
    text:"Grants a Fire Shield that absorbs damage and reflects 20% back.",
    status:{ name:"Reflect", chance:100, turns:2, target:"self" },
  },
  vireon_s2:{
    id:"vireon_s2", heroId:"vireon", slot:"Skill 2", name:"Flame Pulse",
    kind:"damage", scaleStat:"ATK", basePct:85, perLevelPct:7,
    cdTurns:2, energyCost:0,
    text:"Small AoE damage and reduces enemy Attack for 1 turn.",
    status:{ name:"ATK Down", chance:100, turns:1, target:"all_enemies" },
  },
  vireon_u:{
    id:"vireon_u", heroId:"vireon", slot:"Ultimate", name:"Phoenix Barrier",
    kind:"utility", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:4, energyCost:100,
    text:"Revives Vireon once per loop with 40% HP and Taunts for 1 turn.",
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
    text:"Heals all allies and removes 1 debuff.",
  },
  sirenia_s2:{
    id:"sirenia_s2", heroId:"sirenia", slot:"Skill 2", name:"Tidal Blessing",
    kind:"buff", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:2, energyCost:0,
    text:"Buffs DEF and RESIST for 2 turns.",
  },
  sirenia_u:{
    id:"sirenia_u", heroId:"sirenia", slot:"Ultimate", name:"Moonwake Revival",
    kind:"support", scaleStat:null, basePct:0, perLevelPct:0,
    cdTurns:4, energyCost:100,
    text:"Revives one ally at 50% HP and grants them an extra turn.",
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
    text:"Deals damage and gains Evasion for 1 turn.",
    status:{ name:"Evasion", chance:100, turns:1, target:"self" },
  },
  caelum_s2:{
    id:"caelum_s2", heroId:"caelum", slot:"Skill 2", name:"Wind Shear",
    kind:"damage", scaleStat:"ATK", basePct:80, perLevelPct:6,
    cdTurns:2, energyCost:0,
    text:"AoE attack that lowers enemy Speed.",
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
