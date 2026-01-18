export const goldState = { gold: 0 };
export function addGold(n){ goldState.gold = Math.max(0, Math.floor(goldState.gold + (n||0))); }
