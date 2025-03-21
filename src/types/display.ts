export interface Display {
  id: string;
  name: string;
  description?: string;
  location: string;
  image_url?: string;
  display_type?: string;
  holiday_type?: string;
  year_started?: number;
  fm_station?: string;
  schedule?: string;
  tags?: string[];
  rating: number;
  review_rating: number;
  owner?: {
    id: string;
    name: string;
    avatar?: string;
  };
} 