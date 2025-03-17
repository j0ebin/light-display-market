
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DisplayOwnerCardProps {
  avatarUrl: string;
  ownerName: string;
  ownerTitle?: string;
}

const DisplayOwnerCard: React.FC<DisplayOwnerCardProps> = ({
  avatarUrl,
  ownerName,
  ownerTitle = "Display Creator"
}) => {
  // Since our mock data maps owner IDs to 1, 2, 3
  // and the names match our mockOwnersData
  // we can determine the ID based on the name for this demo
  const getOwnerId = () => {
    if (ownerName === 'John Smith') return 1;
    if (ownerName === 'Sarah Johnson') return 2;
    if (ownerName === 'David Williams') return 3;
    return 1; // Default to first owner
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Display Owner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={ownerName} />
            <AvatarFallback>{ownerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{ownerName}</div>
            <div className="text-sm text-muted-foreground">{ownerTitle}</div>
          </div>
        </div>
        <Button className="w-full mt-4" variant="outline" asChild>
          <Link to={`/owner/${getOwnerId()}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DisplayOwnerCard;
