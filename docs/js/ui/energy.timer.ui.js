import { openModal, closeModal } from "./ui.modal.js";
import { energyState, syncEnergy, msUntilNextEnergy, msUntilFullEnergy } from "../economy/energy.state.js";

function fmt(ms){
  if (ms <= 0) return "0:00";
  const s = Math.ceil(ms/1000);
  const hh = Math.floor(s/3600);
  const mm = Math.floor((s%3600)/60);
  const ss = s%60;
  if (hh > 0) return `${hh}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
  return `${mm}:${String(ss).padStart(2,"0")}`;
}

export function openEnergyTimer(){
  const render = ()=>{
    const now = Date.now();
    syncEnergy(now);
    const next = msUntilNextEnergy(now);
    const full = msUntilFullEnergy(now);

    return `
      <div class="card">
        <div class="row" style="justify-content:space-between; align-items:center;">
          <div>
            <div class="h2">Energy</div>
            <div class="muted">Regenerates 1 every 6 minutes • Max ${energyState.max}</div>
          </div>
          <div style="font-size:18px;"><b>${energyState.current}</b>/${energyState.max}</div>
        </div>

        <div style="height:12px"></div>

        <div class="row" style="justify-content:space-between;">
          <div class="muted">Next +1 in</div>
          <div><b>${energyState.current >= energyState.max ? "Full" : fmt(next)}</b></div>
        </div>

        <div class="row" style="justify-content:space-between; margin-top:8px;">
          <div class="muted">Full in</div>
          <div><b>${energyState.current >= energyState.max ? "Full" : fmt(full)}</b></div>
        </div>

        <div style="height:14px"></div>
        <div class="row" style="justify-content:flex-end;">
          <button class="btn" data-close>Close</button>
        </div>
      </div>
    `;
  };

  openModal("Energy", render());

  const host = document.getElementById("modalHost");
  host?.querySelector("[data-close]")?.addEventListener("click", closeModal);

  // live update while open
  const t = setInterval(()=>{
    const h = document.getElementById("modalHost");
    if (!h?.classList.contains("on")) { clearInterval(t); return; }
    // replace modal body safely
    const card = h.querySelector(".modalCard");
    if (card) card.innerHTML = render();
    h.querySelector("[data-close]")?.addEventListener("click", closeModal);
  }, 1000);
}
