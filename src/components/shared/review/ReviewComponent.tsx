import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Review } from './types';
import { ReviewForm } from './ReviewForm';
import { ReviewsList } from './ReviewsList';

interface ReviewComponentProps {
  itemId: string;
  type: 'display' | 'sequence';
  currentRating?: number;
  currentReview?: string;
  onRatingUpdate?: (rating: number) => void;
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
  const [reviews, setReviews] = useState<Review[]>([]);

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

  useEffect(() => {
    loadReviews();
  }, [itemId, type]);

  return (
    <div className="space-y-6">
      <ReviewForm
        itemId={itemId}
        type={type}
        currentRating={currentRating}
        currentReview={currentReview}
        onRatingUpdate={onRatingUpdate}
        onReviewSubmitted={loadReviews}
      />
      <ReviewsList
        reviews={reviews}
        itemId={itemId}
        type={type}
      />
    </div>
  );
};

export default ReviewComponent; 