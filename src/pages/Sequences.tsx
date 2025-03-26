import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Sequence } from '@/types/sequence';
import { mockSequences } from '@/data/mockSequences';
import SequenceSearchBar from '@/components/sequences/SequenceSearchBar';
import SequenceFilters from '@/components/sequences/SequenceFilters';
import SequenceCategories from '@/components/sequences/SequenceCategories';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

// Generate a deterministic sequence ID from song title and artist
const generateSequenceId = (title: string, artist: string): string => {
  const baseString = `${title}-${artist}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  return baseString.substring(0, 8);
};

const Sequences = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const displayFilter = searchParams.get('display');
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [songFilter, setSongFilter] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [combinedSequences, setCombinedSequences] = useState<Sequence[]>([]);

  // Fetch sequences from Supabase
  const { data: supabaseSequences, isLoading } = useQuery({
    queryKey: ['supabaseSequences', displayFilter],
    queryFn: async (): Promise<Sequence[]> => {
      try {
        let query = supabase
          .from('display_songs')
          .select(`
            *,
            display_year:display_years(
              id,
              display:displays(
                id,
                name
              )
            )
          `)
          .eq('sequence_available', true);
        
        // Filter by display if provided
        if (displayFilter) {
          query = query.eq('display_year.display.id', displayFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching sequences:', error);
          return [];
        }
        
        // Transform to Sequence type
        return (data || []).map(song => ({
          id: song.id,
          title: song.title,
          displayName: song.display_year?.display?.name || 'Unknown Display',
          imageUrl: 'https://images.unsplash.com/photo-1482350325005-eda5e677279b?q=80&w=1080',
          price: Number(song.sequence_price) || 0,
          rating: 4.5 + Math.random() * 0.5,
          review_rating: 4.5 + Math.random() * 0.5,
          downloads: Math.floor(Math.random() * 300) + 50,
          software: Math.random() > 0.3 ? 'xLights' : 'LOR',
          song: {
            title: song.title,
            artist: song.artist,
            genre: song.genre || 'Holiday'
          },
          creatorName: 'Holiday Lights Pro',
          creatorAvatar: 'https://i.pravatar.cc/150?img=1',
          displayId: song.display_year?.display?.id?.toString(),
          createdAt: song.created_at,
          display: song.display_year?.display,
          creator: {
            id: '1',
            name: 'Holiday Lights Pro',
            avatar: 'https://i.pravatar.cc/150?img=1',
            rating: 4.8,
            sequencesCount: 50,
            joinedDate: '2023-01-01'
          }
        }));
      } catch (error) {
        console.error('Error in fetch:', error);
        return [];
      }
    }
  });

  // Combine mock and real sequences when data changes
  useEffect(() => {
    if (supabaseSequences) {
      // Use real sequences if available, fallback to mock data
      const sequences = supabaseSequences.length > 0 ? supabaseSequences : mockSequences;
      setCombinedSequences(sequences);
    }
  }, [supabaseSequences]);

  // Update search query when URL params change
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Create sequences by category using the combined data
  const sequencesByCategory = {
    all: combinedSequences,
    free: combinedSequences.filter(seq => seq.price === 0),
    xLights: combinedSequences.filter(seq => seq.software === 'xLights'),
    LOR: combinedSequences.filter(seq => seq.software === 'LOR'),
    popular: [...combinedSequences].sort((a, b) => b.downloads - a.downloads),
    recent: [...combinedSequences].sort((a, b) => b.id.localeCompare(a.id)),
  };

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
          
          {isLoading ? (
            <div className="py-8 text-center">Loading sequences...</div>
          ) : (
            <SequenceCategories 
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              filteredSequences={filteredSequences}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sequences;
