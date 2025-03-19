
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Charity } from '@/types/charity';

export const useCharity = (ownerId?: string | null) => {
  const [charity, setCharity] = useState<Charity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ownerId) {
      setIsLoading(false);
      return;
    }

    const fetchCharity = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('charities')
          .select('*')
          .eq('owner_id', ownerId)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - not an error for our purposes
          throw error;
        }

        setCharity(data || null);
      } catch (err) {
        console.error('Error fetching charity:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharity();
  }, [ownerId]);

  return { charity, isLoading, error, setCharity };
};
