/* Resumen de marcadores en la portada: hasta un partido jugado por equipo. */
(function () {
  const bloque = document.getElementById("resultados-portada");
  if (!bloque) return;

  const categorias = [
    ["cadete", "Cadete"],
    ["femenino", "Femenino"]
  ];

  function elemento(tipo, clase, texto) {
    const nodo = document.createElement(tipo);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }

  function fila(nombre, goles) {
    const nodo = elemento("div", "resultados-portada__fila");
    let equipo = /^(?:c\.?\s*d\.?\s*)?uni[oó]n\s+isora$/i.test(nombre.trim()) ? "C.D. Unión Isora" : nombre;
    if (/^c\.?\s*d\.?\s*f\.?\s*alcala$/i.test(equipo)) equipo = "C.D.F. Alcalá";
    nodo.append(elemento("span", "", equipo), elemento("strong", "resultados-portada__goles", goles));
    return nodo;
  }

  function tarjeta(nombre, partido) {
    const nodo = elemento("li", "resultados-portada__equipo");
    nodo.append(elemento("h3", "", nombre));
    if (!partido) {
      nodo.append(elemento("p", "resultados-portada__aviso", "Sin resultados registrados."));
      return nodo;
    }

    if (partido.fecha) {
      const fecha = elemento("time", "resultados-portada__fecha", partido.fecha.split("-").reverse().join("/"));
      fecha.dateTime = partido.fecha;
      nodo.append(fecha);
    }
    nodo.append(fila(partido.local, partido.goles_local), fila(partido.visitante, partido.goles_visitante));
    return nodo;
  }

  function pintar(equipos) {
    const lista = elemento("ul", "resultados-portada__lista");
    for (const [categoria, nombre] of categorias) {
      const partido = equipos.find(e => e.categoria === categoria)?.partidos?.[0];
      lista.append(tarjeta(nombre, partido));
    }
    bloque.replaceChildren(lista);
  }

  async function cargar() {
    try {
      const config = window.CD_ISORA_CONFIG;
      const cliente = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
        auth: {
          storageKey: "cd-isora-resultados-portada",
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
      const { data, error } = await cliente
        .from("equipos")
        .select("categoria,partidos(fecha,local,visitante,goles_local,goles_visitante)")
        .eq("activo", true)
        .in("categoria", categorias.map(([categoria]) => categoria))
        .eq("partidos.jugado", true)
        .order("orden")
        .order("fecha", { referencedTable: "partidos", ascending: false, nullsFirst: false })
        .order("id", { referencedTable: "partidos", ascending: false })
        .limit(1, { referencedTable: "partidos" });

      if (error) throw error;
      pintar(data);
    } catch (error) {
      console.error("No se pudieron cargar los resultados de portada:", error);
      bloque.replaceChildren(elemento("p", "resultados-portada__aviso", "No se han podido cargar los resultados en este momento."));
    } finally {
      bloque.setAttribute("aria-busy", "false");
    }
  }

  cargar();
})();
