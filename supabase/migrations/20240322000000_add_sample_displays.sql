-- Add sample displays
INSERT INTO displays (
  id,
  user_id,
  name,
  description,
  image_url,
  location,
  schedule,
  display_type,
  holiday_type,
  review_rating
) VALUES
-- Winter Wonderland Symphony
(
  '550e8400-e29b-41d4-a716-446655440000',
  'auth_user_1',
  'Winter Wonderland Symphony',
  'Experience a magical winter evening with our synchronized light show featuring over 20,000 LED lights dancing to classic holiday tunes. The display includes animated snowflakes, twinkling icicles, and a grand 12-foot Christmas tree centerpiece.',
  'https://example.com/winter-wonderland.jpg',
  'Seattle, WA',
  'Nov 24 - Jan 4 • 17:00-22:00',
  'Musical Light Show',
  'Christmas',
  4.5
),
-- Spooktacular Halloween Lights
(
  '550e8400-e29b-41d4-a716-446655440001',
  'auth_user_2',
  'Spooktacular Halloween Lights',
  'A haunting display featuring projection-mapped ghosts, animated jack-o-lanterns, and fog effects synchronized to spooky music. Our cemetery scene and flying witches create an immersive Halloween experience for all ages.',
  'https://example.com/halloween-lights.jpg',
  'Portland, OR',
  'Oct 1 - Oct 31 • 18:00-23:00',
  'Projection Mapping',
  'Halloween',
  4.8
),
-- Spring Garden Illumination
(
  '550e8400-e29b-41d4-a716-446655440002',
  'auth_user_3',
  'Spring Garden Illumination',
  'A stunning botanical display featuring illuminated flower gardens, color-changing butterflies, and musical water fountains. Experience the magic of spring with our eco-friendly LED technology and nature-inspired soundscape.',
  'https://example.com/spring-garden.jpg',
  'Vancouver, BC',
  'Mar 15 - May 15 • 19:30-23:30',
  'Garden Light Show',
  'Spring',
  4.3
),
-- Patriotic Light Spectacular
(
  '550e8400-e29b-41d4-a716-446655440003',
  'auth_user_4',
  'Patriotic Light Spectacular',
  'Celebrate American spirit with our patriotic display featuring red, white, and blue light choreography, animated flag sequences, and synchronized firework effects. Perfect for Independence Day celebrations!',
  'https://example.com/patriotic-lights.jpg',
  'San Francisco, CA',
  'Jun 25 - Jul 10 • 20:00-00:00',
  'Musical Light Show',
  'Independence Day',
  4.7
),
-- Aurora Borealis Experience
(
  '550e8400-e29b-41d4-a716-446655440004',
  'auth_user_5',
  'Aurora Borealis Experience',
  'An innovative display recreating the Northern Lights using advanced laser technology and LED curtains. Features dynamic color waves, star field effects, and ambient space music for a truly immersive experience.',
  'https://example.com/aurora-lights.jpg',
  'Anchorage, AK',
  'Sep 1 - Apr 30 • 18:00-02:00',
  'Laser Light Show',
  'Year Round',
  4.9
);

-- Add sample songs for each display
INSERT INTO display_songs (
  id,
  display_id,
  name,
  artist,
  duration,
  sequence_data
) VALUES
-- Winter Wonderland Symphony songs
(
  '660e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440000',
  'Carol of the Bells',
  'Trans-Siberian Orchestra',
  '3:45',
  '{"sequence": "winter_sequence_1"}'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Let It Snow',
  'Michael Bublé',
  '3:02',
  '{"sequence": "winter_sequence_2"}'
),
-- Spooktacular Halloween songs
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'Thriller',
  'Michael Jackson',
  '5:57',
  '{"sequence": "halloween_sequence_1"}'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  'Monster Mash',
  'Bobby Pickett',
  '3:14',
  '{"sequence": "halloween_sequence_2"}'
),
-- Spring Garden songs
(
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  'Spring',
  'Vivaldi',
  '4:23',
  '{"sequence": "spring_sequence_1"}'
),
(
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440002',
  'Morning Mood',
  'Edvard Grieg',
  '4:46',
  '{"sequence": "spring_sequence_2"}'
),
-- Patriotic songs
(
  '660e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440003',
  'God Bless the USA',
  'Lee Greenwood',
  '3:10',
  '{"sequence": "patriotic_sequence_1"}'
),
(
  '660e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440003',
  'Stars and Stripes Forever',
  'John Philip Sousa',
  '3:50',
  '{"sequence": "patriotic_sequence_2"}'
),
-- Aurora songs
(
  '660e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440004',
  'Space Oddity',
  'David Bowie',
  '5:13',
  '{"sequence": "aurora_sequence_1"}'
),
(
  '660e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440004',
  'Northern Lights',
  'Ambient Symphony',
  '6:20',
  '{"sequence": "aurora_sequence_2"}'
); 