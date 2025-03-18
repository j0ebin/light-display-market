
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Download, Star, DollarSign, Play, Disc2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { Sequence } from '@/types/sequence';

interface SequenceCardProps {
  sequence: Sequence;
}

const SequenceCard: React.FC<SequenceCardProps> = ({ sequence }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isFree = sequence.price === 0;

  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-video w-full overflow-hidden relative">
        {/* Initial blur overlay while image loads */}
        <div 
          className={cn(
            "absolute inset-0 bg-muted backdrop-blur-sm z-10 transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Image with loading effect */}
        <img
          src={sequence.imageUrl}
          alt={sequence.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLoaded ? "scale-100 filter-none" : "scale-105 blur-sm",
            isHovered ? "scale-110" : "scale-100"
          )}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
        
        {/* Play button overlay */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-20",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/10">
            <Play size={20} className="ml-1" />
          </Button>
        </div>

        {/* Software Badge */}
        <Badge 
          className="absolute top-3 left-3 z-30 bg-white/20 backdrop-blur-sm text-white border-none"
        >
          {sequence.software}
        </Badge>
        
        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 z-30">
          <Badge 
            className={cn(
              "backdrop-blur-sm border-none",
              isFree
                ? "bg-green-500/80 text-white" 
                : "bg-white/20 text-white"
            )}
          >
            {isFree ? 'Free' : `$${sequence.price.toFixed(2)}`}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{sequence.title}</h3>
            <p className="text-sm text-muted-foreground">{sequence.displayName}</p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} className="fill-amber-500" />
            <span className="text-xs font-medium">{sequence.rating}</span>
          </div>
        </div>

        {/* Song Details */}
        <div className="mt-2 mb-3">
          <div className="flex items-center gap-2">
            <Music size={14} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium line-clamp-1">{sequence.song.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{sequence.song.artist}</p>
            </div>
          </div>
        </div>

        {/* Creator Info and Action Button */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={sequence.creatorAvatar} alt={sequence.creatorName} />
              <AvatarFallback>{sequence.creatorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{sequence.creatorName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {sequence.software === 'LOR' && sequence.channelCount && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Disc2 size={14} />
                <span>{sequence.channelCount} ch</span>
              </div>
            )}
            
            <Link to={`/sequence/${sequence.id}`}>
              <Button 
                size="sm" 
                className={cn(
                  "rounded-full transition-all",
                  isFree ? "bg-primary/90 hover:bg-primary" : ""
                )}
              >
                {isFree ? (
                  <>
                    <Download size={14} className="mr-1" /> 
                    Download
                  </>
                ) : (
                  <>
                    <Download size={14} className="mr-1" /> 
                    Download
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Card overlay for link */}
      <Link to={`/sequence/${sequence.id}`} className="absolute inset-0 z-10" aria-label={`View ${sequence.title}`}></Link>
    </div>
  );
};

export default SequenceCard;
