import { openModal, closeModal } from "./ui.modal.js";
import { LOGIN_CALENDAR } from "../logincalendar/logincalendar.catalog.data.js";
import { claimToday, hasClaimedToday, getTodayCalendarDay, loginCalendarState } from "../logincalendar/logincalendar.state.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";

function rewardLine(r){
  const parts = [];
  if (r.gold) parts.push(`${r.gold} gold`);
  if (r.accountXP) parts.push(`${r.accountXP} XP`);
  return parts.join(" • ") || "—";
}

export function openLoginCalendar(){
  const todayDay = getTodayCalendarDay();
  const claimedToday = hasClaimedToday();

  const cells = LOGIN_CALENDAR.map(entry=>{
    const day = entry.day;
    const isPast = day < todayDay;
    const isToday = day === todayDay;
    const isFuture = day > todayDay;

    const claimed = isPast || (isToday && claimedToday);
    const cls = ["calCell", claimed ? "claimed" : "", isToday ? "today" : "", isFuture ? "future" : ""].join(" ").trim();

    return `<div class="${cls}">
      <div class="calDay">Day ${day}</div>
      <div class="calReward">${rewardLine(entry.reward)}</div>
      ${claimed ? `<div class="calMark">✓</div>` : isToday ? `<div class="calMark">★</div>` : `<div class="calMark">🔒</div>`}
    </div>`;
  }).join("");

  openModal("Daily Login", `
    <div class="card tight">
      <div class="spread">
        <div class="muted">Claims: <b>${loginCalendarState.totalClaims}</b> • Today is Day <b>${todayDay}</b></div>
        <button class="btn small" data-close>Close</button>
      </div>
    </div>
    <div class="calGrid">${cells}</div>
    <div class="card tight">
      <div class="spread">
        <div class="muted">${claimedToday ? "Already claimed today." : "Claim available now."}</div>
        <button class="btn primary" data-claim ${claimedToday ? "disabled" : ""}>Claim</button>
      </div>
    </div>
  `);

  const host = document.getElementById("modalHost");
  host?.querySelector("[data-close]")?.addEventListener("click", closeModal);
  host?.querySelector("[data-claim]")?.addEventListener("click", ()=>{
    const res = claimToday();
    if (!res.ok){
      emit(EVENTS.TOAST, { kind:"bad", text: res.reason || "Can't claim" });
      return;
    }
    emit(EVENTS.TOAST, { kind:"good", text: `Claimed Day ${res.day}` });
    openLoginCalendar(); // rerender
  });
}
