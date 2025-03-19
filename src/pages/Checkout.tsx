
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

// Import custom hooks
import { useSequenceDetails } from '@/hooks/useSequenceDetails';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

// Import components
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import CheckoutPayment from '@/components/checkout/CheckoutPayment';
import CheckoutSecurityInfo from '@/components/checkout/CheckoutSecurityInfo';
import CheckoutLoader from '@/components/checkout/CheckoutLoader';
import CheckoutNotFound from '@/components/checkout/CheckoutNotFound';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use custom hooks
  const { sequence, isLoading } = useSequenceDetails(id, user);
  const { isProcessing, initiateStripeCheckout } = useStripeCheckout({ 
    sequence, 
    userId: user?.id 
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <CheckoutLoader isLoading={isLoading} />
        ) : !sequence ? (
          <CheckoutNotFound />
        ) : (
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
                <CheckoutSummary sequence={sequence} />
                <CheckoutSecurityInfo />
              </div>
              
              <div className="md:col-span-2">
                <CheckoutPayment 
                  price={sequence.price}
                  isProcessing={isProcessing}
                  onPaymentSubmit={initiateStripeCheckout}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
