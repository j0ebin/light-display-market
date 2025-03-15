
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
