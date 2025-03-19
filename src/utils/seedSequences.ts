
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const seedSequences = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session) {
      toast.error('No active session found. Please log in first.');
      throw new Error('No active session found');
    }
    
    const accessToken = sessionData.session.access_token;
    
    toast.info('Generating sequences for all displays...', {
      duration: 3000,
    });
    
    // Call the generate-sequences edge function
    const { data, error } = await supabase.functions.invoke('generate-sequences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (error) {
      toast.error(`Failed to generate sequences: ${error.message}`);
      throw new Error(error.message || 'Failed to generate sequences');
    }
    
    toast.success('Sequences generated successfully!', {
      description: data.message,
    });
    
    return data;
  } catch (error) {
    console.error('Error generating sequences:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
