import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Music } from 'lucide-react';
import { formatSchedule } from '@/utils/formatters';

interface Display {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  schedule: string;
  display_type: string;
  holiday_type: string;
  review_rating: number;
  songCount: number;
}

interface DisplayViewProps {
  display: Display;
}

const DisplayView: React.FC<DisplayViewProps> = ({ display }) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{display.name}</h1>
          <div className="flex items-center mt-2 space-x-3">
            <Badge variant="secondary">{display.display_type}</Badge>
            <Badge variant="secondary">{display.holiday_type}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">{display.description}</p>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{display.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatSchedule(display.schedule)}</span>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <Music className="w-4 h-4" />
            <span>{display.songCount} songs</span>
          </div>
        </div>

        {display.image_url && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={display.image_url}
              alt={display.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default DisplayView; 