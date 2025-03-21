-- Add images array to displays table
ALTER TABLE displays 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add youtube_url to display_songs table
ALTER TABLE display_songs 
ADD COLUMN IF NOT EXISTS youtube_url TEXT; 