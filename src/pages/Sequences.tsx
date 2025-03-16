
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sequence } from '@/types/sequence';
import SequenceCard from '@/components/sequences/SequenceCard';
import { Search, DollarSign, Filter, SortDesc } from 'lucide-react';

// Mock sequence categories
const categories = [
  { id: 'all', name: 'All Sequences' },
  { id: 'free', name: 'Free Sequences' },
  { id: 'xLights', name: 'xLights' },
  { id: 'LOR', name: 'LOR' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'recent', name: 'Recently Added' },
];

// Generate mock sequences
const generateMockSequences = (count: number): Sequence[] => {
  const sequences: Sequence[] = [];
  
  for (let i = 1; i <= count; i++) {
    sequences.push({
      id: `seq-${i}`,
      title: `Holiday Sequence ${i}`,
      displayName: `Display Name ${i}`,
      imageUrl: `https://images.unsplash.com/photo-${1606946184955 + i * 1000}-a8cb11e66336?q=80&w=1080`,
      price: i % 3 === 0 ? 0 : 4.99 + (i % 5),
      rating: 3.5 + (i % 10) / 5,
      downloads: 50 + (i * 10),
      songCount: 1 + (i % 5),
      software: i % 2 === 0 ? 'xLights' : 'LOR'
    });
  }
  
  return sequences;
};

// Create mock sequences for each category
const allSequences = generateMockSequences(30);
const sequencesByCategory: Record<string, Sequence[]> = {
  all: allSequences,
  free: allSequences.filter(seq => seq.price === 0),
  xLights: allSequences.filter(seq => seq.software === 'xLights'),
  LOR: allSequences.filter(seq => seq.software === 'LOR'),
  popular: [...allSequences].sort((a, b) => b.downloads - a.downloads),
  recent: [...allSequences].sort((a, b) => b.id.localeCompare(a.id)),
};

const Sequences = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sequences based on search
  const filteredSequences = sequencesByCategory[activeCategory].filter(sequence => 
    sequence.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sequence.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search sequences by title or display name" 
                className="pl-10 pr-4 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
              <DollarSign size={18} />
              <span>Price Range</span>
            </Button>
            <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
              <SortDesc size={18} />
              <span>Sort By</span>
            </Button>
          </div>
          
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
