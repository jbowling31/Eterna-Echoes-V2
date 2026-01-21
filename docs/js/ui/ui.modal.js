// docs/js/ui/ui.modal.js

const host = () => document.getElementById("modalHost");

function onKey(e){
  if (e.key === "Escape") closeModal();
}

export function closeModal(){
  const h = host(); if (!h) return;
  h.classList.remove("on");
  h.setAttribute("aria-hidden","true");
  h.innerHTML = "";
  window.removeEventListener("keydown", onKey);
  h.onclick = null;
}

// ✅ Back-compat openModal:
// 1) openModal("Title", "<div>Body</div>")
// 2) openModal({ title, body, footer })
export function openModal(arg1, arg2){
  const h = host(); if (!h) return;

  // Normalize inputs
  let title = "Modal";
  let bodyHTML = "";
  let footerHTML = null;

  if (arg1 && typeof arg1 === "object"){
    title = arg1.title ?? "Modal";
    bodyHTML = arg1.body ?? "";
    footerHTML = arg1.footer ?? null;
  } else {
    title = arg1 ?? "Modal";
    bodyHTML = arg2 ?? "";
  }

  const footer = footerHTML ?? `
    <button class="btn small" data-close>Close</button>
  `;

  h.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modalHeader">
        <div class="modalTitle">${title || "Modal"}</div>
        <button class="xBtn" data-x aria-label="Close">✕</button>
      </div>

      <div class="modalBody">${bodyHTML || ""}</div>

      <div class="modalFooter"
           style="margin-top:12px; display:flex; justify-content:flex-end; gap:10px;
                  border-top:1px solid rgba(255,255,255,.08); padding-top:10px;">
        ${footer}
      </div>
    </div>
  `;

  h.classList.add("on");
  h.setAttribute("aria-hidden","false");

  h.querySelector("[data-x]")?.addEventListener("click", closeModal);
  h.querySelectorAll("[data-close]")?.forEach(btn => btn.addEventListener("click", closeModal));

  // Backdrop click
  h.onclick = (e)=>{
    if (e.target === h) closeModal();
  };

  window.addEventListener("keydown", onKey);
}
