/* ==========================================================================
   COLABORADORES — Modal para ver logos en grande
   ========================================================================== */

(function () {
  const modal        = document.getElementById('logoModal');
  if (!modal) return;

  const modalImage   = document.getElementById('logoModalImage');
  const modalTitle   = document.getElementById('logoModalTitle');
  const logoButtons  = document.querySelectorAll('.js-logo');
  const closeTargets = modal.querySelectorAll('[data-modal-close]');

  // Abrir modal al pulsar un logo
  logoButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const src  = this.getAttribute('data-src');
      const name = this.getAttribute('data-name') || 'Colaborador';

      modalImage.src = src;
      modalImage.alt = name;
      modalTitle.textContent = name;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Cerrar modal
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Limpiamos la imagen para liberar memoria
    setTimeout(() => { modalImage.src = ''; }, 300);
  }

  closeTargets.forEach(el => el.addEventListener('click', closeModal));

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
