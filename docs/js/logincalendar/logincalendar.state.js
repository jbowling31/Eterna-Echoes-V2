import { LOGIN_CALENDAR } from "./logincalendar.catalog.data.js";
import { applyRewards } from "../economy/rewards.apply.logic.js";
import { addTaskProgress } from "../tasks/tasks.state.js";
import { addMissionProgress } from "../seasonpass/seasonpass.state.js";

function todayKey(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

export const loginCalendarState = {
  claims: [],
  totalClaims: 0
};

export function hydrateLoginCalendarState(saved){
  if (!saved) return;
  loginCalendarState.claims = Array.isArray(saved.claims) ? saved.claims : loginCalendarState.claims;
  loginCalendarState.totalClaims = Number.isFinite(saved.totalClaims) ? saved.totalClaims : loginCalendarState.totalClaims;
}

export function serializeLoginCalendarState(){
  return {
    claims: loginCalendarState.claims,
    totalClaims: loginCalendarState.totalClaims
  };
}

export function hasClaimedToday(){
  const t = todayKey();
  return loginCalendarState.claims.includes(t);
}

export function getTodayCalendarDay(){
  const idx = Math.min(LOGIN_CALENDAR.length, Math.max(1, loginCalendarState.totalClaims + 1));
  return idx;
}

export function claimToday(){
  if (hasClaimedToday()) return { ok:false, reason:"Already claimed today" };
  const day = getTodayCalendarDay();
  const entry = LOGIN_CALENDAR.find(x=>x.day===day) || LOGIN_CALENDAR[0];
  const res = applyRewards(entry.reward);
  if (!res.ok) return res;

  loginCalendarState.totalClaims = Math.min(LOGIN_CALENDAR.length, loginCalendarState.totalClaims + 1);
  // Task + Season hooks
  addTaskProgress("daily","d_login", 1);
  addTaskProgress("weekly","w_claim7", 1);
  addTaskProgress("monthly","m_claim15", 1);
  addMissionProgress("sd_login", 1);
  loginCalendarState.claims.push(todayKey());
  loginCalendarState.claims = Array.from(new Set(loginCalendarState.claims));
  return { ok:true, day, reward: entry.reward };
}
