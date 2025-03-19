
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CheckoutLoaderProps {
  isLoading: boolean;
}

const CheckoutLoader: React.FC<CheckoutLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="text-center py-12">
      Loading checkout information...
    </div>
  );
};

export default CheckoutLoader;
