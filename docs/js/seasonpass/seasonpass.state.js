import { applyRewards } from "../economy/rewards.apply.logic.js";
import { SEASON } from "./seasonpass.catalog.data.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";
import { addTaskProgress } from "../tasks/tasks.state.js";

export const seasonPassState = {
  xp: 0,
  claimedFree: {},
  claimedPaid: {},
  missionProg: {},
  missionClaimed: {}
};

export function hydrateSeasonPassState(saved){
  if (!saved) return;
  seasonPassState.xp = saved.xp ?? seasonPassState.xp;
  seasonPassState.claimedFree = saved.claimedFree || seasonPassState.claimedFree;
  seasonPassState.claimedPaid = saved.claimedPaid || seasonPassState.claimedPaid;
  seasonPassState.missionProg = saved.missionProg || seasonPassState.missionProg;
  seasonPassState.missionClaimed = saved.missionClaimed || seasonPassState.missionClaimed;
}

export function serializeSeasonPassState(){
  return JSON.parse(JSON.stringify(seasonPassState));
}

export function addSeasonXP(n){
  const amt = Math.max(0, Math.floor(n||0));
  seasonPassState.xp = Math.max(0, Math.floor(seasonPassState.xp + amt));
  // Task hooks that reference Season XP
  addTaskProgress("weekly","w_sp", amt);
  addTaskProgress("monthly","m_sp", amt);
  emit(EVENTS.TOAST, { kind:"info", text:`+${amt} Season XP` });
}

export function getTier(){
  const t = Math.floor(seasonPassState.xp / SEASON.tierXP) + 1;
  return Math.min(SEASON.maxTier, Math.max(1, t));
}

export function getTierProgress(){
  const tier = getTier();
  const into = seasonPassState.xp - (tier-1)*SEASON.tierXP;
  return { tier, into, need: SEASON.tierXP };
}

export function claimTierReward(tier, track){
  if (tier < 1 || tier > SEASON.maxTier) return { ok:false, reason:"bad tier" };
  const unlockedTier = getTier();
  if (tier > unlockedTier) return { ok:false, reason:"locked" };

  const key = String(tier);
  const claimed = track==="free" ? seasonPassState.claimedFree : seasonPassState.claimedPaid;
  if (claimed[key]) return { ok:false, reason:"claimed" };

  const entry = SEASON.rewards.find(r=>r.tier===tier);
  const reward = track==="free" ? entry.free : entry.paid;

  const res = applyRewards(reward);
  if (!res.ok) return res;

  claimed[key] = true;
  emit(EVENTS.TOAST, { kind:"good", text:`Tier ${tier} ${track} claimed` });
  return { ok:true };
}

export function addMissionProgress(id, amt){
  if (seasonPassState.missionClaimed[id]) return;
  seasonPassState.missionProg[id] = Math.max(0, (seasonPassState.missionProg[id]||0) + (amt||1));
}

export function canClaimMission(id){
  const all = [...SEASON.missions.daily, ...SEASON.missions.weekly];
  const m = all.find(x=>x.id===id);
  if (!m) return false;
  if (seasonPassState.missionClaimed[id]) return false;
  return (seasonPassState.missionProg[id]||0) >= m.goal;
}

export function claimMission(id){
  const all = [...SEASON.missions.daily, ...SEASON.missions.weekly];
  const m = all.find(x=>x.id===id);
  if (!m) return { ok:false, reason:"missing" };
  if (!canClaimMission(id)) return { ok:false, reason:"not ready" };
  seasonPassState.missionClaimed[id] = true;
  addSeasonXP(m.spXP);
  return { ok:true };
}
