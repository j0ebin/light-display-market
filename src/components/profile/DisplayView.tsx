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
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {display.display_type}
            </Badge>
            {display.holiday_type && (
              <Badge variant="outline">
                {display.holiday_type}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-muted-foreground">{display.description}</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <span>{display.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span>{formatSchedule(display.schedule)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Music size={16} className="text-muted-foreground" />
            <span>{display.songCount} songs</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DisplayView; 