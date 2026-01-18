// Adapter: exposes a flat reward list for claim logic + badges.
import { SEASON } from "./seasonpass.catalog.data.js";

export const SEASONPASS_MAX_TIER = SEASON.maxTier;

export const seasonpassRewards = (SEASON.rewards || []).flatMap(r => {
  const tier = r.tier;

  const free = {
    id: `free_${tier}`,
    tier,
    track: "free",
    rewards: [
      { type: "gold", amount: r.free?.gold ?? 0 },
      { type: "accountXP", amount: r.free?.accountXP ?? 0 },
    ].filter(x => x.amount > 0),
  };

  const paid = {
    id: `paid_${tier}`,
    tier,
    track: "paid",
    rewards: [
      { type: "gold", amount: r.paid?.gold ?? 0 },
      { type: "accountXP", amount: r.paid?.accountXP ?? 0 },
    ].filter(x => x.amount > 0),
  };

  return [free, paid];
});
