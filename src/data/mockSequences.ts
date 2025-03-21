import { Sequence } from '@/types/sequence';

export const mockSequences: Sequence[] = [
  {
    id: 'halleluj',
    title: 'Hallelujah Light Show',
    description: 'A beautiful synchronized light show featuring the timeless classic Hallelujah.',
    software: 'xLights',
    rating: 4.8,
    review_rating: 4.8,
    downloads: 243,
    price: 15.99,
    channelCount: 32,
    createdAt: '2023-11-15T00:00:00Z',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1482350325005-eda5e677279b?q=80&w=1080',
    song: {
      title: 'Hallelujah',
      artist: 'Leonard Cohen',
      genre: 'Folk',
      yearIntroduced: 1984
    },
    display: {
      title: 'Johnson Family Lights',
      location: 'Seattle, WA',
      schedule: 'Nov 25 - Jan 5 • 5-10pm',
      rating: 4.9
    },
    displayName: 'Johnson Family Lights',
    displayId: 1,
    creator: {
      id: 'user-1',
      name: 'John Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 4.9,
      sequencesCount: 12,
      joinedDate: '2021-11-15T00:00:00Z'
    }
  },
  {
    id: 'decktheh',
    title: 'Deck the Halls Spectacular',
    description: 'A festive light show synchronized to the classic Deck the Halls.',
    software: 'xLights',
    rating: 4.6,
    review_rating: 4.6,
    downloads: 512,
    price: 19.99,
    channelCount: 48,
    createdAt: '2023-12-01T00:00:00Z',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1573116456454-e02329be9ae2?q=80&w=1080',
    song: {
      title: 'Deck the Halls',
      artist: 'Traditional',
      genre: 'Classical',
      yearIntroduced: 1862
    },
    display: {
      title: 'Holiday Magic',
      location: 'Portland, OR',
      schedule: 'Nov 25 - Jan 5 • 6-11pm',
      rating: 4.8
    },
    displayName: 'Holiday Magic',
    displayId: 2,
    creator: {
      id: 'user-2',
      name: 'Sarah Holiday',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4.8,
      sequencesCount: 8,
      joinedDate: '2022-01-15T00:00:00Z'
    }
  },
  {
    id: 'wizardsi',
    title: 'Wizards in Winter Light Show',
    description: 'An epic synchronized light show featuring Trans-Siberian Orchestra.',
    software: 'xLights',
    rating: 4.9,
    review_rating: 4.9,
    downloads: 187,
    price: 24.99,
    channelCount: 64,
    createdAt: '2023-11-20T00:00:00Z',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1542262867-c4b517b92db8?q=80&w=1080',
    song: {
      title: 'Wizards in Winter',
      artist: 'Trans-Siberian Orchestra',
      genre: 'Rock',
      yearIntroduced: 2004
    },
    display: {
      title: 'Modern Light Creations',
      location: 'Austin, TX',
      schedule: 'Nov 25 - Jan 5 • 6-10pm',
      rating: 4.9
    },
    displayName: 'Modern Light Creations',
    displayId: 3,
    creator: {
      id: 'user-3',
      name: 'Mike Modern',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 4.9,
      sequencesCount: 15,
      joinedDate: '2021-09-15T00:00:00Z'
    }
  }
];
