
// This is a Supabase Edge Function
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Mock data to seed into the database
    const displayYears = [
      {
        display_id: 1,
        year: 2020,
        description: 'Our first year with a simple static display featuring classic Christmas lights and a few inflatables.'
      },
      {
        display_id: 1,
        year: 2021,
        description: 'Added synchronized music through an FM transmitter and basic light sequencing.'
      },
      {
        display_id: 1,
        year: 2022,
        description: 'Upgraded to full xLights sequencing with over 20,000 pixels and custom props.'
      },
      {
        display_id: 1,
        year: 2023,
        description: 'Expanded the display to include a 20-foot mega tree, singing faces, and interactive elements.'
      }
    ];

    // Create a displays record first if it doesn't exist
    const { data: existingDisplays } = await supabase
      .from('displays')
      .select('id')
      .eq('id', 1)
      .single();

    if (!existingDisplays) {
      // Insert sample display if it doesn't exist
      await supabase.from('displays').insert([
        {
          id: 1,
          name: 'Winter Wonderland Symphony',
          description: 'A spectacular holiday light display synchronized to music.',
          location: 'Seattle, WA',
          holiday_type: 'Christmas',
          display_type: 'Musical Light Show'
        }
      ]);
    }

    // Insert years
    const { data: years, error: yearsError } = await supabase
      .from('display_years')
      .insert(displayYears)
      .select();

    if (yearsError) {
      throw yearsError;
    }

    // Seed media and songs for each year
    let insertedMedia = [];
    let insertedSongs = [];

    if (years && years.length > 0) {
      // Create media for each year
      const mediaToInsert = years.flatMap((year, index) => [
        {
          display_year_id: year.id,
          type: 'image',
          url: `https://images.unsplash.com/photo-${1570000000 + index}?q=80&w=1080`,
          description: `Display photo from ${year.year}`
        },
        // Add a video for years after 2021
        ...(year.year >= 2022 ? [{
          display_year_id: year.id,
          type: 'video',
          url: 'https://www.youtube.com/embed/YEHIkcAXP9Y',
          description: `Light show video from ${year.year}`
        }] : [])
      ]);

      const { data: media, error: mediaError } = await supabase
        .from('display_media')
        .insert(mediaToInsert)
        .select();

      if (mediaError) {
        throw mediaError;
      }

      insertedMedia = media || [];

      // Create songs for each year
      const songsBase = [
        {
          title: 'Carol of the Bells',
          artist: 'Trans-Siberian Orchestra',
          year_introduced: 2021,
          sequence_available: true,
          sequence_price: 19.99
        },
        {
          title: 'All I Want for Christmas Is You',
          artist: 'Mariah Carey',
          year_introduced: 2022,
          sequence_available: true,
          sequence_price: 24.99
        },
        {
          title: 'Let It Go',
          artist: 'Idina Menzel',
          year_introduced: 2022,
          sequence_available: true,
          sequence_price: 29.99
        },
        {
          title: 'Christmas Eve/Sarajevo',
          artist: 'Trans-Siberian Orchestra',
          year_introduced: 2023,
          sequence_available: true,
          sequence_price: 34.99
        }
      ];

      // Create songs for each year with proper references
      const songsByYear = {};
      for (const year of years) {
        const yearSongs = songsBase
          .filter(song => song.year_introduced <= year.year)
          .map(song => ({
            display_year_id: year.id,
            title: song.title,
            artist: song.artist,
            year_introduced: song.year_introduced,
            sequence_available: song.sequence_available,
            sequence_price: song.sequence_price,
            // No reused_from yet, will update later
            reused_from: null
          }));

        const { data: songs } = await supabase
          .from('display_songs')
          .insert(yearSongs)
          .select();

        if (songs) {
          songsByYear[year.year] = songs;
          insertedSongs = [...insertedSongs, ...songs];
        }
      }

      // Now update the reused_from references for songs in later years
      const updates = [];
      for (let i = 1; i < years.length; i++) {
        const currentYear = years[i].year;
        const previousYears = years.slice(0, i).map(y => y.year);
        
        for (const song of songsByYear[currentYear] || []) {
          // Find matching song in previous years
          for (const prevYear of previousYears) {
            const matchingSongs = (songsByYear[prevYear] || [])
              .filter(s => s.title === song.title && s.artist === song.artist);
            
            if (matchingSongs.length > 0) {
              // Update the reused_from field
              updates.push({
                id: song.id,
                reused_from: matchingSongs[0].id
              });
              break;
            }
          }
        }
      }

      if (updates.length > 0) {
        await supabase.from('display_songs').upsert(updates);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Display history data seeded successfully',
        data: {
          years: years || [],
          media: insertedMedia,
          songs: insertedSongs
        }
      }),
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
