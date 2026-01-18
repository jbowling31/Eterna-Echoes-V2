import { openModal, closeModal } from "./ui.modal.js";
import { SEASON } from "../seasonpass/seasonpass.catalog.data.js";
import { seasonPassState, getTierProgress, claimTierReward, addMissionProgress, canClaimMission, claimMission } from "../seasonpass/seasonpass.state.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";

function rewardLine(r){
  const parts = [];
  if (r.gold) parts.push(`${r.gold}g`);
  if (r.accountXP) parts.push(`${r.accountXP}xp`);
  return parts.join(" • ") || "—";
}

export function openSeasonPass(){
  const prog = getTierProgress();
  const pct = Math.floor((prog.into / prog.need) * 100);

  const rows = SEASON.rewards.map(r=>{
    const tier = r.tier;
    const locked = tier > prog.tier;
    const freeClaimed = !!seasonPassState.claimedFree[String(tier)];
    const paidClaimed = !!seasonPassState.claimedPaid[String(tier)];

    return `<div class="card tight">
      <div class="spread">
        <div>
          <div class="h2">Tier ${tier} ${locked ? "🔒" : ""}</div>
          <div class="muted">Free: ${rewardLine(r.free)} • Paid: ${rewardLine(r.paid)}</div>
        </div>
        <div class="row wrap" style="justify-content:flex-end;">
          <button class="btn small ${(!locked && !freeClaimed) ? "primary":""}" data-claim="free:${tier}" ${locked||freeClaimed ? "disabled":""}>${freeClaimed?"Free ✓":"Claim Free"}</button>
          <button class="btn small ${(!locked && !paidClaimed) ? "primary":""}" data-claim="paid:${tier}" ${locked||paidClaimed ? "disabled":""}>${paidClaimed?"Paid ✓":"Claim Paid"}</button>
        </div>
      </div>
    </div>`;
  }).join("");

  const missions = [...SEASON.missions.daily, ...SEASON.missions.weekly].map(m=>{
    const p = seasonPassState.missionProg[m.id] || 0;
    const claimed = !!seasonPassState.missionClaimed[m.id];
    const ok = canClaimMission(m.id);
    return `<div class="card tight">
      <div class="spread">
        <div>
          <div class="h2">${m.title}</div>
          <div class="muted">${Math.min(p,m.goal)}/${m.goal} • +${m.spXP} Season XP</div>
        </div>
        <div class="row wrap" style="justify-content:flex-end;">
          <button class="btn small" data-madd="${m.id}">+1</button>
          <button class="btn small ${ok ? "primary":""}" data-mclaim="${m.id}" ${(!ok || claimed) ? "disabled":""}>${claimed?"Claimed":"Claim"}</button>
        </div>
      </div>
    </div>`;
  }).join("");

  openModal("Season Pass", `
    <div class="card tight">
      <div class="spread">
        <div>
          <div class="h2">${SEASON.name}</div>
          <div class="muted">Tier ${prog.tier} • ${prog.into}/${prog.need} XP</div>
        </div>
        <button class="btn small" data-close>Close</button>
      </div>
      <div style="height:8px"></div>
      <div class="progressBar"><i style="width:${pct}%"></i></div>
      <div class="muted" style="margin-top:8px;">Premium is claimable in prototype (no payments).</div>
    </div>

    <div class="card sectionTitle">
      <div class="h2">Missions</div>
      <div class="muted">Complete missions → earn Season XP → unlock tiers.</div>
    </div>
    ${missions}

    <div class="card sectionTitle">
      <div class="h2">Rewards</div>
      <div class="muted">Free + Paid tracks (both claimable right now).</div>
    </div>
    ${rows}
  `);

  const host = document.getElementById("modalHost");
  host?.querySelector("[data-close]")?.addEventListener("click", closeModal);

  host?.querySelectorAll("[data-claim]")?.forEach(b=>{
    b.addEventListener("click", ()=>{
      const [track, tier] = b.getAttribute("data-claim").split(":");
      const res = claimTierReward(Number(tier), track);
      if (!res.ok) emit(EVENTS.TOAST, { kind:"bad", text: res.reason || "Can't claim" });
      openSeasonPass();
    });
  });

  host?.querySelectorAll("[data-madd]")?.forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-madd");
      addMissionProgress(id, 1);
      openSeasonPass();
    });
  });

  host?.querySelectorAll("[data-mclaim]")?.forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-mclaim");
      const res = claimMission(id);
      if (!res.ok) emit(EVENTS.TOAST, { kind:"bad", text: res.reason || "Can't claim" });
      openSeasonPass();
    });
  });
}
