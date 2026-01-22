// Battle FX: lightweight, no-sprites-required animations.
// - Ghost "lunge" between portraits
// - Subtle shake on hit
// - Impact flash (vibe color)
// - Floating numbers / status labels

const KEY = "EE_BATTLE_FX_ENABLED_V1";

export function loadBattleFXEnabled(){
  try {
    const v = localStorage.getItem(KEY);
    if (v === null) return true;
    return v === "1";
  } catch {
    return true;
  }
}

export function saveBattleFXEnabled(on){
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {}
}

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function getFxLayer(stageEl){
  if (!stageEl) return null;
  return stageEl.querySelector("#eeBFX") || stageEl.querySelector(".eeBFX");
}

function getUnitEl(stageEl, ref){
  if (!stageEl || !ref) return null;
  if (ref.side === "hero") return stageEl.querySelector(`.eeUnit[data-hidx="${ref.idx}"]`);
  return stageEl.querySelector(`.eeUnit[data-eidx="${ref.idx}"]`);
}

function getPortraitImgEl(unitEl){
  if (!unitEl) return null;
  return unitEl.querySelector(".eePortrait img") || unitEl.querySelector("img");
}

function rectRelTo(el, container){
  const a = el.getBoundingClientRect();
  const b = container.getBoundingClientRect();
  return {
    x: a.left - b.left,
    y: a.top - b.top,
    w: a.width,
    h: a.height,
    cx: (a.left + a.width/2) - b.left,
    cy: (a.top + a.height/2) - b.top,
  };
}

function pickPrimaryTarget(fx){
  if (!fx) return null;
  // Prefer a damage target if present
  const dmg = (fx.numbers||[]).find(n => n && n.type === "dmg");
  if (dmg) return { side: dmg.side, idx: dmg.idx };
  // Else any explicit target
  if (fx.targets && fx.targets.length) return fx.targets[0];
  // Else a heal/shield target
  const heal = (fx.numbers||[]).find(n => n && (n.type === "heal" || n.type === "shield"));
  if (heal) return { side: heal.side, idx: heal.idx };
  return null;
}

function vibeClass(v){
  const vv = String(v||"").toLowerCase();
  if (vv.includes("heal")) return "vibeHeal";
  if (vv.includes("shield")) return "vibeShield";
  if (vv.includes("debuff") || vv.includes("control")) return "vibeDebuff";
  if (vv.includes("buff") || vv.includes("utility") || vv.includes("support")) return "vibeBuff";
  return "vibeDmg";
}

function numClass(n){
  switch (n.type){
    case "dmg": return "fxDmg";
    case "heal": return "fxHeal";
    case "shield": return "fxShield";
    case "buff": return "fxBuff";
    case "debuff": return "fxDebuff";
    default: return "";
  }
}

function formatNum(n){
  if (n.type === "dmg") return `-${Math.max(0, Math.floor(n.amount||0))}`;
  if (n.type === "heal") return `+${Math.max(0, Math.floor(n.amount||0))}`;
  if (n.type === "shield") return `+${Math.max(0, Math.floor(n.amount||0))}`;
  if (n.type === "buff" || n.type === "debuff") return String(n.label||"").trim();
  return String(n.amount ?? n.label ?? "");
}

function makeFlash(layer, stageEl, unitEl, vibe){
  if (!layer || !unitEl) return null;
  const r = rectRelTo(unitEl, stageEl);
  const el = document.createElement("div");
  el.className = `eeFxFlash ${vibeClass(vibe)}`;
  const pad = Math.min(10, Math.max(4, r.w*0.06));
  el.style.left = `${r.x - pad}px`;
  el.style.top = `${r.y - pad}px`;
  el.style.width = `${r.w + pad*2}px`;
  el.style.height = `${r.h + pad*2}px`;
  layer.appendChild(el);
  const anim = el.animate([
    { opacity: 0, transform: "scale(0.98)" },
    { opacity: 0.9, transform: "scale(1.02)" },
    { opacity: 0, transform: "scale(1.05)" }
  ], { duration: 380, easing: "ease-out", fill: "forwards" });
  anim.finished.finally(() => el.remove());
  function makeRing(layer, stageEl, unitEl, vibe, opts={}){
  if (!layer || !unitEl) return null;
  const r = rectRelTo(unitEl, stageEl);
  const el = document.createElement("div");
  el.className = `eeFxRing ${vibeClass(vibe)}`.trim();
  const pad = Number.isFinite(opts.pad) ? opts.pad : Math.min(14, Math.max(6, r.w*0.09));
  el.style.left = `${r.x - pad}px`;
  el.style.top = `${r.y - pad}px`;
  el.style.width = `${r.w + pad*2}px`;
  el.style.height = `${r.h + pad*2}px`;
  layer.appendChild(el);

  const dur = Number.isFinite(opts.duration) ? opts.duration : 520;
  const delay = Number.isFinite(opts.delay) ? opts.delay : 0;

  const anim = el.animate([
    { opacity: 0.0, transform: "scale(0.78)" },
    { opacity: 0.85, transform: "scale(1.02)" },
    { opacity: 0.0, transform: "scale(1.18)" }
  ], { duration: dur, delay, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" });

  anim.finished.finally(() => el.remove());
  return anim;
}

function bobCaster(unitEl, direction=1){
  if (!unitEl) return null;
  const dx = 10 * (direction >= 0 ? 1 : -1);
  const anim = unitEl.animate([
    { transform: "translateX(0px) scale(1)" },
    { transform: `translateX(${dx}px) scale(1.01)` },
    { transform: "translateX(0px) scale(1)" }
  ], { duration: 260, easing: "ease-out", fill: "forwards" });
  return anim;
}

return anim;
}

function shakeUnit(unitEl){
  if (!unitEl) return null;
  const anim = unitEl.animate([
    { transform: "translateX(0px)" },
    { transform: "translateX(-4px)" },
    { transform: "translateX(4px)" },
    { transform: "translateX(-3px)" },
    { transform: "translateX(0px)" }
  ], { duration: 260, easing: "ease-out", fill: "forwards" });
  return anim;
}

function floatText(layer, stageEl, unitEl, text, cls){
  if (!layer || !unitEl || !text) return null;
  const r = rectRelTo(unitEl, stageEl);
  const el = document.createElement("div");
  el.className = `eeFxFloat ${cls||""}`.trim();
  el.textContent = text;
  // Slight random drift so multi-target looks alive
  const jitterX = (Math.random() - 0.5) * 18;
  const jitterY = (Math.random() - 0.5) * 10;
  el.style.left = `${r.cx + jitterX}px`;
  el.style.top = `${r.cy + jitterY}px`;
  layer.appendChild(el);
  const anim = el.animate([
    { opacity: 0, transform: "translate(-50%, -10px) scale(0.98)" },
    { opacity: 1, transform: "translate(-50%, -26px) scale(1.0)" },
    { opacity: 0, transform: "translate(-50%, -52px) scale(1.03)" }
  ], { duration: 720, easing: "ease-out", fill: "forwards" });
  anim.finished.finally(() => el.remove());
  return anim;
}

async function ghostLunge(stageEl, fromEl, toEl){
  const layer = getFxLayer(stageEl);
  if (!layer || !fromEl || !toEl) return;
  const fromImg = getPortraitImgEl(fromEl);
  const src = fromImg?.getAttribute("src") || fromImg?.src;
  if (!src) return;

  const fromR = rectRelTo(fromEl, stageEl);
  const toR = rectRelTo(toEl, stageEl);

  const ghost = document.createElement("img");
  ghost.className = "eeFxGhost";
  ghost.alt = "";
  ghost.decoding = "async";
  ghost.src = src;

  const w = clamp(fromR.w * 0.92, 44, 170);
  const h = clamp(fromR.h * 0.92, 52, 210);

  ghost.style.width = `${w}px`;
  ghost.style.height = `${h}px`;
  ghost.style.left = `${fromR.cx}px`;
  ghost.style.top = `${fromR.cy}px`;

  layer.appendChild(ghost);

  // Subtle dim the source while ghost moves
  fromEl.classList.add("eeFxSourceDim");

  const dx = (toR.cx - fromR.cx);
  const dy = (toR.cy - fromR.cy);
  const dist = Math.sqrt(dx*dx + dy*dy);
  const dur = clamp(260 + dist*0.35, 260, 520);

  const anim = ghost.animate([
    { opacity: 0.0, transform: `translate(-50%, -50%) translate(0px,0px) scale(0.92)` },
    { opacity: 0.95, transform: `translate(-50%, -50%) translate(${dx*0.55}px, ${dy*0.55}px) scale(1.02)` },
    { opacity: 0.0, transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(1.06)` }
  ], { duration: dur, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" });

  try { await anim.finished; } catch {}
  ghost.remove();
  fromEl.classList.remove("eeFxSourceDim");
}
function bobCaster(stageEl, fromElOrRef, vibe){
  if (!stageEl) return null;

  // Accept either a DOM element OR a {side, idx} ref
  let el = fromElOrRef;

  // If it's a ref like {side:"hero", idx:0}, resolve to DOM
  if (el && typeof el === "object" && el.side && Number.isFinite(el.idx)) {
    if (typeof getUnitEl === "function") {
      el = getUnitEl(stageEl, el);
    }
  }

  // Guard: must be a DOM element with querySelector
  if (!el || typeof el.querySelector !== "function") return null;

  // Prefer just moving the portrait block for clean motion
  const p = el.querySelector(".eePortrait") || el;
  if (!p || typeof p.animate !== "function") return null;

  const vv = String(vibe || "").toLowerCase();
  const isHeal = vv.includes("heal");
  const isShield = vv.includes("shield");
  const isBuff = vv.includes("buff");

  // Subtle cast lean: damage leans forward, support leans slightly up/back
  const tx = (isHeal || isShield || isBuff) ? 0 : 6;
  const ty = (isHeal || isShield || isBuff) ? -4 : 0;
  const sc = (isHeal || isShield || isBuff) ? 1.03 : 1.04;

  try{
    return p.animate(
      [
        { transform: "translate(0px,0px) scale(1)" },
        { transform: `translate(${tx}px, ${ty}px) scale(${sc})` },
        { transform: "translate(0px,0px) scale(1)" }
      ],
      { duration: 180, easing: "ease-out", fill: "forwards" }
    );
  } catch {
    return null;
  }
}
function makeRing(layer, stageEl, unitEl, vibe){
  if (!layer || !stageEl || !unitEl) return null;

  // Use your existing vibeClass() if present, otherwise default
  const vc = (typeof vibeClass === "function")
    ? vibeClass(vibe)
    : "vibeDmg";

  // Position ring around the unit
  const a = unitEl.getBoundingClientRect();
  const b = stageEl.getBoundingClientRect();

  const cx = (a.left + a.width/2) - b.left;
  const cy = (a.top + a.height/2) - b.top;

  // Ring size relative to unit
  const size = Math.max(42, Math.min(140, Math.max(a.width, a.height) * 0.82));

  const el = document.createElement("div");
  el.className = `eeFxRing ${vc}`;
  el.style.left = `${cx}px`;
  el.style.top = `${cy}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;

  layer.appendChild(el);

  const anim = el.animate(
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.70)" },
      { opacity: 0.95, transform: "translate(-50%, -50%) scale(1.02)" },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.22)" }
    ],
    { duration: 420, easing: "ease-out", fill: "forwards" }
  );

  anim.finished.finally(() => el.remove());
  return anim;
}


export async function playActionFX({ stageEl, fx }){
  if (!stageEl || !fx) return;
  const layer = getFxLayer(stageEl);
  if (!layer) return;

  const fromRef = fx.from || null;
  const primary = pickPrimaryTarget(fx);

  const fromEl = fromRef ? getUnitEl(stageEl, fromRef) : null;
  const primaryEl = primary ? getUnitEl(stageEl, primary) : null;

  // 1) Primary movement (attack lunge only)
  const kind = String(fx.kind||"").toLowerCase();
  const isAttack = kind === "attack";
  const isSkill  = kind === "skill";

  if (isAttack && fromEl && primaryEl && primaryEl !== fromEl){
    await ghostLunge(stageEl, fromEl, primaryEl);
  } else if (isSkill && fromEl){
    // Tiny cast "lean" (toward the opposing side)
    const dir = (fromRef?.side === "hero") ? +1 : -1;
    bobCaster(fromEl, dir);
  }
  // 2) Flashes + shakes
  const targets = Array.isArray(fx.targets) ? fx.targets : [];
  const vibe = fx.vibe || "damage";
  const flashAnims = [];
  const shakeAnims = [];
  const ringAnims = [];
  for (const [i, t] of targets.entries()){
    const uEl = getUnitEl(stageEl, t);
    if (!uEl) continue;

    // Always do a quick flash
    flashAnims.push(makeFlash(layer, stageEl, uEl, vibe));

    // Skill "vibe ring" (subtle pulse) on every affected target
    if (isSkill){
      ringAnims.push(makeRing(layer, stageEl, uEl, vibe, { delay: i*55, duration: 520 }));
    }

    // Shake only for damage-ish vibes
    if (String(vibe||"").toLowerCase().includes("dam") || String(vibe||"").toLowerCase().includes("debuff")){
      shakeAnims.push(shakeUnit(uEl));
    }
  }

  // 3) Floating numbers/labels (all affected)
  const nums = Array.isArray(fx.numbers) ? fx.numbers : [];
  const floatAnims = [];
  for (const n of nums){
    if (!n) continue;
    const uEl = getUnitEl(stageEl, { side:n.side, idx:n.idx });
    if (!uEl) continue;
    const txt = formatNum(n);
    if (!txt) continue;
    floatAnims.push(floatText(layer, stageEl, uEl, txt, numClass(n)));
  }

  // Wait for the "impact" portion (flash/shake) to finish.
  const wait = [
    ...flashAnims.filter(Boolean).map(a => a.finished.catch(()=>{})),
    ...ringAnims.filter(Boolean).map(a => a.finished.catch(()=>{})),
    ...shakeAnims.filter(Boolean).map(a => a.finished.catch(()=>{}))
  ];
  if (wait.length) await Promise.all(wait);

  // Let floats linger slightly (but don't block too long)
  if (floatAnims.length){
    await new Promise(r => setTimeout(r, 220));
  }
}
