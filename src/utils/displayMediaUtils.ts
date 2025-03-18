
import { supabase } from "@/integrations/supabase/client";
import { DisplayMedia } from "@/types/displayHistory";

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
  
  // Ensure correct typing of media data
  return (data || []).map(item => ({
    ...item,
    type: item.type as 'image' | 'video'
  }));
};

// Mock data for development (will be replaced with Supabase data)
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
