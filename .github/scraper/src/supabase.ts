import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno. Revisa tu .env'
  );
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false }
});
