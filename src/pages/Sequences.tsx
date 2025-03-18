
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Sequence } from '@/types/sequence';
import { mockSequences } from '@/data/mockSequences';
import SequenceSearchBar from '@/components/sequences/SequenceSearchBar';
import SequenceFilters from '@/components/sequences/SequenceFilters';
import SequenceCategories from '@/components/sequences/SequenceCategories';

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
          
          <div className="flex flex-col sm:flex-row gap-4">
            <SequenceSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
            
            <SequenceFilters 
              songFilter={songFilter}
              setSongFilter={setSongFilter}
              artistFilter={artistFilter}
              setArtistFilter={setArtistFilter}
              selectedGenres={selectedGenres}
              allGenres={allGenres}
              handleGenreChange={handleGenreChange}
              clearFilters={clearFilters}
            />
          </div>
          
          <SequenceCategories 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredSequences={filteredSequences}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sequences;
