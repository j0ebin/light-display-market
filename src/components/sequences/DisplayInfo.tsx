
import React from 'react';
import { MapPin, Calendar, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DisplayInfoProps {
  display: {
    title: string;
    location: string;
    schedule: string;
    rating: number;
  };
  imageUrl: string;
}

const DisplayInfo: React.FC<DisplayInfoProps> = ({ display, imageUrl }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Featured in Display</h3>
        <div className="flex items-start space-x-4">
          <img 
            src={imageUrl} 
            alt={display.title} 
            className="w-24 h-24 object-cover rounded-md"
          />
          <div>
            <h4 className="font-medium text-lg">{display.title}</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                <span>{display.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{display.schedule}</span>
              </div>
              <div className="flex items-center text-amber-500">
                <Star size={14} className="fill-amber-500 mr-1" />
                <span>{display.rating}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              View Display
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayInfo;
