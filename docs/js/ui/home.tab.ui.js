import { openModal } from "./ui.modal.js";
import { emit } from "../events/events.bus.js";
import { EVENTS } from "../events/events.enums.data.js";
import { openLoginCalendar } from "./logincalendar.ui.js";
import { openTasksModal } from "./tasks.ui.js";
import { openSeasonPass } from "./seasonpass.ui.js";

export function renderHome(){
  return `
 
<div class="homeIconDock">
      <button class="hubIconBtn hubIconBtn--login" data-open-login aria-label="Open Daily Login Calendar">
        <span class="hubIcon" aria-hidden="true">
          <!-- Calendar icon -->
          <svg class="dockIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 3v3M17 3v3M4 8h16" />
            <path d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
            <path d="M8 12h3M13 12h3M8 16h3M13 16h3" />
          </svg>
        </span>
      </button>

      <button class="hubIconBtn hubIconBtn--tasks" data-open-tasks aria-label="Open Tasks">
        <span class="hubIcon" aria-hidden="true">
          <!-- Scroll icon -->
          <svg class="dockIcon" viewBox="0 0 24 24" aria-hidden="true">
            <!-- Lid -->
            <path d="M6 10V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
            <!-- Chest box -->
            <path d="M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
            <!-- Lid seam -->
            <path d="M4 14h16" />
            <!-- Lock plate -->
            <path d="M11 16h2v2h-2z" />
          </svg>
        </span>
      </button>

      <button class="hubIconBtn hubIconBtn--pass" data-open-sp aria-label="Open Season Pass">
        <span class="hubIcon" aria-hidden="true">
          <!-- Pass / badge icon -->
          <svg class="dockIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9l4 4 4-7 4 7 4-4v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
            <path d="M7 20h10" />
          </svg>
        </span>
      </button>
    </div>
  `;
}

export function wireHome(root, nav){
  root.addEventListener('click', (e)=>{
    const b = e.target.closest('button');
    if (!b) return;

    if (b.dataset.openLogin !== undefined){ openLoginCalendar(); return; }
    if (b.dataset.openTasks !== undefined){ openTasksModal('daily'); return; }
    if (b.dataset.openSp !== undefined){ openSeasonPass(); return; }
  });
}
