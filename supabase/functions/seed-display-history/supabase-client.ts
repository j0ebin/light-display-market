
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export const createSupabaseClient = (authHeader: string) => {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    { global: { headers: { Authorization: authHeader } } }
  );
};
