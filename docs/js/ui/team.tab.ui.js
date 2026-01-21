import { HEROES } from "../heroes/heroes.data.js";
import { isUnlocked, getHeroLevel, getHeroXPProgress } from "../heroes/hero.progress.state.js";
import { openTeamBuilder } from "./team.builder.ui.js";
import { openHeroDetail } from "./hero.detail.ui.js";

function portraitSrc(heroId){
  return `./assets/heroes/portraits/hero_${heroId}_p.png`;
}

function initials(name){
  const base = (name||"").split(",")[0].trim();
  const parts = base.split(" ").filter(Boolean);
  const a = parts[0]?.[0] || "E";
  const b = parts[1]?.[0] || parts[0]?.[1] || "E";
  return (a+b).toUpperCase();
}

function elClass(element){
  const e = (element || "").toLowerCase();
  // expecting: fire/water/earth/wind
  if (["fire","water","earth","wind"].includes(e)) return e;
  return "";
}

function renderXPTile(heroId){
  const p = getHeroXPProgress(heroId);
  const pct = Math.round((p.frac||0)*100);

  // MAX
  if (!p.need){
    return `
      <div class="muted" style="margin-top:6px;">Lv ${getHeroLevel(heroId)} • MAX</div>
      <div class="progressBar heroTileBar" style="margin-top:6px;"><i style="width:100%"></i></div>
    `;
  }

  return `
    <div class="muted" style="margin-top:6px;">Lv ${p.level}</div>
    <div class="progressBar heroTileBar" style="margin-top:6px;"><i style="width:${pct}%"></i></div>
  `;
}

export function renderHeroes(){
  const heroes = [...HEROES].sort((a,b)=>{
    const ra = a.rarity === "SR" ? 1 : 0;
    const rb = b.rarity === "SR" ? 1 : 0;
    if (ra!==rb) return ra-rb;
    return (a.name||"").localeCompare(b.name||"");
  });

  return `
    <div class="card">
      <div class="spread">
        <div>
          <div class="h2">Roster</div>
          <div class="muted">Tap any hero tile to open <b>Info</b> (locked or unlocked). Use Team Builder to set your teams.</div>
        </div>
        <button class="btn" data-open-team-builder>Team Builder</button>
      </div>
    </div>

    <div style="height:12px"></div>

<div class="heroGrid">
  ${heroes.map(h => {
    const unlocked = isUnlocked(h.id);
    const e = elClass(h.element); // "fire" | "water" | "earth" | "wind"


    return `
      <div class="card heroTile heroTilePortrait ${unlocked ? "" : "heroLocked"} ${e}Glow"
           data-hero-info="${h.id}">
<img class="heroTile__img"
  data-hero-id="${h.id}"
  src="./assets/heroes/portraits/hero_${h.id}_p.png"
  alt=""
  loading="lazy"
  decoding="async"
  onerror="window.__heroImgFallback(this)">



        <div class="heroTile__shade"></div>

        <div class="heroTile__meta">
          <div class="heroTile__name">${h.name || "Unknown"}</div>
          <div class="heroTile__sub">${h.rarity} • ${h.element} • ${h.role}</div>
          ${unlocked ? renderXPTile(h.id) : ``}
        </div>

        ${unlocked ? `` : `
          <div class="heroTile__lock">
            <div class="heroTile__lockText">LOCKED</div>
          </div>
        `}
      </div>
    `;
  }).join("")}
</div>

  `;
}

export function wireHeroes(root){
  root.addEventListener("click", (e)=>{
    const tile = e.target.closest("[data-hero-info]");
    if (tile){
      openHeroDetail(tile.getAttribute("data-hero-info"));
      return;
    }
    const tb = e.target.closest("[data-open-team-builder]");
    if (tb){
      openTeamBuilder();
    }
  });
}
