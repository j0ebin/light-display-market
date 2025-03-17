
import React from 'react';
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
        <Button className="w-full mt-4" variant="outline">
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default DisplayOwnerCard;
