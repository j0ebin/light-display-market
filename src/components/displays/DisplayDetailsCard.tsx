
import React from 'react';
import { Tag } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface DisplayDetailsCardProps {
  yearStarted: number | null;
  fmStation: string | null;
  songCount: number;
}

const DisplayDetailsCard: React.FC<DisplayDetailsCardProps> = ({
  yearStarted,
  fmStation,
  songCount
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Tag className="mr-2" size={18} />
          Display Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {yearStarted && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Running Since</div>
              <div className="font-medium">{yearStarted}</div>
            </div>
          )}
          {fmStation && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Tune Radio To</div>
              <div className="font-medium">{fmStation}</div>
            </div>
          )}
          <div>
            <div className="text-sm text-muted-foreground mb-1">Songs in Show</div>
            <div className="font-medium">{songCount} songs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayDetailsCard;
