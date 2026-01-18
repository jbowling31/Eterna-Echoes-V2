import { getHeroProg, getHeroLevel } from "../heroes/hero.progress.state.js";
import { goldState } from "../economy/gold.state.js";
import { materialsState } from "../economy/materials.state.js";
import { getSkillDef, SKILL_MAX_LEVEL } from "./skills.data.js";

export function getSkillLevel(heroId, skillId){
  const p = getHeroProg(heroId);
  return (p.skillLv?.[skillId] || 1);
}

export function getSkillLevelReq(nextSkillLevel){
  // Milestones: require hero level 1,6,11,16,21,... for skill levels 1..10
  const n = Math.max(1, nextSkillLevel|0);
  return 1 + (n-1)*5;
}

export function getSkillUpgradeCost(currentLevel){
  // Flat-ish costs for prototype: gold and 1 tome each step (can tune later)
  const lvl = Math.max(1, currentLevel|0);
  return { gold: 500, skillTomes: 1 };
}

export function canUpgradeSkill(heroId, skillId){
  const def = getSkillDef(skillId);
  if (!def) return { ok:false, reason:"Missing skill definition." };

  const cur = getSkillLevel(heroId, skillId);
  if (cur >= SKILL_MAX_LEVEL) return { ok:false, reason:"Skill at max level." };

  const next = cur + 1;
  const needHeroLevel = getSkillLevelReq(next);
  const heroLevel = getHeroLevel(heroId);
  if (heroLevel < needHeroLevel){
    return { ok:false, reason:`Requires Hero Lv ${needHeroLevel}.` };
  }

  const cost = getSkillUpgradeCost(cur);
  if ((goldState.gold|0) < (cost.gold|0)) return { ok:false, reason:"Not enough gold." };
  if ((materialsState.skillTomes|0) < (cost.skillTomes|0)) return { ok:false, reason:"Not enough Skill Tomes." };

  return { ok:true, cost, next, needHeroLevel };
}

export function upgradeSkill(heroId, skillId){
  const chk = canUpgradeSkill(heroId, skillId);
  if (!chk.ok) return chk;

  const p = getHeroProg(heroId);
  const cur = getSkillLevel(heroId, skillId);

  goldState.gold -= chk.cost.gold|0;
  materialsState.skillTomes -= chk.cost.skillTomes|0;

  if (!p.skillLv) p.skillLv = {};
  p.skillLv[skillId] = cur + 1;

  return { ok:true, level: cur+1 };
}
