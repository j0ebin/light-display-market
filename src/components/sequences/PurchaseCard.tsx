import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatters';

interface PurchaseCardProps {
  price: number;
  isPurchased?: boolean;
  onPurchase: () => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ 
  price,
  isPurchased = false,
  onPurchase
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Sequence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Price</span>
          <span className="text-2xl font-bold">{formatPrice(price)}</span>
        </div>
        
        <Button 
          className="w-full" 
          onClick={onPurchase}
          disabled={isPurchased}
        >
          {isPurchased ? 'Purchased' : 'Buy Now'}
        </Button>
        
        <p className="text-sm text-muted-foreground">
          {isPurchased 
            ? 'You already own this sequence'
            : 'Instant download after purchase'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default PurchaseCard;
