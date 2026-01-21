// docs/js/battle/battles.ch01.js
// Chapter 1 battle definitions.
//
// Notes:
// - IDs MUST stay stable (ch01.steps.js references these keys).
// - You can use either `enemies: [...]` for a single-wave fight
//   or `waves: [ [...], [...], ... ]` for multi-wave fights.
// - Enemy stat numbers here are "base" values; the engine applies default scaling
//   based on average hero level.

export const CH01_BATTLES = {
  ch01_b01_ember_guardian: {
    id: "ch01_b01_ember_guardian",
    name: "Shroudspawn Grunts",
    backdrop: "./assets/bg/bg_obsidian_glyph_hall.png",
    backdropVideo: "./assets/bg_anim/bg_obsidian_glyph_hall_loop.mp4",
    reward: { xp: 18, gold: 35 },
    enemies: [
      {
        id: "shroudspawn_grunt",
        name: "Shroudspawn Grunt A",
        element: "Void",
        maxHp: 70, atk: 10, def: 3, spd: 95,
        ai: "basic",
        skillIds: ["e_shroudspawn_claw", "e_shroudspawn_void_spit"],
        art: "./assets/enemies/portraits/enemy_shroudspawn_grunt.png",
      },
      {
        id: "shroudspawn_grunt",
        name: "Shroudspawn Grunt B",
        element: "Void",
        maxHp: 70, atk: 10, def: 3, spd: 92,
        ai: "basic",
        skillIds: ["e_shroudspawn_claw"],
        art: "./assets/enemies/portraits/enemy_shroudspawn_grunt.png",
      },
      {
        id: "shroudspawn_grunt",
        name: "Shroudspawn Grunt C",
        element: "Void",
        maxHp: 70, atk: 11, def: 2, spd: 98,
        ai: "basic",
        skillIds: ["e_shroudspawn_claw", "e_shroudspawn_pack_howl"],
        art: "./assets/enemies/portraits/enemy_shroudspawn_grunt.png",
      },
    ],
  },

  ch01_b02_tidewake_rush: {
    id: "ch01_b02_tidewake_rush",
    name: "Tidewake Rush",
    backdrop: "./assets/bg/bg_ruins_water_garden.png",
    reward: { xp: 22, gold: 45 },
    waves: [
      [
        {
          id: "shroudspawn_scout",
          name: "Shroudspawn Scout",
          element: "Void",
          maxHp: 60, atk: 12, def: 2, spd: 108,
          ai: "basic",
          skillIds: ["e_scout_pounce", "e_shroudspawn_claw"],
          art: "./assets/enemies/portraits/enemy_shroudspawn_scout.png",
        },
        {
          id: "shroudspawn_grunt",
          name: "Grunt (Anchor)",
          element: "Void",
          maxHp: 80, atk: 11, def: 3, spd: 92,
          ai: "basic",
          skillIds: ["e_shroudspawn_claw", "e_shroudspawn_pack_howl"],
          art: "./assets/enemies/portraits/enemy_shroudspawn_grunt.png",
        },
      ],
      [
        {
          id: "spawn_ghost",
          name: "Spawn Ghost",
          element: "Void",
          maxHp: 105, atk: 14, def: 4, spd: 102,
          ai: "basic",
          skillIds: ["e_ghost_drain", "e_ghost_wail"],
          art: "./assets/enemies/portraits/enemy_spawn_ghost.png",
        },
      ],
    ],
  },

  ch01_b03_gale_sweep: {
    id: "ch01_b03_gale_sweep",
    name: "Gale Sweep",
    backdrop: "./assets/bg/bg_forest_wind_trail.png",
    reward: { xp: 26, gold: 55 },
    waves: [
      [
        {
          id: "echo_leaper",
          name: "Echo Leaper",
          element: "Wind",
          maxHp: 120, atk: 15, def: 5, spd: 112,
          ai: "basic",
          skillIds: ["e_leaper_dive", "e_leaper_trip"],
          art: "./assets/enemies/portraits/enemy_echo_leaper.png",
        },
        {
          id: "shroudspawn_scout",
          name: "Scout",
          element: "Void",
          maxHp: 60, atk: 12, def: 2, spd: 106,
          ai: "basic",
          skillIds: ["e_scout_pounce"],
          art: "./assets/enemies/portraits/enemy_shroudspawn_scout.png",
        },
      ],
      [
        {
          id: "echo_leaper",
          name: "Echo Leaper (Frenzied)",
          element: "Wind",
          maxHp: 140, atk: 16, def: 6, spd: 116,
          ai: "basic",
          skillIds: ["e_leaper_dive", "e_leaper_trip"],
          art: "./assets/enemies/portraits/enemy_echo_leaper.png",
        },
      ],
      [
        {
          id: "glyphspawn_elite",
          name: "Glyphspawn Elite",
          element: "Void",
          maxHp: 170, atk: 17, def: 8, spd: 95,
          ai: "basic",
          skillIds: ["e_glyph_pulse", "e_glyph_ult_lock"],
          art: "./assets/enemies/portraits/enemy_glyphspawn_elite.png",
        },
      ],
    ],
  },

  ch01_b04_spore_beast_ambush: {
    id: "ch01_b04_spore_beast_ambush",
    name: "Spore Beast Ambush",
    backdrop: "./assets/bg/bg_fungal_forest_core.png",
    reward: { xp: 30, gold: 65 },
    waves: [
[
        {
          id: "shroud_hatchling",
          name: "Shroud Hatchling A",
          element: "Void",
          maxHp: 80, atk: 14, def: 4, spd: 110,
          ai: "basic",
          skillIds: ["e_hatchling_bite"],
          art: "./assets/enemies/portraits/enemy_shroud_hatchling.png",
        },
        {
          id: "shroud_hatchling",
          name: "Shroud Hatchling B",
          element: "Void",
          maxHp: 80, atk: 14, def: 4, spd: 108,
          ai: "basic",
          skillIds: ["e_hatchling_bite"],
          art: "./assets/enemies/portraits/enemy_shroud_hatchling.png",
        },
      ],
[
        {
          id: "spore_beast",
          name: "Spore Beast",
          element: "Poison",
          maxHp: 220, atk: 18, def: 10, spd: 88,
          ai: "basic",
          skillIds: ["e_spore_bloom", "e_spore_shield"],
          art: "./assets/enemies/portraits/enemy_spore_beast.png",
        },
      ]
    ],
  },

  ch01_b05_mirror_mimics: {
    id: "ch01_b05_mirror_mimics",
    name: "Mirror Mimics",
    backdrop: "./assets/bg/bg_mirror_lake_temple.png",
    reward: { xp: 34, gold: 75 },
    waves: [
      [
        {
          id: "mirrorling",
          name: "Mirrorling",
          element: "Arcane",
          maxHp: 160, atk: 16, def: 10, spd: 92,
          ai: "basic",
          skillIds: ["e_mirror_reflect", "e_mirror_burst"],
          art: "./assets/enemies/portraits/enemy_mirrorling.png",
        },
      ],
      [
        {
          id: "mirrorform_unit",
          name: "Mirrorform Unit A",
          element: "Arcane",
          maxHp: 120, atk: 15, def: 8, spd: 95,
          ai: "basic",
          skillIds: ["e_mirror_burst"],
          art: "./assets/enemies/portraits/enemy_mirrorform_unit.png",
        },
        {
          id: "mirrorform_unit",
          name: "Mirrorform Unit B",
          element: "Arcane",
          maxHp: 120, atk: 15, def: 8, spd: 93,
          ai: "basic",
          skillIds: ["e_mirror_burst"],
          art: "./assets/enemies/portraits/enemy_mirrorform_unit.png",
        },
      ],
    ],
  },

  ch01_b06_shroud_nest_core: {
    id: "ch01_b06_shroud_nest_core",
    name: "Shroud Nest Core",
    backdrop: "./assets/bg/bg_shroud_nest_entry.png",
    reward: { xp: 40, gold: 90 },
    waves: [
      [
        {
          id: "shroud_hatchling",
          name: "Hatchling",
          element: "Void",
          maxHp: 85, atk: 14, def: 5, spd: 112,
          ai: "basic",
          skillIds: ["e_hatchling_bite"],
          art: "./assets/enemies/portraits/enemy_shroud_hatchling.png",
        },
        {
          id: "shroud_caster",
          name: "Shroud Caster",
          element: "Void",
          maxHp: 140, atk: 17, def: 7, spd: 98,
          ai: "basic",
          skillIds: ["e_caster_hex", "e_caster_barrier"],
          art: "./assets/enemies/portraits/enemy_shroud_caster.png",
        },
      ],
      [
        {
          id: "shroud_broodmother",
          name: "Broodmother",
          element: "Void",
          maxHp: 320, atk: 20, def: 12, spd: 85,
          ai: "basic",
          skillIds: ["e_broodmother_slam", "e_broodmother_spawn"],
          art: "./assets/enemies/portraits/enemy_shroud_broodmother.png",
        },
      ],
    ],
  },

  ch01_b07_rewrite_sandbox: {
    id: "ch01_b07_rewrite_sandbox",
    name: "Rewrite Sandbox",
    backdrop: "./assets/bg/bg_loop_core_throneroom.png",
    reward: { xp: 44, gold: 100 },
    enemies: [
      {
        id: "glitchspawn_caster",
        name: "Glitchspawn Caster",
        element: "Void",
        maxHp: 160, atk: 18, def: 8, spd: 105,
        ai: "repeat",
        skillIds: ["e_glitch_rewrite_blast"],
        art: "./assets/enemies/portraits/enemy_glitchspawn_caster.png",
      },
      {
        id: "echo_wraith",
        name: "Echo Wraith",
        element: "Arcane",
        maxHp: 180, atk: 17, def: 9, spd: 92,
        ai: "basic",
        skillIds: ["e_wraith_lament", "e_wraith_freeze_touch"],
        art: "./assets/enemies/portraits/enemy_echo_wraith.png",
      },
    ],
  },

  ch01_b08_shroud_warden_boss: {
    id: "ch01_b08_shroud_warden_boss",
    name: "Shroud Warden",
    backdrop: "./assets/bg/bg_old_keep_gate.png",
    reward: { xp: 55, gold: 130 },
    waves: [
      [
        {
          id: "shroud_warden",
          name: "Shroud Warden",
          element: "Void",
          maxHp: 360, atk: 22, def: 14, spd: 90,
          ai: "basic",
          skillIds: ["e_warden_cleave", "e_warden_guard"],
          art: "./assets/enemies/portraits/enemy_shroud_warden.png",
        },
      ],
      [
        {
          id: "shroud_warden",
          name: "Shroud Warden (Enraged)",
          element: "Void",
          maxHp: 420, atk: 24, def: 15, spd: 95,
          ai: "basic",
          skillIds: ["e_warden_cleave", "e_warden_stun_slam", "e_warden_guard"],
          art: "./assets/enemies/portraits/enemy_shroud_warden.png",
        },
        {
          id: "shroudspawn_scout",
          name: "Scout Add",
          element: "Void",
          maxHp: 70, atk: 13, def: 3, spd: 110,
          ai: "basic",
          skillIds: ["e_scout_pounce"],
          art: "./assets/enemies/portraits/enemy_shroudspawn_scout.png",
        },
      ],
    ],
    waveInterludes: {
      1: { title: "The loop snaps", text: "You strike the Warden down… and reality lurches. The glyph-ring flares, threads reweave, and the Shroud Warden rises again — stronger this time." },
    }
,
  },

  ch01_b09_memory_fragments: {
    id: "ch01_b09_memory_fragments",
    name: "Memory Fragments",
    backdrop: "./assets/bg/bg_ashroad_crater_peak.png",
    reward: { xp: 48, gold: 110 },
    enemies: [
      {
        id: "spawn_ghost",
        name: "Spawn Ghost",
        element: "Void",
        maxHp: 120, atk: 15, def: 6, spd: 103,
        ai: "basic",
        skillIds: ["e_ghost_drain", "e_ghost_wail"],
        art: "./assets/enemies/portraits/enemy_spawn_ghost.png",
      },
      {
        id: "mirrorling",
        name: "Mirrorling",
        element: "Arcane",
        maxHp: 150, atk: 16, def: 10, spd: 95,
        ai: "basic",
        skillIds: ["e_mirror_reflect", "e_mirror_burst"],
        art: "./assets/enemies/portraits/enemy_mirrorling.png",
      },
      {
        id: "echo_wraith",
        name: "Echo Wraith",
        element: "Arcane",
        maxHp: 160, atk: 16, def: 9, spd: 90,
        ai: "basic",
        skillIds: ["e_wraith_lament"],
        art: "./assets/enemies/portraits/enemy_echo_wraith.png",
      },
    ],
  },

  ch01_b10_herald_loopboss: {
    id: "ch01_b10_herald_loopboss",
    name: "Herald of the Loop",
    backdrop: "./assets/bg/bg_loop_core_throneroom.png",
    reward: { xp: 70, gold: 180 },
    waves: [
      [
        {
          id: "shroud_herald",
          name: "Shroud Herald",
          element: "Void",
          maxHp: 520, atk: 26, def: 16, spd: 92,
          ai: "basic",
          skillIds: ["e_herald_void_lance", "e_herald_loop_lock"],
          art: "./assets/enemies/portraits/enemy_shroud_herald.png",
        },
      ],
      [
        {
          id: "shroud_herald",
          name: "Shroud Herald (Phase 2)",
          element: "Void",
          maxHp: 580, atk: 28, def: 17, spd: 95,
          ai: "basic",
          skillIds: ["e_herald_void_lance", "e_herald_nova", "e_herald_loop_lock"],
          art: "./assets/enemies/portraits/enemy_shroud_herald.png",
        },
        {
          id: "shroud_caster",
          name: "Shroud Caster (Support)",
          element: "Void",
          maxHp: 150, atk: 18, def: 8, spd: 100,
          ai: "basic",
          skillIds: ["e_caster_hex", "e_caster_barrier"],
          art: "./assets/enemies/portraits/enemy_shroud_caster.png",
        },
      ],
      [
        {
          id: "shroud_herald",
          name: "Shroud Herald (Final)",
          element: "Void",
          maxHp: 640, atk: 30, def: 18, spd: 98,
          ai: "basic",
          skillIds: ["e_herald_void_lance", "e_herald_nova", "e_herald_ult_lock", "e_herald_loop_lock"],
          art: "./assets/enemies/portraits/enemy_shroud_herald.png",
        },
      ],
    ],
    waveInterludes: {
      1: { title: "It remembers", text: "The Herald staggers — then steadies. The air bends like a page being rewritten. A second form bleeds through." },
      2: { title: "Final rewrite", text: "Your last hit lands… and the loop refuses to end. The Herald reforms with a hateful clarity, pulling the room into a deeper pattern." },
    }
,
  },
};

export function getBattleDef(battleId){
  return CH01_BATTLES[battleId] || null;
}
