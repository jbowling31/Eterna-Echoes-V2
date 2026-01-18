import { openModal, closeModal } from "./ui.modal.js";

import { HEROES } from "../heroes/heroes.data.js";
import { isUnlocked } from "../heroes/hero.progress.state.js";

// IMPORTANT: namespace import so we don't crash on missing named exports
import * as Team from "../teams/team.builder.state.js";

/**
 * Compatibility layer for differing team.builder.state.js exports.
 * We try a few common function names and fall back safely.
 */

const TEAM_MODES = Team.TEAM_MODES || {
  GLOBAL: "global",
  DUNGEONS: "dungeons",
  RAIDS: "raids",
  TRIALS: "trials",
};

const MODE_LABELS = {
  [TEAM_MODES.GLOBAL]: "Global",
  [TEAM_MODES.DUNGEONS]: "Dungeons",
  [TEAM_MODES.RAIDS]: "Raids",
  [TEAM_MODES.TRIALS]: "Trials",
};

function getActiveModeSafe() {
  if (typeof Team.getActiveMode === "function") return Team.getActiveMode();
  if (typeof Team.getMode === "function") return Team.getMode();
  // fallback
  return TEAM_MODES.GLOBAL;
}

function getMaxTeamSizeSafe(mode) {
  if (typeof Team.getMaxTeamSize === "function") return Team.getMaxTeamSize();
  if (typeof Team.getMaxTeamSizeForMode === "function") return Team.getMaxTeamSizeForMode(mode);
  if (typeof Team.getTeamLimit === "function") return Team.getTeamLimit(mode);
  if (typeof Team.getMaxTeam === "function") return Team.getMaxTeam();
  // fallback (your UI says Max 5)
  return 5;
}

function getTeamForModeSafe(mode) {
  if (typeof Team.getTeamForMode === "function") return Team.getTeamForMode(mode);
  if (typeof Team.getTeam === "function") {
    // some implementations are global-only, some accept mode
    try { return Team.getTeam(mode); } catch { return Team.getTeam(); }
  }
  if (typeof Team.getTeamIds === "function") {
    try { return Team.getTeamIds(mode); } catch { return Team.getTeamIds(); }
  }
  // common state shapes
  if (Team.teamState?.byMode?.[mode]) return Team.teamState.byMode[mode];
  if (Team.teamState?.teams?.[mode]) return Team.teamState.teams[mode];
  return [];
}

function setTeamForModeSafe(mode, ids) {
  if (typeof Team.setTeamForMode === "function") return Team.setTeamForMode(mode, ids);

  const fn =
    Team.setTeam ||
    Team.saveTeamForMode ||
    Team.setModeTeam ||
    Team.setTeamMode;

  if (!fn) {
    console.warn("[TeamBuilder] No setTeam function found in team.builder.state.js");
    return;
  }

  // handle unknown parameter order
  try {
    if (fn.length === 1) return fn(ids);
    // try (mode, ids)
    fn(mode, ids);
  } catch (e1) {
    try {
      // try (ids, mode)
      fn(ids, mode);
    } catch (e2) {
      console.warn("[TeamBuilder] setTeam call failed", e1, e2);
    }
  }
}

function ensureTeamBuilderStyles() {
  if (document.getElementById("eeTeamBuilderStyles")) return;

  const s = document.createElement("style");
  s.id = "eeTeamBuilderStyles";
  s.textContent = `
  /* Scoped fixes so the Team Builder modal doesn't explode the screen */
  #modalHost.on .teamBuilderModal{
    max-height: calc(100vh - 220px);
    overflow-y: auto;
    padding-bottom: 4px;
  }

  #modalHost.on .teamBuilderHdr{display:flex; align-items:flex-start; justify-content:space-between; gap:12px;}
  #modalHost.on .teamBuilderHdr .h2{margin:0;}

  #modalHost.on .teamBuilderGrid{display:grid; grid-template-columns:1fr; gap:12px;}

  #modalHost.on .heroGrid{
    display:grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  @media (min-width: 520px){
    #modalHost.on .heroGrid{grid-template-columns: repeat(3, minmax(0, 1fr));}
  }

  #modalHost.on .heroTile{
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.10);
    background: rgba(10,12,22,.65);
    aspect-ratio: 4 / 5;
  }
  #modalHost.on .heroTileArt{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    object-fit: cover;
    display:block;
  }
  #modalHost.on .heroTileShade{
    position:absolute;
    inset:0;
    background:
      radial-gradient(120% 90% at 30% 10%, rgba(255,255,255,.08), transparent 55%),
      linear-gradient(180deg, transparent 35%, rgba(0,0,0,.75) 100%);
    pointer-events:none;
  }
  #modalHost.on .heroTileFooter{
    position:absolute;
    left:10px;
    right:10px;
    bottom:10px;
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:10px;
  }
  #modalHost.on .heroTileName{font-weight:900; line-height:1.05; text-shadow: 0 2px 14px rgba(0,0,0,.55);}
  #modalHost.on .heroTileMeta{font-size:12px; opacity:.75; margin-top:2px;}

  #modalHost.on .heroTile .btn{padding:8px 10px; border-radius:12px; font-size:12px;}

  #modalHost.on .heroLocked{
    position:absolute;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background: rgba(0,0,0,.55);
    font-weight:900;
    letter-spacing:.4px;
  }

  /* Key: roster scrolls INSIDE modal instead of growing the modal */
  #modalHost.on .rosterScroller{max-height: 44vh; overflow-y:auto; padding-right: 2px;}
  `;

  document.head.appendChild(s);
}

function heroById(id) {
  return (HEROES || []).find((h) => h.id === id) || null;
}

function heroName(id) {
  return heroById(id)?.name || id;
}

function heroPortraitSrc(id) {
  return `./assets/heroes/portraits/hero_${id}_p.png`;
}

function renderCurrentTeam(mode, team, max) {
  const rows = Array.from({ length: max }).map((_, i) => {
    const id = team[i] || null;
    if (!id) return `<div class="muted">Empty</div>`;

    return `
      <div class="spread" style="align-items:center;">
        <div class="muted"><b>${heroName(id)}</b></div>
        <button class="btn" data-remove="${id}">Remove</button>
      </div>
    `;
  });

  return `
    <div class="card">
      <div class="spread" style="align-items:flex-end;">
        <div>
          <div class="h2">Current Team</div>
          <div class="muted">Mode: <b>${MODE_LABELS[mode] || mode}</b> • Max ${max} • Locked heroes require story unlock</div>
        </div>
      </div>

      <div style="height:10px"></div>
      ${rows.join(`<div style="height:8px"></div>`)}

      <div style="height:12px"></div>
      <div class="row wrap">
        <button class="btn" data-clear>Clear</button>
        <button class="btn primary" data-save>Save Team</button>
      </div>
    </div>
  `;
}

function renderRoster(team, max) {
  const inTeam = new Set(team);
  const full = team.length >= max;

  const tiles = (HEROES || []).map((h) => {
    const unlocked = isUnlocked(h.id);
    const already = inTeam.has(h.id);
    const canAdd = unlocked && !already && !full;

    const btnLabel = already ? "Added" : (unlocked ? (full ? "Full" : "Add") : "Locked");

    return `
      <div class="heroTile">
        <img class="heroTileArt" src="${heroPortraitSrc(h.id)}" alt="${h.name}" loading="lazy" />
        <div class="heroTileShade"></div>

        ${unlocked ? "" : `<div class="heroLocked">LOCKED</div>`}

        <div class="heroTileFooter">
          <div style="min-width:0;">
            <div class="heroTileName">${h.name}</div>
            <div class="heroTileMeta">${unlocked ? "Unlocked" : "Story unlock"}</div>
          </div>
          <button class="btn ${canAdd ? "primary" : ""}" ${canAdd ? `data-add="${h.id}"` : "disabled"}>
            ${btnLabel}
          </button>
        </div>
      </div>
    `;
  });

  return `
    <div class="card">
      <div class="h2">Roster</div>
      <div class="muted">Tap Add to put a hero into your team.</div>
      <div style="height:10px"></div>
      <div class="rosterScroller">
        <div class="heroGrid">${tiles.join("")}</div>
      </div>
    </div>
  `;
}

function renderTeamBuilder(mode, team, max) {
  return `
    <div class="teamBuilderModal">
      <div class="teamBuilderHdr">
        <div>
          <div class="h2">Edit Team</div>
          <div class="muted">Mode: <b>${MODE_LABELS[mode] || mode}</b> • Max ${max} • Locked heroes require story unlock</div>
        </div>
        <button class="btn" data-close-top>Close</button>
      </div>

      <div class="teamBuilderGrid">
        ${renderCurrentTeam(mode, team, max)}
        ${renderRoster(team, max)}
      </div>

      <div class="row wrap" style="justify-content:flex-end;">
        <button class="btn" data-close>Close</button>
      </div>
    </div>
  `;
}

function normalizeArgs(arg) {
  const out = { mode: getActiveModeSafe(), onDone: null };

  if (typeof arg === "string") {
    out.mode = arg;
    return out;
  }
  if (typeof arg === "function") {
    out.onDone = arg;
    return out;
  }
  if (arg && typeof arg === "object") {
    if (arg.mode) out.mode = arg.mode;
    if (typeof arg.onDone === "function") out.onDone = arg.onDone;
    if (typeof arg.onClose === "function") out.onDone = arg.onClose;
  }
  return out;
}

export function openTeamBuilder(arg) {
  ensureTeamBuilderStyles();

  const { mode, onDone } = normalizeArgs(arg);
  const max = getMaxTeamSizeSafe(mode);

  let team = (getTeamForModeSafe(mode) || []).filter(Boolean);

  // Safety: remove any locked heroes if they somehow got in
  team = team.filter((id) => isUnlocked(id));

  openModal("Team Builder", renderTeamBuilder(mode, team, max));

  const host = document.getElementById("modalHost");

  function done(saved) {
    closeModal();
    try { onDone && onDone({ saved: !!saved, mode }); }
    catch (e) { console.warn("[TeamBuilder] onDone error", e); }
  }

  function rerender() {
    const body = host?.querySelector(".modalBody");
    if (!body) return;
    body.innerHTML = renderTeamBuilder(mode, team, max);
    bind();
  }

  function bind() {
    const root = host?.querySelector(".teamBuilderModal");
    if (!root) return;

    root.querySelector("[data-close]")?.addEventListener("click", () => done(false));
    root.querySelector("[data-close-top]")?.addEventListener("click", () => done(false));

    root.querySelector("[data-clear]")?.addEventListener("click", () => {
      team = [];
      rerender();
    });

    root.querySelector("[data-save]")?.addEventListener("click", () => {
      setTeamForModeSafe(mode, team);
      done(true);
    });

    root.querySelectorAll("button[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove");
        team = team.filter((x) => x !== id);
        rerender();
      });
    });

    root.querySelectorAll("button[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-add");
        if (!id) return;
        if (!isUnlocked(id)) return;
        if (team.includes(id)) return;
        if (team.length >= max) return;
        team = team.concat(id);
        rerender();
      });
    });
  }

  bind();
}
