
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { seedDisplayYears } from "./seed-years.ts";
import { seedMediaAndSongs } from "./seed-media-songs.ts";

export const seedDisplayData = async (supabase: SupabaseClient) => {
  try {
    // Create a displays record first if it doesn't exist
    const { data: existingDisplays } = await supabase
      .from('displays')
      .select('id')
      .eq('id', 1)
      .single();

    let displayId = 1;

    if (!existingDisplays) {
      // Insert sample display if it doesn't exist
      await supabase.from('displays').insert([
        {
          id: displayId,
          name: 'Winter Wonderland Symphony',
          description: 'A spectacular holiday light display synchronized to music.',
          location: 'Seattle, WA',
          holiday_type: 'Christmas',
          display_type: 'Musical Light Show'
        }
      ]);
    }

    // Insert years and get their IDs
    const years = await seedDisplayYears(supabase, displayId);

    // Seed media and songs for each year
    const { media, songs } = await seedMediaAndSongs(supabase, years);

    return {
      success: true,
      message: 'Display history data seeded successfully',
      data: {
        years: years || [],
        media: media,
        songs: songs
      }
    };
  } catch (error) {
    console.error('Error in seedDisplayData:', error);
    throw error;
  }
};
