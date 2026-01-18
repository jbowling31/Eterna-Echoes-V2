export const SEASON = Object.freeze({
  name: "Season 0 — Prototype",
  tierXP: 100,
  maxTier: 20,
  rewards: Array.from({length:20}, (_,i)=>{
    const tier = i+1;
    return {
      tier,
      free: { gold: 250 * tier, accountXP: 10 * tier },
      paid: { gold: 400 * tier, accountXP: 15 * tier } // for now: claimable too
    };
  }),
  missions: {
    daily: [
      { id:"sd_login", title:"Claim daily login", goal:1, spXP:50 },
      { id:"sd_equip", title:"Equip gear 1 time", goal:1, spXP:50 },
    ],
    weekly: [
      { id:"sw_tasks", title:"Earn 100 task points", goal:100, spXP:150 },
      { id:"sw_equip5", title:"Equip gear 5 times", goal:5, spXP:200 },
    ]
  }
});
