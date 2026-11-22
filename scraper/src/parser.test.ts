import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parsePartidos } from './parser.js';
import { parseResultadosWana } from './wanafutbol.js';

const tarjeta = (n: number, local: string, visitante: string, goles: string[], estado = '') => `
  <div class="border border-4 rounded">
    <div><div>J${n}</div><div>21-11-2026</div><div>${estado}</div><div>18:00</div></div>
    <div><div></div><div>${goles.map(g => `<div>${g}</div>`).join('')}</div><div></div></div>
    <div><div>${local}</div><div><button>Ficha</button></div><div>${visitante}</div></div>
  </div>`;

test('las tarjetas conservan el orden local/visitante, un 0–0 real y los pendientes', () => {
  const filas = [
    tarjeta(9, 'Guargacho', 'Union Isora', ['7', '0']),
    tarjeta(10, 'Unión Isora', 'Esmugran', ['0', '0']),
    tarjeta(11, 'Raqui', 'Union Isora', ['', '', '-', '-']),
    tarjeta(12, 'Union Isora', 'Las Zocas', ['0', '0'], 'Suspendido'),
    tarjeta(13, '8', 'Union Isora', ['0', '0']),
  ].join('');
  const partidos = parsePartidos(`<div><div>TODOS LOS PARTIDOS DEL UNION ISORA</div>${filas}</div>`, 'Union Isora');
  assert.deepEqual(partidos.map(p => [p.jornada, p.local, p.visitante, p.goles_local, p.goles_visitante]), [
    [9, 'Guargacho', 'Union Isora', 7, 0],
    [10, 'Unión Isora', 'Esmugran', 0, 0],
    [11, 'Raqui', 'Union Isora', null, null],
    [12, 'Union Isora', 'Las Zocas', null, null],
  ]);
});

test('el formato antiguo admite marcadores y guiones sin desplazar el visitante', () => {
  const campos = ['TODOS LOS PARTIDOS DEL UNION ISORA', '20-11-2026', '18:00', '11', 'Union Isora', '0', '2', 'Fasnia',
    '27-11-2026', '21:00', '12', 'At. Alcala', '-', '-', 'Union Isora'];
  const partidos = parsePartidos(campos.map(t => `<div>${t}</div>`).join(''), 'Union Isora');
  assert.deepEqual(partidos.map(p => [p.local, p.visitante, p.goles_local, p.goles_visitante]), [
    ['Union Isora', 'Fasnia', 0, 2], ['At. Alcala', 'Union Isora', null, null],
  ]);
});

test('el femenino solo publica finales con acta y conserva la temporada al pasar a enero', () => {
  const url = 'https://wanafutbol.com/equipo/union-isora-femenino';
  const fila = (estado: string, acta: string) => `<div class="fb-partido">
    <a class="fb-equipo" href="/equipo/alcala"><span>C.D.F. Alcalá</span></a>
    <a class="fb-marcador" title="${estado}"><span class="fb-marcador__g">0</span><span class="fb-marcador__g">0</span></a>
    <a class="fb-equipo" href="${url}"><span>C.D. Unión Isora</span></a>
    ${acta ? `<a class="fb-partido__acta" href="https://www.ftf.es/pnfg/NPcd/NFG_CmpPartido?CodActa=${acta}"></a>` : ''}
    <div class="fb-partido__meta">sáb 9 ene 20:00 · Playa San Juan · Jornada 9</div></div>`;
  const html = `<title>Unión Isora 2026/27: resultados</title><link rel="canonical" href="${url}">
    <div id="calendario">${fila('Finalizado', '262212')}${fila('En directo', '262213')}
    ${fila('Suspendido', '262214')}${fila('Finalizado', '')}</div>`;
  assert.deepEqual(parseResultadosWana(html, url), [{
    jornada: 9, fecha: '2027-01-09', hora: '20:00', local: 'C.D.F. Alcalá', visitante: 'C.D. Unión Isora',
    goles_local: 0, goles_visitante: 0, uniq_key: 'ftf-acta-262212', cod_acta: '262212',
  }]);
});
