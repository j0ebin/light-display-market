
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export const songsBase = [
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

export const createSongsData = async (supabase: SupabaseClient, year: any) => {
  const yearSongs = songsBase
    .filter(song => song.year_introduced <= year.year)
    .map(song => ({
      display_year_id: year.id,
      title: song.title,
      artist: song.artist,
      year_introduced: song.year_introduced,
      sequence_available: song.sequence_available,
      sequence_price: song.sequence_price,
      reused_from: null
    }));

  const { data: songs, error } = await supabase
    .from('display_songs')
    .insert(yearSongs)
    .select();

  if (error) {
    console.error('Error inserting songs:', error);
    return [];
  }

  return songs || [];
};

export const updateSongReferences = async (years: any[], songsByYear: any) => {
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
  
  return updates;
};
