import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Sequence } from '@/types/sequence';

// Define the type for purchase details response
interface PurchaseDetailsResponse {
  id: string;
  created_at: string;
  status: string;
}

export const useSequencePurchase = (sequenceId: string | undefined) => {
  const [isPurchaseProcessing, setIsPurchaseProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = async (sequence: Sequence) => {
    if (!sequence) return;
    
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to purchase this sequence",
      });
      navigate('/auth');
      return;
    }
    
    setIsPurchaseProcessing(true);
    
    try {
      // Create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          sequenceId: sequence.id,
          userId: user.id,
          price: sequence.price,
          title: sequence.title,
          sellerUserId: sequence.creator.id,
          songTitle: sequence.song?.title || sequence.title,
          songArtist: sequence.song?.artist || 'Unknown Artist',
          callbackUrl: `${window.location.origin}/purchase-success/${sequence.id}`
        }
      });
      
      if (error) throw error;
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error("Purchase failed", {
        description: "There was an error processing your purchase",
      });
    } finally {
      setIsPurchaseProcessing(false);
    }
  };
  
  const handleDownload = (sequence: Sequence) => {
    if (!sequence) return;
    
    // Create a dummy download link - in a real app, this would be a real file
    const element = document.createElement('a');
    const file = new Blob(
      [`This is a mock sequence file for ${sequence.title}`], 
      {type: 'text/plain'}
    );
    element.href = URL.createObjectURL(file);
    element.download = `${sequence.title.replace(/\s+/g, '_')}.xlights`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success("Download started", {
      description: "Your sequence is being downloaded"
    });
  };

  return {
    isPurchaseProcessing,
    isPurchased,
    handlePurchase,
    handleDownload
  };
};
