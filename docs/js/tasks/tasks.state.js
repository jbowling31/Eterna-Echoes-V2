import { applyRewards } from "../economy/rewards.apply.logic.js";
import { TASKS, TASK_MILESTONES } from "./tasks.catalog.data.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";
import { addMissionProgress } from "../seasonpass/seasonpass.state.js";

export const tasksState = {
  daily:{ progress:{}, claimed:{}, points:0, chestClaimed:{} },
  weekly:{ progress:{}, claimed:{}, points:0, chestClaimed:{} },
  monthly:{ progress:{}, claimed:{}, points:0, chestClaimed:{} },
  stamps:{ daily:"", weekly:"", monthly:"" }
};

export function hydrateTasksState(saved){
  if (!saved) return;
  for (const k of ["daily","weekly","monthly"]){
    if (!saved[k]) continue;
    tasksState[k].progress = saved[k].progress || tasksState[k].progress;
    tasksState[k].claimed = saved[k].claimed || tasksState[k].claimed;
    tasksState[k].points = saved[k].points ?? tasksState[k].points;
    tasksState[k].chestClaimed = saved[k].chestClaimed || tasksState[k].chestClaimed;
  }
  tasksState.stamps = saved.stamps || tasksState.stamps;
}

export function serializeTasksState(){
  return JSON.parse(JSON.stringify(tasksState));
}

export function addTaskProgress(kind, taskId, amt){
  const k = tasksState[kind];
  if (!k) return;
  if (k.claimed[taskId]) return;
  k.progress[taskId] = Math.max(0, (k.progress[taskId]||0) + (amt||1));
}

export function canClaimTask(kind, taskId){
  const def = TASKS[kind]?.find(t=>t.id===taskId);
  if (!def) return false;
  const k = tasksState[kind];
  if (k.claimed[taskId]) return false;
  return (k.progress[taskId]||0) >= def.goal;
}

export function claimTask(kind, taskId){
  const def = TASKS[kind]?.find(t=>t.id===taskId);
  if (!def) return { ok:false, reason:"Task not found" };
  const k = tasksState[kind];
  if (k.claimed[taskId]) return { ok:false, reason:"Already claimed" };
  if ((k.progress[taskId]||0) < def.goal) return { ok:false, reason:"Not complete" };

  const res = applyRewards(def.reward);
  if (!res.ok) return res;

  k.claimed[taskId] = true;
  k.points = (k.points||0) + (def.points||0);
  // Season mission hook: tasks points
  addMissionProgress("sw_tasks", def.points||0);
  emit(EVENTS.TOAST, { kind:"good", text:`+${def.points} ${kind} pts` });
  return { ok:true };
}

export function canClaimChest(kind, milestone){
  const k = tasksState[kind];
  if (!k) return false;
  if (k.chestClaimed[milestone]) return false;
  return (k.points||0) >= milestone;
}

export function claimChest(kind, milestone){
  if (!canClaimChest(kind, milestone)) return { ok:false, reason:"Not available" };
  const reward = kind==="daily"
    ? { gold: 500, accountXP: 25 }
    : kind==="weekly"
      ? { gold: 2000, accountXP: 120 }
      : { gold: 8000, accountXP: 600 };

  const res = applyRewards(reward);
  if (!res.ok) return res;

  tasksState[kind].chestClaimed[milestone] = true;
  emit(EVENTS.TOAST, { kind:"good", text:`Chest claimed (${kind})` });
  return { ok:true };
}

export function getMilestones(kind){
  return TASK_MILESTONES[kind] || [];
}
