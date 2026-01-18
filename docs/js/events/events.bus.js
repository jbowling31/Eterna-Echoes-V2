const _subs = new Map();
export function on(evt, fn){
  if (!_subs.has(evt)) _subs.set(evt, new Set());
  _subs.get(evt).add(fn);
  return () => _subs.get(evt)?.delete(fn);
}
export function emit(evt, payload){
  const set = _subs.get(evt);
  if (!set) return;
  for (const fn of Array.from(set)){
    try{ fn(payload); } catch (e){ console.error('[bus]', evt, e); }
  }
}
