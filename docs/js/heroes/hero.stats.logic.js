// docs/js/heroes/hero.stats.logic.js
// Single-source-of-truth derived stat system for:
// - Hero Info UI (visible player stats)
// - Battle engine seeding (so UI == battle math)
// Gear numeric stats are optional; if a gear def has no numeric stats fields, it contributes 0.

import { HEROES } from "./heroes.data.js";
import { getHeroLevel } from "./hero.progress.state.js";
import { getGearForHero } from "../gear/gear.equip.logic.js";
import { getItem, getGearDef } from "../gear/gear.inventory.state.js";

// NOTE: These templates are tuned to be close to the old battle.engine.js statScale()
// while still preserving role identity. All values are "per level" increments.
const ROLE_TEMPLATES = {
  tank:     { hpBase: 110, hpPer: 16, atkBase: 14, atkPer: 3.0, defBase: 8,  defPer: 2.2, spd: 92  },
  damage:   { hpBase:  95, hpPer: 13, atkBase: 15, atkPer: 3.8, defBase: 6,  defPer: 1.7, spd: 100 },
  support:  { hpBase: 100, hpPer: 14, atkBase: 14, atkPer: 3.2, defBase: 7,  defPer: 1.9, spd: 96  },
  sabotage: { hpBase:  95, hpPer: 13, atkBase: 14, atkPer: 3.4, defBase: 6,  defPer: 1.7, spd: 104 },
  default:  { hpBase: 100, hpPer: 14, atkBase: 14, atkPer: 3.3, defBase: 7,  defPer: 2.0, spd: 96  },
};

function normRole(role){
  const r = String(role || "").trim().toLowerCase();
  if (r.includes("tank")) return "tank";
  if (r.includes("support")) return "support";
  if (r.includes("sabot")) return "sabotage";
  if (r.includes("damage") || r.includes("dps")) return "damage";
  return "default";
}

export function getHeroRole(heroId){
  const hero = HEROES.find(h => h.id === heroId);
  return normRole(hero?.role);
}

// ---- Gear numeric stat support (optional) ----
// A gear def can optionally include:
//  - statsFlat: { hp, atk, def, spd }
//  - statsPct:  { hp, atk, def, spd }  (percent, e.g. 8 means +8%)
// You can add these to gear.catalog.data.js entries over time.
// If they are missing, this returns 0 bonuses (safe).
function readGearNumeric(def){
  if (!def) return { flat: {}, pct: {} };
  const flat = def.statsFlat || def.stats_flat || def.flat || {};
  const pct  = def.statsPct  || def.stats_pct  || def.pct  || {};
  return { flat, pct };
}

function sumGearBonuses(heroId){
  const eq = getGearForHero(heroId);
  const flat = { hp:0, atk:0, def:0, spd:0 };
  const pct  = { hp:0, atk:0, def:0, spd:0 };
  const parts = [];

  for (const slot of Object.keys(eq || {})){
    const iid = eq[slot];
    if (!iid) continue;

    const item = getItem(iid);
    const defn = item ? getGearDef(item.gearId) : null;
    const { flat: f, pct: p } = readGearNumeric(defn);

    const addFlat = {
      hp:  Number(f?.hp  || 0) || 0,
      atk: Number(f?.atk || 0) || 0,
      def: Number(f?.def || 0) || 0,
      spd: Number(f?.spd || 0) || 0,
    };
    const addPct = {
      hp:  Number(p?.hp  || 0) || 0,
      atk: Number(p?.atk || 0) || 0,
      def: Number(p?.def || 0) || 0,
      spd: Number(p?.spd || 0) || 0,
    };

    flat.hp  += addFlat.hp;  flat.atk += addFlat.atk; flat.def += addFlat.def; flat.spd += addFlat.spd;
    pct.hp   += addPct.hp;   pct.atk  += addPct.atk;  pct.def  += addPct.def;  pct.spd  += addPct.spd;

    // Only include in breakdown if it actually changes numbers (keeps UI clean)
    const hasAny = (addFlat.hp||addFlat.atk||addFlat.def||addFlat.spd||addPct.hp||addPct.atk||addPct.def||addPct.spd);
    if (hasAny){
      parts.push({
        slot,
        name: defn?.name || item?.gearId || iid,
        level: item?.level || 1,
        flat: addFlat,
        pct: addPct
      });
    }
  }

  return { flat, pct, parts };
}

/**
 * getHeroDerivedStats(heroId, opts)
 * - opts.includeGear (default true): include numeric gear bonuses if present.
 * - opts.breakdown   (default false): include base/gear/final breakdown for UI/debug.
 */
export function getHeroDerivedStats(heroId, opts = {}){
  const includeGear = (opts.includeGear !== false);
  const wantBreakdown = !!opts.breakdown;

  const hero = HEROES.find(h => h.id === heroId) || { id: heroId, role: "default" };
  const roleKey = normRole(hero.role);
  const t = ROLE_TEMPLATES[roleKey] || ROLE_TEMPLATES.default;

  const lvl = Math.max(1, Math.floor(getHeroLevel(heroId) || 1));

  // Base (role + level)
  const base = {
    hp:  Math.round(t.hpBase  + (lvl - 1) * t.hpPer),
    atk: Math.round(t.atkBase + (lvl - 1) * t.atkPer),
    def: Math.round(t.defBase + (lvl - 1) * t.defPer),
    spd: Math.round(t.spd),
  };

  // Gear (flat then percent)
  let gear = { flat:{hp:0,atk:0,def:0,spd:0}, pct:{hp:0,atk:0,def:0,spd:0}, parts:[] };
  if (includeGear){
    gear = sumGearBonuses(heroId);
  }

  const afterFlat = {
    hp:  base.hp  + gear.flat.hp,
    atk: base.atk + gear.flat.atk,
    def: base.def + gear.flat.def,
    spd: base.spd + gear.flat.spd,
  };

  const final = {
    hp:  Math.max(1, Math.round(afterFlat.hp  * (1 + (gear.pct.hp  / 100)))),
    atk: Math.max(0, Math.round(afterFlat.atk * (1 + (gear.pct.atk / 100)))),
    def: Math.max(0, Math.round(afterFlat.def * (1 + (gear.pct.def / 100)))),
    spd: Math.max(1, Math.round(afterFlat.spd * (1 + (gear.pct.spd / 100)))),
  };

  // Simple composite rating for UI (not a balance promise).
  const power = Math.round(final.hp * 0.20 + final.atk * 5 + final.def * 4 + final.spd * 0.10);

  const out = {
    heroId,
    level: lvl,
    role: roleKey,
    hp: final.hp,
    atk: final.atk,
    def: final.def,
    spd: final.spd,
    power,
  };

  if (wantBreakdown){
    out.breakdown = {
      base,
      gear: { flat: gear.flat, pct: gear.pct, parts: gear.parts },
      final,
    };
  }

  return out;
}
