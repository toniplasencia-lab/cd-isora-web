/**
 * Carga automáticamente el PRÓXIMO partido del equipo Regional
 * en la página de inicio, leyendo desde Supabase.
 */

(function () {
  const cfg = window.CD_ISORA_CONFIG;
  if (!cfg || !window.supabase) {
    console.warn("Próximo partido: falta config o cliente de Supabase");
    return;
  }

  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const cuerpo = document.getElementById("proximo-partido-body");
  const pie = document.getElementById("proximo-partido-footer");
  if (!cuerpo) return;

  // Formatea YYYY-MM-DD a "Sábado 21 de junio"
  function fechaBonita(iso) {
    if (!iso) return "Fecha por confirmar";
    const fecha = new Date(iso + "T00:00:00");
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                   "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
  }

  function esIsora(nombre) {
    return /uni[oó]n\s*isora|union\s*isora/i.test(nombre);
  }

  async function cargar() {
    try {
      // Buscar equipo "senior" (Regional)
      const { data: equipos, error: errEq } = await sb
        .from("equipos")
        .select("id, slug, nombre, competicion")
        .eq("slug", "senior")
        .limit(1);

      if (errEq || !equipos || !equipos.length) {
        mostrarVacio();
        return;
      }

      const equipoRegional = equipos[0];

      // Buscar el próximo partido del Regional
      const { data, error } = await sb
        .from("partidos")
        .select("*")
        .eq("equipo_id", equipoRegional.id)
        .eq("jugado", false)
        .order("fecha", { ascending: true })
        .limit(1);

      if (error || !data || !data.length) {
        mostrarVacio();
        return;
      }

      pintarPartido(data[0], equipoRegional);
    } catch (e) {
      console.error("Error cargando próximo partido:", e);
      mostrarVacio();
    }
  }

  function bloqueEquipo(nombre, esIsoraEquipo) {
    if (esIsoraEquipo) {
      return `
        <div class="proximo-partido__team proximo-partido__team--isora">
          <img src="img/logo-club.png" alt="CD Unión Isora" />
          <span>CD Unión Isora</span>
        </div>`;
    }
    const escudoUrl = window.cdIsoraEscudoUrl ? window.cdIsoraEscudoUrl(nombre) : null;
    const icono = escudoUrl
      ? `<img src="${escudoUrl}" alt="${nombre}" onerror="this.outerHTML='<div class=&quot;proximo-partido__rival-icon&quot;>⚽</div>'" />`
      : `<div class="proximo-partido__rival-icon">⚽</div>`;
    return `
      <div class="proximo-partido__team proximo-partido__team--rival">
        ${icono}
        <span>${nombre}</span>
      </div>`;
  }

  function pintarPartido(p, equipo) {
    const isoraLocal = esIsora(p.local);
    const rival = isoraLocal ? p.visitante : p.local;
    const condicion = isoraLocal ? "Local" : "Visitante";
    const fecha = fechaBonita(p.fecha);
    const hora = p.hora ? p.hora.substring(0, 5) : "Por confirmar";
    const campo = p.campo || (isoraLocal ? "Campo Municipal Tomás Hernández Alonso (Guía de Isora)" : null);

    // El equipo local va siempre a la izquierda y el visitante a la derecha,
    // igual que en la notación habitual "Local - VS - Visitante".
    const bloqueLocal = bloqueEquipo(isoraLocal ? "CD Unión Isora" : p.local, isoraLocal);
    const bloqueVisitante = bloqueEquipo(isoraLocal ? p.visitante : "CD Unión Isora", !isoraLocal);

    cuerpo.innerHTML = `
      <div class="proximo-partido__match">
        ${bloqueLocal}
        <div class="proximo-partido__vs">
          <span class="proximo-partido__vs-label">VS</span>
          <span class="proximo-partido__condicion">${condicion}</span>
        </div>
        ${bloqueVisitante}
      </div>
      <div class="proximo-partido__info">
        <div class="proximo-partido__info-item">
          <span class="proximo-partido__info-label">📅 Fecha</span>
          <span class="proximo-partido__info-value">${fecha}</span>
        </div>
        <div class="proximo-partido__info-item">
          <span class="proximo-partido__info-label">🕐 Hora</span>
          <span class="proximo-partido__info-value">${hora}</span>
        </div>
        <div class="proximo-partido__info-item">
          <span class="proximo-partido__info-label">🏆 Competición</span>
          <span class="proximo-partido__info-value">${equipo.competicion || "—"}</span>
        </div>
        <div class="proximo-partido__info-item">
          <span class="proximo-partido__info-label">📍 Campo</span>
          <span class="proximo-partido__info-value">${campo || "Por confirmar"}</span>
        </div>
      </div>
    `;

    if (pie) {
      const btnCampo = pie.querySelector(".proximo-partido__btn-campo");
      if (btnCampo) btnCampo.remove();
      if (campo) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campo)}`;
        pie.insertAdjacentHTML("beforeend",
          `<a href="${url}" target="_blank" rel="noopener" class="btn btn--sm proximo-partido__btn-campo">\uD83D\uDCCD Cómo llegar al campo</a>`);
      }
    }
  }

  function mostrarVacio() {
    cuerpo.innerHTML = `
      <div class="proximo-partido__empty">
        <p>📅 No hay partidos programados en este momento.</p>
        <p class="proximo-partido__empty-sub">El calendario se actualizará cuando empiece la próxima jornada.</p>
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", cargar);
})();