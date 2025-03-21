import { Sequence, SequenceDetail } from "@/types/sequence";
import { mockSequences } from "@/data/mockSequences";
import { getSongForSequence } from "@/data/mockSongsData";

// Get related sequences by display name
export const getRelatedSequences = (currentId: string, displayName: string): Sequence[] => {
  return mockSequences
    .filter(seq => seq.id !== currentId && seq.displayName === displayName)
    .slice(0, 2);
};

// Get sequence details with additional information
export const getSequenceDetails = (id: string): SequenceDetail | undefined => {
  const baseSequence = mockSequences.find(seq => seq.id === id);
  
  if (!baseSequence) {
    // For IDs that don't match mockSequences, create a synthetic sequence
    // This would handle sequences from the display history
    if (id.length === 8) {
      return createSyntheticSequence(id);
    }
    return undefined;
  }
  
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
    displayName: 'Winter Wonderland Symphony',
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
