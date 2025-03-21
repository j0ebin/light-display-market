import React, { useState } from 'react';
import { StarButton } from './StarButton';
import { StarRatingProps } from './types';

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  readOnly = false,
  onRatingChange
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleHover = (value: number) => {
    if (!readOnly) {
      setHoverRating(value);
    }
  };

  const handleClick = (value: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <StarButton
          key={value}
          value={value}
          isActive={value <= (hoverRating || rating)}
          size={size}
          readOnly={readOnly}
          onHover={handleHover}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}; 