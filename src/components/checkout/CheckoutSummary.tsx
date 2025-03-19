
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SequenceDetails {
  id: string;
  title: string;
  price: number;
  seller: {
    id: string;
    name: string;
  };
  song: {
    title: string;
    artist: string;
  };
}

interface CheckoutSummaryProps {
  sequence: SequenceDetails;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ sequence }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          Review your purchase before proceeding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Sequence:</span>
            <span>{sequence.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Song:</span>
            <span>{sequence.song.title} by {sequence.song.artist}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Created by:</span>
            <span>{sequence.seller.name}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${sequence.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
