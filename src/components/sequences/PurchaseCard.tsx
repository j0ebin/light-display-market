
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Download } from 'lucide-react';

interface PurchaseCardProps {
  price: number;
  isPurchased?: boolean;
  isProcessing?: boolean;
  onPurchase: () => void;
  onDownload?: () => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ 
  price,
  isPurchased = false,
  isProcessing = false,
  onPurchase,
  onDownload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sequence Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Price</span>
          <span className="text-2xl font-bold">{formatPrice(price)}</span>
        </div>
        
        {isPurchased ? (
          <Button 
            className="w-full" 
            onClick={onDownload}
            variant="default"
          >
            <Download size={16} className="mr-2" />
            Re-download
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={onPurchase}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Buy Now'}
          </Button>
        )}
        
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
