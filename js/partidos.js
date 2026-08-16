/**
 * Carga dinámica de partidos desde Supabase para la página partidos.html.
 *
 * Requiere:
 *   - /js/config.js  (con SUPABASE_URL y SUPABASE_ANON_KEY)
 *   - El cliente oficial de Supabase cargado por CDN en el HTML
 */

const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.CD_ISORA_CONFIG;
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = sel => document.querySelector(sel);

/** Formatea YYYY-MM-DD → DD/MM/YYYY */
function fechaEs(iso) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Determina si un equipo del partido es el Unión Isora */
function esIsora(nombre) {
  return /uni[oó]n\s*isora|union\s*isora/i.test(nombre);
}

/** Calcula el resultado desde el punto de vista del CD Unión Isora */
function estadoResultado(p) {
  if (p.goles_local === null || p.goles_visitante === null) return null;
  const isoraLocal = esIsora(p.local);
  const golesFav = isoraLocal ? p.goles_local : p.goles_visitante;
  const golesCon = isoraLocal ? p.goles_visitante : p.goles_local;
  if (golesFav > golesCon) return { label: "Victoria", clase: "badge--win" };
  if (golesFav < golesCon) return { label: "Derrota", clase: "badge--loss" };
  return { label: "Empate", clase: "badge--draw" };
}

/** Rellena el selector con los equipos cargados de Supabase */
async function cargarEquipos() {
  const { data, error } = await sb
    .from("equipos")
    .select("id, slug, nombre, competicion")
    .eq("activo", true)
    .order("orden");

  if (error) {
    console.error("Error cargando equipos:", error);
    return [];
  }

  const select = $("#filtro-equipo");
  if (select) {
    select.innerHTML = `<option value="">Todos los equipos</option>` +
      data.map(e => `<option value="${e.id}">${e.nombre} · ${e.competicion}</option>`).join("");
  }
  return data;
}

/** Carga próximos partidos (sin jugar, ordenados por fecha) */
async function cargarProximos(equipoId) {
  let q = sb
    .from("partidos")
    .select("*, equipos(nombre, competicion)")
    .eq("jugado", false)
    .order("fecha", { ascending: true })
    .limit(38);

  if (equipoId) q = q.eq("equipo_id", equipoId);

  const { data, error } = await q;
  if (error) return console.error(error);

  const tbody = $("#tbl-proximos tbody");
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--color-muted);">No hay partidos programados</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => `
    <tr>
      <td>${fechaEs(p.fecha)}</td>
      <td>${p.hora ?? "-"}</td>
      <td>${p.equipos?.competicion ?? ""}</td>
      <td>${esIsora(p.local) ? `<strong>${p.local}</strong>` : p.local}</td>
      <td>${esIsora(p.visitante) ? `<strong>${p.visitante}</strong>` : p.visitante}</td>
      <td>${p.equipos?.nombre ?? ""}</td>
    </tr>
  `).join("");
}

/** Carga últimos resultados (jugados, más recientes primero) */
async function cargarResultados(equipoId) {
  let q = sb
    .from("partidos")
    .select("*, equipos(nombre, competicion)")
    .eq("jugado", true)
    .order("fecha", { ascending: false })
    .limit(38);

  if (equipoId) q = q.eq("equipo_id", equipoId);

  const { data, error } = await q;
  if (error) return console.error(error);

  const tbody = $("#tbl-resultados tbody");
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--color-muted);">Sin resultados todavía</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => {
    const r = estadoResultado(p);
    return `
      <tr>
        <td>${fechaEs(p.fecha)}</td>
        <td>${p.equipos?.competicion ?? ""}</td>
        <td>${p.local} vs ${p.visitante}</td>
        <td><strong>${p.goles_local} - ${p.goles_visitante}</strong></td>
        <td>${r ? `<span class="badge ${r.clase}">${r.label}</span>` : ""}</td>
      </tr>
    `;
  }).join("");
}

async function refrescar() {
  const id = $("#filtro-equipo")?.value || null;
  await Promise.all([cargarProximos(id), cargarResultados(id)]);
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarEquipos();
  $("#filtro-equipo")?.addEventListener("change", refrescar);
  await refrescar();
});
