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
import OwnerAboutTab from '@/components/owners/OwnerAboutTab';
import OwnerSequencesTab from '@/components/owners/OwnerSequencesTab';
import CharityCard from '@/components/charity/CharityCard';
import { useCharity } from '@/hooks/useCharity';
import { getOwnerById, getDisplayByOwnerId } from '@/data/mockOwnersData';
import { DisplayWithOwner } from '@/data/mockDisplaysData';
import { Owner } from '@/types/owner';

const OwnerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [display, setDisplay] = useState<DisplayWithOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { charity, isLoading: isLoadingCharity } = useCharity(id);

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
          
          <section className="mb-10">
            <OwnerHeader owner={owner} />
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="display">
                <TabsList className="mb-6">
                  <TabsTrigger value="display">Display</TabsTrigger>
                  <TabsTrigger value="sequences">Sequences</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  {charity && <TabsTrigger value="charity">Charity</TabsTrigger>}
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
                  <OwnerSequencesTab owner={owner} />
                </TabsContent>
                
                <TabsContent value="about" className="mt-0">
                  <OwnerAboutTab owner={owner} />
                </TabsContent>
                
                {charity && (
                  <TabsContent value="charity" className="mt-0">
                    <h2 className="text-2xl font-semibold mb-6">Supporting Charity</h2>
                    <div className="max-w-md">
                      <CharityCard charity={charity} />
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <OwnerSocialLinks socialLinks={owner.socialLinks} />
              {charity && !isLoadingCharity && (
                <CharityCard charity={charity} variant="compact" />
              )}
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
