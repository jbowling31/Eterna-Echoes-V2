import { openModal, closeModal } from "./ui.modal.js";
import { getTeam, TEAM_MODES, getActiveMode, setActiveMode } from "../teams/team.builder.state.js";
import { openTeamBuilder } from "./team.builder.ui.js";
import { HEROES } from "../heroes/heroes.data.js";
import { getHeroLevel, getHeroXPProgress } from "../heroes/hero.progress.state.js";
import { spendEnergy } from "../economy/energy.state.js";
import { applyRewards } from "../economy/rewards.apply.logic.js";

import { mountStory, openChapterSelect } from "../story/story.runner.js";
import { isUnlocked } from "../heroes/hero.progress.state.js";

const DEV_COST = 10;

// Battle tab “subscreen” state
const battleHubState = {
  view: "hub", // "hub" | "story"
};

const MODE_LABELS = {
  [TEAM_MODES.GLOBAL]: "Global",
  [TEAM_MODES.DUNGEONS]: "Dungeons",
  [TEAM_MODES.RAIDS]: "Raids",
  [TEAM_MODES.TRIALS]: "Trials",
};

// If a Story battle is requested, we stash it here until the player confirms team.
let pendingStoryBattleId = null;

function heroName(id) {
  return HEROES.find((h) => h.id === id)?.name || id;
}

function renderHubButtons() {
  return `
    <div class="card">
      <div class="spread">
        <div>
          <div class="h2">Battle Hub</div>
          <div class="muted">Choose what you want to run.</div>
        </div>
        <span class="pill gold">Mode UI</span>
      </div>

      <div style="height:12px"></div>

      <div class="row wrap">
        <button class="btn primary" data-battle-view="story">Story</button>
        <button class="btn" data-run-mode="${TEAM_MODES.DUNGEONS}">Dungeons</button>
        <button class="btn" data-run-mode="${TEAM_MODES.RAIDS}">Raids</button>
        <button class="btn" data-run-mode="${TEAM_MODES.TRIALS}">Trials</button>
      </div>

      <div class="muted" style="margin-top:10px;">
        Story runs fullscreen from here. Other modes use their saved mode team.
      </div>
    </div>
  `;
}

function renderStoryPanel() {
  return `
    <div class="card">
      <div class="spread">
        <div>
          <div class="h2">Story</div>
          <div class="muted">Pick a chapter, then tap through the scene.</div>
        </div>
        <div class="row">
          <button class="btn" data-open-chapters>Chapters</button>
          <button class="btn" data-battle-view="hub">Back</button>
        </div>
      </div>
    </div>

    <div style="height:12px"></div>

    <div id="battleStoryHost">
      <div class="card">
        <div class="muted">Story runner mounted. Use <b>Chapters</b> to begin.</div>
      </div>
    </div>
  `;
}

export function renderBattle() {
  const view = battleHubState.view;

  return `
    ${renderHubButtons()}
    <div style="height:12px"></div>
    ${view === "story" ? renderStoryPanel() : `
      <div class="card">
        <div class="muted">Pick an option above to begin.</div>
      </div>
    `}
  `;
}

function renderHeroList(ids){
  if (!ids?.length) return `<div class="card"><div class="muted">No heroes selected.</div></div>`;
  return `
    <div class="card">
      <div class="muted">Selected (${ids.length}):</div>
      <div style="height:8px"></div>
      ${ids.map(id=>`<div class="muted">• <b>${heroName(id)}</b> (Lv ${getHeroLevel(id)})</div>`).join("")}
    </div>
  `;
}

function openConfirmTeam() {
  const mode = getActiveMode();

  // story battle = only unlocked heroes allowed
  const isStoryBattle = !!pendingStoryBattleId;
  const ids = (getTeam() || []).filter(Boolean).filter(id => !isStoryBattle || isUnlocked(id));

  openModal("Confirm Team", `
    <div class="card">
      <div class="spread">
        <div>
          <div class="h2">${MODE_LABELS[mode] || mode} Team</div>
          <div class="muted">Battle can start with 1–5 heroes. You can edit right here.</div>
          ${isStoryBattle ? `<div class="muted" style="margin-top:6px;"><b>Story rule:</b> Only unlocked heroes can be used.</div>` : ``}
        </div>
      </div>
    </div>
    <div style="height:12px"></div>
    ${renderHeroList(ids)}
    <div style="height:12px"></div>
    <div class="row wrap">
      <button class="btn" data-edit-team>Edit Team</button>
      <button class="btn" data-cancel>Cancel</button>
      <button class="btn primary" data-confirm-start ${ids.length<1 ? "disabled" : ""}>Start Battle</button>
    </div>
    ${ids.length<1 ? `<div style="height:10px"></div><div class="muted">Pick at least 1 hero to start.</div>` : ""}
  `);

  const host = document.getElementById("modalHost");

  const abortStoryIfNeeded = ()=>{
    const bid = pendingStoryBattleId;
    pendingStoryBattleId = null;

    if (bid){
      window.dispatchEvent(new CustomEvent("EE_STORY_BATTLE_RESULT", {
        detail: { battleId: bid, aborted:true }
      }));
    }
  };

  // ✅ Cancel button
  host?.querySelector("[data-cancel]")?.addEventListener("click", ()=>{
    closeModal();
    abortStoryIfNeeded();
  });

  // ✅ X and footer Close should behave like cancel (this is what was missing)
  host?.querySelector("[data-x]")?.addEventListener("click", abortStoryIfNeeded, { once:true });
  host?.querySelector(".modalFooter [data-close]")?.addEventListener("click", abortStoryIfNeeded, { once:true });

  // ✅ Edit team: return to confirm screen after save OR cancel
  host?.querySelector("[data-edit-team]")?.addEventListener("click", ()=>{
    closeModal();
    openTeamBuilder({
      onDone: () => openConfirmTeam(),
      onCancel: () => openConfirmTeam(),
    });
  });

  host?.querySelector("[data-confirm-start]")?.addEventListener("click", ()=>{
    if (ids.length < 1) return;
    closeModal();

    const storyBattleId = pendingStoryBattleId;
    pendingStoryBattleId = null;

    startBattleInstant(ids, mode, { storyBattleId });
  });
}

// ✅ Instant battle resolver → Victory (no “battle in progress loop” anymore)
function startBattleInstant(ids, mode, meta = {}) {
  if (!spendEnergy(DEV_COST)){
    openModal("Not enough energy", `<div class="card"><div class="muted">You need ${DEV_COST}.</div></div>`);
    return;
  }

  window.EE_TICK?.();

  // Capture BEFORE
  const before = ids.map(id=>({
    id,
    lvl: getHeroLevel(id),
    prog: getHeroXPProgress(id),
  }));

  // Simple dev rewards (edit later)
  const heroXP = 40;
  const rewards = { gold: 250, accountXP: 25, heroXP, gearDrops: [] };

  applyRewards(rewards, { teamMode: mode });

  // Dispatch story battle win (advances segments + unlock heroes)
  if (meta?.storyBattleId){
    window.dispatchEvent(new CustomEvent("EE_STORY_BATTLE_RESULT", {
      detail: { battleId: meta.storyBattleId, won: true }
    }));
  }

  // Capture AFTER
  const after = ids.map(id=>({
    id,
    lvl: getHeroLevel(id),
    prog: getHeroXPProgress(id),
  }));

  openModal("Victory", renderVictoryDetails({ ids, before, after, rewards }));

  const vh = document.getElementById("modalHost");
  const goNext = ()=>{
    closeModal();

    if (meta?.storyBattleId){
      pendingStoryBattleId = null;

      window.dispatchEvent(new CustomEvent("EE_STORY_RESUME", {
        detail: { battleId: meta.storyBattleId }
      }));

      window.EE_TICK?.();
      return;
    }

    window.EE_TICK?.();
  };

  vh?.querySelector("[data-victory-continue]")?.addEventListener("click", goNext);

  // X and footer Close should behave like Continue as well
  vh?.querySelector("[data-x]")?.addEventListener("click", ()=>{
    if (meta?.storyBattleId) setTimeout(()=>openChapterSelect(), 0);
  }, { once:true });

  vh?.querySelector(".modalFooter [data-close]")?.addEventListener("click", ()=>{
    if (meta?.storyBattleId) setTimeout(()=>openChapterSelect(), 0);
  }, { once:true });
}

function renderBar(p){
  const pct = Math.round((p.frac||0)*100);
  if (!p.need) return `<div class="muted">MAX</div>`;
  return `<div class="muted">XP ${p.xp}/${p.need}</div><div class="progressBar" style="margin-top:6px"><i style="width:${pct}%"></i></div>`;
}

function renderVictoryDetails({ ids, before, after, rewards }){
  const rows = ids.map(id=>{
    const b = before.find(x=>x.id===id);
    const a = after.find(x=>x.id===id);
    const gainedLv = (a?.lvl||1) - (b?.lvl||1);

    return `
      <div class="card" style="margin-bottom:10px;">
        <div class="spread">
          <div>
            <div class="h2">${heroName(id)}</div>
            <div class="muted">Lv ${b?.lvl||1} → <b>Lv ${a?.lvl||1}</b>${gainedLv>0 ? ` • +${gainedLv} level` : ""}</div>
            <div style="height:8px"></div>
            <div class="muted"><b>Before</b></div>
            ${renderBar(b?.prog || {level:1,xp:0,need:0,frac:0})}
            <div style="height:10px"></div>
            <div class="muted"><b>After</b></div>
            ${renderBar(a?.prog || {level:1,xp:0,need:0,frac:0})}
          </div>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="card">
      <div class="h2">Rewards</div>
      <div class="muted">
        Gold: <b>${rewards.gold||0}</b> • Account XP: <b>${rewards.accountXP||0}</b> • Hero XP: <b>${rewards.heroXP||0}</b>
      </div>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="h2">Hero Progress</div>
      <div class="muted">(per-hero breakdown)</div>
    </div>
    <div style="height:12px"></div>
    ${rows}
    <div class="row wrap">
      <button class="btn primary" data-victory-continue>Continue</button>
    </div>
  `;
}

function ensureStoryMounted() {
  const host = document.getElementById("battleStoryHost");
  if (host) mountStory("battleStoryHost");
}

function bindStoryBattleBridgeOnce() {
  if (window.__EE_STORY_BATTLE_BRIDGE_BOUND) return;
  window.__EE_STORY_BATTLE_BRIDGE_BOUND = true;

  window.addEventListener("EE_STORY_REQUEST_BATTLE", (ev) => {
    const battleId = ev?.detail?.battleId;
    if (!battleId) return;

    pendingStoryBattleId = battleId;

    // Story always uses Global team
    setActiveMode(TEAM_MODES.GLOBAL);

    openConfirmTeam();
  });
}

export function wireBattle(root) {
  bindStoryBattleBridgeOnce();

  root.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("button[data-battle-view]");
    if (viewBtn) {
      battleHubState.view = viewBtn.getAttribute("data-battle-view") || "hub";
      window.EE_TICK?.();

      if (battleHubState.view === "story") {
        setTimeout(() => {
          ensureStoryMounted();
          openChapterSelect();
        }, 0);
      }
      return;
    }

    if (e.target.closest("button[data-open-chapters]")) {
      ensureStoryMounted();
      openChapterSelect();
      return;
    }

    const modeBtn = e.target.closest("button[data-run-mode]");
    if (modeBtn) {
      const m = modeBtn.getAttribute("data-run-mode");
      if (m) setActiveMode(m);
      openConfirmTeam();
      return;
    }
  });
}
