import { emptyEquip } from "../gear/gear.equip.logic.js";
export const HEROES = Object.freeze([
  
  { id:"arlen", name:"Arlen, Flame Scribe", rarity:"", element:"Fire", role:"Support", skills:["arlen_s1","arlen_s2","arlen_u"] },
  { id:"nyxa", name:"Nyxa, Loopbreaker Scout", rarity:"", element:"Wind", role:"Sabotage", skills:["nyxa_s1","nyxa_s2","nyxa_u"] },
  { id:"dorun", name:"Dorun, Stone Howler", rarity:"", element:"Earth", role:"Tank", skills:["dorun_s1","dorun_s2","dorun_u"] },
  { id:"elya", name:"Elya, Froststep Dancer", rarity:"", element:"Water", role:"Sabotage", skills:["elya_s1","elya_s2","elya_u"] },
  { id:"solen", name:"Solen, Ember Lance", rarity:"", element:"Fire", role:"Damage", skills:["solen_s1","solen_s2","solen_u"] },

  { id:"vireon", name:"Vireon, Emberheart Sentinel", rarity:"", element:"Fire", role:"Tank", skills:["vireon_s1","vireon_s2","vireon_u"] },
  { id:"sirenia", name:"Sirenia, Tidelock Oracle", rarity:"", element:"Water", role:"Support", skills:["sirenia_s1","sirenia_s2","sirenia_u"] },
  { id:"caelum", name:"Caelum, Gale Duelist", rarity:"", element:"Wind", role:"Damage", skills:["caelum_s1","caelum_s2","caelum_u"] },
  { id:"morgrin", name:"Morgrin, Rootwarden", rarity:"", element:"Earth", role:"Sabotage", skills:["morgrin_s1","morgrin_s2","morgrin_u"] },
  { id:"thalor", name:"Thalor, Mirror Warden", rarity:"", element:"Water", role:"Damage", skills:["thalor_s1","thalor_s2","thalor_u"] },
]);
window.__HEROES = HEROES;
console.log("Exposed __HEROES", HEROES.length);

export function makeHeroProgress(heroId){
  return { heroId, unlocked:false, level:1, xp:0, equipped: emptyEquip(), skillLv: {} };
}
