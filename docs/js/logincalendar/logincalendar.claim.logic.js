import { hasClaimedToday } from "./logincalendar.state.js";

function todayKey(now = Date.now()){
  // local day key (matches player expectations)
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function canClaimLoginToday(){
  return !hasClaimedToday();
}