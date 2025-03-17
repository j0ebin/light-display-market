
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin, Calendar, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DisplayWithOwner } from '@/data/mockDisplaysData';
import { formatSchedule } from '@/utils/displayUtils';

interface DisplayCardProps {
  display: DisplayWithOwner;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ display }) => {
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
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <div 
          className={cn(
            "absolute inset-0 bg-muted backdrop-blur-sm z-10 transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        
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
        
        <Badge 
          variant="secondary" 
          className="absolute bottom-3 left-3 z-20 bg-black/30 text-white backdrop-blur-sm border-none"
        >
          {display.display_type}
        </Badge>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-xl line-clamp-1">{display.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} className="fill-amber-500" />
            <span className="text-sm font-medium">{display.rating}</span>
          </div>
        </div>

        {display.owner && (
          <div className="flex items-center gap-2">
            <Link 
              to={`/owner/${display.id}`} 
              className="flex items-center gap-2 hover:text-primary transition-colors" 
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={display.owner.avatar} alt={display.owner.name} />
                <AvatarFallback>{display.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {display.owner.name}
              </span>
            </Link>
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
      
      <Link to={`/display/${display.id}`} className="absolute inset-0 z-10" aria-label={`View ${display.name}`}></Link>
    </div>
  );
};

export default DisplayCard;
