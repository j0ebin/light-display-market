
import { supabase } from "@/integrations/supabase/client";

// Update the DisplayYearContent component to use the real data
export const seedDisplayHistory = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session) {
      throw new Error('No active session found');
    }
    
    const accessToken = sessionData.session.access_token;
    
    // Use the supabase functions.invoke method instead of direct fetch
    const { data, error } = await supabase.functions.invoke('seed-display-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to seed display history');
    }
    
    return data;
  } catch (error) {
    console.error('Error seeding display history:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
