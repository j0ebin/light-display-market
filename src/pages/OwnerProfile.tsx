
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import OwnerHeader from '@/components/owners/OwnerHeader';
import OwnerSocialLinks from '@/components/owners/OwnerSocialLinks';
import OwnerDisplayCard from '@/components/owners/OwnerDisplayCard';
import OwnerSequencesList from '@/components/owners/OwnerSequencesList';
import { getOwnerById, getDisplayByOwnerId } from '@/data/mockOwnersData';
import { DisplayWithOwner } from '@/data/mockDisplaysData';
import { Owner } from '@/types/owner';

const OwnerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [display, setDisplay] = useState<DisplayWithOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchOwnerData = async () => {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      const numericId = parseInt(id);
      const ownerData = getOwnerById(numericId);
      const displayData = getDisplayByOwnerId(numericId);
      
      // Simulate network delay
      setTimeout(() => {
        setOwner(ownerData || null);
        setDisplay(displayData || null);
        setIsLoading(false);
      }, 500);
    };
    
    fetchOwnerData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading owner profile...</div>
        </main>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="text-xl mb-4">Owner not found</div>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2" size={16} />
              Return Home
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center mb-8 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link to="/owners" className="text-muted-foreground hover:text-foreground transition-colors">
              Owners
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="font-medium truncate">{owner.name}</span>
          </div>
          
          {/* Owner header */}
          <section className="mb-10">
            <OwnerHeader owner={owner} />
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="display">
                <TabsList className="mb-6">
                  <TabsTrigger value="display">Display</TabsTrigger>
                  <TabsTrigger value="sequences">Sequences</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                
                <TabsContent value="display" className="mt-0">
                  {display ? (
                    <OwnerDisplayCard display={display} />
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No display information available.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="sequences" className="mt-0">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Available Sequences</h2>
                    <p className="text-muted-foreground">
                      Browse and purchase synchronized light sequences created by {owner.name}.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {mockSequences.slice(0, 4).map(sequence => (
                        <div key={sequence.id} className="bg-card rounded-lg overflow-hidden border">
                          <div className="aspect-video bg-muted relative">
                            <img 
                              src={sequence.imageUrl} 
                              alt={sequence.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-1">{sequence.title}</h3>
                            <div className="flex justify-between items-center">
                              <Badge 
                                variant="outline" 
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                {sequence.software}
                              </Badge>
                              <div className="font-medium">
                                {sequence.price === 0 ? 'Free' : `$${sequence.price.toFixed(2)}`}
                              </div>
                            </div>
                            <Button className="w-full mt-3" asChild>
                              <Link to={`/sequence/${sequence.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="about" className="mt-0">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">About {owner.name}</h2>
                    <div className="prose max-w-none">
                      <p>{owner.biography}</p>
                      <p>
                        {owner.name} has been creating holiday light displays since {owner.joinedDate}. 
                        They currently have {owner.displayCount} display and have created {owner.sequenceCount} sequences.
                      </p>
                      <p>Based in {owner.location}.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <OwnerSocialLinks socialLinks={owner.socialLinks} />
              <OwnerSequencesList ownerId={owner.id} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OwnerProfile;
