-- Insert sample displays with new features
INSERT INTO displays (
    name,
    location,
    description,
    status,
    tags,
    featured,
    holiday_type,
    display_type
) VALUES 
(
    'Winter Wonderland 2024',
    'Seattle, WA',
    'A spectacular winter display featuring synchronized music and lights',
    'active',
    ARRAY['winter', 'music', 'family-friendly', 'synchronized'],
    true,
    'Christmas',
    'residential'
),
(
    'Halloween Spooktacular',
    'Portland, OR',
    'A spooky display in development',
    'draft',
    ARRAY['halloween', 'spooky', 'interactive'],
    false,
    'Halloween',
    'residential'
),
(
    'Classic Christmas Collection',
    'Vancouver, BC',
    'A traditional display from previous years',
    'archived',
    ARRAY['christmas', 'classic', 'traditional'],
    false,
    'Christmas',
    'commercial'
);

-- Simulate some views
UPDATE displays 
SET views_count = 150 
WHERE name = 'Winter Wonderland 2024';

UPDATE displays 
SET views_count = 75 
WHERE name = 'Halloween Spooktacular';

-- Add some sample songs with view counts
INSERT INTO display_songs (
    title,
    artist,
    year_introduced,
    views_count,
    sequence_available
) VALUES 
(
    'Carol of the Bells',
    'Trans-Siberian Orchestra',
    2024,
    200,
    true
),
(
    'This is Halloween',
    'Danny Elfman',
    2024,
    100,
    true
); 