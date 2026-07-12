/* ============================================================================
 *  CD Unión Isora · Página de clasificación
 *  Lee la tabla 'clasificacion' desde Supabase y la pinta agrupada por equipo.
 *  Lleva además un desplegable para cambiar entre las distintas competiciones.
 * ============================================================================ */

(function () {
  'use strict';

  // Espera a que config.js y supabase-js estén cargados
  function init() {
    if (typeof window.supabase === 'undefined' || typeof window.CD_ISORA_CONFIG === 'undefined') {
      setTimeout(init, 50);
      return;
    }

    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.CD_ISORA_CONFIG;
    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const $filtro  = document.getElementById('filtro-clasif');
    const $tabla   = document.getElementById('tbl-clasif');
    const $titulo  = document.getElementById('titulo-clasif');
    const $update  = document.getElementById('last-update');

    let equipos = [];
    let cacheClasif = {}; // {equipo_id: [filas]}

    /* ---- Helpers de formato ---- */

    function bonitoNombre(nombre) {
      // Sustituir 'Union Isora' (como viene del scraper) por el nombre oficial
      const limpio = (nombre || '').trim();
      if (/^union\s+isora$/i.test(limpio)) {
        return 'C.D. Unión Isora';
      }
      return limpio;
    }

    // Mapa de nombre del equipo (tal como viene del scraper) → nombre del archivo del escudo
    // Los escudos están en img/escudos/<archivo>.png
    // Los equipos sin escudo utilizable (Laszocas, Santiagoteide) usarán iniciales
    const ESCUDOS = {
      'Union Isora':          'Unionisora.png',
      'C.D. Tegueste':        'Tegueste.png',
      'S.J. Tablero':         'Tablero.png',
      'A.U.Guimar B':         'Guimar.png',
      'S.D. Valleseco':       'Valleseco.png',
      'C.D. Santaca':         'Santaca.png',
      'U.D. Playa':           'Playa.png',
      'At. Alcala':           'Alcala.png',
      'U.D. Salud':           'Salud.png',
      'C.D. El Tranvia':      'Tranvia.png',
      'Man. De Tajo':         'Manantial.png',
      'C.D. Timaday':         'Timaday.png',
      'U.D. Guargacho':       'Guargacho.png',
      'C.D. Marino C':        'Marino.png',
      'C.D. Aguilas C':       'Aguilas.png',
      'C.D. Raqui C':         'Isidro.png',
      'C.D. Villamar':        'Villamar.png',
      'C.D. Buzanada B':      'Buzanada.png',
      'C.D. Armeñime':        'Armenime.png',
      'Fañabe C.F.':          'Fanabe.png',
      'C.D. Anadona B':       'Cdamedano.png'
      // Excluidos por escudo pobre: 'U.D. Las Zocas B', 'Santiago D.Teide B'
    };

    function iniciales(nombre) {
      // Extraer 2-3 iniciales del nombre del equipo
      const limpio = (nombre || '').replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim();
      const palabras = limpio.split(' ').filter(p => p.length > 0 && !/^[BC]$/.test(p));
      // Ignorar prefijos como CD, UD, SD, AU, SJ, At
      const relevantes = palabras.filter(p =>
        !/^(C|S|U|A|At)\.?[DJU]?\.?$/i.test(p)
      );
      const dos = relevantes.slice(0, 2);
      if (dos.length === 0) return '?';
      return dos.map(p => p[0].toUpperCase()).join('');
    }

    function escudoDe(nombre) {
      const archivo = ESCUDOS[nombre];
      if (archivo) {
        return `<img src="img/escudos/${archivo}" alt="Escudo ${nombre}" class="escudo-tabla" loading="lazy" onerror="this.replaceWith(document.createRange().createContextualFragment('<span class=&quot;escudo-tabla escudo-tabla--txt&quot;>${iniciales(nombre)}</span>'))" />`;
      }
      // Fallback: iniciales
      return `<span class="escudo-tabla escudo-tabla--txt">${iniciales(nombre)}</span>`;
    }


    function formatFecha(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
    }

    /* ---- Carga de equipos ---- */

    async function cargarEquipos() {
      const { data, error } = await sb
        .from('equipos')
        .select('id, slug, nombre, competicion, url_clasificacion')
        .eq('activo', true)
        .not('url_clasificacion', 'is', null)
        .order('orden', { ascending: true });

      if (error) {
        console.error('Error cargando equipos:', error);
        $filtro.innerHTML = '<option value="">Error al cargar</option>';
        return;
      }

      equipos = data || [];

      if (equipos.length === 0) {
        $filtro.innerHTML = '<option value="">Sin clasificaciones disponibles</option>';
        $tabla.querySelector('tbody').innerHTML =
          '<tr><td colspan="10" style="text-align:center; color:var(--color-muted);">No hay clasificaciones cargadas todavía.</td></tr>';
        return;
      }

      // Pintar el desplegable
      $filtro.innerHTML = equipos
        .map(e => `<option value="${e.id}">${e.competicion} — ${e.nombre}</option>`)
        .join('');

      // Cargar la primera competición
      cargarClasificacion(equipos[0].id);
    }

    /* ---- Carga de clasificación ---- */

    async function cargarClasificacion(equipoId) {
      const equipo = equipos.find(e => e.id == equipoId);
      if (!equipo) return;

      $titulo.textContent = `Clasificación · ${equipo.competicion}`;

      // Mostrar spinner
      $tabla.querySelector('tbody').innerHTML =
        '<tr><td colspan="10" style="text-align:center; color:var(--color-muted);">Cargando...</td></tr>';

      // Cache simple
      if (cacheClasif[equipoId]) {
        pintarTabla(cacheClasif[equipoId]);
        return;
      }

      const { data, error } = await sb
        .from('clasificacion')
        .select('*')
        .eq('equipo_id', equipoId)
        .order('posicion', { ascending: true });

      if (error) {
        console.error('Error cargando clasificación:', error);
        $tabla.querySelector('tbody').innerHTML =
          '<tr><td colspan="10" style="text-align:center; color:#c0392b;">Error al cargar la clasificación.</td></tr>';
        return;
      }

      cacheClasif[equipoId] = data || [];
      pintarTabla(cacheClasif[equipoId]);
    }

    /* ---- Pintar tabla ---- */

    function pintarTabla(filas) {
      if (!filas || filas.length === 0) {
        $tabla.querySelector('tbody').innerHTML =
          '<tr><td colspan="10" style="text-align:center; color:var(--color-muted);">No hay clasificación disponible aún. El scraper la generará en la próxima sincronización.</td></tr>';
        $update.textContent = '';
        return;
      }

      const html = filas.map(f => {
        const resaltar = f.es_nuestro ? 'fila-nuestra' : '';
        const nombre = bonitoNombre(f.nombre_equipo);
        const dif = (f.diferencia ?? (f.goles_favor - f.goles_contra));
        const difTxt = dif > 0 ? `+${dif}` : `${dif}`;

        // Para el escudo usamos el nombre EN CRUDO (tal como viene del scraper),
        // no el bonito, porque el mapa ESCUDOS usa ese formato.
        const escudo = escudoDe((f.nombre_equipo || '').trim());

        return `
          <tr class="${resaltar}">
            <td class="col-pos"><strong>${f.posicion}</strong></td>
            <td class="col-escudo">${escudo}</td>
            <td>${nombre}${f.es_nuestro ? ' <span class="badge-nuestro">Nosotros</span>' : ''}</td>
            <td><strong>${f.puntos}</strong></td>
            <td class="col-extra">${f.jugados}</td>
            <td class="col-extra">${f.ganados}</td>
            <td class="col-extra">${f.empatados}</td>
            <td class="col-extra">${f.perdidos}</td>
            <td class="col-extra">${f.goles_favor}</td>
            <td class="col-extra">${f.goles_contra}</td>
            <td class="col-extra">${difTxt}</td>
          </tr>
        `;
      }).join('');

      $tabla.querySelector('tbody').innerHTML = html;

      // Mostrar fecha de última actualización (la más reciente del set)
      const ultima = filas
        .map(f => f.updated_at)
        .filter(Boolean)
        .sort()
        .pop();
      if (ultima) {
        $update.textContent = `Última actualización: ${formatFecha(ultima)}`;
      } else {
        $update.textContent = '';
      }
    }

    /* ---- Eventos ---- */

    $filtro.addEventListener('change', (e) => {
      const id = parseInt(e.target.value, 10);
      if (!isNaN(id)) cargarClasificacion(id);
    });

    /* ---- Arranque ---- */
    cargarEquipos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
