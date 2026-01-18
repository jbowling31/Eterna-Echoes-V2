// docs/js/economy/energy.state.js

export const ENERGY_MAX = 120;
export const ENERGY_REGEN_MS = 6 * 60 * 1000; // 6 minutes per +1

export const energyState = {
  cur: ENERGY_MAX,
  max: ENERGY_MAX,
  lastRegenAt: Date.now(),
};

// Back-compat: allow older code to read/write energyState.current
Object.defineProperty(energyState, "current", {
  get(){ return energyState.cur; },
  set(v){ energyState.cur = Math.max(0, Math.floor(v || 0)); },
});

export function syncEnergy(now = Date.now()){
  // If full, keep anchor fresh so timers stay sane
  if (energyState.cur >= energyState.max){
    energyState.lastRegenAt = now;
    return;
  }

  const anchor = energyState.lastRegenAt || now;
  const elapsed = Math.max(0, now - anchor);
  const gained = Math.floor(elapsed / ENERGY_REGEN_MS);
  if (gained <= 0) return;

  energyState.cur = Math.min(energyState.max, energyState.cur + gained);
  energyState.lastRegenAt = anchor + gained * ENERGY_REGEN_MS;
}

export function spendEnergy(n){
  syncEnergy(Date.now());              // make sure regen is applied before spending
  n = Math.floor(n || 0);
  if (n <= 0) return true;
  if (energyState.cur < n) return false;
  energyState.cur -= n;
  return true;
}

export function msUntilNextEnergy(now = Date.now()){
  syncEnergy(now);
  if (energyState.cur >= energyState.max) return 0;

  const anchor = energyState.lastRegenAt || now;
  const elapsed = Math.max(0, now - anchor);
  const rem = ENERGY_REGEN_MS - (elapsed % ENERGY_REGEN_MS);
  return rem;
}

export function msUntilFullEnergy(now = Date.now()){
  syncEnergy(now);
  const missing = Math.max(0, energyState.max - energyState.cur);
  if (missing === 0) return 0;
  return msUntilNextEnergy(now) + (missing - 1) * ENERGY_REGEN_MS;
}
