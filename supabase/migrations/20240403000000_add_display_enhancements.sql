-- Add status column to displays table
ALTER TABLE displays 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
CHECK (status IN ('active', 'archived', 'draft'));

-- Add views_count columns
ALTER TABLE displays 
ADD COLUMN IF NOT EXISTS views_count bigint NOT NULL DEFAULT 0;

ALTER TABLE display_songs 
ADD COLUMN IF NOT EXISTS views_count bigint NOT NULL DEFAULT 0;

-- Add tags array column to displays
ALTER TABLE displays 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add featured column to displays
ALTER TABLE displays 
ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- Create an index for status for faster filtering
CREATE INDEX IF NOT EXISTS idx_displays_status ON displays(status);

-- Create an index for featured displays
CREATE INDEX IF NOT EXISTS idx_displays_featured ON displays(featured) WHERE featured = true;

-- Create an index for tags using GIN for array operations
CREATE INDEX IF NOT EXISTS idx_displays_tags ON displays USING GIN (tags);

-- Add a function to increment views count
CREATE OR REPLACE FUNCTION increment_display_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE displays
    SET views_count = views_count + 1
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_song_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE display_songs
    SET views_count = views_count + 1
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for view counting
DROP TRIGGER IF EXISTS increment_display_views_trigger ON displays;
CREATE TRIGGER increment_display_views_trigger
    AFTER UPDATE OF status ON displays
    FOR EACH ROW
    WHEN (OLD.status != 'active' AND NEW.status = 'active')
    EXECUTE FUNCTION increment_display_views();

DROP TRIGGER IF EXISTS increment_song_views_trigger ON display_songs;
CREATE TRIGGER increment_song_views_trigger
    AFTER UPDATE OF sequence_available ON display_songs
    FOR EACH ROW
    WHEN (OLD.sequence_available = false AND NEW.sequence_available = true)
    EXECUTE FUNCTION increment_song_views();

-- Add comments for documentation
COMMENT ON COLUMN displays.status IS 'Current status of the display: active, archived, or draft';
COMMENT ON COLUMN displays.views_count IS 'Number of times this display has been viewed';
COMMENT ON COLUMN displays.tags IS 'Array of tags for categorizing the display';
COMMENT ON COLUMN displays.featured IS 'Whether this display is featured on the platform';
COMMENT ON COLUMN display_songs.views_count IS 'Number of times this song/sequence has been viewed'; 