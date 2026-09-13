/**
 * Banner emergente del patrocinador de la semana.
 *
 * Al entrar en la portada, si hay un patrocinador marcado como "activo"
 * en la tabla `patrocinador_semanal` de Supabase, se muestra en una
 * ventana emergente. Solo es informativo: se cierra con la X, pulsando
 * fuera del cuadro o con la tecla Escape.
 *
 * Gestión semanal (sin tocar código ni GitHub):
 *  1. Sube la imagen del banner al bucket de Storage "patrocinadores"
 *     en el panel de Supabase y copia su URL pública.
 *  2. En la tabla "patrocinador_semanal" (Table Editor), edita la fila
 *     activa: pon el nombre del patrocinador y pega la nueva imagen_url.
 *  3. Marca "activo" = true en la fila que quieras mostrar esa semana
 *     (y false en las demás, si tienes varias preparadas).
 */

(function () {
  const cfg = window.CD_ISORA_CONFIG;
  if (!cfg || !window.supabase) {
    console.warn("Banner patrocinador: falta config o cliente de Supabase");
    return;
  }

  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  async function cargar() {
    try {
      const { data, error } = await sb
        .from("patrocinador_semanal")
        .select("nombre, imagen_url")
        .eq("activo", true)
        .order("actualizado_en", { ascending: false })
        .limit(1);

      if (error || !data || !data.length || !data[0].imagen_url) return;

      mostrarBanner(data[0]);
    } catch (e) {
      console.error("Error cargando el banner del patrocinador:", e);
    }
  }

  function mostrarBanner(patrocinador) {
    const banner = document.createElement("div");
    banner.className = "patro-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Patrocinador de la semana");
    banner.innerHTML = `
      <div class="patro-banner__backdrop" data-patro-close></div>
      <div class="patro-banner__dialog">
        <button type="button" class="patro-banner__close" data-patro-close aria-label="Cerrar">&times;</button>
        <p class="patro-banner__eyebrow">Patrocina el próximo partido</p>
        <div class="patro-banner__image-wrap">
          <img class="patro-banner__image" src="${patrocinador.imagen_url}" alt="${patrocinador.nombre || "Patrocinador de la semana"}" />
        </div>
        ${patrocinador.nombre ? `<p class="patro-banner__name">${patrocinador.nombre}</p>` : ""}
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
