
import { Sequence } from '@/types/sequence';

export const mockSequences: Sequence[] = [
  {
    id: '1',
    title: 'Winter Wonderland',
    displayName: 'Johnson Family Lights',
    imageUrl: 'https://images.unsplash.com/photo-1482350325005-eda5e677279b?q=80&w=1080',
    price: 15.99,
    rating: 4.8,
    downloads: 243,
    software: 'xLights',
    song: {
      title: 'Carol of the Bells',
      artist: 'Trans-Siberian Orchestra',
      genre: 'Rock'
    },
    creatorName: 'John Johnson',
    creatorAvatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    title: 'Christmas Classics',
    displayName: 'Holiday Magic',
    imageUrl: 'https://images.unsplash.com/photo-1573116456454-e02329be9ae2?q=80&w=1080',
    price: 0,
    rating: 4.6,
    downloads: 512,
    software: 'LOR',
    song: {
      title: 'All I Want for Christmas Is You',
      artist: 'Mariah Carey',
      genre: 'Pop'
    },
    creatorName: 'Sarah Holiday',
    creatorAvatar: 'https://i.pravatar.cc/150?img=2',
    channelCount: 16
  },
  {
    id: '3',
    title: 'Dubstep Christmas',
    displayName: 'Modern Light Creations',
    imageUrl: 'https://images.unsplash.com/photo-1542262867-c4b517b92db8?q=80&w=1080',
    price: 24.99,
    rating: 4.9,
    downloads: 187,
    software: 'xLights',
    song: {
      title: 'Wizards in Winter',
      artist: 'Trans-Siberian Orchestra',
      genre: 'Rock'
    },
    creatorName: 'Mike Modern',
    creatorAvatar: 'https://i.pravatar.cc/150?img=3'
  }
];
