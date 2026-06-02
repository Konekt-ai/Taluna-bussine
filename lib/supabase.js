import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si todavía no hay llaves configuradas, exportamos null y la web
// usa los datos de ejemplo (ver lib/products.js). Así nunca se rompe.
export const supabase =
  url && key && !url.includes('TU-PROYECTO') ? createClient(url, key) : null;

export const isSupabaseReady = Boolean(supabase);
