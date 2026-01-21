// docs/js/ui/hero.detail.ui.js

import { HEROES } from "../heroes/heroes.data.js";
import { getHeroProg, getHeroXPProgress } from "../heroes/hero.progress.state.js";
import { getHeroDerivedStats } from "../heroes/hero.stats.logic.js";

import { openModal, closeModal } from "./ui.modal.js";
import { getSkillDef } from "../skills/skills.data.js";
import { openSkillInspect } from "./skill.inspect.ui.js";
import { ensureHeroSkillLoadout, setHeroMainSkill } from "../skills/skill.loadout.state.js";
function renderStatBreakdown(stats){
  const b = stats?.breakdown;
  if (!b) return "";

  const base = b.base || {};
  const final = b.final || {};
  const gf = b.gear?.flat || {};
  const gp = b.gear?.pct || {};

  const anyGear = (gf.hp||gf.atk||gf.def||gf.spd||gp.hp||gp.atk||gp.def||gp.spd);

  const row = (k, label) => {
    const baseV = Number(base[k] ?? 0) || 0;
    const flatV = Number(gf[k] ?? 0) || 0;
    const pctV  = Number(gp[k] ?? 0) || 0;
    const finV  = Number(final[k] ?? 0) || 0;

    const gearTxt = anyGear
      ? `${flatV ? (flatV>0?`+${flatV}`:`${flatV}`) : "0"}${pctV ? `, ${pctV>0?`+${pctV}`:`${pctV}`}%` : ""}`
      : "—";

    return `
      <div class="statRow">
        <div class="k">${label}</div>
        <div class="v">${baseV}</div>
        <div class="v">${gearTxt}</div>
        <div class="v"><b>${finV}</b></div>
      </div>
    `;
  };

  return `
    <details class="statBreak" style="margin-top:6px;">
      <summary class="muted" style="cursor:pointer;">Stat breakdown</summary>
      <div class="muted" style="margin-top:8px; font-size:12px;">
        Base (role+level) + Gear (flat/% if present) = Final (used in battle).
      </div>
      <div class="statBreakGrid" style="margin-top:8px;">
        <div class="statRow head">
          <div class="k"></div>
          <div class="v">Base</div>
          <div class="v">Gear</div>
          <div class="v">Final</div>
        </div>
        ${row("hp","HP")}
        ${row("atk","ATK")}
        ${row("def","DEF")}
        ${row("spd","SPD")}
      </div>
      ${anyGear ? "" : `<div class="muted" style="margin-top:8px; font-size:12px;">(No numeric gear bonuses detected yet — add statsFlat/statsPct to gear defs when ready.)</div>`}
    </details>
  `;
}

export function openHeroDetail(heroId){
  const hero = HEROES.find(h => h.id === heroId);
  if (!hero){
    console.warn("[hero.detail] hero not found", heroId);
    return;
  }

  const p = getHeroProg(heroId);
  const xpProg = getHeroXPProgress(heroId);
  const locked = !p.unlocked;
  const stats = getHeroDerivedStats(heroId, { includeGear: true, breakdown: true });

  const loadout = ensureHeroSkillLoadout(heroId);

  const basicDef = getSkillDef(loadout.basic);
  const mainDef  = getSkillDef(loadout.main);
  const altDef   = getSkillDef(loadout.alt);
  const ultDef   = getSkillDef(loadout.ult);

  const equipCard = `
    <div class="card" style="margin-top:12px;">
      <div class="h2">Equipped Skills</div>
      <div class="muted" style="margin-top:6px;">Battle uses <b>Basic</b>, <b>Guard</b>, and your equipped <b>Skill</b> button per hero.</div>

      <div style="height:10px"></div>

      <div class="spread" style="gap:10px; margin:8px 0;">
        <div><b>Basic</b>: ${escapeHtml(basicDef?.name || loadout.basic)}</div>
        <div class="muted">Fixed</div>
      </div>

      <div class="spread" style="gap:10px; margin:8px 0;">
        <div><b>Skill Button</b>: ${escapeHtml(mainDef?.name || loadout.main)}</div>
        <button class="btn" data-equip-main ${locked ? "disabled" : ""}>Change</button>
      </div>

      <div class="muted" style="margin-top:8px;">Alt: ${escapeHtml(altDef?.name || loadout.alt)} &nbsp;•&nbsp; Ult: ${escapeHtml(ultDef?.name || loadout.ult)}</div>
    </div>
  `;

  const skills = hero.skills || [];

  openModal({
    title: hero.name,
    body: `
      <div class="heroDetail">
        <div class="card">
          <div class="spread">
            <div>
              <div class="h2">Overview</div>
              <div class="muted">${escapeHtml(hero.element || "")}${hero.role ? " • " + escapeHtml(hero.role) : ""}</div>
            </div>
            <div class="badge ${locked ? "locked" : ""}">${locked ? "Locked" : "Unlocked"}</div>
          </div>

          <div style="height:12px"></div>

          <div class="statGrid">
            <div class="stat"><div class="k">Level</div><div class="v">${Number(p.level) || 1}</div></div>
            <div class="stat"><div class="k">HP</div><div class="v">${stats.hp}</div></div>
            <div class="stat"><div class="k">ATK</div><div class="v">${stats.atk}</div></div>
            <div class="stat"><div class="k">DEF</div><div class="v">${stats.def}</div></div>
            <div class="stat"><div class="k">SPD</div><div class="v">${stats.spd}</div></div>
          </div>
          ${renderStatBreakdown(stats)}
          <div style="height:12px"></div>

          <div class="muted" style="font-weight:800; letter-spacing:.02em;">Hero XP</div>
          <div class="progressBar" style="margin-top:8px;"><i style="width:${Math.round((xpProg.frac||0)*100)}%"></i></div>
          <div class="muted" style="margin-top:8px;">${xpProg.need ? `${xpProg.xp}/${xpProg.need}` : "MAX"}</div>

          <div class="muted" style="margin-top:10px;">(These are the numbers used in battle.)</div>
        </div>

        ${equipCard}

        <div class="card" style="margin-top:12px;">
          <div class="h2">Skills</div>
          <div class="muted" style="margin-top:6px;">Tap a skill to view details and upgrade it.</div>

          <div class="skillList" style="margin-top:10px;">
            ${renderSkillRow(`${heroId}_basic`, "Basic", locked)}
            ${skills.map(skillId => renderSkillRow(skillId, "", locked)).join("")}
          </div>
        </div>
      </div>
    `,
    footer: `
      <button class="btn" data-close>Close</button>
    `
  });

  const host = document.getElementById("modalHost");
  if (!host) return;

  host.querySelector("[data-close]")?.addEventListener("click", () => closeModal());

  host.querySelectorAll("[data-skill]").forEach(btn => {
    btn.addEventListener("click", () => {
      const skillId = btn.getAttribute("data-skill");
      if (!skillId) return;
      openSkillInspect(heroId, skillId);
    });
  });

  const equipMainBtn = host.querySelector("[data-equip-main]");
  if (equipMainBtn && !locked){
    equipMainBtn.addEventListener("click", () => {
      openEquipMainSkill(heroId);
    });
  }
}

function openEquipMainSkill(heroId){
  const hero = HEROES.find(h => h.id === heroId);
  if (!hero) return;

  const candidates = (hero.skills || []).slice(0, 2);
  const loadout = ensureHeroSkillLoadout(heroId);

  openModal({
    title: "Equip Skill Button",
    body: `
      <div class="card">
        <div class="muted">Pick which skill sits on the battle <b>Skill</b> button for this hero.</div>
      </div>
      <div class="card" style="margin-top:12px;">
        <div class="skillList">
          ${candidates.map(skillId => {
            const def = getSkillDef(skillId);
            const name = def?.name || skillId;
            const desc = def?.text || "";
            const isOn = loadout.main === skillId;
            return `
              <button class="skillRow ${isOn ? "isEquipped" : ""}" data-pick-skill="${escapeHtml(skillId)}">
                <div class="left">
                  <div class="name">${escapeHtml(name)} ${isOn ? "<span class=\"pill\">Equipped</span>" : ""}</div>
                  <div class="muted">${escapeHtml(desc)}</div>
                </div>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `,
    footer: `
      <button class="btn" data-back>Back</button>
    `
  });

  const host = document.getElementById("modalHost");
  if (!host) return;

  host.querySelector("[data-back]")?.addEventListener("click", () => openHeroDetail(heroId));

  host.querySelectorAll("[data-pick-skill]").forEach(btn => {
    btn.addEventListener("click", () => {
      const skillId = btn.getAttribute("data-pick-skill");
      if (!skillId) return;

      setHeroMainSkill(heroId, skillId);
      openHeroDetail(heroId);
    });
  });
}

function renderSkillRow(skillId, tag, locked){
  const def = getSkillDef(skillId);
  const name = def?.name || skillId;
  const kind = def?.kind ? def.kind.toUpperCase() : "";
  const smallTag = tag || kind;

  return `
    <button class="skillRow" data-skill="${escapeHtml(skillId)}" ${locked ? "disabled" : ""}>
      <div class="left">
        <div class="name">${escapeHtml(name)}${smallTag ? ` <span class=\"pill\">${escapeHtml(smallTag)}</span>` : ""}</div>
        <div class="muted">${escapeHtml(def?.text || "")}</div>
      </div>
    </button>
  `;
}

function escapeHtml(s){
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderXPBar(p){
  const prog = p || { level:1, xp:0, need:0, frac:0 };
  const pct = Math.round((prog.frac || 0) * 100);

  if (!prog.need){
    return `
      <div class="muted"><b>XP</b>: MAX</div>
      <div class="progressBar" style="margin-top:6px;"><i style="width:100%"></i></div>
    `;
  }

  return `
    <div class="muted"><b>XP</b>: ${prog.xp}/${prog.need} (${pct}%)</div>
    <div class="progressBar" style="margin-top:6px;"><i style="width:${pct}%"></i></div>
  `;
}
