import { goldState } from "../economy/gold.state.js";
import { energyState } from "../economy/energy.state.js";
import { accountXPState, getAccountXPToNext } from "../economy/xp.account.state.js";
import { invCount, gearInventoryState } from "../gear/gear.inventory.state.js";
import { materialsState } from "../economy/materials.state.js";
export function renderTopStats(){
  const el = document.getElementById('topStats'); if (!el) return;
  el.innerHTML = `
    <div>Gold: <b>${goldState.gold}</b></div>
    <button class="topStatBtn" data-open-energy title="Energy">
    ⚡ <b>${energyState.current}</b>/${energyState.max}
    </button>

    <div>Account: <b>Lv ${accountXPState.level}</b> (${accountXPState.xp}/${getAccountXPToNext()})</div>
    <div>Gear: <b>${invCount()}</b>/<b>${gearInventoryState.cap}</b></div>
    <div>Tomes: <b>${materialsState.skillTomes}</b></div>
  `;
}
