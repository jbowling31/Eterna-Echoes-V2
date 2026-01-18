import { on } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";
export function wireToasts(){
  const host = document.getElementById('toastHost');
  if (!host) return;
  on(EVENTS.TOAST, ({kind, text})=>{
    const el = document.createElement('div');
    el.className = `toast ${kind||""}`.trim();
    el.textContent = text || "";
    host.appendChild(el);
    setTimeout(()=>{ el.style.opacity="0"; el.style.transition="opacity .25s"; }, 1400);
    setTimeout(()=>{ el.remove(); }, 1750);
  });
}
