
export interface Sequence {
  id: string;
  title: string;
  displayName: string;
  imageUrl: string;
  price: number;
  rating: number;
  downloads: number;
  software: 'xLights' | 'LOR';
  song: {
    title: string;
    artist: string;
    genre?: string;
    yearIntroduced?: number;
  };
  creatorName: string;
  creatorAvatar: string;
  channelCount?: number; // For LOR sequences
  displayId?: number; // Reference to the original display
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

export interface Display {
  id: number;
  name: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  holiday_type: string | null;
  display_type: string | null;
  year_started: number | null;
  fm_station: string | null;
  image_url: string | null;
  tags: string[] | null;
  schedule: {
    start_date: string;
    end_date: string;
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  } | null;
  created_at: string;
  updated_at: string;
  rating?: number;
  owner_id?: number;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  year?: number;
  genre?: string;
}
