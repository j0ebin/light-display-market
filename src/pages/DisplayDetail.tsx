import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Map from '@/components/maps/Map';
import DisplayBreadcrumbs from '@/components/displays/DisplayBreadcrumbs';
import DisplayHeader from '@/components/displays/DisplayHeader';
import DisplayDescription from '@/components/displays/DisplayDescription';
import DisplayScheduleCard from '@/components/displays/DisplayScheduleCard';
import DisplayDetailsCard from '@/components/displays/DisplayDetailsCard';
import DisplayOwnerCard from '@/components/displays/DisplayOwnerCard';
import DisplaySequencesCard from '@/components/displays/DisplaySequencesCard';
import DisplayHistoryCard from '@/components/displays/DisplayHistoryCard';
import CharityCard from '@/components/charity/CharityCard';
import { useCharity } from '@/hooks/useCharity';
import { useDisplay } from '@/hooks/useDisplays';
import { DisplayYear } from '@/types/displayHistory';
import { mockDisplayYears } from '@/utils/displayHistoryUtils';
import ReviewComponent from '@/components/shared/review/ReviewComponent';

const DisplayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const parsedId = id ? parseInt(id, 10) : undefined;
  const { data: display, isLoading: isLoadingDisplay, error: displayError } = useDisplay(parsedId);
  const [displayYears, setDisplayYears] = useState<DisplayYear[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [songCount, setSongCount] = useState(0);
  const { charity, isLoading: isLoadingCharity } = useCharity(ownerId);
  
  // For this demo, we'll set isAdmin to true to allow sequence generation
  const isAdmin = true;
  
  useEffect(() => {
    // For now we'll use mock display years, but in the future we could fetch this from Supabase
    setDisplayYears(mockDisplayYears);
    
    // Set a mock owner ID
    if (display) {
      setOwnerId('1'); // Mock owner ID for testing
      setSongCount(Math.floor(Math.random() * 15) + 5); // Random song count between 5-20
    }
  }, [display]);
  
  const isLoading = isLoadingDisplay;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading display details...</div>
        </main>
      </div>
    );
  }
  
  if (displayError || !display) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="text-xl mb-4">Display not found</div>
          <p className="text-muted-foreground mb-4">
            {displayError ? (displayError as Error).message : "The requested display could not be found."}
          </p>
          <Link to="/displays">
            <Button className="mt-4">
              <ArrowLeft className="mr-2" size={16} />
              Browse Displays
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
          <DisplayBreadcrumbs displayName={display.name} />
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Display images and details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main image */}
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={display.image_url || ''} 
                  alt={display.name}
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              
              {/* Display info */}
              <div>
                <DisplayHeader 
                  name={display.name}
                  displayType={display.display_type}
                  rating={4.5} // Mock rating for now
                  holidayType={display.holiday_type}
                  location={display.location}
                  isFavorite={isFavorite}
                  onToggleFavorite={() => setIsFavorite(!isFavorite)}
                />
                
                <DisplayDescription 
                  description={display.description || ''}
                  tags={display.tags}
                />
                
                {/* Display details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* Schedule */}
                  <DisplayScheduleCard schedule={display.schedule} />
                  
                  {/* Additional Info */}
                  <DisplayDetailsCard 
                    yearStarted={display.year_started}
                    fmStation={display.fm_station}
                    songCount={songCount}
                  />
                </div>
              </div>
              
              {/* Display History Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Display History</h2>
                <DisplayHistoryCard 
                  displayId={display.id}
                  years={displayYears}
                />
              </div>

              {/* Reviews Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <ReviewComponent
                  itemId={display.id.toString()}
                  type="display"
                  currentRating={display.rating || 0}
                />
              </div>
            </div>
            
            {/* Right column - Map, Owner, Related, Charity */}
            <div className="space-y-6">
              {/* Map with Mapbox */}
              {display.latitude && display.longitude && (
                <div className="card-wrapper">
                  <Map 
                    latitude={display.latitude} 
                    longitude={display.longitude}
                    markerTitle={display.name}
                  />
                  <div className="mt-4 text-sm">
                    <div className="font-medium">{display.location}</div>
                  </div>
                </div>
              )}
              
              {/* Display owner card */}
              <DisplayOwnerCard 
                avatarUrl="https://i.pravatar.cc/150?img=1"
                ownerName="John Doe"
              />
              
              {/* Display charity card if available */}
              {charity && !isLoadingCharity && (
                <CharityCard charity={charity} variant="compact" />
              )}
              
              {/* Related sequences card */}
              <DisplaySequencesCard displayId={display.id} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DisplayDetail;
