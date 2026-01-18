import { openModal, closeModal } from "./ui.modal.js";
import { seedStarterGear, devAddAllGear } from "../gear/gear.inventory.state.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";
import { goldState } from "../economy/gold.state.js";
import { accountXPState } from "../economy/xp.account.state.js";
import { energyState } from "../economy/energy.state.js";
import { openLoginCalendar } from "./logincalendar.ui.js";
import { openTasksModal } from "./tasks.ui.js";
import { openSeasonPass } from "./seasonpass.ui.js";
import { openInventory } from "./inventory.tab.ui.js";
import { markInventorySeenThisSession } from "../notifications/badges.logic.js";


markInventorySeenThisSession();

export function renderMore(){
  return `
    <div class="card sectionTitle">
      <div class="h2">More</div>
      <div class="muted">Dev tools + hubs.</div>
    </div>

    <div class="card">
      <div class="h2">Hubs</div>
      <div class="row wrap" style="margin-top:10px;">
        <button class="btn" data-open-login>Daily Login</button>
        <button class="btn" data-open-tasks>Tasks</button>
        <button class="btn" data-open-sp>Season Pass</button>
        <button class="btn" data-open-inv>Inventory</button>
        <button class="btn badgeWrap" data-open-login data-badge="login">Daily Login</button>
        <button class="btn badgeWrap" data-open-tasks data-badge="tasks">Tasks</button>
        <button class="btn badgeWrap" data-open-sp data-badge="season">Season Pass</button>
        <button class="btn badgeWrap" data-open-inv data-badge="inventory">Inventory</button>

      </div>
    </div>

    <div class="card">
      <div class="h2">Dev Tools</div>
      <div class="muted">Fix saves / populate data fast (mobile-friendly).</div>
      <div style="height:10px"></div>
      <div class="row wrap">
        <button class="btn" data-dev-topup>Top-up Starter Gear</button>
        <button class="btn" data-dev-allgear>Add ALL 96 Gear</button>
        <button class="btn danger" data-dev-reset>Hard Reset Save</button>
      </div>
    </div>
  `;
}

export function wireMore(root){
  root.addEventListener('click', (e)=>{
    const b = e.target.closest('button');
    if (!b) return;

    if (b.dataset.openLogin !== undefined){ openLoginCalendar(); return; }
    if (b.dataset.openTasks !== undefined){ openTasksModal('daily'); return; }
    if (b.dataset.openSp !== undefined){ openSeasonPass(); return; }
    if (b.dataset.openInv !== undefined){ openInventory(); return; }

    if (b.dataset.devTopup !== undefined){
      seedStarterGear({ mode:"topup" });
      emit(EVENTS.TOAST, { kind:"good", text:"Starter gear topped up" });
      return;
    }
    if (b.dataset.devAllgear !== undefined){
      devAddAllGear();
      emit(EVENTS.TOAST, { kind:"good", text:"All gear added" });
      return;
    }
    if (b.dataset.devReset !== undefined){
      openModal("Hard Reset", `
        <div class="card">
          <div class="muted">This clears local save data and reloads the page.</div>
          <div style="height:10px"></div>
          <div class="row wrap" style="justify-content:flex-end;">
            <button class="btn" data-cancel>Cancel</button>
            <button class="btn danger" data-confirm>Reset</button>
          </div>
        </div>
      `);
      const host = document.getElementById("modalHost");
      host?.querySelector("[data-cancel]")?.addEventListener("click", closeModal);
      host?.querySelector("[data-confirm]")?.addEventListener("click", ()=>{
        try{ localStorage.clear(); }catch(_){}
        location.reload();
      });
      return;
    }
  });
}
