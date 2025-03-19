
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Display } from '@/types/sequence';
import { useDisplays, convertToDisplayWithOwner } from '@/hooks/useDisplays';
import DisplaySearchBar from '@/components/displays/DisplaySearchBar';
import DisplayCategories from '@/components/displays/DisplayCategories';
import { DisplayWithOwner } from '@/data/mockDisplaysData';

// Mock display categories
const categories = [
  { id: 'all', name: 'All Displays' },
  { id: 'christmas', name: 'Christmas' },
  { id: 'halloween', name: 'Halloween' },
  { id: 'musical', name: 'Musical' },
  { id: 'animated', name: 'Animated' },
  { id: 'mega', name: 'Mega Displays' },
];

const Displays = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { data: displays = [], isLoading, error } = useDisplays();

  // Update search query when URL params change
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Filter displays based on search and category
  const filteredDisplays = displays
    .filter(display => {
      // Category filter
      if (activeCategory === 'all') return true;
      if (activeCategory === 'christmas' && display.holiday_type === 'Christmas') return true;
      if (activeCategory === 'halloween' && display.holiday_type === 'Halloween') return true;
      if (activeCategory === 'musical' && display.display_type === 'LightShow') return true;
      if (activeCategory === 'animated' && display.display_type === 'LightShow') return true;
      if (activeCategory === 'mega' && display.tags?.includes('Mega Display')) return true;
      return false;
    })
    .filter(display =>
      searchQuery === '' ||
      display.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      display.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (display.description && display.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Convert to DisplayWithOwner format for rendering
  const displayItems: DisplayWithOwner[] = filteredDisplays.map(display => 
    convertToDisplayWithOwner(display) as DisplayWithOwner
  );

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
          
          <DisplaySearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
          
          {isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Loading displays...</h3>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <h3 className="text-xl font-medium mb-2">Error loading displays</h3>
              <p>{(error as Error).message}</p>
            </div>
          ) : (
            <DisplayCategories 
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              displayItems={displayItems}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Displays;
