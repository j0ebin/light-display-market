export type RatingSize = 'sm' | 'md' | 'lg';

export interface StarButtonProps {
  value: number;
  isActive: boolean;
  size: RatingSize;
  readOnly?: boolean;
  onHover?: (value: number) => void;
  onClick?: (value: number) => void;
}

export interface StarRatingProps {
  rating: number;
  size?: RatingSize;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export interface RatingComponentProps {
  rating: number;
  itemId: string;
  type: 'display' | 'sequence';
  size?: RatingSize;
  showRateButton?: boolean;
  onRatingUpdate?: (newRating: number) => void;
  readOnly?: boolean;
} 