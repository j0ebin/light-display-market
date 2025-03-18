
import { supabase } from "@/integrations/supabase/client";
import { DisplayYear } from "@/types/displayHistory";

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
