
import { supabase } from "@/integrations/supabase/client";
import { DisplayYear, DisplayMedia, DisplaySong } from "@/types/displayHistory";

// Fetch all years for a display
export const fetchDisplayYears = async (displayId: number): Promise<DisplayYear[]> => {
  const { data, error } = await supabase
    .from('display_years')
    .select('*')
    .eq('display_id', displayId)
    .order('year', { ascending: false });
  
  if (error) {
    console.error('Error fetching display years:', error);
    return [];
  }
  
  return data || [];
};

// Fetch media for a specific year
export const fetchYearMedia = async (yearId: string): Promise<DisplayMedia[]> => {
  const { data, error } = await supabase
    .from('display_media')
    .select('*')
    .eq('display_year_id', yearId)
    .order('created_at');
  
  if (error) {
    console.error('Error fetching year media:', error);
    return [];
  }
  
  return data || [];
};

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

// Update the DisplayYearContent component to use the real data
export const seedDisplayHistory = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      'https://vhaizqhkodqyqplpqcss.supabase.co/functions/v1/seed-display-history',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()?.data?.session?.access_token || ''}`
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to seed display history');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error seeding display history:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Mock data for development (will be replaced with Supabase data)
export const mockDisplayYears: DisplayYear[] = [
  {
    id: '1',
    display_id: 1,
    year: 2020,
    description: 'Our first year with a simple static display featuring classic Christmas lights and a few inflatables.',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    display_id: 1,
    year: 2021,
    description: 'Added synchronized music through an FM transmitter and basic light sequencing.',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    display_id: 1,
    year: 2022,
    description: 'Upgraded to full xLights sequencing with over 20,000 pixels and custom props.',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '4',
    display_id: 1,
    year: 2023,
    description: 'Expanded the display to include a 20-foot mega tree, singing faces, and interactive elements.',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

export const mockDisplayMedia: { [key: string]: DisplayMedia[] } = {
  '1': [
    {
      id: '1',
      display_year_id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?q=80&w=1080',
      description: 'Front yard with traditional string lights',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ],
  '2': [
    {
      id: '2',
      display_year_id: '2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1545608444-f045a6db6133?q=80&w=1080',
      description: 'Added light arches and mini-trees',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ],
  '3': [
    {
      id: '3',
      display_year_id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1080',
      description: 'First year with pixel mapping',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: '4',
      display_year_id: '3',
      type: 'video',
      url: 'https://www.youtube.com/embed/YEHIkcAXP9Y',
      description: 'Full display sequence from 2022',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ],
  '4': [
    {
      id: '5',
      display_year_id: '4',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
      description: 'Current display with mega tree',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: '6',
      display_year_id: '4',
      type: 'video',
      url: 'https://www.youtube.com/embed/FmFJRFEHpNQ',
      description: 'Light show feature from local news',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ]
};

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
