-- Add album_cover_url column to display_songs table
ALTER TABLE display_songs ADD COLUMN album_cover_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN display_songs.album_cover_url IS 'URL to the song''s album cover image'; 