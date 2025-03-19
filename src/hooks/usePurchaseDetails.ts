
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
        // Use RPC call to get purchase details with the correct type annotation
        const { data, error } = await supabase.rpc<PurchaseDetailsResponse[]>('get_purchase_details', {
          p_user_id: user.id,
          p_sequence_id: id
        });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const purchaseData = data[0];
          setPurchase({
            id: purchaseData.id,
            sequence: {
              id: purchaseData.sequence_id,
              title: "Holiday Light Sequence", // Replace with actual title from your DB
              downloadUrl: `/api/sequences/download/${purchaseData.sequence_id}` // Replace with actual download URL
            },
            purchaseDate: new Date(purchaseData.created_at).toLocaleDateString(),
            amountPaid: purchaseData.amount_paid
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
      // In a real implementation, this would trigger the file download
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
