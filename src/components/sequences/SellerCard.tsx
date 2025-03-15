
import React from 'react';
import { User, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface SellerCardProps {
  seller: {
    name: string;
    avatar: string;
    rating: number;
    sequencesCount: number;
    joinedDate: string;
  };
}

const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">About the Creator</h3>
        
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{seller.name}</div>
            <div className="flex items-center text-sm text-amber-500">
              <Star size={14} className="fill-amber-500 mr-1" />
              <span>{seller.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span>{seller.joinedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sequences</span>
            <span>{seller.sequencesCount}</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
        >
          <User size={16} className="mr-2" />
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default SellerCard;
