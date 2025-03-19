import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ChevronRight, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface PurchaseDetails {
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

const PurchaseSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              Loading purchase information...
            </div>
          ) : purchase ? (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
                  <h1 className="text-3xl font-bold text-green-700">Thank You for Your Purchase!</h1>
                  <p className="text-green-600 mt-2">
                    Your payment has been processed successfully.
                  </p>
                </div>
                
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
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Purchase Not Found</h2>
              <p className="mb-6">We couldn't find the purchase information.</p>
              <Button asChild>
                <Link to="/sequences">Browse Sequences</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseSuccess;
