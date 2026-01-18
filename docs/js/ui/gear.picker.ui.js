import { gearInventoryState, getGearDef } from "../gear/gear.inventory.state.js";
import { openModal, closeModal } from "./ui.modal.js";

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
    "accessory":"accessory 1" // default if ever used
  };
  return map[s] || s;
}

function getModalScroller(host){
  return host?.querySelector(".modalBody")
    || host?.querySelector(".modalCard")
    || host;
}

export function openGearPicker({ heroId, slot, onPick }){
  const want = normSlot(slot);
  const items = gearInventoryState.items
    .map(inv => ({ inv, def: getGearDef(inv.gearId) }))
    .filter(({def}) => {
      const have = normSlot(def?.slot);
      if (!have || have==="unknown") return false;
      return have === want;
    })
    .slice(0, 240);

  const rows = items.map(({inv, def})=>{
    return `<div class="card">
      <div class="spread">
        <div><b>${def?.name || inv.gearId}</b><div class="muted">${def?.set || ""} • ${def?.slot || ""}</div></div>
        <button type="button" class="btn small" data-pick="${inv.iid}">Pick</button>
      </div>
    </div>`;
  }).join('');

  openModal(`Pick Gear — ${slot}`, `
    <div class="muted">Hero: <b>${heroId}</b></div>
    <div class="card">
      <div class="muted">Showing only: <b>${slot}</b> items</div>
      <button type="button" class="btn small" data-close-picker>Close</button>
    </div>
    ${rows || `<div class="card"><div class="muted">No items for this slot yet.</div></div>`}
  `);

  const host = document.getElementById('modalHost');

  host?.querySelector('[data-close-picker]')?.addEventListener('click', closeModal);

  host?.querySelectorAll('[data-pick]')?.forEach(btn=>{
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Preserve scroll position so picking doesn't jump to the top
      const scroller = getModalScroller(host);
      const y = scroller ? scroller.scrollTop : 0;

      onPick?.(btn.getAttribute('data-pick'));

      // Restore scroll on next frame if modal is still open
      requestAnimationFrame(() => {
        const host2 = document.getElementById('modalHost');
        if (!host2 || !host2.classList.contains('on')) return;
        const scroller2 = getModalScroller(host2);
        if (scroller2) scroller2.scrollTop = y;
      });
    });
  });
}
