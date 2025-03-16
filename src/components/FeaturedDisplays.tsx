
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin, Calendar, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from "@/integrations/supabase/client";
import { Display } from '@/types/sequence';

interface DisplayWithOwner extends Display {
  isFavorite: boolean;
  owner?: {
    name: string;
    avatar: string;
  };
  songCount: number;
}

const mockDisplays: DisplayWithOwner[] = [
  {
    id: 1,
    name: 'Winter Wonderland Symphony',
    image_url: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
    rating: 4.9,
    location: 'Seattle, WA',
    display_type: 'Musical Light Show',
    schedule: {
      start_date: '2023-11-25',
      end_date: '2024-01-05',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: {
        start: '17:00',
        end: '22:00'
      }
    },
    songCount: 12,
    isFavorite: false,
    owner: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    description: '',
    latitude: null,
    longitude: null,
    holiday_type: 'Christmas',
    year_started: 2018,
    fm_station: '88.1 FM',
    tags: ['musical', 'family-friendly', 'animated'],
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Magical Christmas Village',
    image_url: 'https://images.unsplash.com/photo-1604719322778-e05a9ba7156a?q=80&w=1080',
    rating: 4.7,
    location: 'Portland, OR',
    display_type: 'Mega Display',
    schedule: {
      start_date: '2023-12-01',
      end_date: '2023-12-31',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: {
        start: '18:00',
        end: '23:00'
      }
    },
    songCount: 8,
    isFavorite: true,
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    description: '',
    latitude: null,
    longitude: null,
    holiday_type: 'Christmas',
    year_started: 2015,
    fm_station: '90.5 FM',
    tags: ['village', 'themed', 'traditional'],
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Festive Lights Extravaganza',
    image_url: 'https://images.unsplash.com/photo-1607262807149-daa76e3d5a3a?q=80&w=1080',
    rating: 4.5,
    location: 'San Francisco, CA',
    display_type: 'Animated Display',
    schedule: {
      start_date: '2023-11-27',
      end_date: '2024-01-02',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: {
        start: '17:30',
        end: '22:00'
      }
    },
    songCount: 15,
    isFavorite: false,
    owner: {
      name: 'David Williams',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    description: '',
    latitude: null,
    longitude: null,
    holiday_type: 'Christmas',
    year_started: 2020,
    fm_station: '92.3 FM',
    tags: ['animated', 'synchronized', 'modern'],
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z'
  }
];

const formatSchedule = (schedule: any): string => {
  if (!schedule) return 'Schedule not available';
  
  const startDate = new Date(schedule.start_date);
  const endDate = new Date(schedule.end_date);
  
  const startMonth = startDate.toLocaleString('default', { month: 'short' });
  const endMonth = endDate.toLocaleString('default', { month: 'short' });
  
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  const hours = schedule.hours 
    ? `${schedule.hours.start.substring(0, 5)}-${schedule.hours.end.substring(0, 5)}` 
    : '';
  
  return `${startMonth} ${startDay} - ${endMonth} ${endDay} • ${hours}`;
};

const DisplayCard: React.FC<{ display: DisplayWithOwner }> = ({ display }) => {
  const [isFavorite, setIsFavorite] = useState(display.isFavorite);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formattedSchedule = formatSchedule(display.schedule);

  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-card transition-all duration-300 shadow-sm hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        {/* Initial blur overlay while image loads */}
        <div 
          className={cn(
            "absolute inset-0 bg-muted backdrop-blur-sm z-10 transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Image with loading effect */}
        <img
          src={display.image_url}
          alt={display.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-out",
            isLoaded ? "scale-100 filter-none" : "scale-105 blur-sm",
            isHovered ? "scale-110" : "scale-100"
          )}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-20 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-all",
              isFavorite ? "fill-destructive stroke-destructive" : "fill-none"
            )} 
          />
        </Button>
        
        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute bottom-3 left-3 z-20 bg-black/30 text-white backdrop-blur-sm border-none"
        >
          {display.display_type}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-xl line-clamp-1">{display.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} className="fill-amber-500" />
            <span className="text-sm font-medium">{display.rating}</span>
          </div>
        </div>

        {/* Owner info */}
        {display.owner && (
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle profile click - can be replaced with actual link in the future
              alert(`View ${display.owner?.name}'s profile`);
            }}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={display.owner.avatar} alt={display.owner.name} />
              <AvatarFallback>{display.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {display.owner.name}
            </span>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="line-clamp-1">{display.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span className="line-clamp-1">{formattedSchedule}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Music size={14} />
            <span>{display.songCount} songs</span>
          </div>
        </div>

        <Button 
          className="w-full mt-2 rounded-lg transition-all"
          variant="outline"
        >
          View Display
        </Button>
      </div>
      
      {/* Card overlay for link */}
      <Link to={`/display/${display.id}`} className="absolute inset-0 z-10" aria-label={`View ${display.name}`}></Link>
    </div>
  );
};

const FeaturedDisplays = () => {
  // In a future implementation, we could fetch displays from Supabase here
  const [displays, setDisplays] = useState<DisplayWithOwner[]>(mockDisplays);
  
  // useEffect(() => {
  //   const fetchDisplays = async () => {
  //     const { data, error } = await supabase
  //       .from('displays')
  //       .select('*')
  //       .limit(3);
  //       
  //     if (error) {
  //       console.error('Error fetching displays:', error);
  //       return;
  //     }
  //       
  //     if (data) {
  //       // Transform data to include isFavorite and songCount
  //       const displaysWithAdditions = data.map(display => ({
  //         ...display,
  //         isFavorite: false, // Default value, can be updated with user preferences
  //         songCount: Math.floor(Math.random() * 15) + 5, // Random number for demo
  //         owner: {
  //           name: "Display Owner", // Placeholder
  //           avatar: `https://i.pravatar.cc/150?img=${display.id}` // Placeholder
  //         }
  //       }));
  //       setDisplays(displaysWithAdditions);
  //     }
  //   };
  //   
  //   fetchDisplays();
  // }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-sm text-primary font-medium mb-2">EXPLORE</div>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Displays</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Discover spectacular holiday light displays handpicked by our community.
            </p>
          </div>
          <Button variant="link" className="md:self-end" asChild>
            <Link to="/displays">View All Displays</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displays.map(display => (
            <DisplayCard key={display.id} display={display} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="rounded-full px-8" asChild>
            <Link to="/displays">Discover More Displays</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDisplays;
