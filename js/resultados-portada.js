(function () {
  const bloque = document.getElementById("resultados-portada");
  const categorias = [["cadete", "Cadete"], ["femenino", "Femenino"]];

  function elemento(tipo, texto, clase) {
    const nodo = document.createElement(tipo);
    nodo.textContent = texto;
    if (clase) nodo.className = clase;
    return nodo;
  }

  function fila(equipo, goles) {
    let nombre = /^(?:c\.?\s*d\.?\s*)?uni[oó]n\s+isora$/i.test(equipo.trim())
      ? "C.D. Unión Isora" : equipo;
    if (/^c\.?\s*d\.?\s*f\.?\s*alcala$/i.test(nombre)) nombre = "C.D.F. Alcalá";
    const nodo = elemento("div", "", "resultados__fila");
    nodo.append(elemento("span", nombre), elemento("strong", goles));
    return nodo;
  }

  function pintar(equipos) {
    const lista = elemento("ul", "", "resultados__lista");
    for (const [categoria, nombre] of categorias) {
      const tarjeta = elemento("li", "", "resultados__tarjeta");
      tarjeta.append(elemento("h3", nombre));
      const partido = equipos.find(equipo => equipo.categoria === categoria)?.partidos?.[0];
      if (partido) {
        if (partido.fecha) {
          const fecha = elemento("time", partido.fecha.split("-").reverse().join("/"), "resultados__fecha");
          fecha.dateTime = partido.fecha;
          tarjeta.append(fecha);
        }
        tarjeta.append(fila(partido.local, partido.goles_local), fila(partido.visitante, partido.goles_visitante));
      } else {
        tarjeta.append(elemento("p", "Aún no hay resultados registrados.", "resultados__estado"));
      }
      lista.append(tarjeta);
    }
    bloque.replaceChildren(lista);
  }

  async function cargar() {
    const abortar = new AbortController();
    const limite = setTimeout(() => abortar.abort(), 10000);
    try {
      const config = window.CD_ISORA_CONFIG;
      const url = new URL("/rest/v1/equipos", config.SUPABASE_URL);
      url.search = new URLSearchParams({
        select: "categoria,partidos(fecha,local,visitante,goles_local,goles_visitante)",
        categoria: "in.(cadete,femenino)",
        activo: "eq.true",
        order: "orden.asc,id.asc",
        "partidos.jugado": "eq.true",
        "partidos.order": "fecha.desc.nullslast,id.desc",
        "partidos.limit": "1"
      });
      const respuesta = await fetch(url, {
        headers: { apikey: config.SUPABASE_ANON_KEY },
        signal: abortar.signal
      });
      if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
      pintar(await respuesta.json());
    } catch {
      bloque.replaceChildren(elemento("p", "No se pudieron cargar los marcadores. Inténtalo de nuevo más tarde.", "resultados__estado"));
    } finally {
      clearTimeout(limite);
      bloque.setAttribute("aria-busy", "false");
    }
  }

  cargar();
})();
