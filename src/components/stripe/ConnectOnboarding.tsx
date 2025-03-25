import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ConnectOnboardingProps {
  userId: string;
}

export function ConnectOnboarding({ userId }: ConnectOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // Call your API endpoint to create a Stripe Connect account
      const response = await fetch('/api/stripe/connect/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create Stripe account');
      }

      // Redirect to Stripe Connect onboarding
      window.location.href = data.accountLink;
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start onboarding process. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-2xl font-bold">Connect with Stripe</h2>
      <p className="text-muted-foreground text-center max-w-md">
        To start selling sequences and receive payments, you need to connect your Stripe account.
        You'll be able to track your earnings and request payouts once your balance exceeds $20.
      </p>
      <Button
        onClick={handleOnboarding}
        disabled={isLoading}
        className="w-full max-w-sm"
      >
        {isLoading ? "Setting up..." : "Connect with Stripe"}
      </Button>
    </div>
  );
} 