
import { Song } from '@/types/sequence';

export const mockSongsData: Song[] = [
  {
    id: 1,
    title: "Carol of the Bells",
    artist: "Trans-Siberian Orchestra",
    duration: "3:45",
    year: 1998,
    genre: "Rock"
  },
  {
    id: 2,
    title: "Wizards in Winter",
    artist: "Trans-Siberian Orchestra",
    duration: "3:05",
    year: 2004,
    genre: "Rock"
  },
  {
    id: 3,
    title: "All I Want for Christmas Is You",
    artist: "Mariah Carey",
    duration: "4:01",
    year: 1994,
    genre: "Pop"
  },
  {
    id: 4,
    title: "Last Christmas",
    artist: "Wham!",
    duration: "4:27",
    year: 1984,
    genre: "Pop"
  },
  {
    id: 5,
    title: "Jingle Bell Rock",
    artist: "Bobby Helms",
    duration: "2:12",
    year: 1957,
    genre: "Rock and roll"
  }
];

// Map sequences to songs (in a real app, this would be a database relationship)
const sequenceSongMap: Record<string, number> = {
  "1": 1, // Winter Wonderland sequence uses Carol of the Bells song
  "2": 3, // Christmas Classics sequence uses All I Want for Christmas Is You song
  "3": 2  // Dubstep Christmas sequence uses Wizards in Winter song
};

export const getSongForSequence = (sequenceId: string): Song => {
  const songId = sequenceSongMap[sequenceId] || 1; // Default to first song if no mapping
  return mockSongsData.find(song => song.id === songId) || mockSongsData[0];
};
