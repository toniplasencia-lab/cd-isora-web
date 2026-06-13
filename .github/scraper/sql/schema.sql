-- ============================================================================
-- CD UNIÓN ISORA · Esquema Supabase
-- Ejecuta este script una sola vez en el SQL Editor de Supabase
-- ============================================================================

-- Tabla de equipos del club (sénior, juvenil, cadete, infantil, alevín…)
CREATE TABLE IF NOT EXISTS public.equipos (
  id              BIGSERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,            -- p.ej. 'senior', 'cadete-g6'
  nombre          TEXT NOT NULL,                   -- 'Sénior', 'Cadete Primera G6'
  categoria       TEXT NOT NULL,                   -- 'senior', 'cadete', 'juvenil'...
  competicion     TEXT NOT NULL,                   -- 'Regional Segunda G2'
  url_federacion  TEXT NOT NULL,                   -- URL de la página de la federación
  orden           INT NOT NULL DEFAULT 100,        -- Para ordenar en la web
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de partidos (calendario + resultados)
CREATE TABLE IF NOT EXISTS public.partidos (
  id              BIGSERIAL PRIMARY KEY,
  equipo_id       BIGINT NOT NULL REFERENCES public.equipos(id) ON DELETE CASCADE,
  jornada         INT,
  fecha           DATE,
  hora            TIME,
  local           TEXT NOT NULL,
  visitante       TEXT NOT NULL,
  goles_local     INT,                             -- NULL = no jugado todavía
  goles_visitante INT,
  jugado          BOOLEAN GENERATED ALWAYS AS (
                    goles_local IS NOT NULL AND goles_visitante IS NOT NULL
                  ) STORED,
  -- Identificador único por equipo+jornada para idempotencia del scraper
  uniq_key        TEXT NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (equipo_id, uniq_key)
);

CREATE INDEX IF NOT EXISTS idx_partidos_equipo  ON public.partidos (equipo_id);
CREATE INDEX IF NOT EXISTS idx_partidos_fecha   ON public.partidos (fecha);
CREATE INDEX IF NOT EXISTS idx_partidos_jugado  ON public.partidos (jugado);

-- ============================================================================
-- Row Level Security: la web solo lee, el scraper escribe con la service_role
-- ============================================================================
ALTER TABLE public.equipos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidos ENABLE ROW LEVEL SECURITY;

-- Permitir SELECT público (anon) para que la web pueda leer
DROP POLICY IF EXISTS "Lectura pública equipos"  ON public.equipos;
DROP POLICY IF EXISTS "Lectura pública partidos" ON public.partidos;

CREATE POLICY "Lectura pública equipos"
  ON public.equipos FOR SELECT
  USING (true);

CREATE POLICY "Lectura pública partidos"
  ON public.partidos FOR SELECT
  USING (true);

-- ============================================================================
-- SEED · Equipos del CD Unión Isora
-- (URLs reales de futboltenerife.com, ajústalas tras inspeccionar cada equipo)
-- ============================================================================
INSERT INTO public.equipos (slug, nombre, categoria, competicion, url_federacion, orden) VALUES
  ('senior',     'Sénior',          'senior',   'Regional Segunda G2',
   'https://futboltenerife.com/1regional-segunda-grupo-dos/estadisticas-regional-segunda-g2-RSD1', 10),
  ('cadete-g6',  'Cadete Primera G6','cadete',  'Cadete Primera Tenerife G6',
   'https://futboltenerife.com/1cadete-primera-grupo-seis/estadisticas-cadete-primera-g6-CPS9', 30)
ON CONFLICT (slug) DO UPDATE
  SET nombre = EXCLUDED.nombre,
      categoria = EXCLUDED.categoria,
      competicion = EXCLUDED.competicion,
      url_federacion = EXCLUDED.url_federacion,
      orden = EXCLUDED.orden;
