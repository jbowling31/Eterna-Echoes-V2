import { uid } from "../_util.js";
import { GEAR_CATALOG } from "./gear.catalog.data.js";
export const gearInventoryState = { cap: 200, items: [] };
export function invCount(){ return gearInventoryState.items.length; }
export function hasSpace(n=1){ return invCount()+n <= gearInventoryState.cap; }
export function addGearDrop(gearId, level=1){
  if (!hasSpace(1)) return null;
  const iid = uid('gi');
  gearInventoryState.items.push({ iid, gearId, level });
  return iid;
}
export function getGearDef(gearId){ return GEAR_CATALOG.find(g=>g.id===gearId) || null; }
export function seedStarterGear(){
  // Idempotent seeding:
  // - If you already have gear, we *top up* missing slots instead of doing nothing.
  // - This prevents “old localStorage” from leaving you with only 3 items forever.
  const targetSlots = ["head","body","hands","feet","accessory 1","accessory 2"];
  const elements = ["fire","water","earth","wind"];

  const haveGearIds = new Set(gearInventoryState.items.map(x=>x.gearId));

  // Build catalog index by normalized slot, then by element
  const bySlot = new Map();
  for (const s of targetSlots) bySlot.set(s, []);
  for (const g of GEAR_CATALOG){
    const slotN = normSlot(g.slot);
    if (!bySlot.has(slotN)) continue;
    bySlot.get(slotN).push(g);
  }
  // Stable order: element → name
  for (const s of targetSlots){
    bySlot.get(s).sort((a,b)=>{
      const ea = (a.element||"").toLowerCase();
      const eb = (b.element||"").toLowerCase();
      if (ea !== eb) return ea.localeCompare(eb);
      return (a.name||"").localeCompare(b.name||"");
    });
  }

  // Count what we already have per slot (by looking up defs)
  const counts = Object.fromEntries(targetSlots.map(s=>[s,0]));
  for (const it of gearInventoryState.items){
    const def = getGearDef(it.gearId);
    const s = normSlot(def?.slot);
    if (counts[s] !== undefined) counts[s] += 1;
  }

  // If inventory is basically empty or missing any slot, top-up.
  const missingAnySlot = targetSlots.some(s => counts[s] === 0);
  const veryLow = gearInventoryState.items.length < 12;

  if (!missingAnySlot && !veryLow) return;

  // Add: at least 1 per element per slot (if available), then top to 6 per slot.
  for (const s of targetSlots){
    const list = bySlot.get(s) || [];
    // 1 per element
    for (const el of elements){
      const pick = list.find(g => (g.element||"").toLowerCase() === el);
      if (pick && !haveGearIds.has(pick.id)){
        addGearDrop(pick.id, 1);
        haveGearIds.add(pick.id);
      }
    }
    // top up to 6 items for the slot
    const cur = (counts[s] || 0) + countNewlyAddedForSlot(s);
    const need = Math.max(0, 6 - cur);
    if (need > 0){
      let added = 0;
      for (const g of list){
        if (added >= need) break;
        if (haveGearIds.has(g.id)) continue;
        addGearDrop(g.id, 1);
        haveGearIds.add(g.id);
        added++;
      }
    }
  }

  function countNewlyAddedForSlot(slotN){
    // after adding, recompute quickly for this slot only
    let c = 0;
    for (const it of gearInventoryState.items){
      const def = getGearDef(it.gearId);
      if (normSlot(def?.slot) === slotN) c++;
    }
    return c;
  }
}

// DEV: add one copy of every gear piece (for UI testing)
export function devAddAllGear(){
  const have = new Set(gearInventoryState.items.map(x=>x.gearId));
  for (const g of GEAR_CATALOG){
    if (have.has(g.id)) continue;
    addGearDrop(g.id, 1);
    have.add(g.id);
  }
}

function normSlot(s){
  s = (s||"").toString().trim().toLowerCase();
  if (!s) return "";
  // canonical: head/body/hands/feet/accessory 1/accessory 2
  const map = {
    "head":"head",
    "body":"body",
    "hands":"hands",
    "feet":"feet",
    "accessory 1":"accessory 1",
    "accessory 2":"accessory 2",
    "accessory1":"accessory 1",
    "accessory2":"accessory 2",
    "acc 1":"accessory 1",
    "acc 2":"accessory 2",
    "accessory":"accessory 1"
  };
  return map[s] || s;
}


// Find an inventory item by iid
export function getItem(iid){
  if (!iid) return null;
  return gearInventoryState.items.find(it => it.iid === iid) || null;
}
