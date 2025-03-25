import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface SequencePaymentProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ amount, currency, onSuccess, onCancel }: Omit<SequencePaymentProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: error.message || "An error occurred during payment.",
        });
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="rounded-lg border p-4">
        <PaymentElement />
      </div>
      
      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isProcessing} className="w-full">
          {isProcessing ? "Processing..." : `Pay ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function SequencePayment({ clientSecret, ...props }: SequencePaymentProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="flex flex-col items-center gap-4 p-6">
        <h2 className="text-2xl font-bold">Complete Purchase</h2>
        <CheckoutForm {...props} />
      </div>
    </Elements>
  );
} 