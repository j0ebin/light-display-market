-- Test 1: Verify status filtering
SELECT name, status 
FROM displays 
WHERE status = 'active';

-- Test 2: Check featured displays
SELECT name, featured, views_count 
FROM displays 
WHERE featured = true;

-- Test 3: Test tag searching
SELECT name, tags 
FROM displays 
WHERE tags && ARRAY['winter', 'music'];

-- Test 4: View counts for both displays and songs
SELECT 
    d.name as display_name,
    d.views_count as display_views,
    s.title as song_title,
    s.views_count as song_views
FROM displays d
LEFT JOIN display_years dy ON d.id = dy.display_id
LEFT JOIN display_songs s ON dy.id = s.display_year_id
WHERE d.status = 'active'
ORDER BY d.views_count DESC;

-- Test 5: Verify trigger functionality
UPDATE displays 
SET status = 'active' 
WHERE name = 'Halloween Spooktacular';

-- Verify the view count increased
SELECT name, status, views_count 
FROM displays 
WHERE name = 'Halloween Spooktacular'; 