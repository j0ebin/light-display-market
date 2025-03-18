
import { supabase } from "@/integrations/supabase/client";
import { DisplaySong } from "@/types/displayHistory";

// Fetch songs for a specific year
export const fetchYearSongs = async (yearId: string): Promise<DisplaySong[]> => {
  const { data, error } = await supabase
    .from('display_songs')
    .select('*')
    .eq('display_year_id', yearId)
    .order('title');
  
  if (error) {
    console.error('Error fetching year songs:', error);
    return [];
  }
  
  // For reused songs, fetch the original song details
  const songsWithReused = await Promise.all(
    (data || []).map(async (song) => {
      if (song.reused_from) {
        const { data: originalSong } = await supabase
          .from('display_songs')
          .select('*')
          .eq('id', song.reused_from)
          .single();
        
        return { ...song, original_song: originalSong || undefined };
      }
      return song;
    })
  );
  
  return songsWithReused;
};

// Mock data for development (will be replaced with Supabase data)
export const mockDisplaySongs: { [key: string]: DisplaySong[] } = {
  '1': [
    {
      id: '1',
      display_year_id: '1',
      title: 'Jingle Bells',
      artist: 'Traditional',
      year_introduced: 2020,
      reused_from: null,
      sequence_file_url: null,
      sequence_available: false,
      sequence_price: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ],
  '2': [
    {
      id: '2',
      display_year_id: '2',
      title: 'Carol of the Bells',
      artist: 'Trans-Siberian Orchestra',
      year_introduced: 2021,
      reused_from: null,
      sequence_file_url: null,
      sequence_available: true,
      sequence_price: 19.99,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ],
  '3': [
    {
      id: '3',
      display_year_id: '3',
      title: 'All I Want for Christmas Is You',
      artist: 'Mariah Carey',
      year_introduced: 2022,
      reused_from: null,
      sequence_file_url: null,
      sequence_available: true,
      sequence_price: 24.99,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: '4',
      display_year_id: '3',
      title: 'Let It Go',
      artist: 'Idina Menzel',
      year_introduced: 2022,
      reused_from: null,
      sequence_file_url: null,
      sequence_available: true,
      sequence_price: 29.99,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ],
  '4': [
    {
      id: '5',
      display_year_id: '4',
      title: 'Carol of the Bells',
      artist: 'Trans-Siberian Orchestra',
      year_introduced: 2021,
      reused_from: '2',
      sequence_file_url: null,
      sequence_available: true,
      sequence_price: 19.99,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      original_song: {
        id: '2',
        display_year_id: '2',
        title: 'Carol of the Bells',
        artist: 'Trans-Siberian Orchestra',
        year_introduced: 2021,
        reused_from: null,
        sequence_file_url: null,
        sequence_available: true,
        sequence_price: 19.99,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    },
    {
      id: '6',
      display_year_id: '4',
      title: 'All I Want for Christmas Is You',
      artist: 'Mariah Carey',
      year_introduced: 2022,
      reused_from: '3',
      sequence_file_url: null,
      sequence_available: true,
      sequence_price: 24.99,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      original_song: {
        id: '3',
        display_year_id: '3',
        title: 'All I Want for Christmas Is You',
        artist: 'Mariah Carey',
        year_introduced: 2022,
        reused_from: null,
        sequence_file_url: null,
        sequence_available: true,
        sequence_price: 24.99,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    },
    {
      id: '7',
      display_year_id: '4',
      title: 'Christmas Eve/Sarajevo',
      artist: 'Trans-Siberian Orchestra',
      year_introduced: 2023,
      reused_from: null,
      sequence_file_url: null,
      sequence_available: true,
      sequence_price: 34.99,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ]
};
