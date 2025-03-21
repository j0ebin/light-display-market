export interface ReviewUser {
  first_name: string;
  avatar_url: string;
}

export interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  users: ReviewUser;
}

export interface ReviewFormProps {
  itemId: string;
  type: 'display' | 'sequence';
  currentRating?: number;
  currentReview?: string;
  onRatingUpdate?: (rating: number) => void;
  onReviewSubmitted?: () => void;
}

export interface ReviewsListProps {
  reviews: Review[];
  itemId: string;
  type: 'display' | 'sequence';
}

export interface ReviewItemProps {
  review: Review;
  itemId: string;
  type: 'display' | 'sequence';
}

export interface ReviewStatsProps {
  reviews: Review[];
} 