import { request } from 'undici';
import { supabase } from './supabase.js';
import { parsePartidos } from './parser.js';
import type { Equipo, PartidoScrapeado } from './types.js';

const DEBUG = process.env.DEBUG === '1';
const NOMBRE_CLUB = 'Union Isora';
const USER_AGENT = 'CD-Union-Isora-Bot/1.0 (+contacto: info@cdunionisora.es)';

function log(...args: unknown[]) {
  console.log('[scraper]', ...args);
}
function debug(...args: unknown[]) {
  if (DEBUG) console.log('[debug]', ...args);
}

/**
 * Descarga el HTML de la federación para un equipo concreto.
 */
async function descargarHTML(url: string): Promise<string> {
  const res = await request(url, {
    headers: { 'user-agent': USER_AGENT },
    maxRedirections: 3,
  });
  if (res.statusCode >= 400) {
    throw new Error(`HTTP ${res.statusCode} al descargar ${url}`);
  }
  return await res.body.text();
}

/**
 * Lee los equipos activos desde Supabase.
 */
async function leerEquiposActivos(): Promise<Equipo[]> {
  const { data, error } = await supabase
    .from('equipos')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Equipo[];
}

/**
 * Hace upsert de los partidos de un equipo, evitando duplicados por uniq_key.
 */
async function guardarPartidos(equipo: Equipo, partidos: PartidoScrapeado[]) {
  if (partidos.length === 0) {
    log(`  (sin partidos parseados para ${equipo.nombre})`);
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
  log(`  ✓ ${partidos.length} partidos sincronizados`);
}

/**
 * Punto de entrada.
 */
async function main() {
  const inicio = Date.now();
  log('Inicio · ' + new Date().toISOString());

  const equipos = await leerEquiposActivos();
  log(`Encontrados ${equipos.length} equipos activos en Supabase`);

  let totalOk = 0;
  let totalKo = 0;

  for (const eq of equipos) {
    log(`→ ${eq.nombre} (${eq.competicion})`);
    try {
      const html = await descargarHTML(eq.url_federacion);
      debug(`  HTML ${html.length} bytes`);
      const partidos = parsePartidos(html, NOMBRE_CLUB);
      debug(`  Parseados ${partidos.length} partidos`);
      await guardarPartidos(eq, partidos);
      totalOk++;
      // pausa cortés para no martillear la web
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      totalKo++;
      console.error(`  ✗ Error con ${eq.nombre}:`, (e as Error).message);
    }
  }

  const ms = Date.now() - inicio;
  log(`Fin · ${totalOk} OK · ${totalKo} con error · ${ms} ms`);

  if (totalKo > 0) process.exit(1);
}

main().catch(err => {
  console.error('[fatal]', err);
  process.exit(1);
});
