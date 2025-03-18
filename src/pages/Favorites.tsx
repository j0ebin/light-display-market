
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SequenceCard from '@/components/sequences/SequenceCard';
import DisplayCard from '@/components/displays/DisplayCard';
import { mockSequences } from '@/data/mockSequences';
import { mockDisplaysData } from '@/data/mockDisplaysData';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const [favoriteSequences, setFavoriteSequences] = useState<string[]>([]);
  const [favoriteDisplays, setFavoriteDisplays] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('sequences');

  // Mock data for favorites - in a real app, this would come from the backend
  useEffect(() => {
    if (user) {
      // These would come from an API call in a real application
      setFavoriteSequences(['1', '3']);
      setFavoriteDisplays([1, 3]);
    }
  }, [user]);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const toggleSequenceFavorite = (id: string) => {
    setFavoriteSequences(current => 
      current.includes(id) 
        ? current.filter(itemId => itemId !== id)
        : [...current, id]
    );
  };

  const toggleDisplayFavorite = (id: number) => {
    setFavoriteDisplays(current => 
      current.includes(id) 
        ? current.filter(itemId => itemId !== id)
        : [...current, id]
    );
  };

  const filteredSequences = mockSequences.filter(sequence => 
    favoriteSequences.includes(sequence.id)
  );

  const filteredDisplays = mockDisplaysData.filter(display => 
    favoriteDisplays.includes(display.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center mb-6 gap-3">
            <Heart className="text-primary" size={24} />
            <h1 className="text-3xl font-bold">Your Favorites</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-8">
              <TabsTrigger 
                value="sequences" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sequences
              </TabsTrigger>
              <TabsTrigger 
                value="displays"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Displays
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sequences" className="mt-0">
              {filteredSequences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSequences.map(sequence => (
                    <SequenceCard 
                      key={sequence.id} 
                      sequence={sequence} 
                      toggleFavorite={toggleSequenceFavorite}
                      isFavorite={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/50 rounded-lg">
                  <Heart className="mx-auto text-muted-foreground" size={48} />
                  <h3 className="mt-4 text-xl font-medium">No favorite sequences yet</h3>
                  <p className="mt-2 text-muted-foreground">Save your favorite sequences to find them easily later</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="displays" className="mt-0">
              {filteredDisplays.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDisplays.map(display => (
                    <DisplayCard 
                      key={display.id} 
                      display={{
                        ...display,
                        isFavorite: true
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/50 rounded-lg">
                  <Heart className="mx-auto text-muted-foreground" size={48} />
                  <h3 className="mt-4 text-xl font-medium">No favorite displays yet</h3>
                  <p className="mt-2 text-muted-foreground">Save your favorite displays to find them easily later</p>
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

export default Favorites;
