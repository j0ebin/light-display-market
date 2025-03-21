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
  "halleluj": 4, // Hallelujah sequence uses Last Christmas song
  "decktheh": 5, // Deck the Halls sequence uses Jingle Bell Rock song
  "wizardsi": 2  // Wizards in Winter sequence uses Wizards in Winter song
};

export const getSongForSequence = (sequenceId: string): Song | undefined => {
  const songId = sequenceSongMap[sequenceId];
  return mockSongsData.find(song => song.id === songId);
};
