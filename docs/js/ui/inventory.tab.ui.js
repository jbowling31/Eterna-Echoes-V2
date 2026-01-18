import { gearInventoryState, getGearDef } from "../gear/gear.inventory.state.js";
import { openModal } from "./ui.modal.js";
import { materialsState } from "../economy/materials.state.js";

export function openInventory(){
  openModal("Inventory", `
    <div class="card runeCard">
      <div class="h2">Materials</div>
      <div class="muted">Skill Tomes let you upgrade hero skills.</div>
      <div style="height:8px"></div>
      <div class="spread"><div><b>Skill Tome</b></div><span class="pill gold">${materialsState.skillTomes}</span></div>
    </div>
    <div style="height:12px"></div>
    <div class="h2">Gear</div>
    <div class="muted">Capacity: ${gearInventoryState.items.length}/${gearInventoryState.cap}</div>

    <div class="muted">Capacity: ${gearInventoryState.items.length}/${gearInventoryState.cap}</div>
    ${gearInventoryState.items.slice(0,120).map(it=>{
      const def = getGearDef(it.gearId);
      return `<div class="card"><div class="spread">
        <div><b>${def?.name || it.gearId}</b><div class="muted">${def?.set || ""}</div></div>
        <span class="pill">Lv ${it.level}</span>
      </div></div>`;
    }).join('')}
  `);
}
