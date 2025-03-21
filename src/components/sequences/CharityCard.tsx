import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface CharityCardProps {
  charity: {
    name: string;
    description: string;
    imageUrl: string;
    donationPercentage: number;
  };
}

const CharityCard: React.FC<CharityCardProps> = ({ charity }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={20} className="text-red-500" />
          <h3 className="text-lg font-semibold">Supporting Charity</h3>
        </div>

        <div className="flex gap-4">
          <img
            src={charity.imageUrl}
            alt={charity.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium">{charity.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {charity.description}
            </p>
            <p className="text-sm font-medium text-green-600">
              {charity.donationPercentage}% of sales donated
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharityCard; 