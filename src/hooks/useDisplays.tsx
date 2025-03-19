
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Display } from '@/types/sequence';
import { DisplayWithOwner } from '@/data/mockDisplaysData';

export const useDisplays = () => {
  return useQuery({
    queryKey: ['displays'],
    queryFn: async (): Promise<Display[]> => {
      const { data, error } = await supabase
        .from('displays')
        .select('*');
      
      if (error) {
        console.error('Error fetching displays:', error);
        throw new Error(error.message);
      }
      
      return data || [];
    }
  });
};

export const useDisplay = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ['display', id],
    queryFn: async (): Promise<Display | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('displays')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error(`Error fetching display ${id}:`, error);
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!id
  });
};

// Helper function to convert Display to DisplayWithOwner for components that need it
export const convertToDisplayWithOwner = (display: Display | null): DisplayWithOwner | null => {
  if (!display) return null;
  
  return {
    ...display,
    isFavorite: false,
    songCount: Math.floor(Math.random() * 15) + 5, // For now, generate a random number of songs
    owner: {
      name: `Owner of ${display.name}`,
      avatar: `https://i.pravatar.cc/150?img=${display.id % 70}`
    }
  };
};
