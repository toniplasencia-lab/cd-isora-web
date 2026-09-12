# Alineaciones / actas de partido (ftf.es)

Este documento explica cómo funciona el enlace "Ver alineación" que aparece en
`partidos.html` y cómo mantenerlo actualizado semana a semana.

## Cómo funciona

Cada partido en la tabla `partidos` de Supabase puede tener una columna
`cod_acta`. Cuando existe, `js/partidos.js` construye un enlace a la ficha
oficial del partido en la Federación Tinerfeña de Fútbol (ftf.es):

```
https://www.ftf.es/pnfg/NPcd/NFG_CmpPartido?cod_primaria=1000120&CodActa=<cod_acta>
```

Esa página muestra la convocatoria/alineación en cuanto el club o el árbitro
la registra en ftf.es (normalmente pocos días antes del partido, y se
completa con titulares/suplentes tras el pitido inicial).

## De dónde sale el `cod_acta`

La tabla `equipos` guarda, por equipo, los identificadores de ftf.es para la
temporada en curso:

| Equipo | ftf_codigo_equipo | ftf_codcompeticion | ftf_codgrupo | ftf_codtemporada |
|---|---|---|---|---|
| Sénior | 3004 | 903525650 | 903525653 | 22 |
| Cadete Preferente G3 | 873 | 903525738 | 903525741 | 22 |
| Juvenil Primera G3 | 872 | 903525704 | 903525706 | 22 |

`ftf_codtemporada=22` corresponde a la temporada 2026-27. **Cada temporada
nueva hay que volver a comprobar este número** entrando en:

```
https://www.ftf.es/pnfg/NPcd/NFG_VisCompeticiones_Club?cod_primaria=1000123&codclub=10159&codtemporada=<N>
```

probando valores de `<N>` hasta encontrar la temporada correcta (el año pasado
era 21; cada temporada nueva suele sumar 1, pero conviene confirmarlo).

Con esos códigos, la jornada de cada equipo se consulta así:

```
https://www.ftf.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=<ftf_codcompeticion>&CodGrupo=<ftf_codgrupo>&CodTemporada=<ftf_codtemporada>&CodJornada=<N>
```

Cada partido de Unión Isora en esa página tiene, junto al marcador, un enlace
`NFG_CmpPrevio?...&CodActa=<id>` (antes del partido) o
`NFG_CmpPartido?...&CodActa=<id>` (una vez jugado). Si en vez de un enlace
aparece "Previo no disponible", significa que ftf.es todavía no ha asignado
el acta a ese partido — hay que volver a comprobarlo más cerca de la fecha.

## Actualizar Supabase

Una vez se tiene el `CodActa` de un partido, se guarda así (ejemplo real, el
primer partido de la temporada 2026-27 del sénior):

```sql
UPDATE public.partidos p
SET cod_acta = '248439'
FROM public.equipos e
WHERE p.equipo_id = e.id
  AND e.slug = 'senior'
  AND p.jornada = 1
  AND p.fecha = '2026-09-13';
```

## Por qué esto no está automatizado en GitHub Actions

El scraper de `scraper/src/*.ts` (calendario y clasificación) funciona bien
en GitHub Actions porque futboltenerife.com no bloquea las peticiones del
runner. **ftf.es sí bloquea esas peticiones** (devuelve respuestas vacías), así
que por ahora la actualización de `cod_acta` se hace manualmente, pidiéndole
al asistente que lo revise semana a semana o antes de cada jornada.

## Historial

- 2026-09-12: primera versión. Se corrigió un error de temporada
  (`CodTemporada=21` en vez de `22`) que hacía que la numeración de jornadas
  de ftf.es no coincidiera con el calendario real. Con `CodTemporada=22` la
  numeración coincide para los tres equipos (sénior, cadete, juvenil).
