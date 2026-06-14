import { request } from 'undici';
import { supabase } from './supabase.js';
import { parsePartidos, parseClasificacion } from './parser.js';
import type { Equipo, PartidoScrapeado, ClasificacionScrapeada } from './types.js';

const DEBUG = process.env.DEBUG === '1';
const NOMBRE_CLUB = 'Union Isora';
const USER_AGENT = 'CD-Union-Isora-Bot/1.0 (+contacto: cdunionisora2019@gmail.com)';

function log(...args: unknown[]) {
  console.log('[scraper]', ...args);
}
function debug(...args: unknown[]) {
  if (DEBUG) console.log('[debug]', ...args);
}

async function descargarHTML(url: string): Promise<string> {
  const res = await request(url, {
    headers: { 'user-agent': USER_AGENT },
    maxRedirections: 3,
  });
  if (res.statusCode >= 400) {
    throw new Error('HTTP ' + res.statusCode + ' al descargar ' + url);
  }
  return await res.body.text();
}

async function leerEquiposActivos(): Promise<Equipo[]> {
  const { data, error } = await supabase
    .from('equipos')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Equipo[];
}

async function guardarPartidos(equipo: Equipo, partidos: PartidoScrapeado[]) {
  if (partidos.length === 0) {
    log('  (sin partidos parseados para ' + equipo.nombre + ')');
    return;
  }

  const filas = partidos.map(p => ({
    equipo_id: equipo.id,
    jornada: p.jornada,
    fecha: p.fecha,
    hora: p.hora,
    local: p.local,
    visitante: p.visitante,
    goles_local: p.goles_local,
    goles_visitante: p.goles_visitante,
    uniq_key: p.uniq_key,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('partidos')
    .upsert(filas, { onConflict: 'equipo_id,uniq_key' });

  if (error) throw error;
  log('  OK ' + partidos.length + ' partidos sincronizados');
}

async function guardarClasificacion(equipo: Equipo, filas: ClasificacionScrapeada[]) {
  if (filas.length === 0) {
    log('  (sin clasificacion parseada para ' + equipo.nombre + ')');
    return;
  }

  const { error: errDel } = await supabase
    .from('clasificacion')
    .delete()
    .eq('equipo_id', equipo.id);
  if (errDel) throw errDel;

  const datos = filas.map(f => ({
    equipo_id: equipo.id,
    posicion: f.posicion,
    nombre_equipo: f.nombre_equipo,
    puntos: f.puntos,
    jugados: f.jugados,
    ganados: f.ganados,
    empatados: f.empatados,
    perdidos: f.perdidos,
    goles_favor: f.goles_favor,
    goles_contra: f.goles_contra,
    es_nuestro: f.es_nuestro,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('clasificacion').insert(datos);
  if (error) throw error;
  log('  OK ' + filas.length + ' filas de clasificacion sincronizadas');
}

async function main() {
  const inicio = Date.now();
  log('Inicio ' + new Date().toISOString());

  const equipos = await leerEquiposActivos();
  log('Encontrados ' + equipos.length + ' equipos activos en Supabase');

  let totalOk = 0;
  let totalKo = 0;

  for (const eq of equipos) {
    log('-> ' + eq.nombre + ' (' + eq.competicion + ')');
    try {
      const html = await descargarHTML(eq.url_federacion);
      debug('  HTML ' + html.length + ' bytes');

      const partidos = parsePartidos(html, NOMBRE_CLUB);
      debug('  Parseados ' + partidos.length + ' partidos');
      await guardarPartidos(eq, partidos);

      try {
        const clasif = parseClasificacion(html, NOMBRE_CLUB);
        debug('  Parseadas ' + clasif.length + ' filas de clasificacion');
        await guardarClasificacion(eq, clasif);
      } catch (eClasif) {
        console.error('  AVISO clasificacion de ' + eq.nombre + ' fallo: ' + (eClasif as Error).message);
      }

      totalOk++;
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      totalKo++;
      console.error('  ERROR con ' + eq.nombre + ': ' + (e as Error).message);
    }
  }

  const ms = Date.now() - inicio;
  log('Fin ' + totalOk + ' OK, ' + totalKo + ' con error, ' + ms + ' ms');

  if (totalKo > 0) process.exit(1);
}

main().catch(err => {
  console.error('[fatal]', err);
  process.exit(1);
});
