
import React, { useState } from 'react';
import { Music, Download, Star, DollarSign, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Sequence {
  id: string;
  title: string;
  displayName: string;
  imageUrl: string;
  price: number;
  rating: number;
  downloads: number;
  songCount: number;
  software: 'xLights' | 'LOR';
}

const mockSequences: Sequence[] = [
  {
    id: '1',
    title: 'Winter Wonderland',
    displayName: 'Johnson Family Lights',
    imageUrl: 'https://images.unsplash.com/photo-1482350325005-eda5e677279b?q=80&w=1080',
    price: 15.99,
    rating: 4.8,
    downloads: 243,
    songCount: 3,
    software: 'xLights'
  },
  {
    id: '2',
    title: 'Christmas Classics',
    displayName: 'Holiday Magic',
    imageUrl: 'https://images.unsplash.com/photo-1573116456454-e02329be9ae2?q=80&w=1080',
    price: 0,
    rating: 4.6,
    downloads: 512,
    songCount: 5,
    software: 'LOR'
  },
  {
    id: '3',
    title: 'Dubstep Christmas',
    displayName: 'Modern Light Creations',
    imageUrl: 'https://images.unsplash.com/photo-1542262867-c4b517b92db8?q=80&w=1080',
    price: 24.99,
    rating: 4.9,
    downloads: 187,
    songCount: 4,
    software: 'xLights'
  }
];

const SequenceCard: React.FC<{ sequence: Sequence }> = ({ sequence }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
              sequence.price === 0 
                ? "bg-green-500/80 text-white" 
                : "bg-white/20 text-white"
            )}
          >
            {sequence.price === 0 ? 'Free' : `$${sequence.price.toFixed(2)}`}
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

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download size={14} />
              <span>{sequence.downloads}</span>
            </div>
            <div className="flex items-center gap-1">
              <Music size={14} />
              <span>{sequence.songCount} songs</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className={cn(
              "rounded-full transition-all",
              sequence.price === 0 ? "bg-primary/90 hover:bg-primary" : ""
            )}
          >
            {sequence.price === 0 ? (
              <>
                <Download size={14} className="mr-1" /> 
                Download
              </>
            ) : (
              <>
                <DollarSign size={14} className="mr-1" /> 
                Buy Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PopularSequences = () => {
  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-sm text-primary font-medium mb-2">SYNCHRONIZED MAGIC</div>
            <h2 className="text-3xl md:text-4xl font-bold">Popular Sequences</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Find and purchase synchronized light sequences created by talented display owners.
            </p>
          </div>
          <Button variant="link" className="md:self-end">
            View All Sequences
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockSequences.map(sequence => (
            <SequenceCard key={sequence.id} sequence={sequence} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-full px-8">
            Explore All Sequences
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularSequences;
