import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import RatingComponent from '../rating/RatingComponent';
import { supabase } from '@/lib/supabase';
import { ReviewFormProps } from './types';

export const ReviewForm: React.FC<ReviewFormProps> = ({
  itemId,
  type,
  currentRating = 0,
  currentReview = '',
  onRatingUpdate,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(currentRating);
  const [review, setReview] = useState(currentReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingError, setShowRatingError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setShowRatingError(false);
    if (onRatingUpdate) {
      onRatingUpdate(newRating);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (rating === 0) {
      setShowRatingError(true);
      return;
    }

    setIsSubmitting(true);
    const table = type === 'display' ? 'display_reviews' : 'sequence_reviews';
    const idField = type === 'display' ? 'display_id' : 'sequence_id';

    try {
      const { error } = await supabase
        .from(table)
        .upsert({
          [idField]: itemId,
          user_id: user.id,
          rating,
          review_text: review.trim() || null,
        }, {
          onConflict: `${idField},user_id`
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setReview('');
      setRating(0);
      setShowRatingError(false);

      // Notify parent
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Leave a Review</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <RatingComponent
            rating={rating}
            itemId={itemId}
            type={type}
            size="lg"
            onRatingUpdate={handleRatingChange}
            readOnly={false}
          />
          <span className="text-sm text-muted-foreground">
            {rating > 0 ? `${rating} stars` : 'Select a rating'}
          </span>
        </div>
        {showRatingError && (
          <p className="text-sm text-destructive">
            Please select a star rating
          </p>
        )}
      </div>
      <Textarea
        placeholder="Write your review (optional, max 250 characters)"
        value={review}
        onChange={(e) => {
          if (e.target.value.length <= 250) {
            setReview(e.target.value);
          }
        }}
        className="min-h-[100px]"
        maxLength={250}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {review.length}/250 characters
        </span>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </div>
  );
}; 