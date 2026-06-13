# CD Unión Isora · Web + Sincronización con la Federación Tinerfeña

Web estática del club con sincronización automática de partidos y resultados
desde [futboltenerife.com](https://futboltenerife.com) hacia Supabase, y carga
dinámica desde la web mediante JavaScript.

```
┌──────────────────────┐   cada 6 h    ┌──────────┐    REST    ┌─────────────┐
│ futboltenerife.com   │ ─────────────▶│ Scraper  │ ─────────▶ │  Supabase   │
│ (HTML público)       │   GitHub Act. │ Node+TS  │   upsert   │  Postgres   │
└──────────────────────┘               └──────────┘            └─────┬───────┘
                                                                     │ anon
                                                                     ▼
                                                          ┌──────────────────┐
                                                          │  partidos.html   │
                                                          │  (JS + Supabase) │
                                                          └──────────────────┘
```

## Estructura del proyecto

```
cd-isora/
├── index.html · historia.html · abonados.html · partidos.html · alineaciones.html
├── css/styles.css       ← Estilos centralizados
├── js/
│   ├── main.js          ← Menú hamburguesa
│   ├── config.js        ← Credenciales públicas de Supabase
│   └── partidos.js      ← Lectura dinámica de la BD
├── img/                 ← Escudo y otras imágenes
├── scraper/             ← Backend Node + TypeScript + Cheerio
│   ├── src/
│   │   ├── index.ts     ← Orquestador principal
│   │   ├── parser.ts    ← Parseo del HTML de la federación
│   │   ├── supabase.ts  ← Cliente con service_role
│   │   └── types.ts
│   ├── sql/schema.sql   ← Esquema y políticas RLS
│   ├── package.json · tsconfig.json · .env.example
└── .github/workflows/scrape.yml   ← Cron cada 6 h
```

## Puesta en marcha (paso a paso)

### 1. Crear el proyecto Supabase

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto nuevo
   (cualquier región europea va bien, p. ej. *eu-west-1*).
2. Anota la URL del proyecto y, sobre todo, la **service_role key** y la
   **anon key** (Project Settings → API).

### 2. Crear las tablas

1. En el proyecto Supabase, abre el **SQL Editor**.
2. Pega el contenido completo de `scraper/sql/schema.sql` y ejecútalo.
3. Esto crea `equipos` y `partidos`, las políticas RLS de solo lectura y dos
   equipos de ejemplo (sénior y cadete).

### 3. Añadir el resto de equipos del club

En `scraper/sql/schema.sql` ya hay 2 equipos sembrados. Para los demás equipos
de cantera, busca cada uno en futboltenerife.com (su URL termina en
`-XXX9` o similar) y añade filas con `INSERT INTO equipos ...`.

### 4. Probar el scraper en local

```bash
cd scraper
cp .env.example .env
# Edita .env con tus URL y SERVICE_ROLE_KEY
npm install
npm run scrape
```

Si todo va bien verás algo así:

```
[scraper] Inicio · 2026-06-13T09:30:00.000Z
[scraper] Encontrados 2 equipos activos en Supabase
[scraper] → Sénior (Regional Segunda G2)
[scraper]   ✓ 22 partidos sincronizados
[scraper] → Cadete Primera G6 (Cadete Primera Tenerife G6)
[scraper]   ✓ 22 partidos sincronizados
[scraper] Fin · 2 OK · 0 con error · 4321 ms
```

### 5. Configurar la web

Edita `js/config.js` y rellena:

```js
window.CD_ISORA_CONFIG = {
  SUPABASE_URL: "https://tu-proyecto.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi..."     // la anon, no la service_role
};
```

Abre `index.html` en el navegador o súbelo a tu hosting habitual (Vercel,
Netlify, GitHub Pages, etc.). La página `partidos.html` se rellenará sola
desde Supabase.

### 6. Automatización cada 6 horas con GitHub Actions

1. Sube el repo a GitHub.
2. En el repo de GitHub: **Settings → Secrets and variables → Actions** y
   añade dos secretos:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. El workflow `.github/workflows/scrape.yml` se ejecutará automáticamente
   cada 6 horas. También puedes lanzarlo a mano desde la pestaña **Actions**.

## Seguridad: lectura vs escritura

- La web (frontend) usa la **anon key**, pública y segura.
- El scraper usa la **service_role key**, que tiene permisos completos.
  **Nunca** la pongas en código del navegador ni en el repositorio público.
- Las políticas de RLS definidas en `schema.sql` solo permiten `SELECT` con la
  anon key, por lo que aunque se filtrase no se podría escribir nada.

## Migración futura a React/Next.js

La estructura está lista para migrarse: el esquema Supabase y la lógica de
lectura no cambian. Solo habría que envolver lo de `js/partidos.js` en un
componente React que use `@supabase/supabase-js` igual que ya haces en tu
sistema hotelero.

## Cumplimiento y buenas prácticas

- El scraper se identifica con un User-Agent propio y respeta una pausa de
  1 s entre equipos para no martillear la web de la federación.
- Solo se almacenan datos públicos disponibles en su web.
- Si la federación cambia el HTML, el parser (`scraper/src/parser.ts`) está
  pensado para fallar de forma silenciosa por equipo sin romper la web.
