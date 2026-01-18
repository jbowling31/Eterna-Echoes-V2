import { HEROES } from "../heroes/heroes.data.js";
import { getHeroProg, getHeroLevel, getHeroXP, getHeroXPToNext } from "../heroes/hero.progress.state.js";
import { getSkillDef, SKILL_MAX_LEVEL } from "../skills/skills.data.js";
import { getSkillLevel, canUpgradeSkill, upgradeSkill, getSkillUpgradeCost, getSkillLevelReq } from "../skills/skill.upgrade.logic.js";
import { openModal } from "./ui.modal.js";


function pctFor(def, lvl){
  if (!def || !def.basePct) return 0;
  const per = def.perLevelPct || 0;
  return Math.round((def.basePct + (lvl-1)*per) * 10) / 10;
}

function scaleLabel(def){
  if (!def || !def.scaleStat) return "—";
  return def.scaleStat === "ATK" ? "ATK%" : (def.scaleStat === "DEF" ? "DEF%" : def.scaleStat);
}

export function openSkillInspect(heroId, skillId){
  const h = HEROES.find(x=>x.id===heroId);
  const p = getHeroProg(heroId);
  const def = getSkillDef(skillId);
  if (!h || !def){
    openModal("Skill", `<div class="card"><div class="h2">Missing skill</div><div class="muted">${skillId}</div></div>`);
    return;
  }

  const lvl = getSkillLevel(heroId, skillId);
  const next = Math.min(SKILL_MAX_LEVEL, lvl+1);

  const curPct = pctFor(def, lvl);
  const nextPct = pctFor(def, next);

  const reqHeroLv = getSkillLevelReq(next);
  const chk = canUpgradeSkill(heroId, skillId);
  const cost = getSkillUpgradeCost(lvl);

  const kind = def.kind || "—";
  const status = def.status ? `${def.status.name || "Status"} • ${def.status.chance ?? ""}% • ${def.status.turns ?? ""}t` : "—";

  const body = `
    <div class="card runeCard">
      <div class="spread">
        <div>
          <div class="h2">${def.name}</div>
          <div class="muted">${def.slot} • ${h.element} • ${kind}</div>
        </div>
        <div class="pill gold">Lv ${lvl}/${SKILL_MAX_LEVEL}</div>
      </div>

      <div style="height:10px"></div>
      <div class="row wrap">
        <span class="pill">${scaleLabel(def)}</span>
        <span class="pill">CD ${def.cdTurns ?? 0}</span>
        <span class="pill">Cost ${def.energyCost ?? 0}</span>
        <span class="pill">Status: ${status}</span>
      </div>

      <div style="height:12px"></div>
<div class="muted">${
  (def.text || "")
    .replaceAll("{pct}", String(pctFor(def, lvl)))
    .replaceAll("{nextPct}", String(pctFor(def, next)))
}</div>



      <div style="height:14px"></div>
      <div class="card" style="background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.10);">
        <div class="spread">
          <div>
            <b>Scaling</b>
            <div class="muted">${def.scaleStat ? `Current: ${curPct}% ${def.scaleStat}` : "No scaling (utility/buff/control)"}</div>
          </div>
          <div>
            ${def.scaleStat ? `<span class="pill gold">Next: ${nextPct}%</span>` : `<span class="pill">—</span>`}
          </div>
        </div>
        <div class="muted" style="margin-top:8px;">
          Next level requires <b>Hero Lv ${reqHeroLv}</b>.
        </div>
      </div>

      <div style="height:12px"></div>
      <div class="spread">
        <div class="muted">Upgrade cost: <b>${cost.gold}</b> gold + <b>${cost.skillTomes}</b> tome</div>
        <button class="btn primary" data-skill-up ${chk.ok ? "" : "disabled"}>${chk.ok ? "Upgrade" : "Locked"}</button>
      </div>
      ${chk.ok ? "" : `<div class="muted" style="margin-top:8px;">${chk.reason}</div>`}
    </div>
  `;

  openModal("Skill", body);

  const host = document.getElementById("modalHost");
  host?.querySelector("[data-skill-up]")?.addEventListener("click", ()=>{
    const res = upgradeSkill(heroId, skillId);
    if (!res.ok){
      openSkillInspect(heroId, skillId);
      return;
    }
    window.EE_TICK?.();

    openSkillInspect(heroId, skillId);
  });
}
