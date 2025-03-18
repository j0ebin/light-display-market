
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { createMediaData } from "./media-data.ts";
import { createSongsData, updateSongReferences } from "./songs-data.ts";

export const seedMediaAndSongs = async (supabase: SupabaseClient, years: any[]) => {
  let insertedMedia = [];
  let insertedSongs = [];

  if (years && years.length > 0) {
    // Create media for each year
    const mediaToInsert = createMediaData(years);

    const { data: media, error: mediaError } = await supabase
      .from('display_media')
      .insert(mediaToInsert)
      .select();

    if (mediaError) {
      throw mediaError;
    }

    insertedMedia = media || [];

    // Create songs for base years (without reused references)
    const songsByYear = {};
    for (const year of years) {
      const yearSongs = await createSongsData(supabase, year);
      if (yearSongs) {
        songsByYear[year.year] = yearSongs;
        insertedSongs = [...insertedSongs, ...yearSongs];
      }
    }

    // Update reused_from references for songs in later years
    const updates = await updateSongReferences(years, songsByYear);
    
    if (updates.length > 0) {
      await supabase.from('display_songs').upsert(updates);
    }
  }

  return { media: insertedMedia, songs: insertedSongs };
};
