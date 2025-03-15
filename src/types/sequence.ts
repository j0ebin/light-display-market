
export interface Sequence {
  id: string;
  title: string;
  displayName: string;
  imageUrl: string;
  price: number;
  rating: number;
  downloads: number;
  songCount: number;
  software: 'xLights' | 'LOR';
}

export interface SequenceDetail extends Sequence {
  videoUrl: string;
  description: string;
  createdAt: string;
  display: {
    id: string;
    title: string;
    location: string;
    schedule: string;
    rating: number;
  };
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    sequencesCount: number;
    joinedDate: string;
  };
}
