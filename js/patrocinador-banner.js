/**
 * Banner emergente de la entrada a la web.
 *
 * Al entrar en la portada se muestra una única ventana emergente que
 * combina, si están disponibles:
 *  1. El patrocinador de la semana (tabla `patrocinador_semanal`), con
 *     su imagen grande — igual que hasta ahora.
 *  2. Una fila de logos institucionales y de empresas patrocinadoras
 *     destacadas (tabla `banner_entidades`).
 * Es solo informativo: se cierra con la X, pulsando fuera del cuadro
 * o con la tecla Escape.
 *
 * Gestión semanal del patrocinador (sin tocar código ni GitHub):
 *  1. Sube la imagen del banner al bucket de Storage "patrocinadores"
 *     en el panel de Supabase y copia su URL pública.
 *  2. En la tabla "patrocinador_semanal" (Table Editor), edita la fila
 *     activa: pon el nombre del patrocinador y pega la nueva imagen_url.
 *  3. Marca "activo" = true en la fila que quieras mostrar esa semana
 *     (y false en las demás, si tienes varias preparadas).
 *
 * Gestión de logos institucionales / patrocinadores destacados
 * (tabla "banner_entidades", sin tocar código ni GitHub):
 *  1. Sube el logo al mismo bucket de Storage "patrocinadores" y
 *     copia su URL pública.
 *  2. Añade una fila nueva en la tabla "banner_entidades": `tipo`
 *     ("institucional" o "patrocinador"), `nombre`, `imagen_url`,
 *     `orden` (número para el orden de aparición) y `activo` = true.
 *  3. Todas las filas con `activo` = true aparecen juntas en una fila
 *     de logos dentro del mismo banner de entrada.
 */

(function () {
  const cfg = window.CD_ISORA_CONFIG;
  if (!cfg || !window.supabase) {
    console.warn("Banner de entrada: falta config o cliente de Supabase");
    return;
  }

  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  async function cargar() {
    try {
      const [patrocinadorRes, entidadesRes] = await Promise.all([
        sb
          .from("patrocinador_semanal")
          .select("nombre, imagen_url")
          .eq("activo", true)
          .order("actualizado_en", { ascending: false })
          .limit(1),
        sb
          .from("banner_entidades")
          .select("tipo, nombre, imagen_url, enlace_url")
          .eq("activo", true)
          .order("orden", { ascending: true }),
      ]);

      const patrocinador =
        !patrocinadorRes.error &&
        patrocinadorRes.data &&
        patrocinadorRes.data.length &&
        patrocinadorRes.data[0].imagen_url
          ? patrocinadorRes.data[0]
          : null;

      const entidades =
        !entidadesRes.error && entidadesRes.data ? entidadesRes.data : [];

      if (!patrocinador && !entidades.length) return;

      mostrarBanner(patrocinador, entidades);
    } catch (e) {
      console.error("Error cargando el banner de entrada:", e);
    }
  }

  function mostrarBanner(patrocinador, entidades) {
    const banner = document.createElement("div");
    banner.className = "patro-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Patrocinadores y colaboradores del club");

    const bloquePatrocinador = patrocinador
      ? `
        <p class="patro-banner__eyebrow">Patrocina el próximo partido</p>
        <div class="patro-banner__image-wrap">
          <img class="patro-banner__image" src="${patrocinador.imagen_url}" alt="${patrocinador.nombre || "Patrocinador de la semana"}" />
        </div>
        ${patrocinador.nombre ? `<p class="patro-banner__name">${patrocinador.nombre}</p>` : ""}
      `
      : "";

    const bloqueEntidades = entidades.length
      ? `
        ${patrocinador ? `<div class="patro-banner__divider"></div>` : ""}
        <p class="patro-banner__eyebrow patro-banner__eyebrow--muted">Con la colaboración de</p>
        <div class="patro-banner__logos">
          ${entidades
            .map((e) => {
              const img = `<img src="${e.imagen_url}" alt="${e.nombre || "Colaborador"}" loading="lazy" />`;
              return e.enlace_url
                ? `<a class="patro-banner__logo" href="${e.enlace_url}" target="_blank" rel="noopener">${img}</a>`
                : `<span class="patro-banner__logo">${img}</span>`;
            })
            .join("")}
        </div>
      `
      : "";

    banner.innerHTML = `
      <div class="patro-banner__backdrop" data-patro-close></div>
      <div class="patro-banner__dialog">
        <button type="button" class="patro-banner__close" data-patro-close aria-label="Cerrar">&times;</button>
        ${bloquePatrocinador}
        ${bloqueEntidades}
      </div>
    `;
    document.body.appendChild(banner);

    function cerrar() {
      banner.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(() => banner.remove(), 200);
    }

    banner.querySelectorAll("[data-patro-close]").forEach((el) =>
      el.addEventListener("click", cerrar)
    );

    document.addEventListener("keydown", function escListener(e) {
      if (e.key === "Escape") {
        cerrar();
        document.removeEventListener("keydown", escListener);
      }
    });

    // Pequeño margen para que la animación de entrada se note
    requestAnimationFrame(() => {
      banner.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cargar);
  } else {
    cargar();
  }
})();
