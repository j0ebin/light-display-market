
import React from 'react';
import { Star, Heart, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DisplayHeaderProps {
  name: string;
  displayType: string | null;
  rating: number;
  holidayType: string | null;
  location: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const DisplayHeader: React.FC<DisplayHeaderProps> = ({
  name,
  displayType,
  rating,
  holidayType,
  location,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center mt-2 space-x-3">
            {displayType && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {displayType}
              </Badge>
            )}
            <div className="flex items-center text-amber-500">
              <Star size={16} className="fill-amber-500 mr-1" />
              <span>{rating}</span>
            </div>
            {holidayType && (
              <Badge variant="outline">
                {holidayType}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={onToggleFavorite}
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
        <span>{location}</span>
      </div>
    </div>
  );
};

export default DisplayHeader;
