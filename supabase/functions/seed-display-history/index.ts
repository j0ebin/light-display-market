
// This is a Supabase Edge Function
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { createSupabaseClient } from "./supabase-client.ts";
import { seedDisplayData } from "./seed-display-data.ts";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client with auth header
    const supabase = createSupabaseClient(authHeader);
    
    // Seed the display history data
    const result = await seedDisplayData(supabase);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error seeding display history:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An error occurred while seeding display history data'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
