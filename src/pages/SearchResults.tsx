
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import DisplayCard from '@/components/displays/DisplayCard';
import SequenceCard from '@/components/sequences/SequenceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Display } from '@/types/sequence';
import { Search, MapPin, Filter } from 'lucide-react';
import { mockDisplaysData } from '@/data/mockDisplaysData';
import { mockSequences } from '@/data/mockSequences';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter displays and sequences based on search query
  const filteredDisplays = mockDisplaysData.filter(display => 
    display.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
    (display.description && display.description.toLowerCase().includes(initialQuery.toLowerCase())) ||
    display.location.toLowerCase().includes(initialQuery.toLowerCase())
  );
  
  const filteredSequences = mockSequences.filter(sequence => 
    sequence.title.toLowerCase().includes(initialQuery.toLowerCase()) ||
    sequence.displayName.toLowerCase().includes(initialQuery.toLowerCase())
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground max-w-3xl">
              {initialQuery ? `Showing results for "${initialQuery}"` : 'Enter a search term to find displays and sequences'}
            </p>
          </div>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search for displays or sequences..." 
                className="pl-10 pr-4 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="py-6 px-4">
              <Search size={18} className="mr-2" /> Search
            </Button>
          </form>
          
          {/* Results Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-muted mb-6 p-1">
              <TabsTrigger 
                value="all"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Results ({filteredDisplays.length + filteredSequences.length})
              </TabsTrigger>
              <TabsTrigger 
                value="displays"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Displays ({filteredDisplays.length})
              </TabsTrigger>
              <TabsTrigger 
                value="sequences"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sequences ({filteredSequences.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {(filteredDisplays.length > 0 || filteredSequences.length > 0) ? (
                <>
                  {filteredDisplays.length > 0 && (
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold mb-6">Displays ({filteredDisplays.length})</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDisplays.slice(0, 3).map(display => (
                          <DisplayCard key={display.id} display={display} />
                        ))}
                      </div>
                      {filteredDisplays.length > 3 && (
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab('displays')}
                          >
                            View All Displays
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {filteredSequences.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Sequences ({filteredSequences.length})</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSequences.slice(0, 3).map(sequence => (
                          <SequenceCard key={sequence.id} sequence={sequence} />
                        ))}
                      </div>
                      {filteredSequences.length > 3 && (
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab('sequences')}
                          >
                            View All Sequences
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search query</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="displays">
              {filteredDisplays.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDisplays.map(display => (
                    <DisplayCard key={display.id} display={display} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No displays found</h3>
                  <p className="text-muted-foreground">Try adjusting your search query</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sequences">
              {filteredSequences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSequences.map(sequence => (
                    <SequenceCard key={sequence.id} sequence={sequence} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No sequences found</h3>
                  <p className="text-muted-foreground">Try adjusting your search query</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
