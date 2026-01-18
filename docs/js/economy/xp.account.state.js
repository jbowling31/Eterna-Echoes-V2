export const accountXPState = { level: 1, xp: 0 };
function xpForLevel(lv){ return Math.floor(50 * lv + 25 * lv * lv); }
export function addAccountXP(n){
  n = Math.floor(n||0);
  accountXPState.xp += n;
  let gained = 0;
  while (accountXPState.xp >= xpForLevel(accountXPState.level)){
    accountXPState.xp -= xpForLevel(accountXPState.level);
    accountXPState.level++;
    gained++;
  }
  return { leveled:gained>0, levelsGained:gained };
}
export function getAccountXPToNext(){ return xpForLevel(accountXPState.level); }
