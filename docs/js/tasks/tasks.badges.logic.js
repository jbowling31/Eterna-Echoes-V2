import { TASKS } from "./tasks.catalog.data.js";
import { canClaimTask, canClaimChest, getMilestones } from "./tasks.state.js";

function kindHasClaimable(kind){
  // Any task claimable?
  const defs = TASKS[kind] || [];
  for (const t of defs){
    if (canClaimTask(kind, t.id)) return true;
  }

  // Any chest claimable?
  const ms = getMilestones(kind) || [];
  for (const m of ms){
    if (canClaimChest(kind, m)) return true;
  }

  return false;
}

export function computeTasksBadges(){
  const daily = kindHasClaimable("daily");
  const weekly = kindHasClaimable("weekly");
  const monthly = kindHasClaimable("monthly");
  return { daily, weekly, monthly, any: (daily || weekly || monthly) };
}

export function hasAnyTaskClaimable(){
  return computeTasksBadges().any;
}
