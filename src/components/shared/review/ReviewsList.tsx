import React from 'react';
import { ReviewsListProps } from './types';
import { ReviewItem } from './ReviewItem';

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  itemId,
  type
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              itemId={itemId}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 