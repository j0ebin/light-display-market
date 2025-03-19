
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, DollarSign, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseCardProps {
  price: number;
  sequenceId: string;
  sellerUserId?: string;
  sequenceTitle: string;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ 
  price, 
  sequenceId, 
  sellerUserId,
  sequenceTitle
}) => {
  const isFree = price === 0;
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePurchaseClick = async () => {
    setIsLoading(true);
    
    // Check if user is authenticated
    if (!user) {
      // Store the intended action in sessionStorage
      sessionStorage.setItem('afterAuthAction', JSON.stringify({
        action: isFree ? 'download' : 'purchase',
        sequenceId,
        price
      }));
      
      // Redirect to auth page
      navigate('/auth');
      return;
    }
    
    if (isFree) {
      // Handle free download
      await handleFreeDownload();
    } else {
      // Redirect to checkout
      initiateCheckout();
    }
    
    setIsLoading(false);
  };
  
  const handleFreeDownload = async () => {
    try {
      // First record the "purchase" of the free item
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          sequence_id: sequenceId,
          amount_paid: 0,
          seller_id: sellerUserId || null,
          status: 'completed'
        });
        
      if (purchaseError) {
        throw purchaseError;
      }
      
      // Trigger the download
      // In a real implementation, this would redirect to the actual file
      toast({
        title: "Download started",
        description: "Your sequence is being downloaded."
      });
      
      // Show donation popup after successful download
      // This would be opened in a separate dialog/modal
      setTimeout(() => {
        navigate(`/donation/${sequenceId}`);
      }, 500);
      
    } catch (error) {
      console.error("Error processing free download:", error);
      toast({
        title: "Download failed",
        description: "There was a problem starting your download. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const initiateCheckout = () => {
    // Redirect to checkout page with sequence details
    navigate(`/checkout/${sequenceId}`);
  };

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
          onClick={handlePurchaseClick}
          disabled={isLoading}
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              {isFree ? (
                <>
                  <Download size={18} className="mr-2" />
                  Download Now
                </>
              ) : (
                <>
                  <ShoppingCart size={18} className="mr-2" />
                  Purchase Now
                </>
              )}
            </>
          )}
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
