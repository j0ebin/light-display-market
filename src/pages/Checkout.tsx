
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

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

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sequence, setSequence] = useState<SequenceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      sessionStorage.setItem('afterAuthAction', JSON.stringify({
        action: 'purchase',
        sequenceId: id,
      }));
      navigate('/auth');
      return;
    }
    
    // Fetch sequence details
    const fetchSequenceDetails = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from your database
        // This is a mock example
        // Replace with your actual data fetching logic
        const mockSequenceData = {
          id: id,
          title: "Holiday Light Sequence",
          price: 19.99,
          seller: {
            id: "seller-123",
            name: "John Johnson",
          },
          song: {
            title: "Carol of the Bells",
            artist: "Trans-Siberian Orchestra",
          }
        };
        
        setSequence(mockSequenceData);
      } catch (error) {
        console.error("Error fetching sequence details:", error);
        toast({
          title: "Failed to load sequence details",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSequenceDetails();
  }, [id, user, navigate, toast]);
  
  const initiateStripeCheckout = async () => {
    if (!sequence || !user) return;
    
    setIsProcessing(true);
    try {
      // Call the Stripe checkout function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          sequenceId: sequence.id,
          userId: user.id,
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
      toast({
        title: "Checkout Failed",
        description: "Unable to process your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            Loading checkout information...
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!sequence) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Sequence Not Found</h2>
            <p className="mb-6">We couldn't find the sequence you're looking for.</p>
            <Button asChild>
              <Link to="/sequences">Browse Sequences</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your purchase before proceeding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Sequence:</span>
                      <span>{sequence.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Song:</span>
                      <span>{sequence.song.title} by {sequence.song.artist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Created by:</span>
                      <span>{sequence.seller.name}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${sequence.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <ShieldCheck size={16} className="mr-2 text-green-500" />
                  Secure checkout powered by Stripe
                </p>
                <p className="mt-2">
                  By completing this purchase, you agree to our Terms of Service and acknowledge that you've read our Privacy Policy.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>
                    Complete your purchase securely
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <CreditCard size={48} className="mx-auto mb-2 text-primary/60" />
                    <p className="text-sm text-muted-foreground mb-4">
                      You'll be redirected to our secure payment processor
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing}
                    onClick={initiateStripeCheckout}
                  >
                    {isProcessing ? "Processing..." : `Pay $${sequence.price.toFixed(2)}`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
