
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckoutPaymentProps {
  price: number;
  isProcessing: boolean;
  onPaymentSubmit: () => void;
}

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({ 
  price, 
  isProcessing, 
  onPaymentSubmit 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete your purchase securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <CreditCard size={48} className="mx-auto mb-2 text-primary/60" />
          <p className="text-sm text-muted-foreground mb-4">
            You'll be redirected to our secure payment processor
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          disabled={isProcessing}
          onClick={onPaymentSubmit}
        >
          {isProcessing ? "Processing..." : `Pay $${price.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CheckoutPayment;
