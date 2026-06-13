/**
 * Configuración de la web · CD Unión Isora
 *
 * IMPORTANTE: aquí solo se usa la clave PUBLISHABLE (pública) de Supabase,
 * que solo permite operaciones de LECTURA gracias a las políticas RLS
 * definidas en scraper/sql/schema.sql.
 *
 * NUNCA pegues aquí la clave 'secret' (sb_secret_...): esa va en GitHub
 * Secrets o en el .env local del scraper, y permite escribir en la BD.
 */
window.CD_ISORA_CONFIG = {
  // Project Settings → API → Project URL
  SUPABASE_URL: "https://jwbezhbaivdmfmnvlrvk.supabase.co",

  // Project Settings → API Keys → publishable (empieza por sb_publishable_)
  SUPABASE_ANON_KEY: "sb_publishable_k1FbkmskPPyI8PxhiYrKFA_G4s9O-QT"
};
