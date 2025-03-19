
import { supabase } from '@/integrations/supabase/client';

export const seedSequences = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session) {
      throw new Error('No active session found');
    }
    
    const accessToken = sessionData.session.access_token;
    
    // Call the generate-sequences edge function
    const { data, error } = await supabase.functions.invoke('generate-sequences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to generate sequences');
    }
    
    return data;
  } catch (error) {
    console.error('Error generating sequences:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
