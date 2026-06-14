import * as cheerio from 'cheerio';
import type { PartidoScrapeado, ClasificacionScrapeada } from './types.js';

/**
 * ============================================================================
 *  PARSER DE PARTIDOS (sin cambios respecto a la versión anterior)
 * ============================================================================
 */

const FECHA_RE = /^(\d{2})-(\d{2})-(\d{4})$/;
const HORA_RE  = /^\d{1,2}:\d{2}$/;
const NUM_RE   = /^\d{1,2}$/;

function isFecha(s: string)   { return FECHA_RE.test(s); }
function isHora(s: string)    { return HORA_RE.test(s); }
function isNumero(s: string)  { return NUM_RE.test(s); }

function toIsoDate(raw: string): string {
  const m = raw.match(FECHA_RE)!;
  return `${m[3]}-${m[2]}-${m[1]}`;
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
      uniq_key: `${jornada}-${fecha}-${slug(local)}-${slug(visitante)}`,
    });

    i = nextIndex;
  }

  const norm = nombreClub.toLowerCase();
  return partidos.filter(p =>
    p.local.toLowerCase().includes(norm) ||
    p.visitante.toLowerCase().includes(norm)
  );
}

/**
 * ============================================================================
 *  PARSER DE CLASIFICACIÓN (nuevo)
 *
 *  La página de estadísticas de futboltenerife.com contiene una tabla con la
 *  clasificación. Los datos aparecen como fragmentos planos en este orden por
 *  cada fila:
 *
 *    posicion · nombre_equipo · puntos · jugados · ganados · empatados ·
 *    perdidos · goles_favor · goles_contra
 *
 *  Se localiza usando como ancla el texto "CLASIFICACIÓN" o "CLASIFICACION".
 * ============================================================================
 */

function extraerFragmentosClasificacion(html: string): string[] {
  const $ = cheerio.load(html);

  const ancla = $('div').filter((_, el) => {
    const t = $(el).text().toUpperCase();
    return t.includes('CLASIFICACIÓN') || t.includes('CLASIFICACION');
  }).first();

  const root = ancla.length ? ancla.parent() : $('body');

  const fragmentos: string[] = [];
  root.find('div').each((_, el) => {
    const t = clean($(el).clone().children().remove().end().text());
    if (t) fragmentos.push(t);
  });

  const idx = fragmentos.findIndex(f =>
    f.toUpperCase().includes('CLASIFICACIÓN') || f.toUpperCase().includes('CLASIFICACION')
  );
  return idx >= 0 ? fragmentos.slice(idx + 1) : fragmentos;
}

export function parseClasificacion(html: string, nombreClub: string): ClasificacionScrapeada[] {
  const frags = extraerFragmentosClasificacion(html);
  const filas: ClasificacionScrapeada[] = [];
  const norm = nombreClub.toLowerCase();

  let i = 0;
  while (i < frags.length) {
    const f = frags[i]!;

    // Buscar inicio de fila: una POSICION (número entre 1 y 30)
    if (!isNumero(f)) {
      i++;
      continue;
    }
    const posicion = parseInt(f);
    if (posicion < 1 || posicion > 30) {
      i++;
      continue;
    }

    // Patrón: pos · nombre · puntos · jugados · ganados · empatados · perdidos · gf · gc
    if (i + 8 >= frags.length) break;

    const nombre = frags[i + 1]!;
    const puntos    = isNumero(frags[i + 2]!) ? parseInt(frags[i + 2]!) : null;
    const jugados   = isNumero(frags[i + 3]!) ? parseInt(frags[i + 3]!) : null;
    const ganados   = isNumero(frags[i + 4]!) ? parseInt(frags[i + 4]!) : null;
    const empatados = isNumero(frags[i + 5]!) ? parseInt(frags[i + 5]!) : null;
    const perdidos  = isNumero(frags[i + 6]!) ? parseInt(frags[i + 6]!) :
