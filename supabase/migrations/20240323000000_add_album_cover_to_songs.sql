-- Add album_cover_url column to display_songs table
ALTER TABLE display_songs ADD COLUMN album_cover_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN display_songs.album_cover_url IS 'URL to the song''s album cover image';

-- Create album-covers storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'album-covers',
  'album-covers',
  true,
  5242880, -- 5MB in bytes
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Set up storage policy to allow authenticated users to upload album covers
CREATE POLICY "Users can upload album covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'album-covers');

-- Allow public read access to album covers
CREATE POLICY "Public read access to album covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'album-covers'); 