
import { Display } from '@/types/sequence';

interface DisplayWithOwner extends Display {
  isFavorite: boolean;
  owner?: {
    name: string;
    avatar: string;
  };
  songCount: number;
}

export const mockDisplaysData: DisplayWithOwner[] = [
  {
    id: 1,
    name: 'Winter Wonderland Symphony',
    image_url: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
    rating: 4.9,
    location: 'Seattle, WA',
    display_type: 'Musical Light Show',
    schedule: {
      start_date: '2023-11-25',
      end_date: '2024-01-05',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: {
        start: '17:00',
        end: '22:00'
      }
    },
    songCount: 12,
    isFavorite: false,
    owner: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    description: '',
    latitude: null,
    longitude: null,
    holiday_type: 'Christmas',
    year_started: 2018,
    fm_station: '88.1 FM',
    tags: ['musical', 'family-friendly', 'animated'],
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Magical Christmas Village',
    image_url: 'https://images.unsplash.com/photo-1604719322778-e05a9ba7156a?q=80&w=1080',
    rating: 4.7,
    location: 'Portland, OR',
    display_type: 'Mega Display',
    schedule: {
      start_date: '2023-12-01',
      end_date: '2023-12-31',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: {
        start: '18:00',
        end: '23:00'
      }
    },
    songCount: 8,
    isFavorite: true,
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    description: '',
    latitude: null,
    longitude: null,
    holiday_type: 'Christmas',
    year_started: 2015,
    fm_station: '90.5 FM',
    tags: ['village', 'themed', 'traditional'],
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Festive Lights Extravaganza',
    image_url: 'https://images.unsplash.com/photo-1607262807149-daa76e3d5a3a?q=80&w=1080',
    rating: 4.5,
    location: 'San Francisco, CA',
    display_type: 'Animated Display',
    schedule: {
      start_date: '2023-11-27',
      end_date: '2024-01-02',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: {
        start: '17:30',
        end: '22:00'
      }
    },
    songCount: 15,
    isFavorite: false,
    owner: {
      name: 'David Williams',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    description: '',
    latitude: null,
    longitude: null,
    holiday_type: 'Christmas',
    year_started: 2020,
    fm_station: '92.3 FM',
    tags: ['animated', 'synchronized', 'modern'],
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z'
  }
];

// Export the interface for reuse
export type { DisplayWithOwner };
