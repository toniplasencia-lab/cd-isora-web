import * as cheerio from 'cheerio';
import type { PartidoScrapeado } from './types.js';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Solo actas de partidos finalizados del calendario de este equipo. */
export function parseResultadosWana(html: string, urlEquipo: string): PartidoScrapeado[] {
  const $ = cheerio.load(html);
  const [inicio, fin] = $('title').text().match(/\b(20\d{2})\/(\d{2})\b/)?.slice(1).map(Number) ?? [];
  const pathEquipo = new URL(urlEquipo).pathname.replace(/\/$/, '');
  const path = (href: string) => new URL(href, urlEquipo).pathname.replace(/\/$/, '');
  if (!inicio || fin !== (inicio + 1) % 100 ||
      path($('link[rel="canonical"]').attr('href') ?? '/') !== pathEquipo ||
      !$('#calendario .fb-partido').length) {
    throw new Error('No se reconoce el calendario de WanaFutbol para este equipo');
  }

  const resultados: PartidoScrapeado[] = [];
  $('#calendario .fb-partido').each((_, el) => {
    const fila = $(el);
    const marcador = fila.children('.fb-marcador[title="Finalizado"]');
    if (!marcador.length) return;
    const equipos = fila.children('.fb-equipo');
    const local = equipos.eq(0).children('span').text().trim();
    const visitante = equipos.eq(1).children('span').text().trim();
    if (!local || !visitante || equipos.length !== 2 ||
        !equipos.toArray().some(eq => path($(eq).attr('href') ?? '/') === pathEquipo)) return;
    const enlace = fila.children('a.fb-partido__acta').attr('href');
    if (!enlace) return;
    const acta = new URL(enlace, urlEquipo);
    const codActa = acta.searchParams.get('CodActa') ?? '';
    if (acta.hostname !== 'www.ftf.es' || !acta.pathname.endsWith('/NFG_CmpPartido') ||
        !/^\d+$/.test(codActa)) return;
    const goles = marcador.children('.fb-marcador__g').map((_, g) => $(g).text().trim()).get();
    const meta = fila.children('.fb-partido__meta').text().replace(/\s+/g, ' ').trim();
    const fechaTexto = meta.match(/^\p{L}+ (\d{1,2}) ([a-z]{3})\.?(?: (\d{2}:\d{2}))?\s*·/u);
    const jornada = Number(meta.match(/·\s*Jornada (\d+)\s*$/i)?.[1]);
    if (!jornada || !fechaTexto || goles.length !== 2 || !goles.every(g => /^\d{1,2}$/.test(g))) return;
    const mes = MESES.indexOf(fechaTexto[2]!) + 1;
    if (!mes) return;
    const fecha = `${mes >= 7 ? inicio : inicio + 1}-${String(mes).padStart(2, '0')}-${fechaTexto[1]!.padStart(2, '0')}`;
    if (!Number.isFinite(Date.parse(fecha)) || new Date(fecha).toISOString().slice(0, 10) !== fecha) return;
    resultados.push({
      jornada, fecha, hora: fechaTexto[3] ?? null, local, visitante,
      goles_local: Number(goles[0]), goles_visitante: Number(goles[1]),
      uniq_key: 'ftf-acta-' + codActa, cod_acta: codActa,
    });
  });
  return [...new Map(resultados.map(p => [p.uniq_key, p])).values()];
}
