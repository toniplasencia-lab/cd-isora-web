/* =====================================================================
   HISTORIA · MONTAJE DE GALERÍAS Y MODAL
   ---------------------------------------------------------------------
   Este archivo NO se toca para añadir fotos.
   Para añadir fotos edita SOLO el archivo  js/historia-fotos.js
   ===================================================================== */

(function () {
  'use strict';

  const fotosPorEpoca = window.HISTORIA_FOTOS || {};

  // --------- 1. Construir cada galería ---------
  document.querySelectorAll('.history-gallery[data-era]').forEach((contenedor) => {
    const era = contenedor.getAttribute('data-era');
    const fotos = Array.isArray(fotosPorEpoca[era]) ? fotosPorEpoca[era] : [];

    // Limpiar el "Cargando…"
    contenedor.innerHTML = '';

    if (fotos.length === 0) {
      // Sin fotos: mensaje amable
      const aviso = document.createElement('p');
      aviso.className = 'history-gallery__empty';
      aviso.textContent = 'Próximamente publicaremos fotografías de esta época.';
      contenedor.appendChild(aviso);
      return;
    }

    // Marco del carrusel
    const marco = document.createElement('div');
    marco.className = 'history-photo-strip';

    // Para que el bucle sea continuo duplicamos las fotos cuando hay pocas
    const fotosParaPintar = fotos.length < 6 ? [...fotos, ...fotos, ...fotos] : [...fotos, ...fotos];

    fotosParaPintar.forEach((foto) => {
      const figura = document.createElement('figure');
      figura.className = 'history-photo';

      const img = document.createElement('img');
      img.src = foto.src;
      img.alt = foto.caption || ('Fotografía histórica años ' + era);
      img.loading = 'lazy';
      img.addEventListener('click', () => abrirModal(foto));
      img.addEventListener('error', () => {
        figura.classList.add('history-photo--error');
        img.alt = 'No se pudo cargar la imagen';
      });

      figura.appendChild(img);

      if (foto.caption) {
        const pie = document.createElement('figcaption');
        pie.textContent = foto.caption;
        figura.appendChild(pie);
      }

      marco.appendChild(figura);
    });

    contenedor.appendChild(marco);

    // Si hay muy pocas fotos, ralentizar aún más para que no parezca raro
    const totalElementos = fotosParaPintar.length;
    const duracion = Math.max(60, totalElementos * 13); // segundos
    marco.style.animationDuration = duracion + 's';
  });

  // --------- 2. Modal de foto ampliada ---------
  const modal = document.getElementById('photoModal');
  if (!modal) return;

  const modalImg = document.getElementById('photoModalImage');
  const modalTitle = document.getElementById('photoModalTitle');
  const closeTargets = modal.querySelectorAll('[data-close-modal]');

  function abrirModal(foto) {
    if (!modalImg) return;
    modalImg.src = foto.src;
    modalImg.alt = foto.caption || 'Fotografía histórica';
    if (modalTitle) modalTitle.textContent = foto.caption || 'Fotografía histórica';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { if (modalImg) modalImg.src = ''; }, 250);
  }

  closeTargets.forEach((el) => el.addEventListener('click', cerrarModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) cerrarModal();
  });
})();
