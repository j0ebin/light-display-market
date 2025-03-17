
import React from 'react';
import { Calendar, MapPin, Monitor } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Owner } from '@/types/owner';

interface OwnerHeaderProps {
  owner: Owner;
}

const OwnerHeader: React.FC<OwnerHeaderProps> = ({ owner }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
        <AvatarImage src={owner.avatar} alt={owner.name} />
        <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{owner.name}</h1>
        
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{owner.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Member since {owner.joinedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor size={16} />
            <span>{owner.displayCount} Display • {owner.sequenceCount} Sequences</span>
          </div>
        </div>
        
        <p className="mt-4 text-muted-foreground">{owner.biography}</p>
        
        <div className="flex gap-3 mt-4">
          <Button variant="outline">Contact</Button>
          <Button variant="outline">Follow</Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerHeader;
