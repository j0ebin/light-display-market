
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
    displayId: 1, // Link back to the main display
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example YouTube embed URL
    description: 'A spectacular synchronized light show featuring classic Christmas songs. This sequence includes over 20 different effects and is compatible with most standard xLights setups.',
    createdAt: 'November 15, 2023',
    display: {
      id: `display-1`,
      title: baseSequence.displayName,
      location: 'Seattle, WA',
      schedule: 'Nov 25 - Jan 5 • 5-10pm',
      rating: 4.9
    },
    seller: {
      id: `user-${baseSequence.id}`,
      name: baseSequence.creatorName,
      avatar: baseSequence.creatorAvatar,
      rating: 4.9,
      sequencesCount: 12,
      joinedDate: 'November 2021'
    }
  };
};

// Create synthetic sequence details for IDs generated from song titles
const createSyntheticSequence = (id: string): SequenceDetail => {
  // In a real app, you would likely fetch this data from an API
  // This is just a placeholder implementation
  return {
    id: id,
    title: 'Holiday Light Sequence',
    displayName: 'Winter Wonderland Symphony',
    displayId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
    price: 19.99,
    rating: 4.8,
    downloads: 156,
    software: 'xLights',
    song: {
      title: 'Carol of the Bells',
      artist: 'Trans-Siberian Orchestra',
      genre: 'Rock',
      yearIntroduced: 2021
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'This sequence was created for the Winter Wonderland Symphony display in 2021. It features over 15,000 lights synchronized to Carol of the Bells by Trans-Siberian Orchestra.',
    createdAt: 'December 15, 2021',
    creatorName: 'John Johnson',
    creatorAvatar: 'https://i.pravatar.cc/150?img=1',
    display: {
      id: '1',
      title: 'Winter Wonderland Symphony',
      location: 'Seattle, WA',
      schedule: 'Nov 25 - Jan 5 • 5-10pm',
      rating: 4.9
    },
    seller: {
      id: 'user-1',
      name: 'John Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 4.9,
      sequencesCount: 12,
      joinedDate: 'November 2021'
    }
  };
};
