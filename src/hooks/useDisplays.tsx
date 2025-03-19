
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Display } from '@/types/sequence';
import { DisplayWithOwner } from '@/data/mockDisplaysData';

// Helper function to transform the database response to match our Display type
const transformDatabaseResponse = (data: any): Display => {
  // Parse the schedule if it's a string, or pass through if it's already an object
  let scheduleObject;
  if (typeof data.schedule === 'string') {
    try {
      scheduleObject = JSON.parse(data.schedule);
    } catch (e) {
      scheduleObject = null;
    }
  } else {
    scheduleObject = data.schedule;
  }
  
  return {
    ...data,
    // Ensure schedule follows the required structure
    schedule: scheduleObject ? {
      start_date: scheduleObject.start_date || '',
      end_date: scheduleObject.end_date || '',
      days: scheduleObject.days || [],
      hours: {
        start: scheduleObject.hours?.start || '',
        end: scheduleObject.hours?.end || ''
      }
    } : null
  };
};

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
      
      // Transform each database record to match our Display type
      return (data || []).map(transformDatabaseResponse);
    }
  });
};

export const useDisplay = (id: number | undefined) => {
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
      
      return data ? transformDatabaseResponse(data) : null;
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
