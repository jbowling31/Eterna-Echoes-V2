import { openModal, closeModal } from "./ui.modal.js";
import { TASKS } from "../tasks/tasks.catalog.data.js";
import { tasksState, canClaimTask, claimTask, getMilestones, canClaimChest, claimChest, addTaskProgress } from "../tasks/tasks.state.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";

const TABS = ["daily","weekly","monthly"];

function pct(have, need){
  if (!need) return 0;
  return Math.max(0, Math.min(100, Math.floor((have/need)*100)));
}

function renderPoints(kind){
  const have = tasksState[kind].points || 0;
  const ms = getMilestones(kind);
  const max = ms[ms.length-1] || 100;
  return `
    <div class="card tight">
      <div class="spread">
        <div>
          <div class="h2">${kind[0].toUpperCase()+kind.slice(1)} Points</div>
          <div class="muted">${have} / ${max}</div>
        </div>
        <div class="pill gold">${have} pts</div>
      </div>
      <div style="height:8px"></div>
      <div class="progressBar"><i style="width:${pct(have,max)}%"></i></div>
      <div style="height:10px"></div>
      <div class="row wrap">
        ${ms.map(m=>{
          const claimed = !!tasksState[kind].chestClaimed[m];
          const ok = canClaimChest(kind, m);
          const label = claimed ? `✅ ${m}` : ok ? `🎁 ${m}` : `🔒 ${m}`;
          return `<button class="btn small" data-chest="${kind}:${m}" ${claimed? "disabled": ""}>${label}</button>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderTaskRow(kind, t){
  const prog = tasksState[kind].progress[t.id] || 0;
  const done = prog >= t.goal;
  const claimed = !!tasksState[kind].claimed[t.id];
  const can = canClaimTask(kind, t.id);

  return `<div class="card">
    <div class="spread">
      <div>
        <div class="h2">${t.title}</div>
        <div class="muted">${t.desc}</div>
        <div class="muted"><b>${Math.min(prog,t.goal)}</b> / ${t.goal} • +${t.points} pts</div>
      </div>
      <div class="col" style="gap:8px; align-items:flex-end;">
        <button class="btn small" data-add="${kind}:${t.id}">+1</button>
        <button class="btn ${can ? "primary": ""} small" data-claim="${kind}:${t.id}" ${(!can || claimed) ? "disabled": ""}>
          ${claimed ? "Claimed" : done ? "Claim" : "Locked"}
        </button>
      </div>
    </div>
  </div>`;
}

function renderTabButtons(active){
  return `<div class="row wrap">
    ${TABS.map(k=>`<button class="btn ${active===k?"primary":""}" data-tab="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join("")}
  </div>`;
}

export function openTasksModal(startTab="daily"){
  const active = startTab;

  openModal("Tasks", `
    <div class="card tight">
      <div class="spread">
        <div class="muted">Complete tasks → earn points → claim chests. Rewards apply instantly.</div>
        <button class="btn small" data-close>Close</button>
      </div>
      <div style="height:10px"></div>
      ${renderTabButtons(active)}
    </div>

    ${renderPoints(active)}

    ${TASKS[active].map(t=>renderTaskRow(active,t)).join("")}
  `);

  const host = document.getElementById("modalHost");

  host?.querySelector("[data-close]")?.addEventListener("click", closeModal);

  host?.querySelectorAll("[data-tab]")?.forEach(b=>{
    b.addEventListener("click", ()=> openTasksModal(b.getAttribute("data-tab")));
  });

  host?.querySelectorAll("[data-add]")?.forEach(b=>{
    b.addEventListener("click", ()=>{
      const [kind,id] = b.getAttribute("data-add").split(":");
      addTaskProgress(kind, id, 1);
      openTasksModal(kind);
    });
  });

  host?.querySelectorAll("[data-claim]")?.forEach(b=>{
    b.addEventListener("click", ()=>{
      const [kind,id] = b.getAttribute("data-claim").split(":");
      const res = claimTask(kind, id);
      if (!res.ok) emit(EVENTS.TOAST, { kind:"bad", text: res.reason || "Can't claim" });
      openTasksModal(kind);
    });
  });

  host?.querySelectorAll("[data-chest]")?.forEach(b=>{
    b.addEventListener("click", ()=>{
      const [kind, ms] = b.getAttribute("data-chest").split(":");
      const res = claimChest(kind, Number(ms));
      if (!res.ok) emit(EVENTS.TOAST, { kind:"bad", text: res.reason || "Can't claim" });
      openTasksModal(kind);
    });
  });
}
