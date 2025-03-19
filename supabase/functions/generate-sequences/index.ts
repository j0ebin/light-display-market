import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../seed-display-history/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Mock data for generating sequences
const songTitles = [
  "Carol of the Bells", "Winter Wonderland", "All I Want for Christmas",
  "Let It Snow", "Jingle Bell Rock", "Deck the Halls", "Santa Claus is Coming to Town",
  "Rudolph the Red-Nosed Reindeer", "Joy to the World", "Silent Night",
  "Wizards in Winter", "Christmas Eve/Sarajevo", "The Nutcracker Suite",
  "Feliz Navidad", "O Holy Night", "White Christmas", "Frosty the Snowman",
  "Little Drummer Boy", "Silver Bells", "Have Yourself a Merry Little Christmas",
  "The Christmas Song", "Carol of the Drum", "God Rest Ye Merry Gentlemen",
  "Trans-Siberian Medley", "Christmas Time", "Hallelujah", "Blue Christmas",
  "Mary, Did You Know?", "Christmas Canon", "It's Beginning to Look a Lot Like Christmas",
  "Here Comes Santa Claus", "Last Christmas", "Do You Hear What I Hear?",
  "Rockin' Around the Christmas Tree", "Sleigh Ride", "Ave Maria",
  "Christmas Time is Here", "The First Noel", "Holly Jolly Christmas", "O Come All Ye Faithful",
  "Believe", "Grandma Got Run Over by a Reindeer", "Let it Go", "Frozen Medley",
  "Winter Dreams", "Snow Miser", "Heat Miser", "Hark! The Herald Angels Sing",
  "Wonderful Christmastime", "Baby, It's Cold Outside", "Shake Up Christmas"
];

const artists = [
  "Trans-Siberian Orchestra", "Mariah Carey", "Michael Bublé", 
  "Pentatonix", "Mannheim Steamroller", "Bing Crosby", 
  "John Williams", "Frank Sinatra", "Josh Groban", 
  "Kelly Clarkson", "Lindsey Stirling", "Dean Martin", 
  "Andy Williams", "The Piano Guys", "Johnny Mathis",
  "Celine Dion", "Andrea Bocelli", "Boney M.",
  "Idina Menzel", "Nat King Cole", "Amy Grant",
  "Christina Aguilera", "Ella Fitzgerald", "Ariana Grande",
  "Justin Bieber", "The Ronettes", "Wham!",
  "Elton John", "Straight No Chaser", "Leroy Anderson"
];

function getRandomPrice() {
  // 20% chance of being free
  if (Math.random() < 0.2) {
    return 0;
  }
  
  // Otherwise, random price between $9.99 and $34.99
  return +(Math.floor(Math.random() * 2500 + 999) / 100).toFixed(2);
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Get all displays
    const { data: displays, error: displaysError } = await supabase
      .from("displays")
      .select("id, name");

    if (displaysError) {
      throw new Error(`Error fetching displays: ${displaysError.message}`);
    }

    console.log(`Found ${displays.length} displays`);

    // Create a shuffled copy of song titles for unique sequences
    const shuffledSongs = shuffleArray([...songTitles]);
    const shuffledArtists = shuffleArray([...artists]);
    
    let sequencesCreated = 0;
    const allSequences = [];

    // Process each display
    for (const display of displays) {
      console.log(`Processing display: ${display.name} (ID: ${display.id})`);
      
      // Get display years for this display
      const { data: years, error: yearsError } = await supabase
        .from("display_years")
        .select("id, year")
        .eq("display_id", display.id)
        .order("year");

      if (yearsError) {
        console.error(`Error fetching years for display ${display.id}: ${yearsError.message}`);
        continue;
      }

      if (!years || years.length === 0) {
        console.log(`No years found for display ${display.id}, creating default year`);
        
        // Create a default year if none exists
        const currentYear = new Date().getFullYear();
        const { data: newYear, error: newYearError } = await supabase
          .from("display_years")
          .insert([{
            display_id: display.id,
            year: currentYear,
            description: `Default year for ${display.name}`
          }])
          .select();

        if (newYearError) {
          console.error(`Error creating default year for display ${display.id}: ${newYearError.message}`);
          continue;
        }
        
        years.push(newYear[0]);
      }

      console.log(`Found ${years.length} years for display ${display.id}`);

      // Create 3 unique sequences for this display
      for (let i = 0; i < 3; i++) {
        if (sequencesCreated >= shuffledSongs.length) {
          console.log("Used all available songs, stopping sequence generation");
          break;
        }

        const songIndex = sequencesCreated % shuffledSongs.length;
        const artistIndex = sequencesCreated % shuffledArtists.length;
        
        const title = shuffledSongs[songIndex];
        const artist = shuffledArtists[artistIndex];
        const price = getRandomPrice();
        
        // Assign to the latest year first
        const latestYear = years[years.length - 1];
        
        // Create the sequence for the latest year
        const newSequence = {
          display_year_id: latestYear.id,
          title: title,
          artist: artist,
          year_introduced: latestYear.year,
          sequence_available: true,
          sequence_price: price,
          sequence_file_url: `https://example.com/sequences/${display.id}/${title.replace(/\s+/g, '-').toLowerCase()}.zip`,
          reused_from: null
        };
        
        allSequences.push(newSequence);
        sequencesCreated++;
      }
    }

    console.log(`Created ${allSequences.length} sequences`);

    // Insert all sequences at once
    const { data: insertedSequences, error: insertError } = await supabase
      .from("display_songs")
      .insert(allSequences)
      .select();

    if (insertError) {
      throw new Error(`Error inserting sequences: ${insertError.message}`);
    }

    // Now handle sequence reuses across years
    const reusedSequences = [];
    
    for (const display of displays) {
      // Get years again with the newly created sequences
      const { data: years, error: yearsError } = await supabase
        .from("display_years")
        .select("id, year")
        .eq("display_id", display.id)
        .order("year");

      if (yearsError || !years || years.length <= 1) {
        continue; // Skip if error or not enough years for reuse
      }

      // For each year except the earliest
      for (let i = 1; i < years.length; i++) {
        const currentYear = years[i];
        const previousYear = years[i-1];
        
        // Get sequences from previous year
        const { data: prevSequences, error: prevSeqError } = await supabase
          .from("display_songs")
          .select("*")
          .eq("display_year_id", previousYear.id);
          
        if (prevSeqError || !prevSequences || prevSequences.length === 0) {
          continue;
        }
        
        // Reuse 1-2 sequences from previous year
        const numToReuse = Math.min(prevSequences.length, Math.floor(Math.random() * 2) + 1);
        
        for (let j = 0; j < numToReuse; j++) {
          const seqToReuse = prevSequences[j];
          
          reusedSequences.push({
            display_year_id: currentYear.id,
            title: seqToReuse.title,
            artist: seqToReuse.artist,
            year_introduced: seqToReuse.year_introduced,
            reused_from: seqToReuse.id,
            sequence_available: seqToReuse.sequence_available,
            sequence_price: seqToReuse.sequence_price,
            sequence_file_url: seqToReuse.sequence_file_url
          });
        }
      }
    }
    
    // Insert all reused sequences
    if (reusedSequences.length > 0) {
      const { data: insertedReuses, error: reuseError } = await supabase
        .from("display_songs")
        .insert(reusedSequences)
        .select();
        
      if (reuseError) {
        console.error(`Error inserting reused sequences: ${reuseError.message}`);
      } else {
        console.log(`Added ${insertedReuses.length} reused sequences`);
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${sequencesCreated} unique sequences and ${reusedSequences.length} reused sequences`,
        data: {
          sequencesCreated,
          reusedSequences: reusedSequences.length
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating sequences:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
