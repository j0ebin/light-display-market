
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
  
  if (!baseSequence) return undefined;
  
  return {
    ...baseSequence,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example YouTube embed URL
    description: 'A spectacular synchronized light show featuring classic Christmas songs. This sequence includes over 20 different effects and is compatible with most standard xLights setups.',
    createdAt: 'November 15, 2023',
    song: getSongForSequence(id), // Get the associated song for this sequence
    display: {
      id: `display-${baseSequence.id}`,
      title: baseSequence.displayName,
      location: 'Seattle, WA',
      schedule: 'Nov 25 - Jan 5 • 5-10pm',
      rating: 4.9
    },
    seller: {
      id: `user-${baseSequence.id}`,
      name: `${baseSequence.displayName} Owner`,
      avatar: 'https://i.pravatar.cc/150?img=68',
      rating: 4.9,
      sequencesCount: 12,
      joinedDate: 'November 2021'
    }
  };
};
