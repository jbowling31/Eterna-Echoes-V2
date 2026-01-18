export const materialsState = {
  skillTomes: 20, // starting stack for testing
};

export function canAffordMaterials(cost){
  if (!cost) return true;
  const tomes = cost.skillTomes || 0;
  return (materialsState.skillTomes >= tomes);
}

export function spendMaterials(cost){
  if (!cost) return true;
  const tomes = cost.skillTomes || 0;
  if (materialsState.skillTomes < tomes) return false;
  materialsState.skillTomes -= tomes;
  return true;
}

export function addMaterials(reward){
  if (!reward) return;
  if (reward.skillTomes) materialsState.skillTomes += (reward.skillTomes|0);
}
