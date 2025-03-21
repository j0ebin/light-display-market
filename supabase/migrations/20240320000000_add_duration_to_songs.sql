-- Add duration column to display_songs table
ALTER TABLE display_songs
ADD COLUMN duration VARCHAR(10);

-- Add genre column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'display_songs' AND column_name = 'genre') THEN
        ALTER TABLE display_songs ADD COLUMN genre VARCHAR(50);
    END IF;
END $$; 