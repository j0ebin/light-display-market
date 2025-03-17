
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar } from 'lucide-react';
import { DisplayWithOwner } from '@/data/mockDisplaysData';
import { formatSchedule } from '@/utils/displayUtils';

interface OwnerDisplayCardProps {
  display: DisplayWithOwner;
}

const OwnerDisplayCard: React.FC<OwnerDisplayCardProps> = ({ display }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={display.image_url || ''} 
          alt={display.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        {display.rating && (
          <div className="absolute top-3 right-3 bg-black/60 text-white rounded-full px-2 py-1 text-sm flex items-center">
            <Star size={14} className="mr-1 fill-amber-400 stroke-amber-400" />
            <span>{display.rating}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{display.name}</h3>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{display.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{formatSchedule(display.schedule)}</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/display/${display.id}`}>View Display</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default OwnerDisplayCard;
