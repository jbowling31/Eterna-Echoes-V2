import { canClaimLoginToday } from "../logincalendar/logincalendar.claim.logic.js";
import { hasAnyTaskClaimable } from "../tasks/tasks.badges.logic.js";
import { hasAnySeasonPassClaimable } from "../seasonpass/seasonpass.claim.logic.js";




// Inventory “new” (session only)
const SKEY = "ee_inv_seen_session";
export function markInventorySeenThisSession(){
  try{ sessionStorage.setItem(SKEY, "1"); }catch(_){}
}
export function isInventoryUnseenThisSession(){
  try{ return sessionStorage.getItem(SKEY) !== "1"; }catch(_){ return false; }
}

export function computeBadges(){
  const login = !!canClaimLoginToday?.();
  const tasks = !!hasAnyTaskClaimable?.();
  const season = !!hasAnySeasonPassClaimable?.();

const heroUp = false;
const skillUp = false;

  // milestone + gold+tome

  const inv = isInventoryUnseenThisSession(); // optional “new” indicator

  // “More” dot should show if any hub in it is actionable
  const more = login || tasks || season || inv || heroUp || skillUp;

  return { login, tasks, season, inventory: inv, heroUp, skillUp, more };
}

export function applyBadges(root=document){
  const b = computeBadges();

  root.querySelectorAll("[data-badge]")?.forEach(el=>{
    const key = el.getAttribute("data-badge");
    const on = !!b[key];

    el.classList.toggle("hasBadge", on);

    // ensure dot element exists
    let dot = el.querySelector(":scope > .badgeDot");
    if (!dot){
      dot = document.createElement("span");
      dot.className = "badgeDot";
      el.appendChild(dot);
    }

    // ✅ force visibility in JS (no dependency on CSS)
    dot.style.display = on ? "block" : "none";
  });
}

