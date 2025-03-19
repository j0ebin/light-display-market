
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const CheckoutSecurityInfo: React.FC = () => {
  return (
    <div className="mt-6 text-sm text-muted-foreground">
      <p className="flex items-center">
        <ShieldCheck size={16} className="mr-2 text-green-500" />
        Secure checkout powered by Stripe
      </p>
      <p className="mt-2">
        By completing this purchase, you agree to our Terms of Service and acknowledge that you've read our Privacy Policy.
      </p>
    </div>
  );
};

export default CheckoutSecurityInfo;
