import { heroProgressState, getHeroProg } from "../heroes/hero.progress.state.js";
import { getItem, getGearDef } from "./gear.inventory.state.js";

// Canonical runtime slots (lowercase)
export const GEAR_SLOTS = Object.freeze([
  "head",
  "body",
  "hands",
  "feet",
  "accessory 1",
  "accessory 2",
]);

function normSlot(s){
  s = (s||"").toString().trim().toLowerCase();
  if (!s) return "";
  const map = {
    "acc1": "accessory 1",
    "acc2": "accessory 2",
    "accessory1": "accessory 1",
    "accessory2": "accessory 2",
    "acc 1": "accessory 1",
    "acc 2": "accessory 2",
  };
  return map[s] || s;
}

function ensureEquippedObj(heroId){
  const p = getHeroProg(heroId);
  if (!p.equipped) p.equipped = {};

  // Migrate Map -> object if older saves used Map
  if (p.equipped instanceof Map){
    const obj = {};
    for (const [k,v] of p.equipped.entries()) obj[normSlot(k)] = v;
    p.equipped = obj;
  }
  return p.equipped;
}

export function emptyEquip(heroId){
  const eq = ensureEquippedObj(heroId);
  for (const k of Object.keys(eq)) delete eq[k];
}

export function getGearForHero(heroId){
  return { ...ensureEquippedObj(heroId) };
}

export function equipItem(heroId, iid, targetSlot){
  const item = getItem(iid);
  if (!item) return { ok:false, reason:"missing item" };
  const def = getGearDef(item.gearId);
  if (!def) return { ok:false, reason:"missing gear def" };

  const haveSlot = normSlot(def.slot);
  const wantSlot = normSlot(targetSlot || haveSlot);
  if (!haveSlot || !wantSlot) return { ok:false, reason:"bad slot" };
  if (haveSlot !== wantSlot) return { ok:false, reason:`wrong slot (${haveSlot} != ${wantSlot})` };

  const eq = ensureEquippedObj(heroId);
  eq[wantSlot] = iid;
  return { ok:true, slot: wantSlot, iid };
}

// Useful for UI: resolve equipped item names
export function getEquippedSummary(heroId){
  const eq = ensureEquippedObj(heroId);
  const out = {};
  for (const slot of GEAR_SLOTS){
    const iid = eq[slot];
    if (!iid){ out[slot] = null; continue; }
    const item = getItem(iid);
    const def = item ? getGearDef(item.gearId) : null;
    out[slot] = {
      iid,
      gearId: item?.gearId || null,
      name: def?.name || item?.gearId || iid,
      level: item?.level || 1,
      set: def?.set || "",
    };
  }
  return out;
}
