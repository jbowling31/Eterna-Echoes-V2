import { getTier, seasonPassState } from "./seasonpass.state.js";

export function hasAnySeasonPassClaimable(){
  const unlockedTier = getTier();

  for (let tier = 1; tier <= unlockedTier; tier++){
    const key = String(tier);

    // free track claimable?
    if (!seasonPassState.claimedFree?.[key]) return true;

    // paid track claimable too (for now)
    if (!seasonPassState.claimedPaid?.[key]) return true;
  }
  return false;
}
