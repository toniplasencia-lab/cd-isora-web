/* =====================================================================
   EQUIPOS · MONTAJE DE PLANTILLAS Y MODAL
   ---------------------------------------------------------------------
   Este archivo NO se toca para añadir jugadores.
   Para añadir jugadores edita SOLO el archivo  js/equipos-plantillas.js
   ===================================================================== */

(function () {
  'use strict';

  const plantillas = window.PLANTILLAS || {};

  // --------- 1. Construir cada plantilla ---------
  document.querySelectorAll('.jugadores-grid[data-equipo]').forEach((contenedor) => {
    const equipo = contenedor.getAttribute('data-equipo');
    const jugadores = Array.isArray(plantillas[equipo]) ? plantillas[equipo] : [];

    // Limpiar el "Cargando…"
    contenedor.innerHTML = '';

    if (jugadores.length === 0) {
      // Sin jugadores: mensaje amable
      const aviso = document.createElement('p');
      aviso.className = 'jugadores-grid__empty';
      aviso.textContent = 'Próximamente publicaremos la plantilla de este equipo.';
      contenedor.appendChild(aviso);
      return;
    }

    jugadores.forEach((jugador, indice) => {
      const tarjeta = document.createElement('figure');
      tarjeta.className = 'jugador-card';

      const wrap = document.createElement('button');
      wrap.type = 'button';
      wrap.className = 'jugador-card__foto-wrap';
      wrap.setAttribute('aria-label', 'Ver foto de ' + (jugador.nombre || 'jugador'));

      const img = document.createElement('img');
      img.className = 'jugador-card__foto';
      img.src = jugador.foto;
      img.alt = jugador.nombre || ('Jugador ' + (indice + 1));
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        // Si falla la foto, mostramos un círculo con las iniciales
        wrap.classList.add('jugador-card__foto-wrap--placeholder');
        wrap.innerHTML = '<span class="jugador-card__iniciales">' + iniciales(jugador.nombre) + '</span>';
      });

      wrap.appendChild(img);
      wrap.addEventListener('click', () => abrirModal(jugador));

      const pie = document.createElement('figcaption');
      pie.className = 'jugador-card__nombre';
      pie.textContent = jugador.nombre || 'Jugador';

      tarjeta.appendChild(wrap);
      tarjeta.appendChild(pie);
      contenedor.appendChild(tarjeta);
    });
  });

  // --------- 2. Iniciales para placeholder ---------
  function iniciales(nombre) {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    const a = partes[0] ? partes[0][0] : '';
    const b = partes[1] ? partes[1][0] : '';
    return (a + b).toUpperCase() || '?';
  }

  // --------- 3. Modal ---------
  const modal = document.getElementById('photoModal');
  if (!modal) return;

  const modalImage = document.getElementById('photoModalImage');
  const modalTitle = document.getElementById('photoModalTitle');
  const closeTargets = modal.querySelectorAll('[data-close-modal]');

  function abrirModal(jugador) {
    if (!jugador || !jugador.foto) return;
    modalImage.src = jugador.foto;
    modalImage.alt = jugador.nombre || 'Jugador';
    modalTitle.textContent = jugador.nombre || 'Jugador';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { modalImage.src = ''; }, 300);
  }

  closeTargets.forEach((el) => el.addEventListener('click', cerrarModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) cerrarModal();
  });
})();
