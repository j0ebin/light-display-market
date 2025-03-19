import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Song titles pool for generating random sequences
const songTitles = [
  "Carol of the Bells", "Wizards in Winter", "Christmas Eve/Sarajevo", 
  "All I Want for Christmas Is You", "Last Christmas", "Silent Night",
  "Jingle Bell Rock", "Let It Snow", "Feliz Navidad", "White Christmas",
  "Rockin' Around the Christmas Tree", "Winter Wonderland", "Little Drummer Boy",
  "Frosty the Snowman", "Santa Claus Is Coming to Town", "O Holy Night",
  "The Christmas Song", "Home for the Holidays", "Blue Christmas", "Rudolph the Red-Nosed Reindeer",
  "Deck the Halls", "Joy to the World", "Have Yourself a Merry Little Christmas",
  "Silver Bells", "Grandma Got Run Over by a Reindeer", "It's Beginning to Look a Lot Like Christmas",
  "I'll Be Home for Christmas", "Wonderful Christmastime", "Happy Xmas (War Is Over)",
  "Do You Hear What We Hear?", "It Came Upon a Midnight Clear", "We Wish You a Merry Christmas"
];

// Artist names pool
const artistNames = [
  "Trans-Siberian Orchestra", "Mariah Carey", "Wham!", "Bing Crosby",
  "Michael Bublé", "Frank Sinatra", "Nat King Cole", "John Lennon", 
  "Dean Martin", "Elvis Presley", "The Beach Boys", "Coldplay",
  "Kelly Clarkson", "Celine Dion", "Josh Groban", "Burl Ives",
  "Johnny Mathis", "Ariana Grande", "Justin Bieber", "Ella Fitzgerald",
  "Andy Williams", "Pentatonix", "Mannheim Steamroller", "Perry Como",
  "Band Aid", "Brenda Lee", "Paul McCartney", "Stevie Wonder"
];

/**
 * Generates a unique song title and artist combination
 */
const getUniqueSong = (usedCombinations: Set<string>) => {
  let title, artist, combination;
  
  do {
    title = songTitles[Math.floor(Math.random() * songTitles.length)];
    artist = artistNames[Math.floor(Math.random() * artistNames.length)];
    combination = `${title}-${artist}`;
  } while (usedCombinations.has(combination));
  
  usedCombinations.add(combination);
  return { title, artist };
};

/**
 * Generates random price (with some free sequences)
 */
const generatePrice = (): number => {
  // 20% chance of a free sequence
  if (Math.random() < 0.2) {
    return 0;
  }
  
  // Otherwise price between $4.99 and $29.99
  return Number((Math.random() * 25 + 4.99).toFixed(2));
};

/**
 * Generates a placeholder sequence file URL
 */
const generateSequenceFileUrl = (title: string, artist: string): string => {
  const sanitized = `${title}-${artist}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `https://example.com/sequences/${sanitized}.zip`;
};

/**
 * Function to generate dummy sequences for all displays
 */
export const generateDummySequences = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Step 1: Fetch all displays
    const { data: displays, error: displaysError } = await supabase
      .from('displays')
      .select('id');
      
    if (displaysError || !displays) {
      console.error('Error fetching displays:', displaysError);
      return { success: false, message: 'Failed to fetch displays' };
    }
    
    // Track all used song-artist combinations to ensure uniqueness
    const usedCombinations = new Set<string>();
    
    // For each display, generate 3 songs
    for (const display of displays) {
      // Step 2: Get years for this display
      const { data: years, error: yearsError } = await supabase
        .from('display_years')
        .select('id, year')
        .eq('display_id', display.id)
        .order('year', { ascending: true });
        
      if (yearsError || !years || years.length === 0) {
        console.warn(`No years found for display ${display.id}`);
        continue;
      }
      
      // Generate 3 unique songs for this display
      const songs = [];
      for (let i = 0; i < 3; i++) {
        const { title, artist } = getUniqueSong(usedCombinations);
        
        // Assign to earliest year
        const firstYear = years[0];
        const price = generatePrice();
        
        songs.push({
          display_year_id: firstYear.id,
          title,
          artist,
          year_introduced: firstYear.year,
          sequence_available: true,
          sequence_price: price,
          sequence_file_url: generateSequenceFileUrl(title, artist)
        });
      }
      
      // Insert the songs
      const { error: insertError } = await supabase
        .from('display_songs')
        .insert(songs);
        
      if (insertError) {
        console.error(`Error inserting songs for display ${display.id}:`, insertError);
      }
      
      // Create reused songs for subsequent years (if any)
      if (years.length > 1) {
        const laterYears = years.slice(1);
        const reusedSongs = [];
        
        for (const laterYear of laterYears) {
          // Get the songs we just created for this display
          const { data: createdSongs } = await supabase
            .from('display_songs')
            .select('id, title, artist, sequence_price, sequence_file_url')
            .eq('display_year_id', firstYear.id);
            
          if (createdSongs) {
            // Reuse 1-2 songs for each later year
            const songsToReuse = createdSongs.slice(0, Math.min(2, createdSongs.length));
            
            for (const song of songsToReuse) {
              reusedSongs.push({
                display_year_id: laterYear.id,
                title: song.title,
                artist: song.artist,
                year_introduced: firstYear.year,
                reused_from: song.id,
                sequence_available: true,
                sequence_price: song.sequence_price,
                sequence_file_url: song.sequence_file_url
              });
            }
            
            // Add 1 new song per later year
            const { title, artist } = getUniqueSong(usedCombinations);
            const price = generatePrice();
            
            reusedSongs.push({
              display_year_id: laterYear.id,
              title,
              artist,
              year_introduced: laterYear.year,
              sequence_available: true,
              sequence_price: price,
              sequence_file_url: generateSequenceFileUrl(title, artist)
            });
          }
        }
        
        // Insert the reused songs
        if (reusedSongs.length > 0) {
          const { error: reusedError } = await supabase
            .from('display_songs')
            .insert(reusedSongs);
            
          if (reusedError) {
            console.error(`Error inserting reused songs:`, reusedError);
          }
        }
      }
    }
    
    return { 
      success: true, 
      message: `Successfully generated sequences for ${displays.length} displays` 
    };
  } catch (error) {
    console.error('Error generating dummy sequences:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
