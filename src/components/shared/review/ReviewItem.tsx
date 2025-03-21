import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RatingComponent from '../rating/RatingComponent';
import { ReviewItemProps } from './types';

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  itemId,
  type
}) => {
  return (
    <div className="flex gap-4 p-4 rounded-lg border">
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
  );
}; 