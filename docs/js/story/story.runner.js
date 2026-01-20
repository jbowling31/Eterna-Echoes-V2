// File: docs/js/story/story.runner.js
import { openModal, closeModal } from "../ui/ui.modal.js";
import { CH01 } from "./chapters/ch01.steps.js";
import { HEROES } from "../heroes/heroes.data.js";
import { unlockHero, getHeroProg } from "../heroes/hero.progress.state.js";
import { startBattle } from "../battle/battle.ui.js";

// ============================================================
// Story Runner (Chapter Select + Fullscreen Pacing Overlay)
// - One beat at a time (tap to advance)
// - Chapters locked sequentially until prior chapter complete
// - Progress saved at SEGMENT level (not line). Leaving mid-segment restarts the segment.
// - Battles are requested via CustomEvent:  EE_STORY_REQUEST_BATTLE
//   Battle results should dispatch:         EE_STORY_BATTLE_RESULT  { battleId, won, canceled }
// ============================================================

const STORE_KEY = "EE_STORY_STATE_V1";

/** Unlocks are defined per chapter steps when possible:
 *   CH0X.unlocks = { start: string[], battles: Record<string,string[]> }
 *
 * Fallback exists so chapters without unlock data still work.
 * Chapter 1 should NOT unlock: nyxa, dorun, elya (they start in later chapters).
 */
const FALLBACK_CHAPTER_UNLOCKS = {
  ch01: {
    start: ["vireon"],
    battles: {
      // Prefer CH01.unlocks in steps. This fallback is only used if steps omit unlocks.
      ch01_b02_tidewake_rush: ["sirenia"],
      ch01_b03_gale_sweep: ["caelum"],
      ch01_b04_spore_beast_ambush: ["morgrin"],
      ch01_b05_mirror_mimics: ["thalor"],
      ch01_b06_shroud_nest_core: ["arlen"],
      ch01_b08_shroud_warden_boss: ["solen"],
    },
  },
};

const CHAPTER_ORDER = [
  "ch01",
  "ch02",
  "ch03",
  "ch04",
  "ch05",
  "ch06",
  "ch07",
  "ch08",
  "ch09",
  "ch10",
];

const CHAPTER_META = {
  ch01: { label: "CH01", title: "A Call Through the Ember" },
  ch02: { label: "CH02", title: "(Locked Placeholder)" },
  ch03: { label: "CH03", title: "(Locked Placeholder)" },
  ch04: { label: "CH04", title: "(Locked Placeholder)" },
  ch05: { label: "CH05", title: "(Locked Placeholder)" },
  ch06: { label: "CH06", title: "(Locked Placeholder)" },
  ch07: { label: "CH07", title: "(Locked Placeholder)" },
  ch08: { label: "CH08", title: "(Locked Placeholder)" },
  ch09: { label: "CH09", title: "(Locked Placeholder)" },
  ch10: { label: "CH10", title: "(Locked Placeholder)" },
};

const CHAPTER_DATA = {
  ch01: CH01,
  // ch02..ch10 later
};

function getUnlockSpec(chId) {
  const ch = CHAPTER_DATA?.[chId];
  const raw = ch?.unlocks || FALLBACK_CHAPTER_UNLOCKS?.[chId] || {};
  const start = Array.isArray(raw.start) ? raw.start : [];
  const battles = raw.battles && typeof raw.battles === "object" ? raw.battles : {};
  return { start, battles };
}

function applyChapterStartUnlocks(chId) {
  const { start } = getUnlockSpec(chId);
  if (!start?.length) return;
  start.forEach(unlockHero);
  window.EE_TICK?.();
}

function applyBattleUnlocks(chId, battleId) {
  const { battles } = getUnlockSpec(chId);
  const list = battles?.[battleId];
  if (!Array.isArray(list) || !list.length) return;
  list.forEach(unlockHero);
  window.EE_TICK?.();
}

/** Re-apply unlocks based on story progress (good for old saves / skips). */
function applyUnlocksFromProgress(chId) {
  const ch = CHAPTER_DATA?.[chId];
  if (!ch) return;

  const store = loadStore();
  const { start } = getUnlockSpec(chId);
  start.forEach(unlockHero);

  const order = linearizeSegments(ch);
  const progSeg = store.progress?.[chId] || ch.start;
  const idx = order.indexOf(progSeg);

  const upto = store.completed?.[chId] ? order.length : idx >= 0 ? idx : 0;

  for (let i = 0; i < upto; i++) {
    const seg = ch.segments?.[order[i]];
    for (const beat of seg?.beats || []) {
      if (beat?.t === "battle" && beat.battleId) {
        applyBattleUnlocks(chId, beat.battleId);
      }
    }
  }
}

/** Lock any heroes that are unlocked but not allowed by current story progress. */
function reconcileHeroUnlocksFromStoryState() {
  const store = loadStore();
  const allowed = new Set();

  for (const [chId, ch] of Object.entries(CHAPTER_DATA || {})) {
    const spec = getUnlockSpec(chId);

    const addAll = () => {
      for (const h of spec.start) allowed.add(h);
      for (const arr of Object.values(spec.battles || {})) {
        if (Array.isArray(arr)) for (const h of arr) allowed.add(h);
      }
    };

    if (store.completed?.[chId]) {
      addAll();
      continue;
    }

    const progSeg = store.progress?.[chId];
    if (!progSeg) continue;

    for (const h of spec.start) allowed.add(h);

    const order = linearizeSegments(ch);
    const idx = order.indexOf(progSeg);
    const upto = idx >= 0 ? idx : 0;

    for (let i = 0; i < upto; i++) {
      const seg = ch.segments?.[order[i]];
      for (const beat of seg?.beats || []) {
        if (beat?.t === "battle" && beat.battleId) {
          const list = spec.battles?.[beat.battleId];
          if (Array.isArray(list)) for (const h of list) allowed.add(h);
        }
      }
    }
  }

  for (const h of HEROES || []) {
    const p = getHeroProg(h.id);
    if (p?.unlocked && !allowed.has(h.id)) {
      p.unlocked = false;
    }
  }

  window.EE_TICK?.();
}

/**
 * Fix: don't re-open story overlay until Victory/Rewards finishes.
 *
 * Race: battle result event can fire BEFORE the modal opens.
 * We wait for modalHost to OPEN (within openWaitMs), then wait for it to CLOSE.
 * If no modal opens, we resume anyway after openWaitMs.
 */
function waitForModalOpenThenCloseThen(fn, { openWaitMs = 1200 } = {}) {
  const mh = document.getElementById("modalHost");
  if (!mh) {
    fn();
    return;
  }

  if (mh.classList.contains("on")) {
    const obsClose = new MutationObserver(() => {
      if (!mh.classList.contains("on")) {
        obsClose.disconnect();
        fn();
      }
    });
    obsClose.observe(mh, { attributes: true, attributeFilter: ["class"] });
    return;
  }

  let sawOpen = false;
  let done = false;

  const obs = new MutationObserver(() => {
    if (done) return;

    const isOn = mh.classList.contains("on");
    if (!sawOpen && isOn) {
      sawOpen = true;
      return;
    }
    if (sawOpen && !isOn) {
      done = true;
      obs.disconnect();
      fn();
    }
  });

  obs.observe(mh, { attributes: true, attributeFilter: ["class"] });

  window.setTimeout(() => {
    if (done) return;
    if (!sawOpen) {
      done = true;
      obs.disconnect();
      fn();
    }
  }, openWaitMs);
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function isJunkStoryLine(s) {
  const t = String(s || "").trim();
  if (!t) return true;

  if (/^(✅|🎼|🧿|🎁|🎭)\s*/.test(t)) return true;
  if (/^(Version|Notes)\s*:/i.test(t)) return true;
  if (/IMPLEMENTATION PACKAGE/i.test(t)) return true;
  if (/^(SCENE BACKGROUNDS|BATTLE PACK|UNLOCKS|CHOICES)/i.test(t)) return true;

  if (/^(Cutscene Dialogue|Full Dialogue Sequence)\s*:?\s*$/i.test(t)) return true;

  if (/^(Title|Enemies|Tag|Waves|Rewards|Special|Gimmick|Phases)\s*:/i.test(t)) return true;

  if (/^(bg_[a-z0-9_]+|ms_[a-z0-9_]+)$/i.test(t)) return true;

  return false;
}

function defaultStore() {
  return {
    completed: {},
    progress: {},
    flags: {},
    battleWins: {},
  };
}

function loadStore() {
  const raw = localStorage.getItem(STORE_KEY);
  const base = defaultStore();
  if (!raw) return base;
  const s = safeParse(raw, base);
  s.completed = s.completed && typeof s.completed === "object" ? s.completed : {};
  s.progress = s.progress && typeof s.progress === "object" ? s.progress : {};
  s.flags = s.flags && typeof s.flags === "object" ? s.flags : {};
  s.battleWins = s.battleWins && typeof s.battleWins === "object" ? s.battleWins : {};
  return s;
}

function saveStore(s) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

function isLocked(chId) {
  if (chId === "ch01") return false;
  const idx = CHAPTER_ORDER.indexOf(chId);
  const prev = idx > 0 ? CHAPTER_ORDER[idx - 1] : null;
  if (!prev) return false;
  const store = loadStore();
  return !store.completed?.[prev];
}

// ------------------------------------------------------------
// Overlay UI
// ------------------------------------------------------------
let mounted = false;
let hostEl = null;
let overlayEl = null;
let ui = null;

const run = {
  chapterId: null,
  segmentId: null,
  beatIndex: 0,
  waitingBattleId: null,
};

function ensureStyle() {
  if (document.getElementById("eeStoryStyles")) return;
  const s = document.createElement("style");
  s.id = "eeStoryStyles";
  s.textContent = `
  .eeStoryOverlay{position:fixed; inset:0; z-index:9999; display:none;}
  .eeStoryOverlay.on{display:block;}
  .eeStoryBg{position:absolute; inset:0; background-size:cover; background-position:center; filter:saturate(1.05) contrast(1.05);}
  .eeStoryShade{position:absolute; inset:0; background: radial-gradient(120% 80% at 50% 20%, rgba(0,0,0,.05), rgba(0,0,0,.55) 70%);}

  .eeStoryTop{position:absolute; top:10px; left:10px; right:10px; display:flex; align-items:center; justify-content:space-between; gap:10px;}
  .eeStoryTop .eeStoryTitle{flex:1; text-align:center; font-weight:800; letter-spacing:.3px; text-shadow:0 2px 14px rgba(0,0,0,.55);}

  .eeStoryDlgWrap{position:absolute; left:12px; right:12px; bottom:14px; display:flex; gap:12px; align-items:flex-end;}

  .eeStoryPortrait{width:92px; height:116px; border-radius:16px; overflow:hidden; flex:0 0 auto;
    border:1px solid rgba(255,255,255,.14);
    background: rgba(10,12,22,.55);
    box-shadow: 0 10px 26px rgba(0,0,0,.35);
  }
  .eeStoryPortrait img{width:100%; height:100%; object-fit:cover; display:block;}
  .eeStoryPortrait .eeStoryPortraitFallback{display:flex; align-items:center; justify-content:center; height:100%; font-weight:900; opacity:.65;}

  .eeStoryDlg{flex:1; min-height:116px; border-radius:18px; padding:14px 14px 12px;
    border:1px solid rgba(255,255,255,.14);
    background: rgba(10,12,22,.70);
    backdrop-filter: blur(10px);
    box-shadow: 0 12px 28px rgba(0,0,0,.45);
  }
  .eeStorySpeaker{font-weight:900; letter-spacing:.4px;}
  .eeStoryText{margin-top:6px; line-height:1.35; font-size:15px; white-space:pre-wrap;}
  .eeStoryText.inner{opacity:.92; font-style:italic;}
  .eeStoryHint{margin-top:10px; font-size:12px; opacity:.65;}

  .eeStoryChoice{margin-top:12px; display:flex; flex-direction:column; gap:10px;}
  .eeStoryChoice .btn{width:100%; text-align:left; justify-content:flex-start;}

  .eeStoryBattle{margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;}

  .eeStoryOverlay .btn{cursor:pointer; border-radius:14px; padding:10px 12px; border:1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.06); color: inherit; font-weight:800; display:inline-flex; align-items:center; justify-content:center; gap:8px;}
  .eeStoryOverlay .btn.primary{background: rgba(122,162,255,.18); border-color: rgba(122,162,255,.35);}
  .eeStoryOverlay .btn.tiny{padding:8px 10px; border-radius:12px; font-size:12px;}
  `;
  document.head.appendChild(s);
}

function ensureOverlay() {
  if (overlayEl) return;
  ensureStyle();

  overlayEl = document.createElement("div");
  overlayEl.className = "eeStoryOverlay";
  overlayEl.id = "eeStoryOverlay";
  overlayEl.innerHTML = `
    <div class="eeStoryBg" id="eeStoryBg"></div>
    <div class="eeStoryShade"></div>

    <div class="eeStoryTop">
      <button class="btn tiny" data-story-back>Back</button>
      <div class="eeStoryTitle" id="eeStoryTitle"></div>
      <button class="btn tiny" data-story-skip>Skip</button>
    </div>

    <div class="eeStoryDlgWrap">
      <div class="eeStoryPortrait" id="eeStoryPortrait">
        <div class="eeStoryPortraitFallback">YOU</div>
      </div>
      <div class="eeStoryDlg" id="eeStoryDlg">
        <div class="eeStorySpeaker" id="eeStorySpeaker"></div>
        <div class="eeStoryText" id="eeStoryText"></div>
        <div class="eeStoryChoice" id="eeStoryChoice" style="display:none"></div>
        <div class="eeStoryBattle" id="eeStoryBattle" style="display:none"></div>
        <div class="eeStoryHint" id="eeStoryHint">Tap to continue</div>
      </div>
    </div>
  `;

  document.body.appendChild(overlayEl);

  ui = {
    bg: overlayEl.querySelector("#eeStoryBg"),
    title: overlayEl.querySelector("#eeStoryTitle"),
    portrait: overlayEl.querySelector("#eeStoryPortrait"),
    speaker: overlayEl.querySelector("#eeStorySpeaker"),
    text: overlayEl.querySelector("#eeStoryText"),
    hint: overlayEl.querySelector("#eeStoryHint"),
    choice: overlayEl.querySelector("#eeStoryChoice"),
    battle: overlayEl.querySelector("#eeStoryBattle"),
    btnBack: overlayEl.querySelector("[data-story-back]"),
    btnSkip: overlayEl.querySelector("[data-story-skip]"),
  };

  overlayEl.addEventListener("pointerup", (e) => {
    if (!overlayEl.classList.contains("on")) return;
    if (e.target.closest("button")) return;
    const beat = getBeat();
    if (!beat) return;
    if (beat.t === "line") nextBeat();
  });

  ui.btnBack.addEventListener("click", () => exitStory());
  ui.btnSkip.addEventListener("click", () => openSkipMenu());
}

function showOverlay(on) {
  ensureOverlay();
  overlayEl.classList.toggle("on", !!on);
  document.body.style.overflow = on ? "hidden" : "";
}

function bgCss(bgId) {
  if (!bgId) return "";
  let base = window.__EE_STORY_BG_DIR || "./assets/bg/";
  if (!base.endsWith("/")) base += "/";
  return "url(" + base + bgId + ".png)";
}

function portraitHtmlFor(spec) {
  if (!spec) return "";
  const s = String(spec);

  if (s.startsWith("hero:")) {
    const id = s.slice(5);
    if (id === "player" || id === "you") {
      return `<div class="eeStoryPortraitFallback">YOU</div>`;
    }
    const src = `./assets/heroes/portraits/hero_${id}_p.png`;
    const fallback = (id || "").slice(0, 3).toUpperCase() || "YOU";
    const onerr = `this.onerror=null;const p=this.parentElement;if(p){p.innerHTML='<div class=\\'eeStoryPortraitFallback\\'>${fallback}</div>';}`;
    return `<img src="${src}" alt="${id}" onerror="${onerr}">`;
  }

  if (s.startsWith("enemy:")) {
    const id = s.slice(6);
    const srcA = `./assets/enemies/portraits/enemy_${id}_p.png`;
    const srcB = `./assets/story/enemies/enemy_${id}_p.png`;
    const onerr = `this.onerror=null; if (this.src.includes('/assets/enemies/portraits/')) { this.src='${srcB}'; return; } const p=this.parentElement; if(p){p.innerHTML='<div class=\\'eeStoryPortraitFallback\\'>ENEMY</div>';}`;
    return `<img src="${srcA}" alt="${id}" onerror="${onerr}">`;
  }

  if (s.startsWith("./") || s.startsWith("assets/")) {
    const onerr = `this.onerror=null;const p=this.parentElement;if(p){p.innerHTML='<div class=\\'eeStoryPortraitFallback\\'>---</div>';}`;
    return `<img src="${s}" alt="portrait" onerror="${onerr}">`;
  }

  return "";
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------
export function mountStory(hostIdOrEl) {
  hostEl = typeof hostIdOrEl === "string" ? document.getElementById(hostIdOrEl) : hostIdOrEl;
  ensureOverlay();

  if (!mounted) {
    mounted = true;

    reconcileHeroUnlocksFromStoryState();

    const handleBattleResultDetail = (d) => {
      const payload = d || {};
      if (!payload.battleId) return;
      if (!run.waitingBattleId || payload.battleId !== run.waitingBattleId) return;

      const chId = run.chapterId;
      const segNow = getSegment();
      const beatNow = getBeat();

      if (payload.won) {
        applyBattleUnlocks(chId, payload.battleId);

        if (segNow?.next) setProgressSegment(chId, segNow.next);


        run.waitingBattleId = null;

        waitForModalOpenThenCloseThen(() => {
          showOverlay(true);
          if (beatNow?.t === "battle") nextBeat();
          else render();
        });

        return;
      }

      if (payload.canceled || payload.aborted || payload.won === false) {
        run.waitingBattleId = null;
        waitForModalOpenThenCloseThen(() => {
          showOverlay(true);
          render();
        });
      }
    };

    // Legacy / external battle screen contract
    window.addEventListener("EE_STORY_BATTLE_RESULT", (ev) => {
      handleBattleResultDetail(ev?.detail || {});
    });

    // Direct battle UI contract (battle.ui.js can dispatch this)
    window.addEventListener("EE_BATTLE_RESOLVED", (ev) => {
      const raw = ev?.detail || {};
      const battleId = raw.battleId;
      const r = raw.result || {};
      const d = { battleId };

      if (typeof r.won === "boolean") d.won = r.won;
      else if (r.winner === "heroes") d.won = true;
      else if (r.winner === "enemies") d.won = false;
      else if (r.canceled || r.aborted) d.canceled = true;
      else d.canceled = true;

      handleBattleResultDetail(d);
    });

  }
}

function linearizeSegments(ch) {
  const out = [];
  const seen = new Set();
  let cur = ch?.start || null;

  while (cur && !seen.has(cur)) {
    seen.add(cur);
    out.push(cur);
    const seg = ch.segments?.[cur];
    cur = seg?.next || null;
  }

  if (!out.length) {
    return Object.keys(ch?.segments || {});
  }
  return out;
}

function progressIndexFor(order, progId) {
  const i = order.indexOf(progId);
  return i >= 0 ? i : 0;
}

export function openChapterSelect() {
  ensureOverlay();

  const store = loadStore();

  const modalStyles = `
    <style>
      details.eeCh{border:1px solid rgba(255,255,255,.10); border-radius:16px; padding:12px; background: rgba(10,12,22,.55);}
      details.eeCh + details.eeCh{margin-top:10px;}
      details.eeCh > summary{list-style:none; cursor:pointer;}
      details.eeCh > summary::-webkit-details-marker{display:none;}
      .eeChHdr{display:flex; align-items:flex-start; justify-content:space-between; gap:10px;}
      .eeChHdr .h2{margin:0;}
      .eeSegRow{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 10px; border-radius:14px; border:1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03);}
      .eeSegRow + .eeSegRow{margin-top:8px;}
      .eeSegLeft{min-width:0;}
      .eeSegTitle{font-weight:900;}
      .eeSegSub{opacity:.7; font-size:12px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
      .eeSegBtns{display:flex; gap:8px; flex:0 0 auto;}
      .eeSegBtns .btn{white-space:nowrap;}
    </style>
  `;

  const rows = CHAPTER_ORDER
    .map((chId) => {
      const meta = CHAPTER_META[chId] || { label: chId.toUpperCase(), title: "" };
      const locked = isLocked(chId);
      const done = !!store.completed?.[chId];
      const prog = store.progress?.[chId];

      const right = done
        ? `<span class="pill gold">COMPLETE</span>`
        : locked
          ? `<span class="pill">LOCKED</span>`
          : `<span class="pill">UNLOCKED</span>`;

      const ch = CHAPTER_DATA[chId];

      if (!ch) {
        return `
        <details class="eeCh" ${chId === "ch01" ? "open" : ""}>
          <summary>
            <div class="eeChHdr">
              <div>
                <div class="h2">${meta.label} <span class="muted" style="font-weight:700;">• ${meta.title}</span></div>
                <div class="muted">${prog ? `Resume at <b>${prog}</b>` : "Not started"}</div>
              </div>
              ${right}
            </div>
          </summary>
          <div style="height:10px"></div>
          <div class="muted">${locked ? "Locked. Complete the prior chapter first." : "Chapter steps not wired yet."}</div>
        </details>
      `;
      }

      const order = linearizeSegments(ch);
      const progSeg = prog || ch.start;
      const unlockedIdx = done ? order.length - 1 : progressIndexFor(order, progSeg);

      const segRows = order
        .map((segId, i) => {
          const seg = ch.segments?.[segId];
          const segTitle = seg?.title || "";
          const isUnlockedSeg = !locked && (done || i <= unlockedIdx);
          const isCurrent = segId === progSeg && !done;

          const segPill = done
            ? `<span class="pill gold">OK</span>`
            : isUnlockedSeg
              ? `<span class="pill">UNLOCKED</span>`
              : `<span class="pill">LOCKED</span>`;

          const btn = isUnlockedSeg
            ? `<button class="btn ${isCurrent ? "primary" : ""}" data-ch="${chId}" data-seg="${segId}">${isCurrent ? "Resume" : "Start"}</button>`
            : `<button class="btn" disabled>Locked</button>`;

          return `
        <div class="eeSegRow">
          <div class="eeSegLeft">
            <div class="eeSegTitle">${segId}</div>
            <div class="eeSegSub">${segTitle}</div>
          </div>
          <div class="eeSegBtns">
            ${segPill}
            ${btn}
          </div>
        </div>
      `;
        })
        .join("");

      return `
      <details class="eeCh" ${chId === "ch01" ? "open" : ""}>
        <summary>
          <div class="eeChHdr">
            <div>
              <div class="h2">${meta.label} <span class="muted" style="font-weight:700;">• ${meta.title}</span></div>
              <div class="muted">${prog ? `Resume at <b>${prog}</b>` : "Not started"} • Tap to expand sections</div>
            </div>
            ${right}
          </div>
        </summary>
        <div style="height:12px"></div>
        ${locked ? `<div class="muted">Locked. Complete the prior chapter first.</div>` : segRows}
      </details>
    `;
    })
    .join("");

  openModal(
    "Story Chapters",
    `
    ${modalStyles}
    <div class="card">
      <div class="h2">Choose a Chapter</div>
      <div class="muted">Tap a chapter to drop down sections. Locked sections stay visible.</div>
    </div>
    <div style="height:12px"></div>
    ${rows}
    <div style="height:12px"></div>
    <div class="row wrap">
      <button class="btn" data-close>Close</button>
    </div>
  `,
  );

  const mh = document.getElementById("modalHost");
  mh?.querySelector("[data-close]")?.addEventListener("click", closeModal);

  mh?.querySelectorAll("button[data-ch][data-seg]")?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chId = btn.getAttribute("data-ch");
      const segId = btn.getAttribute("data-seg");
      if (!chId || !segId) return;
      if (isLocked(chId)) return;
      closeModal();
      resumeOrStartStory(chId, segId);
    });
  });
}

export function resumeOrStartStory(chId = "ch01", segOverride = null) {
  const ch = CHAPTER_DATA[chId];
  if (!ch) {
    openModal(
      "Not ready",
      `<div class="card"><div class="muted">${CHAPTER_META[chId]?.label || chId} isn't wired yet.</div></div>`,
    );
    return;
  }

  applyChapterStartUnlocks(chId);
  applyUnlocksFromProgress(chId);
  reconcileHeroUnlocksFromStoryState();

  const store = loadStore();
  const seg = segOverride || store.progress?.[chId] || ch.start;

  run.chapterId = chId;
  run.segmentId = seg;
  run.beatIndex = 0;
  run.waitingBattleId = null;

  showOverlay(true);
  render();
}

// ------------------------------------------------------------
// Core stepping
// ------------------------------------------------------------
function getChapter() {
  return CHAPTER_DATA[run.chapterId] || null;
}

function getSegment() {
  const ch = getChapter();
  if (!ch) return null;
  return ch.segments?.[run.segmentId] || null;
}

function getBeat() {
  const seg = getSegment();
  if (!seg) return null;
  return seg.beats?.[run.beatIndex] || null;
}

function setProgressSegment(chId, segId) {
  const s = loadStore();
  s.progress ||= {};

  const ch = CHAPTER_DATA?.[chId];
  if (!ch) {
    s.progress[chId] = segId;
    saveStore(s);
    return;
  }

  const order = linearizeSegments(ch);
  const cur = s.progress[chId] || ch.start;
  const curIdx = order.indexOf(cur);
  const newIdx = order.indexOf(segId);

  if (newIdx < 0) {
    s.progress[chId] = segId;
    saveStore(s);
    return;
  }

  if (curIdx < 0 || newIdx >= curIdx) {
    s.progress[chId] = segId;
    saveStore(s);
  }
}

function setFlag(chId, key, value) {
  const s = loadStore();
  s.flags[chId] = s.flags[chId] || {};
  s.flags[chId][key] = value;
  saveStore(s);
}

function getFlag(chId, key) {
  const s = loadStore();
  return s.flags?.[chId]?.[key];
}

function markChapterComplete(chId) {
  const s = loadStore();
  s.completed[chId] = true;
  saveStore(s);
}

function exitStory() {
  run.waitingBattleId = null;
  showOverlay(false);
}

function nextBeat() {
  const seg = getSegment();
  if (!seg) return;

  if (run.waitingBattleId) return;

  run.beatIndex++;
  if (run.beatIndex < (seg.beats?.length || 0)) {
    render();
    return;
  }

  const next = seg.next;
  if (next) {
    run.segmentId = next;
    run.beatIndex = 0;
    setProgressSegment(run.chapterId, next);
    render();
    return;
  }

  showChapterComplete();
}

function showChapterComplete() {
  const chId = run.chapterId;
  const meta = CHAPTER_META[chId];
  markChapterComplete(chId);

  ui.title.textContent = `${meta?.label || chId.toUpperCase()} COMPLETE`;
  ui.bg.style.backgroundImage = bgCss(getSegment()?.bg);

  ui.speaker.textContent = "SYSTEM";
  ui.text.classList.remove("inner");
  ui.text.textContent = "Chapter complete. Next chapter unlocks after you leave this screen.";

  ui.choice.style.display = "none";
  ui.battle.style.display = "flex";
  ui.battle.innerHTML = `
    <button class="btn primary" data-exit>Back to Battle</button>
    <button class="btn" data-chapters>Chapter Select</button>
  `;
  ui.hint.textContent = "";
  ui.portrait.innerHTML = `<div class="eeStoryPortraitFallback">OK</div>`;

  ui.battle.querySelector("[data-exit]")?.addEventListener("click", () => exitStory());
  ui.battle.querySelector("[data-chapters]")?.addEventListener("click", () => openChapterSelect());
}

function openSkipMenu() {
  openModal(
    "Skip",
    `
    <div class="card">
      <div class="h2">Skip Options</div>
      <div class="muted">Skip is for people who want to jump to the next fight or the finale.</div>
    </div>
    <div style="height:12px"></div>
    <div class="row wrap">
      <button class="btn" data-skip-next>Skip to next battle</button>
      <button class="btn primary" data-skip-end>Skip to final battle</button>
      <button class="btn" data-close>Close</button>
    </div>
    <div style="height:10px"></div>
    <div class="muted">Note: skipping jumps within the story, but still requires winning the battle to count as complete.</div>
  `,
  );

  const mh = document.getElementById("modalHost");
  mh?.querySelector("[data-close]")?.addEventListener("click", closeModal);
  mh?.querySelector("[data-skip-next]")?.addEventListener("click", () => {
    closeModal();
    skipToNextBattle();
  });
  mh?.querySelector("[data-skip-end]")?.addEventListener("click", () => {
    closeModal();
    skipToFinalBattle();
  });
}

function skipToNextBattle() {
  const ch = getChapter();
  if (!ch) return;

  let segId = run.segmentId;
  let idx = run.beatIndex;

  while (segId) {
    const seg = ch.segments?.[segId];
    if (!seg) break;
    for (let i = idx; i < (seg.beats?.length || 0); i++) {
      const b = seg.beats[i];
      if (b && b.t === "battle") {
        run.segmentId = segId;
        run.beatIndex = i;
        setProgressSegment(run.chapterId, segId);
        render();
        return;
      }
    }
    segId = seg.next;
    idx = 0;
  }

  openModal("No battle found", `<div class="card"><div class="muted">No upcoming battle was found in this chapter.</div></div>`);
}

function skipToFinalBattle() {
  const ch = getChapter();
  if (!ch) return;
  const targetId = ch.completeOnBattleId;
  if (!targetId) return;

  for (const [segId, seg] of Object.entries(ch.segments || {})) {
    const beats = seg.beats || [];
    const i = beats.findIndex((b) => b.t === "battle" && b.battleId === targetId);
    if (i >= 0) {
      run.segmentId = segId;
      run.beatIndex = i;
      setProgressSegment(run.chapterId, segId);
      render();
      return;
    }
  }

  openModal("Not found", `<div class="card"><div class="muted">Final battle not found in step data.</div></div>`);
}

function requestBattle(battleId) {
  run.waitingBattleId = battleId;

  // Hide pacing overlay while the battle UI takes over.
  showOverlay(false);

  // Preferred: call the local battle UI directly.
  let started = false;
  try {
    if (typeof startBattle === "function") {
      startBattle(battleId);
      started = true;

      // Optional: broadcast that the story started a battle (non-starting event).
      window.dispatchEvent(
        new CustomEvent("EE_STORY_BATTLE_STARTED", {
          detail: {
            chapterId: run.chapterId,
            segmentId: run.segmentId,
            battleId,
          },
        }),
      );
    }
  } catch (err) {
    console.warn("[STORY] startBattle failed; falling back to EE_STORY_REQUEST_BATTLE", err);
  }

  // Fallback: keep old contract for any external battle screen handler.
  if (!started) {
    window.dispatchEvent(
      new CustomEvent("EE_STORY_REQUEST_BATTLE", {
        detail: {
          chapterId: run.chapterId,
          segmentId: run.segmentId,
          battleId,
        },
      }),
    );
  }
}


function render() {
  const chId = run.chapterId;
  const ch = getChapter();
  const seg = getSegment();
  let beat = getBeat();
  if (!ch || !seg || !beat) return;

  if (run.beatIndex === 0) setProgressSegment(chId, run.segmentId);

  while (beat && beat.t === "line" && isJunkStoryLine(beat.text)) {
    run.beatIndex++;
    beat = getBeat();
  }
  if (!beat) return;

  const meta = CHAPTER_META[chId];
  ui.title.textContent = `${meta?.label || chId.toUpperCase()} • ${run.segmentId}`;
  ui.bg.style.backgroundImage = bgCss(seg.bg);

  ui.choice.style.display = "none";
  ui.choice.innerHTML = "";
  ui.battle.style.display = "none";
  ui.battle.innerHTML = "";

  ui.hint.textContent = beat.t === "line" ? "Tap to continue" : "";

  if (beat.t === "line") {
    const txt = beat.text || "";
    if (isJunkStoryLine(txt)) {
      nextBeat();
      return;
    }

    ui.speaker.textContent = beat.speaker || "";
    ui.text.textContent = txt;

    const isInner = !!beat.meta?.inner;
    ui.text.classList.toggle("inner", isInner);

    ui.portrait.innerHTML = portraitHtmlFor(beat.portrait);
    return;
  }

  if (beat.t === "choice") {
    ui.speaker.textContent = beat.speaker || "PLAYER";
    ui.text.classList.remove("inner");
    ui.text.textContent = beat.prompt || "Choose:";
    ui.portrait.innerHTML = portraitHtmlFor(beat.portrait || "hero:player");

    ui.choice.style.display = "flex";
    const chosen = getFlag(chId, beat.id);

    ui.choice.innerHTML = (beat.options || [])
      .map((opt) => {
        const picked = chosen === opt.value;
        return `<button class="btn ${picked ? "primary" : ""}" data-opt="${opt.value}">${opt.label}</button>`;
      })
      .join("");

    ui.choice.querySelectorAll("button[data-opt]")?.forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-opt");
        setFlag(chId, beat.id, v);
        nextBeat();
      });
    });
    return;
  }

  if (beat.t === "battle") {
    ui.speaker.textContent = "BATTLE";
    ui.text.classList.remove("inner");
    ui.text.textContent = beat.title || "Battle";
    ui.portrait.innerHTML = portraitHtmlFor(beat.portrait || null);

    ui.battle.style.display = "flex";
    ui.battle.innerHTML = `<button class="btn primary" data-start-battle>Start Battle</button>`;
    ui.battle.querySelector("[data-start-battle]")?.addEventListener("click", () => {
      requestBattle(beat.battleId);
      ui.hint.textContent = "Battle in progress...";
    });
  }
}
