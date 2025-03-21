-- Create display_reviews table
CREATE TABLE IF NOT EXISTS display_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_id UUID NOT NULL REFERENCES displays(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(display_id, user_id)
);

-- Create sequence_reviews table
CREATE TABLE IF NOT EXISTS sequence_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES display_songs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sequence_id, user_id)
);

-- Function to calculate average display review rating
CREATE OR REPLACE FUNCTION calculate_display_review_rating(p_display_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT ROUND(COALESCE(AVG(rating), 0)::NUMERIC, 1)
    INTO avg_rating
    FROM display_reviews
    WHERE display_id = p_display_id;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate average sequence review rating
CREATE OR REPLACE FUNCTION calculate_sequence_review_rating(p_sequence_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT ROUND(COALESCE(AVG(rating), 0)::NUMERIC, 1)
    INTO avg_rating
    FROM sequence_reviews
    WHERE sequence_id = p_sequence_id;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Add rating columns to displays and display_songs tables if they don't exist
ALTER TABLE displays ADD COLUMN IF NOT EXISTS review_rating NUMERIC(3,1) DEFAULT 0;
ALTER TABLE display_songs ADD COLUMN IF NOT EXISTS review_rating NUMERIC(3,1) DEFAULT 0;

-- Create triggers to update ratings automatically
CREATE OR REPLACE FUNCTION update_display_review_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE displays
    SET review_rating = calculate_display_review_rating(NEW.display_id)
    WHERE id = NEW.display_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_sequence_review_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE display_songs
    SET review_rating = calculate_sequence_review_rating(NEW.sequence_id)
    WHERE id = NEW.sequence_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_display_review_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON display_reviews
FOR EACH ROW EXECUTE FUNCTION update_display_review_rating();

CREATE TRIGGER update_sequence_review_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON sequence_reviews
FOR EACH ROW EXECUTE FUNCTION update_sequence_review_rating(); 