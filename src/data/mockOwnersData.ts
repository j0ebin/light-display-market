
import { Owner } from '@/types/owner';
import { DisplayWithOwner } from '@/data/mockDisplaysData';

// Each owner has one display currently
export const mockOwnersData: Owner[] = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
    biography: 'Creating holiday light displays since 2018. Specializing in musical light shows synchronized to popular Christmas songs. I use xLights for all my programming.',
    joinedDate: 'November 2018',
    location: 'Seattle, WA',
    displayCount: 1,
    sequenceCount: 12,
    socialLinks: {
      website: 'https://example.com/johnsmith',
      youtube: 'https://youtube.com/c/johnsmith',
      facebook: 'https://facebook.com/johnsmithlights'
    }
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    biography: 'Light display enthusiast with a passion for creating immersive Christmas experiences. My Magical Christmas Village display has been featured in local news and attracts thousands of visitors each season.',
    joinedDate: 'October 2015',
    location: 'Portland, OR',
    displayCount: 1,
    sequenceCount: 8,
    socialLinks: {
      youtube: 'https://youtube.com/c/sarahjohnson',
      instagram: 'https://instagram.com/sarahjohnsonlights'
    }
  },
  {
    id: 3,
    name: 'David Williams',
    avatar: 'https://i.pravatar.cc/150?img=3',
    biography: 'Software engineer by day, light show creator by night. I focus on high-tech animated displays with cutting-edge effects and programming techniques using LOR software.',
    joinedDate: 'January 2020',
    location: 'San Francisco, CA',
    displayCount: 1,
    sequenceCount: 15,
    socialLinks: {
      website: 'https://example.com/davidwilliams',
      youtube: 'https://youtube.com/c/davidwilliams',
      facebook: 'https://facebook.com/davidwilliamslights',
      instagram: 'https://instagram.com/davidwilliamslights'
    }
  }
];

// Helper function to get owner by ID
export const getOwnerById = (id: number): Owner | undefined => {
  return mockOwnersData.find(owner => owner.id === id);
};

// Helper function to get display by owner ID
export const getDisplayByOwnerId = (ownerId: number): DisplayWithOwner | undefined => {
  // In our current mock data model, owner IDs match display IDs for simplicity
  // In a real application, we would have a more sophisticated relationship
  const ownerDisplays = mockDisplaysData.find(display => display.id === ownerId);
  return ownerDisplays;
};

// Import this at the top of the file
import { mockDisplaysData } from '@/data/mockDisplaysData';
