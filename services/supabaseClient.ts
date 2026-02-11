
import { createClient } from '@supabase/supabase-js';

// Fallback sicuro se le variabili d'ambiente mancano (comune nei deploy statici senza build step)
// Fixed: accessed process.env directly instead of via window object to resolve TS errors
const supabaseUrl = process.env.SUPABASE_URL || 'https://hjlyygxgatdvdopcegnj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_4_RZ_XFss5iKgfjXk5Xuww_ua1g7eYi';

if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error("Supabase URL mancante. L'app non funzionerà correttamente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
