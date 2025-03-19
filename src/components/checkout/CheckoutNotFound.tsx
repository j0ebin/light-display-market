
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CheckoutNotFound: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Sequence Not Found</h2>
      <p className="mb-6">We couldn't find the sequence you're looking for.</p>
      <Button asChild>
        <Link to="/sequences">Browse Sequences</Link>
      </Button>
    </div>
  );
};

export default CheckoutNotFound;
