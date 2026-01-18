import { isUnlocked } from "../heroes/hero.progress.state.js";

export const TEAM_SIZE = 5;

// Modes that will eventually have their own team.
// Keep strings stable; they become save keys.
export const TEAM_MODES = {
  GLOBAL: "global",
  DUNGEONS: "dungeons",
  RAIDS: "raids",
  TRIALS: "trials",
};

export const teamBuilderState = {
  // mode -> heroIds[]
  teams: {
    [TEAM_MODES.GLOBAL]: [],
    [TEAM_MODES.DUNGEONS]: [],
    [TEAM_MODES.RAIDS]: [],
    [TEAM_MODES.TRIALS]: [],
  },
  activeMode: TEAM_MODES.GLOBAL,
};

export function setActiveMode(mode){
  if (!teamBuilderState.teams[mode]) mode = TEAM_MODES.GLOBAL;
  teamBuilderState.activeMode = mode;
}

export function getActiveMode(){
  return teamBuilderState.activeMode;
}

export function getTeam(mode = teamBuilderState.activeMode){
  return (teamBuilderState.teams[mode] || []).slice();
}

export function setTeam(heroIds, mode = teamBuilderState.activeMode){
  teamBuilderState.teams[mode] = Array.from(new Set(heroIds)).slice(0, TEAM_SIZE);
}

export function toggleTeamHero(heroId, mode = teamBuilderState.activeMode){
  const arr = teamBuilderState.teams[mode] || (teamBuilderState.teams[mode] = []);
  const idx = arr.indexOf(heroId);
  if (idx >= 0){
    arr.splice(idx, 1);
    return;
  }
  if (arr.length >= TEAM_SIZE) return;
  arr.push(heroId);
}

export function isTeamReady(mode = teamBuilderState.activeMode){
  return (teamBuilderState.teams[mode] || []).length === TEAM_SIZE;
}

export function validateTeam(heroIds, mode = teamBuilderState.activeMode){
  const unique = Array.from(new Set(heroIds || []));
  if (unique.length !== (heroIds||[]).length) return { ok:false, reason:"Duplicate hero in team." };
  if (unique.length < 1) return { ok:false, reason:"Pick at least 1 hero." };
  if (unique.length > TEAM_SIZE) return { ok:false, reason:`Max ${TEAM_SIZE} heroes.` };
  for (const id of unique){
    if (!isUnlocked(id)) return { ok:false, reason:`Hero locked: ${id}` };
  }
  return { ok:true };
}
