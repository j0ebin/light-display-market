// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Check if we have displays in the database already
    const { data: existingDisplays, error: displayError } = await supabaseClient
      .from('displays')
      .select('id')
      .limit(1);

    if (displayError) {
      throw new Error(`Error checking displays: ${displayError.message}`);
    }

    if (!existingDisplays || existingDisplays.length === 0) {
      // Insert a display if none exists
      const { data: newDisplay, error: insertError } = await supabaseClient
        .from('displays')
        .insert({
          name: 'Winter Wonderland Symphony',
          description: 'A spectacular holiday light display synchronized to music, featuring over 50,000 LED lights programmed to dance to a variety of Christmas classics and contemporary holiday hits. The display includes animated snowflakes, dancing trees, singing faces, and a mesmerizing light tunnel that immerses visitors in a world of color and sound.',
          location: 'Seattle, WA',
          latitude: 47.6062,
          longitude: -122.3321,
          holiday_type: 'Christmas',
          display_type: 'Musical Light Show',
          year_started: 2018,
          fm_station: '88.1 FM',
          image_url: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
          tags: ['musical', 'family-friendly', 'animated', 'synchronized', 'LED'],
          schedule: {
            start_date: '2023-11-25',
            end_date: '2024-01-05',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            hours: {
              start: '17:00',
              end: '22:00'
            }
          }
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error inserting display: ${insertError.message}`);
      }

      // Use a different variable name to avoid reassignment error
      const displayToUse = [newDisplay];
      
      // Check if we already have display years for this display
      const displayId = displayToUse[0].id;
      const { data: existingYears, error: yearsError } = await supabaseClient
        .from('display_years')
        .select('id')
        .eq('display_id', displayId)
        .limit(1);

      if (yearsError) {
        throw new Error(`Error checking display years: ${yearsError.message}`);
      }

      // If we already have years, don't seed again
      if (existingYears && existingYears.length > 0) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Display history data already exists' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Insert display years
      const { data: years, error: insertYearsError } = await supabaseClient
        .from('display_years')
        .insert([
          {
            display_id: displayId,
            year: 2020,
            description: 'Our first year with a simple static display featuring classic Christmas lights and a few inflatables.'
          },
          {
            display_id: displayId,
            year: 2021,
            description: 'Added synchronized music through an FM transmitter and basic light sequencing.'
          },
          {
            display_id: displayId,
            year: 2022,
            description: 'Upgraded to full xLights sequencing with over 20,000 pixels and custom props.'
          },
          {
            display_id: displayId,
            year: 2023,
            description: 'Expanded the display to include a 20-foot mega tree, singing faces, and interactive elements.'
          }
        ])
        .select();

      if (insertYearsError) {
        throw new Error(`Error inserting display years: ${insertYearsError.message}`);
      }

      // Map for year IDs
      const yearMap: { [key: number]: string } = {};
      years.forEach(year => {
        yearMap[year.year] = year.id;
      });

      // Insert media for each year
      const mediaInserts = [
        {
          display_year_id: yearMap[2020],
          type: 'image',
          url: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?q=80&w=1080',
          description: 'Front yard with traditional string lights'
        },
        {
          display_year_id: yearMap[2021],
          type: 'image',
          url: 'https://images.unsplash.com/photo-1545608444-f045a6db6133?q=80&w=1080',
          description: 'Added light arches and mini-trees'
        },
        {
          display_year_id: yearMap[2022],
          type: 'image',
          url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1080',
          description: 'First year with pixel mapping'
        },
        {
          display_year_id: yearMap[2022],
          type: 'video',
          url: 'https://www.youtube.com/embed/YEHIkcAXP9Y',
          description: 'Full display sequence from 2022'
        },
        {
          display_year_id: yearMap[2023],
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
          description: 'Current display with mega tree'
        },
        {
          display_year_id: yearMap[2023],
          type: 'video',
          url: 'https://www.youtube.com/embed/FmFJRFEHpNQ',
          description: 'Light show feature from local news'
        }
      ];

      const { error: mediaError } = await supabaseClient
        .from('display_media')
        .insert(mediaInserts);

      if (mediaError) {
        throw new Error(`Error inserting media: ${mediaError.message}`);
      }

      // Insert songs - first the original songs
      const { data: songsData, error: songsError } = await supabaseClient
        .from('display_songs')
        .insert([
          {
            display_year_id: yearMap[2020],
            title: 'Jingle Bells',
            artist: 'Traditional',
            year_introduced: 2020,
            sequence_available: false
          },
          {
            display_year_id: yearMap[2021],
            title: 'Carol of the Bells',
            artist: 'Trans-Siberian Orchestra',
            year_introduced: 2021,
            sequence_available: true,
            sequence_price: 19.99
          },
          {
            display_year_id: yearMap[2022],
            title: 'All I Want for Christmas Is You',
            artist: 'Mariah Carey',
            year_introduced: 2022,
            sequence_available: true,
            sequence_price: 24.99
          },
          {
            display_year_id: yearMap[2022],
            title: 'Let It Go',
            artist: 'Idina Menzel',
            year_introduced: 2022,
            sequence_available: true,
            sequence_price: 29.99
          }
        ])
        .select();

      if (songsError) {
        throw new Error(`Error inserting songs: ${songsError.message}`);
      }

      // Map for song references
      const songMap: { [key: string]: string } = {};
      songsData.forEach(song => {
        const key = `${song.title}-${song.artist}`;
        songMap[key] = song.id;
      });

      // Insert reused songs for 2023
      const reusedSongs = [
        {
          display_year_id: yearMap[2023],
          title: 'Carol of the Bells',
          artist: 'Trans-Siberian Orchestra',
          year_introduced: 2021,
          reused_from: songMap['Carol of the Bells-Trans-Siberian Orchestra'],
          sequence_available: true,
          sequence_price: 19.99
        },
        {
          display_year_id: yearMap[2023],
          title: 'All I Want for Christmas Is You',
          artist: 'Mariah Carey',
          year_introduced: 2022,
          reused_from: songMap['All I Want for Christmas Is You-Mariah Carey'],
          sequence_available: true,
          sequence_price: 24.99
        },
        {
          display_year_id: yearMap[2023],
          title: 'Christmas Eve/Sarajevo',
          artist: 'Trans-Siberian Orchestra',
          year_introduced: 2023,
          sequence_available: true,
          sequence_price: 34.99
        }
      ];

      const { error: reusedSongsError } = await supabaseClient
        .from('display_songs')
        .insert(reusedSongs);

      if (reusedSongsError) {
        throw new Error(`Error inserting reused songs: ${reusedSongsError.message}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Display history data seeded successfully'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      // Displays already exist, use the existing ones
      const displayId = existingDisplays[0].id;
      
      // Check if display years already exist
      const { data: existingYears, error: yearsError } = await supabaseClient
        .from('display_years')
        .select('id')
        .eq('display_id', displayId)
        .limit(1);

      if (yearsError) {
        throw new Error(`Error checking display years: ${yearsError.message}`);
      }

      // If years already exist, don't seed again
      if (existingYears && existingYears.length > 0) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Display history data already exists' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Otherwise proceed with seeding for the existing display
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No displays to seed history for' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
