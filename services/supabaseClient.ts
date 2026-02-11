
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://hjlyygxgatdvdopcegnj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_4_RZ_XFss5iKgfjXk5Xuww_ua1g7eYi';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing. Check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
