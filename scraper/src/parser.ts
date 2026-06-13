import * as cheerio from 'cheerio';
import type { PartidoScrapeado } from './types.js';

/**
 * Parser del HTML de futboltenerife.com.
 *
 * La página de cada equipo contiene una sección que arranca con el texto
 * "TODOS LOS PARTIDOS DEL ..." y, a partir de ahí, los datos aparecen como
 * fragmentos planos en este orden por cada partido:
 *
 *   fecha · hora · jornada · LOCAL · [goles_L · goles_V] · VISITANTE
 *
 * Cuando el partido aún no se ha jugado, los goles no aparecen y queda:
 *
 *   fecha · hora · jornada · LOCAL · VISITANTE
 *
 * Esto se debe a que los <div> de la web tienen anchos relativos pero no
 * llevan clases identificativas, así que usamos esta secuencia como contrato.
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

/**
 * Extrae los fragmentos de texto en orden desde la sección
 * "TODOS LOS PARTIDOS DEL ...".
 */
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

  // Descartar todo lo anterior a "TODOS LOS PARTIDOS DEL"
  const idx = fragmentos.findIndex(f => f.includes('TODOS LOS PARTIDOS DEL'));
  return idx >= 0 ? fragmentos.slice(idx + 1) : fragmentos;
}

/**
 * Convierte la lista plana de fragmentos en partidos estructurados.
 */
export function parsePartidos(html: string, nombreClub: string): PartidoScrapeado[] {
  const frags = extraerFragmentos(html);
  const partidos: PartidoScrapeado[] = [];

  let i = 0;
  while (i < frags.length) {
    const f = frags[i]!;

    // Buscar el inicio de un partido: una FECHA
    if (!isFecha(f)) {
      i++;
      continue;
    }

    // Patrón mínimo necesario: fecha, hora, jornada, local, ..., visitante
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

    // ¿Hay goles? → siguientes 2 fragmentos son numéricos y luego visitante
    if (i + 6 < frags.length && isNumero(frags[i + 4]!) && isNumero(frags[i + 5]!)) {
      golesLocal = parseInt(frags[i + 4]!);
      golesVisitante = parseInt(frags[i + 5]!);
      visitante = frags[i + 6]!;
      nextIndex = i + 7;
    } else {
      // Partido sin jugar todavía
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

  // Sanity check: solo conservar partidos que involucren a nuestro club
  const norm = nombreClub.toLowerCase();
  return partidos.filter(p =>
    p.local.toLowerCase().includes(norm) ||
    p.visitante.toLowerCase().includes(norm)
  );
}
