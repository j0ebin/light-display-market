
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sequence } from '@/types/sequence';

// Define the type for purchase details response
interface PurchaseDetailsResponse {
  id: string;
  sequence_id: string;
  amount_paid: number;
  created_at: string;
}

export const useSequencePurchase = (sequenceId: string | undefined) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPurchaseProcessing, setIsPurchaseProcessing] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkPurchaseStatus = async () => {
    if (!user || !sequenceId) {
      setIsPurchased(false);
      setIsCheckingPurchase(false);
      return;
    }
    
    try {
      setIsCheckingPurchase(true);
      const { data, error } = await supabase.rpc<PurchaseDetailsResponse[]>('get_purchase_details', {
        p_user_id: user.id,
        p_sequence_id: sequenceId
      });
      
      if (error) throw error;
      
      // Check if data exists and has items
      setIsPurchased(data && Array.isArray(data) && data.length > 0);
    } catch (error) {
      console.error("Error checking purchase status:", error);
      toast.error("Failed to check purchase status");
    } finally {
      setIsCheckingPurchase(false);
    }
  };
  
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
      // In a real implementation, this would call your payment API
      const { data, error } = await supabase.rpc<PurchaseDetailsResponse[]>('create_purchase', {
        p_user_id: user.id,
        p_sequence_id: sequenceId,
        p_amount_paid: sequence.price,
        p_seller_id: sequence.creator.id,
        p_status: 'completed'
      });
      
      if (error) throw error;
      
      setIsPurchased(true);
      toast.success("Purchase successful", {
        description: `You have successfully purchased ${sequence.title}`,
      });
      
      // Start download after successful purchase
      handleDownload(sequence);
      
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
    isPurchased,
    isPurchaseProcessing,
    isCheckingPurchase,
    checkPurchaseStatus,
    handlePurchase,
    handleDownload
  };
};
