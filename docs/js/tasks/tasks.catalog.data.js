export const TASK_MILESTONES = Object.freeze({
  daily:   [20, 50, 100],
  weekly:  [60, 150, 300],
  monthly: [200, 500, 1000]
});

export const TASKS = Object.freeze({
  daily: [
    { id:"d_login", title:"Log in", desc:"Claim your daily login reward.", goal:1, points:20, reward:{ gold:150 } },
    { id:"d_equip", title:"Equip 1 gear item", desc:"Equip any gear on any hero.", goal:1, points:20, reward:{ gold:250, accountXP:10 } },
    { id:"d_level", title:"Gain 1 account level", desc:"Earn enough account XP to level up once.", goal:1, points:40, reward:{ gold:400, accountXP:20 } },
  ],
  weekly: [
    { id:"w_claim7", title:"Claim 3 daily logins", desc:"Claim daily login 3 times this week.", goal:3, points:60, reward:{ gold:1000, accountXP:60 } },
    { id:"w_equip10", title:"Equip gear 5 times", desc:"Equip gear on heroes 5 times.", goal:5, points:80, reward:{ gold:1200, accountXP:80 } },
    { id:"w_sp", title:"Earn 300 Season XP", desc:"Progress the season pass.", goal:300, points:160, reward:{ gold:1600, accountXP:120 } },
  ],
  monthly: [
    { id:"m_claim15", title:"Claim 10 daily logins", desc:"Claim daily login 10 times this month.", goal:10, points:200, reward:{ gold:4000, accountXP:300 } },
    { id:"m_equip40", title:"Equip gear 25 times", desc:"Equip gear on heroes 25 times.", goal:25, points:300, reward:{ gold:5000, accountXP:400 } },
    { id:"m_sp", title:"Earn 2000 Season XP", desc:"Progress the season pass.", goal:2000, points:500, reward:{ gold:7500, accountXP:600 } },
  ]
});
