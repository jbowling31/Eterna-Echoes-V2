import { addGold } from "./gold.state.js";
import { addAccountXP } from "./xp.account.state.js";
import { addTaskProgress } from "../tasks/tasks.state.js";
import { addGearDrop, hasSpace } from "../gear/gear.inventory.state.js";
import { addHeroXP } from "../heroes/hero.progress.state.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";
import { getTeam, getActiveMode, TEAM_MODES, setActiveMode } from "../teams/team.builder.state.js";

function getTeamForMode(mode){
  const prev = getActiveMode();
  setActiveMode(mode);
  const ids = [...(getTeam() || [])];
  setActiveMode(prev);
  return ids;
}

export function applyRewards(r, ctx = {}){
  r = r || {};
  const gearDrops = r.gearDrops || [];
  if (gearDrops.length && !hasSpace(gearDrops.length)) return { ok:false, reason:"Gear inv full" };

  if (r.gold) addGold(r.gold);

  if (r.accountXP){
    const res = addAccountXP(r.accountXP);
    if (res?.leveled){
      addTaskProgress("daily","d_level", res.levelsGained||1);
    }
  }

  // ✅ HERO XP
  if (r.heroXP){
    const mode = ctx.teamMode || TEAM_MODES.DUNGEONS;
    const ids = getTeamForMode(mode);
    ids.filter(Boolean).forEach(heroId => addHeroXP(heroId, r.heroXP));
  }

  const added = [];
  for (const gd of gearDrops){
    const iid = addGearDrop(gd.gearId, gd.level||1);
    if (iid) added.push(iid);
  }
  return { ok:true, addedGear:added };
}

