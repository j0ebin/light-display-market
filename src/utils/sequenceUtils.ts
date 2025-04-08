import { Sequence, SequenceDetail } from "@/types/sequence";
import { mockSequences } from "@/data/mockSequences";
import { getSongForSequence } from "@/data/mockSongsData";
import { supabase } from "@/lib/supabase";

// Get related sequences by display name
export const getRelatedSequences = (currentId: string, displayName: string): Sequence[] => {
  return mockSequences
    .filter(seq => seq.id !== currentId && seq.displayName === displayName)
    .slice(0, 2);
};

// Get sequence details with additional information
export const getSequenceDetails = async (id: string): Promise<SequenceDetail | undefined> => {
  console.log('getSequenceDetails called with ID:', id);
  
  // First try to fetch from Supabase
  try {
    const { data: sequences } = await supabase
      .from('sequences')
      .select('*')
      .eq('id', id)
      .single();

    if (sequences) {
      console.log('Found sequence in Supabase:', sequences.name);
      
      // Map Supabase data to SequenceDetail interface
      return {
        id: sequences.id,
        title: sequences.name,
        displayName: sequences.name,
        description: sequences.description || 'A spectacular synchronized light show',
        imageUrl: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080', // Default image
        price: 19.99, // Default price
        rating: 4.8, // Default rating
        downloads: Math.floor(Math.random() * 500) + 100, // Random downloads
        software: 'xLights', // Default software
        song: {
          title: sequences.music_track || 'Unknown Song',
          artist: 'Various Artists',
          genre: 'Holiday'
        },
        creatorName: 'Holiday Lights Pro',
        creatorAvatar: 'https://i.pravatar.cc/150?img=4',
        displayId: sequences.display_id,
        review_rating: 4.8,
        createdAt: sequences.created_at,
        display: {
          id: `display-${sequences.display_id}`,
          title: 'Winter Wonderland Symphony',
          location: 'Seattle, WA',
          schedule: 'Nov 25 - Jan 5 • 5-10pm',
          rating: 4.9
        },
        creator: {
          id: 'user-synthetic',
          name: 'Holiday Lights Pro',
          avatar: 'https://i.pravatar.cc/150?img=4',
          rating: 4.9,
          sequencesCount: 25,
          joinedDate: '2021-01-01T00:00:00Z'
        },
        seller: {
          id: 'user-synthetic',
          name: 'Holiday Lights Pro',
          avatar: 'https://i.pravatar.cc/150?img=4',
          rating: 4.9,
          sequencesCount: 25,
          joinedDate: '2021-01-01T00:00:00Z'
        }
      };
    }
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
  }

  // If not found in Supabase, try mock data
  console.log('Falling back to mock data');
  console.log('Available mock sequences:', mockSequences.map(s => s.id));
  
  // First try to find in mock sequences
  const baseSequence = mockSequences.find(seq => seq.id === id);
  console.log('Found base sequence:', baseSequence ? 'yes' : 'no');
  
  if (!baseSequence) {
    // For IDs that don't match mockSequences, handle different formats
    if (id.length === 8 && !id.includes('-')) {
      // Display history format (8 chars, no hyphens)
      console.log('Creating synthetic sequence for 8-char ID');
      return createSyntheticSequence(id);
    } else if (id.includes('-')) {
      // UUID format - create a synthetic sequence with UUID
      console.log('Creating synthetic sequence for UUID');
      return {
        id,
        title: 'Premium Light Show',
        displayName: 'Premium Light Show',
        description: 'A premium synchronized light show featuring stunning effects and professional choreography.',
        software: 'xLights',
        rating: 4.9,
        review_rating: 4.9,
        downloads: Math.floor(Math.random() * 1000) + 500,
        price: 29.99,
        channelCount: 64,
        createdAt: new Date().toISOString(),
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        imageUrl: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
        song: {
          title: 'Winter Symphony',
          artist: 'Various Artists',
          genre: 'Holiday'
        },
        display: {
          id: 'display-premium',
          title: 'Premium Light Display',
          location: 'Various Locations',
          schedule: 'Nov 25 - Jan 5 • 5-10pm',
          rating: 4.9
        },
        displayId: 999,
        creatorName: 'Professional Light Artist',
        creatorAvatar: 'https://i.pravatar.cc/150?img=5',
        creator: {
          id: 'user-premium',
          name: 'Professional Light Artist',
          avatar: 'https://i.pravatar.cc/150?img=5',
          rating: 4.9,
          sequencesCount: 50,
          joinedDate: '2020-01-01T00:00:00Z'
        },
        seller: {
          id: 'user-premium',
          name: 'Professional Light Artist',
          avatar: 'https://i.pravatar.cc/150?img=5',
          rating: 4.9,
          sequencesCount: 50,
          joinedDate: '2020-01-01T00:00:00Z'
        }
      };
    }
    console.log('No sequence found and not a recognized ID format');
    return undefined;
  }
  
  console.log('Returning sequence details for:', baseSequence.title);
  return {
    ...baseSequence,
    description: baseSequence.description || 'A spectacular synchronized light show featuring classic Christmas songs. This sequence includes over 20 different effects and is compatible with most standard xLights setups.',
    createdAt: baseSequence.createdAt || new Date().toISOString(),
    display: {
      id: `display-${baseSequence.displayId}`,
      title: baseSequence.display.title,
      location: baseSequence.display.location,
      schedule: baseSequence.display.schedule,
      rating: baseSequence.display.rating
    },
    seller: {
      id: baseSequence.creator.id,
      name: baseSequence.creator.name,
      avatar: baseSequence.creator.avatar,
      rating: baseSequence.creator.rating,
      sequencesCount: baseSequence.creator.sequencesCount,
      joinedDate: baseSequence.creator.joinedDate
    }
  };
};

// Create synthetic sequence details for IDs generated from song titles
const createSyntheticSequence = (id: string): SequenceDetail => {
  const song = getSongForSequence(id);
  
  return {
    id,
    title: song?.title || 'Holiday Light Sequence',
    description: 'A spectacular synchronized light show featuring classic Christmas songs. This sequence includes over 20 different effects and is compatible with most standard xLights setups.',
    software: 'xLights',
    rating: 4.8,
    review_rating: 4.8,
    downloads: Math.floor(Math.random() * 500) + 100,
    price: 19.99,
    channelCount: 32,
    createdAt: new Date().toISOString(),
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
    song: {
      title: song?.title || 'Unknown Song',
      artist: song?.artist || 'Various Artists',
      genre: song?.genre || 'Holiday',
      yearIntroduced: song?.year
    },
    display: {
      id: 'display-1',
      title: 'Winter Wonderland Symphony',
      location: 'Seattle, WA',
      schedule: 'Nov 25 - Jan 5 • 5-10pm',
      rating: 4.9
    },
    displayId: 1,
    creator: {
      id: 'user-synthetic',
      name: 'Holiday Lights Pro',
      avatar: 'https://i.pravatar.cc/150?img=4',
      rating: 4.9,
      sequencesCount: 25,
      joinedDate: '2021-01-01T00:00:00Z'
    },
    seller: {
      id: 'user-synthetic',
      name: 'Holiday Lights Pro',
      avatar: 'https://i.pravatar.cc/150?img=4',
      rating: 4.9,
      sequencesCount: 25,
      joinedDate: '2021-01-01T00:00:00Z'
    }
  };
};
