// docs/js/ui/heroTile.ui.js
const esc = (s="") => String(s)
  .replaceAll("&","&amp;").replaceAll("<","&lt;")
  .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");

export function heroTileHTML(hero, {
  variant = "roster",     // "roster" | "team" | "picker"
  locked = false,
  selected = false,
  levelText = "",
  subText = "",           // e.g. "Fire • Tank" or "SR • Wind"
  onClickAction = "heroInfo" // what your input handler expects
} = {}) {
  const id = hero?.id ?? "";
  const name = hero?.name ?? "Unknown";


  const cls = [
    "heroTile",
    variant ? `heroTile--${variant}` : "",
    locked ? "isLocked" : "",
    selected ? "isSelected" : ""
  ].filter(Boolean).join(" ");

  return `
    <button class="${cls}"
      type="button"
      data-hero-id="${esc(id)}"
      data-action="${esc(onClickAction)}"
      aria-label="${esc(name)}"
    >
<img class="heroTile__img"
  data-hero-id="${h.id}"
  src="./assets/heroes/portraits/hero_${h.id}_p.png"
  alt=""
  loading="lazy"
  decoding="async"
  onerror="window.__heroImgFallback(this)">


      />

      <div class="heroTile__shade"></div>

      <div class="heroTile__meta">
        <div class="heroTile__name">${esc(name)}</div>
        ${subText ? `<div class="heroTile__sub">${esc(subText)}</div>` : ``}
      </div>

      ${levelText ? `<div class="heroTile__badge">${esc(levelText)}</div>` : ``}

      ${locked ? `
        <div class="heroTile__lock">
          <div class="heroTile__lockText">LOCKED</div>
        </div>
      ` : ``}
    </button>
  `;
}
