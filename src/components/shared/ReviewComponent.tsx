import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RatingComponent from './RatingComponent';
import { supabase } from '@/lib/supabase';

interface ReviewComponentProps {
  itemId: string;
  type: 'display' | 'sequence';
  currentRating?: number;
  currentReview?: string;
  onRatingUpdate?: (rating: number) => void;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  users: {
    first_name: string;
    avatar_url: string;
  };
}

interface SupabaseReview {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  users: {
    first_name: string;
    avatar_url: string;
  };
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({
  itemId,
  type,
  currentRating = 0,
  currentReview = '',
  onRatingUpdate
}) => {
  const [rating, setRating] = useState(currentRating);
  const [review, setReview] = useState(currentReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showRatingError, setShowRatingError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadReviews = async () => {
    const table = type === 'display' ? 'display_reviews' : 'sequence_reviews';
    const idField = type === 'display' ? 'display_id' : 'sequence_id';

    const { data, error } = await supabase
      .from(table)
      .select(`
        id,
        user_id,
        rating,
        review_text,
        created_at,
        users!inner (
          first_name,
          avatar_url
        )
      `)
      .eq(idField, itemId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reviews:', error);
      return;
    }

    // Transform the data to match our Review interface
    const transformedData = (data as unknown as SupabaseReview[]).map(review => ({
      ...review,
      review_text: review.review_text || undefined
    }));

    setReviews(transformedData);
  };

  React.useEffect(() => {
    loadReviews();
  }, [itemId, type]);

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

      // Reload reviews
      await loadReviews();
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
    <div className="space-y-6">
      {/* Review Form */}
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

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="flex gap-4 p-4 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.users.avatar_url} />
                  <AvatarFallback>{review.users.first_name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.users.first_name}</span>
                    <RatingComponent
                      rating={review.rating}
                      itemId={itemId}
                      type={type}
                      size="sm"
                      readOnly={true}
                    />
                  </div>
                  {review.review_text && (
                    <p className="text-muted-foreground">{review.review_text}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent; 