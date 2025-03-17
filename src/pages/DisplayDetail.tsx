
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { supabase } from "@/integrations/supabase/client";
import { Display } from '@/types/sequence';

// Mock display for development - will be replaced with Supabase data
const mockDisplay: Display & { rating: number; songCount: number } = {
  id: 1,
  name: 'Winter Wonderland Symphony',
  description: 'A spectacular holiday light display synchronized to music, featuring over 50,000 LED lights programmed to dance to a variety of Christmas classics and contemporary holiday hits. The display includes animated snowflakes, dancing trees, singing faces, and a mesmerizing light tunnel that immerses visitors in a world of color and sound.',
  location: 'Seattle, WA',
  latitude: 47.6062,
  longitude: -122.3321,
  holiday_type: 'Christmas',
  display_type: 'Musical Light Show',
  year_started: 2018,
  fm_station: '88.1 FM',
  image_url: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
  tags: ['musical', 'family-friendly', 'animated', 'synchronized', 'LED'],
  schedule: {
    start_date: '2023-11-25',
    end_date: '2024-01-05',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    hours: {
      start: '17:00',
      end: '22:00'
    }
  },
  created_at: '2023-11-01T00:00:00Z',
  updated_at: '2023-11-01T00:00:00Z',
  rating: 4.9,
  songCount: 12
};

const DisplayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [display, setDisplay] = useState<(Display & { rating: number; songCount: number }) | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDisplay = async () => {
      setIsLoading(true);
      
      // In a real implementation, fetch from Supabase
      // const { data, error } = await supabase
      //   .from('displays')
      //   .select('*')
      //   .eq('id', id)
      //   .single();
      
      // if (error) {
      //   console.error('Error fetching display:', error);
      //   setIsLoading(false);
      //   return;
      // }
      
      // Add mock data for development
      setTimeout(() => {
        setDisplay(mockDisplay);
        setIsLoading(false);
      }, 500);
    };
    
    fetchDisplay();
  }, [id]);
  
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
  
  if (!display) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="text-xl mb-4">Display not found</div>
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
                  rating={display.rating}
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
                    songCount={display.songCount}
                  />
                </div>
              </div>
            </div>
            
            {/* Right column - Map, Owner, Related */}
            <div className="space-y-6">
              {/* Map with Mapbox */}
              {display.latitude && display.longitude && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Map 
                      latitude={display.latitude} 
                      longitude={display.longitude}
                      markerTitle={display.name}
                    />
                    <div className="mt-4 text-sm">
                      <div className="font-medium">{display.location}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Display owner card */}
              <DisplayOwnerCard 
                avatarUrl="https://i.pravatar.cc/150?img=1"
                ownerName="John Doe"
              />
              
              {/* Related sequences card */}
              <DisplaySequencesCard />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DisplayDetail;
