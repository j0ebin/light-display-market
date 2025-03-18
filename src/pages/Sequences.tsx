
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sequence } from '@/types/sequence';
import SequenceCard from '@/components/sequences/SequenceCard';
import { Search, Filter, Music, Podcast, Disc2, Tag } from 'lucide-react';
import { mockSequences } from '@/data/mockSequences';

// Mock sequence categories
const categories = [
  { id: 'all', name: 'All Sequences' },
  { id: 'free', name: 'Free Sequences' },
  { id: 'xLights', name: 'xLights' },
  { id: 'LOR', name: 'LOR' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'recent', name: 'Recently Added' },
];

// Extract unique genres from sequences
const allGenres = Array.from(new Set(mockSequences.map(seq => seq.song.genre).filter(Boolean) as string[]));

// Create sequences by category
const sequencesByCategory: Record<string, Sequence[]> = {
  all: mockSequences,
  free: mockSequences.filter(seq => seq.price === 0),
  xLights: mockSequences.filter(seq => seq.software === 'xLights'),
  LOR: mockSequences.filter(seq => seq.software === 'LOR'),
  popular: [...mockSequences].sort((a, b) => b.downloads - a.downloads),
  recent: [...mockSequences].sort((a, b) => b.id.localeCompare(a.id)),
};

const Sequences = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [songFilter, setSongFilter] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Update search query when URL params change
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Filter sequences based on all filters
  const filteredSequences = sequencesByCategory[activeCategory].filter(sequence => {
    // General search query (title or display name)
    const matchesQuery = 
      searchQuery === '' || 
      sequence.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sequence.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sequence.song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sequence.song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sequence.song.genre && sequence.song.genre.toLowerCase().includes(searchQuery.toLowerCase()));

    // Specific song filter
    const matchesSong = 
      songFilter === '' || 
      sequence.song.title.toLowerCase().includes(songFilter.toLowerCase());

    // Specific artist filter
    const matchesArtist = 
      artistFilter === '' || 
      sequence.song.artist.toLowerCase().includes(artistFilter.toLowerCase());

    // Genre filter
    const matchesGenre = 
      selectedGenres.length === 0 || 
      (sequence.song.genre && selectedGenres.includes(sequence.song.genre));

    return matchesQuery && matchesSong && matchesArtist && matchesGenre;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres(current => 
      current.includes(genre)
        ? current.filter(g => g !== genre)
        : [...current, genre]
    );
  };

  const clearFilters = () => {
    setSongFilter('');
    setArtistFilter('');
    setSelectedGenres([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Light Show Sequences</h1>
            <p className="text-muted-foreground max-w-3xl">
              Browse and purchase synchronized light sequences for your holiday display. Compatible with xLights and Light-O-Rama.
            </p>
          </div>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search sequences by title, song, artist or genre" 
                className="pl-10 pr-4 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline" className="py-6 px-4 flex items-center gap-2">
              <Search size={18} />
              <span>Search</span>
            </Button>
            
            {/* Song Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
                  <Music size={18} />
                  <span>Song</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter by Song</h4>
                  <Input 
                    placeholder="Song title..." 
                    value={songFilter}
                    onChange={(e) => setSongFilter(e.target.value)}
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Artist Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
                  <Podcast size={18} />
                  <span>Artist</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter by Artist</h4>
                  <Input 
                    placeholder="Artist name..." 
                    value={artistFilter}
                    onChange={(e) => setArtistFilter(e.target.value)}
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Genre Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
                  <Tag size={18} />
                  <span>Genre</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filter by Genre</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-auto text-xs p-0"
                    >
                      Clear filters
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {allGenres.map(genre => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`genre-${genre}`} 
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => handleGenreChange(genre)}
                        />
                        <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
                  {filteredSequences.map(sequence => (
                    <SequenceCard key={sequence.id} sequence={sequence} />
                  ))}
                </div>
                
                {filteredSequences.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No sequences found</h3>
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

export default Sequences;
