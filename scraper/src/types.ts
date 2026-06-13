/**
 * Tipos compartidos entre el scraper y Supabase.
 */

export interface Equipo {
  id: number;
  slug: string;
  nombre: string;
  categoria: string;
  competicion: string;
  url_federacion: string;
  orden: number;
  activo: boolean;
}

export interface PartidoScrapeado {
  jornada: number | null;
  fecha: string | null;        // ISO YYYY-MM-DD
  hora: string | null;         // HH:mm
  local: string;
  visitante: string;
  goles_local: number | null;
  goles_visitante: number | null;
  /** Clave para detectar duplicados al hacer upsert */
  uniq_key: string;
}
