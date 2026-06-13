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

  function pintarPartido(p, equipo) {
    const isoraLocal = esIsora(p.local);
    const rival = isoraLocal ? p.visitante : p.local;
    const condicion = isoraLocal ? "Local" : "Visitante";
    const fecha = fechaBonita(p.fecha);
    const hora = p.hora ? p.hora.substring(0, 5) : "Por confirmar";

    cuerpo.innerHTML = `
      <div class="proximo-partido__match">
        <div class="proximo-partido__team proximo-partido__team--isora">
          <img src="img/logo-club.png" alt="CD Unión Isora" />
          <span>CD Unión Isora</span>
        </div>
        <div class="proximo-partido__vs">
          <span class="proximo-partido__vs-label">VS</span>
          <span class="proximo-partido__condicion">${condicion}</span>
        </div>
        <div class="proximo-partido__team proximo-partido__team--rival">
          <div class="proximo-partido__rival-icon">⚽</div>
          <span>${rival}</span>
        </div>
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
      </div>
    `;
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