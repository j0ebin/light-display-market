import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { StarRating } from './StarRating';
import { RatingComponentProps } from './types';

const RatingComponent: React.FC<RatingComponentProps> = ({
  rating,
  itemId,
  type,
  size = 'md',
  showRateButton = false,
  onRatingUpdate,
  readOnly = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRatingChange = (newRating: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a rating",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (onRatingUpdate) {
      onRatingUpdate(newRating);
    }
  };

  return (
    <StarRating
      rating={rating}
      size={size}
      readOnly={readOnly}
      onRatingChange={handleRatingChange}
    />
  );
};

export default RatingComponent; 