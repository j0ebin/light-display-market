-- Create display_ratings table
CREATE TABLE IF NOT EXISTS display_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_id UUID NOT NULL REFERENCES displays(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(display_id, user_id)
);

-- Create sequence_ratings table
CREATE TABLE IF NOT EXISTS sequence_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES display_songs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sequence_id, user_id)
);

-- Function to calculate average display rating
CREATE OR REPLACE FUNCTION calculate_display_rating(p_display_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT ROUND(COALESCE(AVG(rating), 0)::NUMERIC, 1)
    INTO avg_rating
    FROM display_ratings
    WHERE display_id = p_display_id;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate average sequence rating
CREATE OR REPLACE FUNCTION calculate_sequence_rating(p_sequence_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT ROUND(COALESCE(AVG(rating), 0)::NUMERIC, 1)
    INTO avg_rating
    FROM sequence_ratings
    WHERE sequence_id = p_sequence_id;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Add rating columns to displays and display_songs tables
ALTER TABLE displays ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0;
ALTER TABLE display_songs ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0;

-- Create triggers to update ratings automatically
CREATE OR REPLACE FUNCTION update_display_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE displays
    SET rating = calculate_display_rating(NEW.display_id)
    WHERE id = NEW.display_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_sequence_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE display_songs
    SET rating = calculate_sequence_rating(NEW.sequence_id)
    WHERE id = NEW.sequence_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_display_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON display_ratings
FOR EACH ROW EXECUTE FUNCTION update_display_rating();

CREATE TRIGGER update_sequence_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON sequence_ratings
FOR EACH ROW EXECUTE FUNCTION update_sequence_rating(); 