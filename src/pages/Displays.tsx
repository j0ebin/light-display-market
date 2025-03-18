
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Display } from '@/types/sequence';
import DisplayCard from '@/components/displays/DisplayCard';
import { Search, MapPin, Filter } from 'lucide-react';

// Mock display categories
const categories = [
  { id: 'all', name: 'All Displays' },
  { id: 'christmas', name: 'Christmas' },
  { id: 'halloween', name: 'Halloween' },
  { id: 'musical', name: 'Musical' },
  { id: 'animated', name: 'Animated' },
  { id: 'mega', name: 'Mega Displays' },
];

// Mock displays data organized by category
const displaysByCategory: Record<string, Display[]> = {
  all: [],
  christmas: [],
  halloween: [],
  musical: [],
  animated: [],
  mega: [],
};

// Generate mock displays
for (let i = 1; i <= 30; i++) {
  const display: Display = {
    id: i,
    name: `Display ${i}`,
    description: `Description for display ${i}`,
    location: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA', 'Denver, CO', 'Austin, TX'][i % 5],
    latitude: null,
    longitude: null,
    holiday_type: i % 3 === 0 ? 'Halloween' : 'Christmas',
    display_type: ['Musical Light Show', 'Mega Display', 'Animated Display', 'Traditional Display', 'Interactive Display'][i % 5],
    year_started: 2010 + (i % 10),
    fm_station: i % 2 === 0 ? `${88 + (i % 10)}.${i % 10}` : null,
    image_url: `https://images.unsplash.com/photo-${1606946184955 + i * 1000}-a8cb11e66336?q=80&w=1080`,
    tags: ['musical', 'family-friendly', 'animated', 'synchronized', 'traditional'].slice(0, (i % 5) + 1),
    schedule: {
      start_date: '2023-11-25',
      end_date: '2024-01-05',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: {
        start: '17:00',
        end: '22:00'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 3.5 + (i % 10) / 5,
  };

  // Add to all category
  displaysByCategory.all.push(display);
  
  // Add to specific categories
  if (i % 3 === 0) {
    displaysByCategory.halloween.push(display);
  } else {
    displaysByCategory.christmas.push(display);
  }
  
  if (i % 5 === 0) {
    displaysByCategory.mega.push(display);
  }
  
  if (i % 2 === 0) {
    displaysByCategory.musical.push(display);
  }
  
  if (i % 4 === 0) {
    displaysByCategory.animated.push(display);
  }
}

interface DisplayWithOwner extends Display {
  isFavorite: boolean;
  owner?: {
    name: string;
    avatar: string;
  };
  songCount: number;
}

const Displays = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Update search query when URL params change
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Convert to DisplayWithOwner format for rendering
  const getDisplaysWithOwner = (displays: Display[]): DisplayWithOwner[] => {
    return displays.map(display => ({
      ...display,
      isFavorite: false,
      songCount: Math.floor(Math.random() * 15) + 5,
      owner: {
        name: `Owner ${display.id}`,
        avatar: `https://i.pravatar.cc/150?img=${display.id % 70}`
      }
    }));
  };

  // Filter displays based on search
  const filteredDisplays = displaysByCategory[activeCategory].filter(display => 
    display.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    display.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (display.description && display.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayItems = getDisplaysWithOwner(filteredDisplays);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Discover Light Displays</h1>
            <p className="text-muted-foreground max-w-3xl">
              Explore holiday light displays around the world. Find magical experiences near you or plan your next light-hunting adventure.
            </p>
          </div>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search displays by name, location, or description" 
                className="pl-10 pr-4 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline" className="py-6 px-4 flex items-center gap-2">
              <Search size={18} />
              <span>Search</span>
            </Button>
            <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
              <MapPin size={18} />
              <span>Near Me</span>
            </Button>
            <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
              <Filter size={18} />
              <span>Filters</span>
            </Button>
          </form>
          
          {/* Categories */}
          <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-muted mb-6 p-1 flex flex-wrap">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex-1 min-w-fit data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayItems.map(display => (
                    <DisplayCard key={display.id} display={display} />
                  ))}
                </div>
                
                {displayItems.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No displays found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Displays;
