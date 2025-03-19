
import React from 'react';
import { PurchaseDetails as PurchaseDetailsType } from '@/hooks/usePurchaseDetails';

interface PurchaseDetailsProps {
  purchase: PurchaseDetailsType;
}

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ purchase }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sequence:</span>
          <span className="font-medium">{purchase.sequence.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Purchase Date:</span>
          <span>{purchase.purchaseDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount Paid:</span>
          <span className="font-medium">${purchase.amountPaid.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
