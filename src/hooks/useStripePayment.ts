import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { validatePrice } from '@/lib/stripe';

interface UseStripePaymentProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useStripePayment({ onSuccess, onError }: UseStripePaymentProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentIntent = async ({
    amount,
    currency,
    sequenceId,
    buyerId,
    sellerId,
  }: {
    amount: number;
    currency: string;
    sequenceId: string;
    buyerId: string;
    sellerId: string;
  }) => {
    try {
      setIsLoading(true);

      // Validate price
      if (!validatePrice(amount, currency as any)) {
        throw new Error('Invalid price amount');
      }

      // Create payment intent
      const response = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          sequenceId,
          buyerId,
          sellerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      onSuccess?.();
      return data.clientSecret;
    } catch (error) {
      console.error('Payment intent error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process payment. Please try again.",
      });
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createPaymentIntent,
  };
} 