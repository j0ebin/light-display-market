
import React from 'react';
import { Download, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PurchaseCardProps {
  price: number;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ price }) => {
  const isFree = price === 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-3xl font-bold">
              {isFree ? 'Free' : `$${price.toFixed(2)}`}
            </div>
            <div className="text-sm text-muted-foreground">One-time purchase</div>
          </div>
          {isFree ? (
            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-200">
              Free
            </Badge>
          ) : null}
        </div>
        
        <Button 
          className="w-full text-base py-6 mb-4"
          variant={isFree ? "outline" : "default"}
        >
          <Download size={18} className="mr-2" />
          Download Now
        </Button>
        
        <div className="text-sm text-center text-muted-foreground">
          {isFree ? 
            "No payment required" : 
            "Secure payment processing by Stripe"
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseCard;
