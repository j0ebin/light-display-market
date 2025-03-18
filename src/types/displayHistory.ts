
export interface DisplayYear {
  id: string;
  display_id: number;
  year: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DisplayMedia {
  id: string;
  display_year_id: string;
  type: 'image' | 'video';
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DisplaySong {
  id: string;
  display_year_id: string;
  title: string;
  artist: string;
  year_introduced: number;
  reused_from: string | null;
  sequence_file_url: string | null;
  sequence_available: boolean;
  sequence_price: number | null;
  created_at: string;
  updated_at: string;
  original_song?: DisplaySong; // For frontend use, not in DB
}
