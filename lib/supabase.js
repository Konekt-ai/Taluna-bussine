import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cada cuánto (segundos) la tienda vuelve a preguntar por el catálogo.
// Es lo que hace que un cambio del Organizador aparezca solo, sin volver
// a desplegar. El Organizador además avisa al instante cuando se guarda
// algo (ver app/api/revalidate/route.js); esto es la red de seguridad.
export const CATALOG_REVALIDATE = 60;

// Si todavía no hay llaves configuradas, exportamos null y la web
// usa los datos de ejemplo (ver lib/products.js). Así nunca se rompe.
export const supabase =
  url && key && !url.includes('TU-PROYECTO')
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        // Next cachea los fetch del servidor de por vida; sin esto el
        // catálogo se quedaría congelado en lo que había al hacer build.
        global: {
          fetch: (input, init) =>
            fetch(input, { ...init, next: { revalidate: CATALOG_REVALIDATE } }),
        },
      })
    : null;

export const isSupabaseReady = Boolean(supabase);
