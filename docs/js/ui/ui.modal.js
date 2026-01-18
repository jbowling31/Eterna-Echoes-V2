const host = () => document.getElementById('modalHost');

function onKey(e){
  if (e.key === 'Escape') closeModal();
}

export function closeModal(){
  const h = host(); if (!h) return;
  h.classList.remove('on');
  h.setAttribute('aria-hidden','true');
  h.innerHTML='';
  window.removeEventListener('keydown', onKey);
  // clear any stale backdrop handler
  h.onclick = null;
}

export function openModal(title, bodyHTML){
  const h = host(); if (!h) return;

  h.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modalHeader">
        <div class="modalTitle">${title || "Modal"}</div>
        <button class="xBtn" data-x aria-label="Close">✕</button>
      </div>
      <div class="modalBody">${bodyHTML || ""}</div>
      <div class="modalFooter" style="margin-top:12px; display:flex; justify-content:flex-end; gap:10px; border-top:1px solid rgba(255,255,255,.08); padding-top:10px;">
        <button class="btn small" data-close>Close</button>
      </div>
    </div>
  `;

  h.classList.add('on');
  h.setAttribute('aria-hidden','false');

  h.querySelector('[data-x]')?.addEventListener('click', closeModal);
  h.querySelector('[data-close]')?.addEventListener('click', closeModal);

  // Backdrop click (reliable even after re-opening modals)
  h.onclick = (e)=>{
    // only close when user taps outside the modal card
    if (e.target === h) closeModal();
  };

  window.addEventListener('keydown', onKey);
}
