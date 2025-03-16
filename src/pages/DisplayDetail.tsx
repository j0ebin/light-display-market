
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Music, Star, Heart, Clock, Radio, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
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

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatSchedule = (schedule: any): string => {
  if (!schedule) return 'Schedule not available';
  
  const startDate = new Date(schedule.start_date);
  const endDate = new Date(schedule.end_date);
  
  const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  return `${startFormatted} - ${endFormatted}`;
};

const formatHours = (schedule: any): string => {
  if (!schedule || !schedule.hours) return 'Hours not available';
  
  return `${schedule.hours.start.substring(0, 5)} - ${schedule.hours.end.substring(0, 5)}`;
};

const formatDays = (schedule: any): string => {
  if (!schedule || !schedule.days || schedule.days.length === 0) return 'Days not available';
  
  if (schedule.days.length === 7) {
    return 'Every day';
  }
  
  return schedule.days.join(', ');
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
          <div className="flex items-center mb-8 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link to="/displays" className="text-muted-foreground hover:text-foreground transition-colors">
              Displays
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="font-medium truncate">{display.name}</span>
          </div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Display images and details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main image */}
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={display.image_url} 
                  alt={display.name}
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              
              {/* Display info */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{display.name}</h1>
                    <div className="flex items-center mt-2 space-x-3">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {display.display_type}
                      </Badge>
                      <div className="flex items-center text-amber-500">
                        <Star size={16} className="fill-amber-500 mr-1" />
                        <span>{display.rating}</span>
                      </div>
                      {display.holiday_type && (
                        <Badge variant="outline">
                          {display.holiday_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      size={18}
                      className={cn(
                        "transition-colors",
                        isFavorite ? "fill-destructive stroke-destructive" : "fill-none"
                      )}
                    />
                  </Button>
                </div>
                
                <div className="flex items-center mb-4">
                  <MapPin size={16} className="text-muted-foreground mr-2" />
                  <span>{display.location}</span>
                </div>
                
                <div className="prose prose-sm max-w-none mb-8">
                  <p>{display.description}</p>
                </div>
                
                {/* Tags */}
                {display.tags && display.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {display.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Display details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* Schedule */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="mr-2" size={18} />
                        Viewing Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Dates</div>
                          <div className="font-medium">{formatSchedule(display.schedule)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Days</div>
                          <div className="font-medium">{formatDays(display.schedule)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Hours</div>
                          <div className="font-medium">{formatHours(display.schedule)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Additional Info */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Tag className="mr-2" size={18} />
                        Display Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {display.year_started && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Running Since</div>
                            <div className="font-medium">{display.year_started}</div>
                          </div>
                        )}
                        {display.fm_station && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Tune Radio To</div>
                            <div className="font-medium">{display.fm_station}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Songs in Show</div>
                          <div className="font-medium">{display.songCount} songs</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Right column - Map, Owner, Related */}
            <div className="space-y-6">
              {/* Map placeholder - can be replaced with an actual map component */}
              {display.latitude && display.longitude && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Map placeholder - would display at coordinates {display.latitude}, {display.longitude}
                      </p>
                    </div>
                    <div className="mt-4 text-sm">
                      <div className="font-medium">{display.location}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Display owner card placeholder */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Display Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">Display Creator</div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
              
              {/* Related sequences card placeholder */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sequences Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Purchase sequences used in this display to recreate it yourself!
                  </p>
                  <Button className="w-full">
                    View Sequences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DisplayDetail;
