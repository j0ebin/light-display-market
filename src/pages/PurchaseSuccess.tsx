
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PurchaseDetails from '@/components/checkout/PurchaseDetails';
import PurchaseActions from '@/components/checkout/PurchaseActions';
import CheckoutNotFound from '@/components/checkout/CheckoutNotFound';
import CheckoutLoader from '@/components/checkout/CheckoutLoader';
import { usePurchaseDetails } from '@/hooks/usePurchaseDetails';

const PurchaseSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { purchase, isLoading, handleDownload } = usePurchaseDetails(id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <CheckoutLoader isLoading={isLoading} />
          
          {!isLoading && purchase ? (
            <Card className="border-green-200 bg-green-50/50">
              <div className="pt-6 p-6">
                <div className="text-center mb-8">
                  <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
                  <h1 className="text-3xl font-bold text-green-700">Thank You for Your Purchase!</h1>
                  <p className="text-green-600 mt-2">
                    Your payment has been processed successfully.
                  </p>
                </div>
                
                <PurchaseDetails purchase={purchase} />
                <PurchaseActions 
                  purchase={purchase} 
                  handleDownload={handleDownload} 
                />
              </div>
            </Card>
          ) : !isLoading && (
            <CheckoutNotFound />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseSuccess;
