
import React from 'react';
import PurchaseCard from '@/components/sequences/PurchaseCard';
import SellerCard from '@/components/sequences/SellerCard';
import CharityCard from '@/components/charity/CharityCard';
import { SequenceDetail } from '@/types/sequence';
import { Charity } from '@/types/charity';

interface SequenceSidePanelProps {
  sequence: SequenceDetail;
  isPurchased: boolean;
  isPurchaseProcessing: boolean;
  onPurchase: () => void;
  onDownload: () => void;
}

const SequenceSidePanel: React.FC<SequenceSidePanelProps> = ({
  sequence,
  isPurchased,
  isPurchaseProcessing,
  onPurchase,
  onDownload
}) => {
  return (
    <div className="space-y-8">
      <PurchaseCard 
        price={sequence.price}
        isPurchased={isPurchased}
        isProcessing={isPurchaseProcessing}
        onPurchase={onPurchase}
        onDownload={onDownload}
      />
      
      <SellerCard seller={sequence.creator} />
      
      {sequence.charity && (
        <CharityCard charity={sequence.charity as Charity} />
      )}
    </div>
  );
};

export default SequenceSidePanel;
