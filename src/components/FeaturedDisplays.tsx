
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin, Calendar, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Display {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  category: string;
  schedule: string;
  songCount: number;
  isFavorite: boolean;
}

const mockDisplays: Display[] = [
  {
    id: '1',
    title: 'Winter Wonderland Symphony',
    image: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
    rating: 4.9,
    location: 'Seattle, WA',
    category: 'Musical Light Show',
    schedule: 'Nov 25 - Jan 5 • 5-10pm',
    songCount: 12,
    isFavorite: false
  },
  {
    id: '2',
    title: 'Magical Christmas Village',
    image: 'https://images.unsplash.com/photo-1604719322778-e05a9ba7156a?q=80&w=1080',
    rating: 4.7,
    location: 'Portland, OR',
    category: 'Mega Display',
    schedule: 'Dec 1 - Dec 31 • 6-11pm',
    songCount: 8,
    isFavorite: true
  },
  {
    id: '3',
    title: 'Festive Lights Extravaganza',
    image: 'https://images.unsplash.com/photo-1607262807149-daa76e3d5a3a?q=80&w=1080',
    rating: 4.5,
    location: 'San Francisco, CA',
    category: 'Animated Display',
    schedule: 'Nov 27 - Jan 2 • 5:30-10pm',
    songCount: 15,
    isFavorite: false
  }
];

const DisplayCard: React.FC<{ display: Display }> = ({ display }) => {
  const [isFavorite, setIsFavorite] = useState(display.isFavorite);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
          src={display.image}
          alt={display.title}
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
          {display.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-xl line-clamp-1">{display.title}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} className="fill-amber-500" />
            <span className="text-sm font-medium">{display.rating}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="line-clamp-1">{display.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span className="line-clamp-1">{display.schedule}</span>
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
      <Link to={`/display/${display.id}`} className="absolute inset-0 z-10" aria-label={`View ${display.title}`}></Link>
    </div>
  );
};

const FeaturedDisplays = () => {
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
          <Button variant="link" className="md:self-end">
            View All Displays
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockDisplays.map(display => (
            <DisplayCard key={display.id} display={display} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="rounded-full px-8">
            Discover More Displays
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDisplays;
