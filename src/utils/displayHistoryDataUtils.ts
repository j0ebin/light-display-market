
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
    
    const response = await fetch(
      'https://vhaizqhkodqyqplpqcss.supabase.co/functions/v1/seed-display-history',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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
