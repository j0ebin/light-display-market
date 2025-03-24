
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface PurchaseDetails {
  id: string;
  sequence: {
    id: string;
    title: string;
    downloadUrl: string;
  };
  purchaseDate: string;
  amountPaid: number;
}

// Define the type for the response from the get_purchase_details RPC
interface PurchaseDetailsResponse {
  id: string;
  sequence_id: string;
  amount_paid: number;
  created_at: string;
}

export const usePurchaseDetails = (id: string | undefined) => {
  const { user } = useAuth();
  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!user || !id) return;
      
      setIsLoading(true);
      try {
        // Use RPC call to get purchase details with correct typing
        const { data, error } = await supabase.rpc<PurchaseDetailsResponse[]>('get_purchase_details', {
          p_user_id: user.id,
          p_sequence_id: id
        });
          
        if (error) throw error;
        
        // Check if data exists and has items
        if (data && Array.isArray(data) && data.length > 0) {
          const purchaseItem = data[0];
          setPurchase({
            id: purchaseItem.id,
            sequence: {
              id: purchaseItem.sequence_id,
              title: "Holiday Light Sequence", // Replace with actual title from your DB
              downloadUrl: `/api/sequences/download/${purchaseItem.sequence_id}` // Replace with actual download URL
            },
            purchaseDate: new Date(purchaseItem.created_at).toLocaleDateString(),
            amountPaid: purchaseItem.amount_paid
          });
        }
      } catch (error) {
        console.error("Error fetching purchase details:", error);
        toast.error("Failed to load purchase details", {
          description: "Please try again or contact support."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchaseDetails();
  }, [id, user]);
  
  const handleDownload = async () => {
    if (!purchase) return;
    
    try {
      // Create a mock file for demonstration
      const element = document.createElement('a');
      const file = new Blob(
        [`This is a mock sequence file for ${purchase.sequence.id}`], 
        {type: 'text/plain'}
      );
      element.href = URL.createObjectURL(file);
      element.download = `sequence_${purchase.sequence.id}.xlights`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success("Download started", {
        description: "Your sequence is being downloaded."
      });
      
      // If this is a free sequence, navigate to donation page
      if (purchase.amountPaid === 0) {
        setTimeout(() => {
          window.location.href = `/donation/${purchase.sequence.id}`;
        }, 500);
      }
    } catch (error) {
      console.error("Error downloading sequence:", error);
      toast.error("Download failed", {
        description: "There was a problem starting your download. Please try again."
      });
    }
  };
  
  return {
    purchase,
    isLoading,
    handleDownload
  };
};
