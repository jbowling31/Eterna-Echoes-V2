import { HEROES } from "../heroes/heroes.data.js";
import { isUnlocked, getHeroLevel, getHeroXPProgress } from "../heroes/hero.progress.state.js";
import { GEAR_SLOTS, getGearForHero } from "../gear/gear.equip.logic.js";
import { getItem, getGearDef } from "../gear/gear.inventory.state.js";
import { openSkillInspect } from "./skill.inspect.ui.js";
import { openModal, closeModal } from "./ui.modal.js";

// ✅ Add this import (adjust path if your file isn't in ../data/)
import { getSkillDef } from "../skills/skills.data.js";


function fmtPct(f){
  const pct = Math.max(0, Math.min(100, Math.round((f||0)*100)));
  return pct;
}

function renderXP(heroId){
  const p = getHeroXPProgress(heroId);
  const pct = fmtPct(p.frac);
  if (!p.need){
    return `<div class="muted">Lv ${p.level} • MAX</div>`;
  }
  return `
    <div class="muted">Lv ${p.level} • XP ${p.xp}/${p.need}</div>
    <div class="progressBar" style="margin-top:8px;"><i style="width:${pct}%"></i></div>
  `;
}

function renderGear(heroId){
  const equipped = getGearForHero(heroId) || {};
  const locked = !isUnlocked(heroId);

  const rows = GEAR_SLOTS.map(slot=>{
    const iid = equipped[slot] || null;
    const it = iid ? getItem(iid) : null;
    const def = it ? getGearDef(it.gearId) : null;
    const name = def?.name || it?.gearId || "Empty";

    return `
      <div class="spread" style="margin:8px 0;">
        <div class="muted"><b>${slot.toUpperCase()}</b> — ${name}</div>
        <button class="btn small" data-gear-slot="${slot}" ${locked?"disabled":""}>${iid?"Change":"Equip"}</button>
      </div>
    `;
  }).join("");

  return `
    <div class="card">
      <div class="h2">Gear</div>
      <div class="muted">6 slots: Head / Body / Hands / Feet / Accessory 1 / Accessory 2</div>
      ${locked ? `<div class="muted" style="margin-top:8px;">Locked hero — gear can be equipped after unlock.</div>` : ""}
      <div style="height:8px"></div>
      ${rows}
    </div>
  `;
}

export function openHeroDetail(heroId){
  const hero = HEROES.find(h=>h.id===heroId);
  if (!hero) return;

  const locked = !isUnlocked(heroId);

  // ✅ Use skills.data.js to render names/desc/etc (falls back safely)
  const skillRows = (hero.skills || []).map(id=>{
    const def = getSkillDef(id);
    const name = def?.name || id;
    const slot = def?.slot || "";
    const kind = def?.kind || "";
    const cd = (def?.cdTurns != null) ? `CD ${def.cdTurns}` : "";
    const energy = (def?.energyCost != null && def.energyCost > 0) ? `Energy ${def.energyCost}` : "";
    const meta = [slot, kind, cd, energy].filter(Boolean).join(" • ");
    const text = def?.text || "";

    return `
      <button type="button" class="card" data-skill="${id}" style="text-align:left;">
        <div class="spread">
          <div>
            <div class="h2" style="font-size:16px; margin:0;">${name}</div>
            ${meta ? `<div class="muted" style="margin-top:4px;">${meta}</div>` : ``}
            ${text ? `<div class="muted" style="margin-top:8px;">${text}</div>` : ``}
          </div>
          <div class="muted">›</div>
        </div>
      </button>
    `;
  }).join("");

  openModal("Hero Info", `
    <div class="card">
      <div class="spread">
        <div>
          <div class="h2">${hero.name}</div>
          <div class="muted">${hero.element} • ${hero.role} ${locked ? "• 🔒 Locked" : ""}</div>

          <div style="height:8px"></div>
          ${renderXP(heroId)}
        </div>
        <button class="btn" data-close>Close</button>
      </div>
    </div>

    <div style="height:12px"></div>

    <div class="card">
      <div class="h2">Skills</div>
      <div class="muted">Tap a skill to view details.</div>
      <div style="height:10px"></div>
      <div class="col" style="gap:10px;">
        ${skillRows || `<span class="muted">No skills set</span>`}
      </div>
    </div>

    <div style="height:12px"></div>

    ${renderGear(heroId)}
  `);

  const host = document.getElementById("modalHost");
  host?.querySelector("[data-close]")?.addEventListener("click", closeModal);

  // Skills
host?.querySelectorAll("[data-skill]")?.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const skillId = btn.getAttribute("data-skill");
    openSkillInspect(heroId, skillId);
  });
});

  // Gear equip flow (handled globally in app.js)
  host?.querySelectorAll("[data-gear-slot]")?.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const slot = btn.getAttribute("data-gear-slot");
      window.dispatchEvent(new CustomEvent('EE_GEAR_EQUIP_FLOW', { detail:{ heroId, slot } }));
    });
  });
}

// Backward-compatible alias (some older imports)
export function openHeroInfo(heroId){
  return openHeroDetail(heroId);
}
