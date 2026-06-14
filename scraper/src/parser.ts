import * as cheerio from 'cheerio';
import type { PartidoScrapeado, ClasificacionScrapeada } from './types.js';

/* ============================================================================
 *  Helpers comunes
 * ============================================================================ */

const FECHA_RE = /^(\d{2})-(\d{2})-(\d{4})$/;
const HORA_RE  = /^\d{1,2}:\d{2}$/;
const NUM_RE   = /^\d{1,2}$/;

function isFecha(s: string)  { return FECHA_RE.test(s); }
function isHora(s: string)   { return HORA_RE.test(s); }
function isNumero(s: string) { return NUM_RE.test(s); }

function toIsoDate(raw: string): string {
  const m = raw.match(FECHA_RE)!;
  return m[3] + '-' + m[2] + '-' + m[1];
}

function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ============================================================================
 *  Parser de partidos (sin cambios respecto al original)
 * ============================================================================ */

function extraerFragmentos(html: string): string[] {
  const $ = cheerio.load(html);

  const ancla = $('div').filter((_, el) =>
    $(el).text().includes('TODOS LOS PARTIDOS DEL')
  ).first();

  const root = ancla.length ? ancla.parent() : $('body');

  const fragmentos: string[] = [];
  root.find('div').each((_, el) => {
    const t = clean($(el).clone().children().remove().end().text());
    if (t) fragmentos.push(t);
  });

  const idx = fragmentos.findIndex(f => f.includes('TODOS LOS PARTIDOS DEL'));
  return idx >= 0 ? fragmentos.slice(idx + 1) : fragmentos;
}

export function parsePartidos(html: string, nombreClub: string): PartidoScrapeado[] {
  const frags = extraerFragmentos(html);
  const partidos: PartidoScrapeado[] = [];

  let i = 0;
  while (i < frags.length) {
    const f = frags[i]!;

    if (!isFecha(f)) {
      i++;
      continue;
    }

    if (i + 4 >= frags.length) break;

    const fecha = toIsoDate(f);
    const hora = isHora(frags[i + 1]!) ? frags[i + 1]! : null;
    const jornadaStr = frags[i + 2]!;
    const jornada = isNumero(jornadaStr) ? parseInt(jornadaStr) : null;

    if (jornada === null) {
      i++;
      continue;
    }

    const local = frags[i + 3]!;
    let visitante: string;
    let golesLocal: number | null = null;
    let golesVisitante: number | null = null;
    let nextIndex: number;

    if (i + 6 < frags.length && isNumero(frags[i + 4]!) && isNumero(frags[i + 5]!)) {
      golesLocal = parseInt(frags[i + 4]!);
      golesVisitante = parseInt(frags[i + 5]!);
      visitante = frags[i + 6]!;
      nextIndex = i + 7;
    } else {
      visitante = frags[i + 4]!;
      nextIndex = i + 5;
    }

    partidos.push({
      jornada,
      fecha,
      hora,
      local: clean(local),
      visitante: clean(visitante),
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
      uniq_key: jornada + '-' + fecha + '-' + slug(local) + '-' + slug(visitante),
    });

    i = nextIndex;
  }

  const norm = nombreClub.toLowerCase();
  return partidos.filter(p =>
    p.local.toLowerCase().includes(norm) ||
    p.visitante.toLowerCase().includes(norm)
  );
}

/* ============================================================================
 *  Parser de clasificacion
 *
 *  En la pagina /1regional-segunda-grupo-dos/ la clasificacion son filas
 *  que siguen este patron de divs hermanos (todos con style float:left):
 *
 *    [orden]   width:1%
 *    [pos]     width:4%
 *    [escudo]  width:16%
 *    [nombre]  width:31%
 *    [puntos]  width:6%   (background #1F618D)
 *    [dif]     width:6%   (diferencia goles, p.ej. -11 o 75)
 *    [jugados] width:6%
 *    [ganados] width:6%
 *    [empatd]  width:6%
 *    [perdids] width:6%
 *    [gf]      width:6%
 *    [gc]      width:6%
 *
 *  Como los divs no tienen clases, los buscamos por el contenedor que tiene
 *  un div con background-color:#1F618D (que solo aparece en la columna puntos
 *  de la clasificacion).
 * ============================================================================ */

export function parseClasificacion(html: string, nombreClub: string): ClasificacionScrapeada[] {
  const $ = cheerio.load(html);
  const filas: ClasificacionScrapeada[] = [];
  const norm = nombreClub.toLowerCase();

  // Cada fila contiene un div con fondo azul (#1F618D) que tiene los puntos.
  // Subimos al div padre y leemos sus divs hijos directos en orden.
  $('div[style*="1F618D"]').each((_, puntosDiv) => {
    const fila = $(puntosDiv).parent();
    if (!fila || fila.length === 0) return;

    const hijos = fila.children('div').toArray();
    if (hijos.length < 12) return;

    // Buscar el indice del div con #1F618D (los puntos) dentro de los hijos
    const idxPuntos = hijos.findIndex(h => ($(h).attr('style') || '').includes('1F618D'));
    if (idxPuntos < 0) return;

    // Antes de puntos: orden(0), pos(1), escudo(2), nombre(3) -> puntos en idx 4
    // Pero por seguridad usamos el indice real
    const posDiv    = hijos[idxPuntos - 3];
    const nombreDiv = hijos[idxPuntos - 1];
    const puntDiv   = hijos[idxPuntos];
    const difDiv    = hijos[idxPuntos + 1];
    const pjDiv     = hijos[idxPuntos + 2];
    const pgDiv     = hijos[idxPuntos + 3];
    const peDiv     = hijos[idxPuntos + 4];
    const ppDiv     = hijos[idxPuntos + 5];
    const gfDiv     = hijos[idxPuntos + 6];
    const gcDiv     = hijos[idxPuntos + 7];

    if (!posDiv || !nombreDiv || !puntDiv || !pjDiv || !pgDiv || !peDiv || !ppDiv || !gfDiv || !gcDiv) {
      return;
    }

    const posStr = clean($(posDiv).text());
    if (!/^\d{1,2}$/.test(posStr)) return;
    const posicion = parseInt(posStr);

    // Nombre: solo el texto directo del div, sin styles ni hijos
    const nombre = clean($(nombreDiv).clone().children().remove().end().text());
    if (!nombre) return;

    const puntos    = parseInt(clean($(puntDiv).text()));
    const jugados   = parseInt(clean($(pjDiv).text()));
    const ganados   = parseInt(clean($(pgDiv).text()));
    const empatados = parseInt(clean($(peDiv).text()));
    const perdidos  = parseInt(clean($(ppDiv).text()));
    const gf        = parseInt(clean($(gfDiv).text()));
    const gc        = parseInt(clean($(gcDiv).text()));

    if ([puntos, jugados, ganados, empatados, perdidos, gf, gc].some(n => !Number.isFinite(n))) {
      return;
    }

    filas.push({
      posicion,
      nombre_equipo: nombre,
      puntos,
      jugados,
      ganados,
      empatados,
      perdidos,
      goles_favor: gf,
      goles_contra: gc,
      es_nuestro: nombre.toLowerCase().includes(norm),
    });
  });

  // Ordenar por posicion ascendente
  filas.sort((a, b) => a.posicion - b.posicion);

  return filas;
}
