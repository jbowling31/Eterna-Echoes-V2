import { HEROES } from "./heroes.data.js";

export const HERO_LVL_CAP = 50;

// heroId -> { unlocked:boolean, level:number, xp:number, equipped:Record<string,string> }
export const heroProgressState = {
  byId: new Map(),
};

function defaultProg(heroId){
  return {
    heroId,
    unlocked: false,
    level: 1,
    xp: 0,
    equipped: {},
  };
}

export function getHeroProg(heroId){
  if (!heroProgressState.byId.has(heroId)){
    heroProgressState.byId.set(heroId, defaultProg(heroId));
  }
  return heroProgressState.byId.get(heroId);
}

export function resetAll(){
  heroProgressState.byId = new Map();
}

// Story-first: ALL heroes start locked.
export function seedStarters(){
  for (const h of (HEROES || [])){
    const p = getHeroProg(h.id);
    p.unlocked = false;
  }
}

export function unlockHero(heroId){
  const p = getHeroProg(heroId);
  p.unlocked = true;
}

export function lockHero(heroId){
  const p = getHeroProg(heroId);
  p.unlocked = false;
}

export function isUnlocked(heroId){
  return !!getHeroProg(heroId).unlocked;
}

export function getHeroLevel(heroId){
  return Math.max(1, Math.floor(getHeroProg(heroId).level || 1));
}

export function getHeroXP(heroId){
  return Math.max(0, Math.floor(getHeroProg(heroId).xp || 0));
}

export function getHeroXPToNext(level){
  level = Math.max(1, Math.floor(level || 1));
  const base = 40 + level * 18;
  const curve = (level * level) * 4;
  const bump = level >= 20 ? Math.pow(level - 19, 2) * 2 : 0;
  return Math.floor(base + curve + bump);
}

export function getHeroXPProgress(heroId){
  const level = getHeroLevel(heroId);
  if (level >= HERO_LVL_CAP){
    return { level: HERO_LVL_CAP, xp: 0, need: 0, frac: 1 };
  }
  const xp = getHeroXP(heroId);
  const need = getHeroXPToNext(level);
  const frac = need > 0 ? Math.max(0, Math.min(1, xp / need)) : 0;
  return { level, xp, need, frac };
}

export function addHeroXP(heroId, amt){
  const p = getHeroProg(heroId);
  const cap = HERO_LVL_CAP;

  let level = getHeroLevel(heroId);
  let xp = getHeroXP(heroId) + Math.max(0, Math.floor(amt || 0));

  let levelsGained = 0;
  while (level < cap){
    const need = getHeroXPToNext(level);
    if (xp < need) break;
    xp -= need;
    level++;
    levelsGained++;
  }

  p.level = level;
  p.xp = xp;

  return {
    ok: true,
    leveled: levelsGained > 0,
    levelsGained,
    level,
    xp,
  };
}

export function hasAnyHeroLevelUpAvailable(){
  return false;
}
