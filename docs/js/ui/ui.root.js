// docs/js/ui/ui.root.js
import { routerState } from "./ui.router.js";
import { renderHome, wireHome } from "./home.tab.ui.js";
import { renderHeroes, wireHeroes } from "./team.tab.ui.js";
import { renderBattle, wireBattle } from "./battle.tab.ui.js";
import { renderShop } from "./shop.tab.ui.js";
import { renderMore, wireMore } from "./more.tab.ui.js";
import { openEnergyTimer } from "../ui/energy.timer.ui.js";

const root =
  document.getElementById("screenRoot") ||
  document.getElementById("app") ||       // ✅ capture top bar + nav + modals
  document.body;

export function renderApp(main, nav){
  const tab = routerState.tab;
  main.innerHTML =
    tab === "home" ? renderHome()
    : tab === "heroes" ? renderHeroes()
    : tab === "battle" ? renderBattle()
    : tab === "shop" ? renderShop()
    : renderMore();

  if (tab === "home") wireHome(main, nav);
  if (tab === "heroes") wireHeroes(main);
  if (tab === "battle") wireBattle(main);
  if (tab === "more") wireMore(main);
}

root.addEventListener("click", (e)=>{
  const el = e.target.closest("[data-open-energy]");
  if (!el) return;
  openEnergyTimer();
});
