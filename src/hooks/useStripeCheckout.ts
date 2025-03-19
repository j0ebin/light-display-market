
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

interface UseStripeCheckoutProps {
  sequence: SequenceDetails | null;
  userId: string | undefined;
}

export const useStripeCheckout = ({ sequence, userId }: UseStripeCheckoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const initiateStripeCheckout = async () => {
    if (!sequence || !userId) return;
    
    setIsProcessing(true);
    try {
      // Call the Stripe checkout function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          sequenceId: sequence.id,
          userId: userId,
          price: sequence.price,
          title: sequence.title,
          sellerUserId: sequence.seller.id,
          songTitle: sequence.song.title,
          songArtist: sequence.song.artist,
          callbackUrl: `${window.location.origin}/purchase-success/${sequence.id}`
        }
      });
      
      if (error) throw error;
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Checkout Failed", {
        description: "Unable to process your payment. Please try again."
      });
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    initiateStripeCheckout
  };
};
