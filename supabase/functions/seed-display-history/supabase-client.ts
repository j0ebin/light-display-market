import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export const createSupabaseClient = (authHeader: string) => {
  const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('VITE_SUPABASE_ANON_KEY') || '';
  
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    { global: { headers: { Authorization: authHeader } } }
  );
};
