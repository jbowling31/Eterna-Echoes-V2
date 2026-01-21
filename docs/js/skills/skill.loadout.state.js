// docs/js/skills/skill.loadout.state.js
// Per-hero skill loadout.
//
// We keep the battle UI simple (one Skill button) but still allow you to "equip"
// which of the hero's two non-ultimate skills sits on that button.

import { HEROES } from "../heroes/heroes.data.js";
import { getHeroProg } from "../heroes/hero.progress.state.js";

function getHeroDef(heroId){
  return (HEROES || []).find(h => h.id === heroId) || null;
}

export function ensureHeroSkillLoadout(heroId){
  const p = getHeroProg(heroId);
  if (!p.skillLoadout || typeof p.skillLoadout !== "object"){
    p.skillLoadout = {};
  }

  const h = getHeroDef(heroId);
  const skills = Array.isArray(h?.skills) ? h.skills.slice() : [];

  // Expect hero.skills = [s1, s2, u]
  const s1 = skills[0] || `${heroId}_s1`;
  const s2 = skills[1] || `${heroId}_s2`;
  const ult = skills[2] || `${heroId}_u`;
  const basic = `${heroId}_basic`;

  if (!p.skillLoadout.basic) p.skillLoadout.basic = basic;
  if (!p.skillLoadout.ult) p.skillLoadout.ult = ult;

  const main = p.skillLoadout.main;
  if (main !== s1 && main !== s2){
    p.skillLoadout.main = s1;
  }

  // alt is always the other non-ult skill (if present)
  p.skillLoadout.alt = (p.skillLoadout.main === s1) ? s2 : s1;

  return p.skillLoadout;
}

export function getHeroSkillLoadout(heroId){
  return ensureHeroSkillLoadout(heroId);
}

export function setHeroMainSkill(heroId, skillId){
  const h = getHeroDef(heroId);
  const candidates = Array.isArray(h?.skills) ? h.skills.slice(0, 2) : [`${heroId}_s1`, `${heroId}_s2`];

  if (!candidates.includes(skillId)){
    return { ok:false, reason:"not_in_hero_skillset" };
  }

  const l = ensureHeroSkillLoadout(heroId);
  l.main = skillId;
  l.alt = candidates.find(x => x !== skillId) || l.alt;
  return { ok:true };
}
