
import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PurchaseDetails } from '@/hooks/usePurchaseDetails';

interface PurchaseActionsProps {
  purchase: PurchaseDetails;
  handleDownload: () => void;
}

const PurchaseActions: React.FC<PurchaseActionsProps> = ({ purchase, handleDownload }) => {
  return (
    <div className="text-center space-y-4">
      <Button
        size="lg"
        className="w-full"
        onClick={handleDownload}
      >
        <Download className="mr-2" size={18} />
        Download Your Sequence
      </Button>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link to={`/sequence/${purchase.sequence.id}`}>
            View Sequence Details
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </Button>
        
        <Button variant="ghost" asChild>
          <Link to="/">
            <Home size={16} className="mr-1" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PurchaseActions;
