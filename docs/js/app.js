import { wireToasts } from "./ui/ui.toast.js";
import { renderApp } from "./ui/ui.root.js";
import { go } from "./ui/ui.router.js";
import { renderTopStats } from "./ui/ui.topstats.js";
import { seedStarters, heroProgressState, getHeroProg } from "./heroes/hero.progress.state.js";
import { seedStarterGear, gearInventoryState, getGearDef } from "./gear/gear.inventory.state.js";
import { loadState, saveState } from "./storage.js";
import { goldState } from "./economy/gold.state.js";
import { energyState } from "./economy/energy.state.js";
import { accountXPState } from "./economy/xp.account.state.js";
import { materialsState } from "./economy/materials.state.js";
import { GEAR_CATALOG } from "./gear/gear.catalog.data.js";
import { equipItem } from "./gear/gear.equip.logic.js";
import { openGearPicker } from "./ui/gear.picker.ui.js";
import { openHeroDetail } from "./ui/hero.detail.ui.js";
import { loginCalendarState, hydrateLoginCalendarState, serializeLoginCalendarState } from "./logincalendar/logincalendar.state.js";
import { tasksState, hydrateTasksState, serializeTasksState } from "./tasks/tasks.state.js";
import { seasonPassState, hydrateSeasonPassState, serializeSeasonPassState } from "./seasonpass/seasonpass.state.js";
import { applyBadges } from "./notifications/badges.logic.js";

wireToasts();
window.__EE_GEAR_IDS = GEAR_CATALOG.map(g=>g.id);
window.__EE_GET_GEAR_DEF = (id)=>getGearDef(id);
// Global image fallback helper
window.__heroImgFallback = function(imgEl){
  const id = imgEl?.dataset?.heroId || "";
  const candidates = [
    `./assets/heroes/portraits/hero_${id}_p.png`,
    `./assets/heroes/portraits/hero_${id}_p.webp`,
    `./assets/heroes/portraits/hero_${id}_p.jpg`,
    `./assets/heroes/portraits/hero_${id}_p.jpeg`,
  ];

  const tried = (imgEl.dataset.tried || "").split("|").filter(Boolean);

  for (const url of candidates){
    if (tried.includes(url)) continue;
    tried.push(url);
    imgEl.dataset.tried = tried.join("|");
    imgEl.src = url;
    return;
  }

  imgEl.onerror = null;
  imgEl.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
};


window.addEventListener('EE_GEAR_EQUIP_FLOW', (ev)=>{
  const { heroId, slot } = ev.detail || {};
  openGearPicker({ heroId, slot, onPick:(iid)=>{
    const inv = gearInventoryState.items.find(x=>x.iid===iid);
    if (!inv) return;
    equipItem(heroId, iid, slot);
    openHeroDetail(heroId);
    tick();
  }});
});

const main = document.getElementById('main');
const navEl = document.getElementById('bottomNav');

/**
 * LOCKED BACKGROUND (only changes when TAB changes)
 * Put your background images directly under /docs as:
 *   bg_home.png, bg_heroes.png, bg_battle.png, bg_shop.png, bg_more.png
 * If you later move them, just update these paths.
 */
const TAB_BG = {
  home:   "./assets/bg/bg_home.png",
  heroes: "./assets/bg/bg_heroes.png",
  battle: "./assets/bg/bg_battle.png",
  shop:   "./assets/bg/bg_shop.png",
  more:   "./assets/bg/bg_more.png",
};

let currentBgKey = null;

function setTabBackground(tabKey){
  if (tabKey === currentBgKey) return; // prevents changing “all the time”
  currentBgKey = tabKey;

  const bg = document.getElementById("bgLayer");
  if (!bg) return; // if you haven’t added #bgLayer yet, this will safely do nothing
  const url = TAB_BG[tabKey] || TAB_BG.home;
  bg.style.backgroundImage = `url("${url}")`;
}

function getActiveTab(){
  return (document.querySelector('.tabBtn.active')?.dataset.tab) || 'home';
}

function setActive(tab){
  if (!navEl) return;
  navEl.querySelectorAll('.tabBtn').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab===tab);
  });
}

function nav(tab){
  go(tab);
  setActive(tab);
  setTabBackground(tab);
  tick();
  persist();
}

function tick(){
  renderApp(main, nav);
  renderTopStats();
}
window.EE_TICK = tick;

function hydrate(){
  seedStarters();
  seedStarterGear();
  const s = loadState();
window.state = s;
  if (!s) return;
const se = s.energyState || {};
energyState.cur = se.cur ?? se.current ?? energyState.cur;
energyState.max = se.max ?? energyState.max;
energyState.lastRegenAt = se.lastRegenAt ?? energyState.lastRegenAt;

  try{
    goldState.gold = s.goldState?.gold ?? goldState.gold;
    energyState.cur = s.energyState?.cur ?? energyState.cur;
    energyState.max = s.energyState?.max ?? energyState.max;
    accountXPState.level = s.accountXPState?.level ?? accountXPState.level;
    accountXPState.xp = s.accountXPState?.xp ?? accountXPState.xp;
    materialsState.skillTomes = s.materialsState?.skillTomes ?? materialsState.skillTomes;

    if (s.gearInventoryState?.items) gearInventoryState.items = s.gearInventoryState.items;
    if (Array.isArray(s.heroesById)) heroProgressState.byId = new Map(s.heroesById);

    hydrateLoginCalendarState(s.loginCalendarState);
    hydrateTasksState(s.tasksState);
    hydrateSeasonPassState(s.seasonPassState);

    applyBadges(document);

    // Restore last tab (and keep UI + bg in sync)
    if (s.tab){
      go(s.tab);
      setActive(s.tab);
      setTabBackground(s.tab);
    }
  }catch(e){
    console.warn(e);
  }
}

function persist(){
  saveState({
    goldState, energyState, accountXPState, materialsState,
    gearInventoryState,
    heroesById: Array.from(heroProgressState.byId.entries()),

    loginCalendarState: serializeLoginCalendarState(),
    tasksState: serializeTasksState(),
    seasonPassState: serializeSeasonPassState(),

    tab: getActiveTab()
  });
}

if (navEl){
  navEl.addEventListener('click', (e)=>{
    const b = e.target.closest('button[data-tab]');
    if (!b) return;
    nav(b.dataset.tab);
  });
}

hydrate();

// Ensure we always have a consistent initial state (UI + BG)
const initialTab = getActiveTab();
setActive(initialTab);
setTabBackground(initialTab);

tick();
setInterval(persist, 6000);
