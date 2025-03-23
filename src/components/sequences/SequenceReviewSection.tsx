
import React from 'react';
import ReviewComponent from '@/components/shared/review/ReviewComponent';

interface SequenceReviewSectionProps {
  id: string;
  currentRating: number;
}

const SequenceReviewSection: React.FC<SequenceReviewSectionProps> = ({ id, currentRating }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      <ReviewComponent
        itemId={id}
        type="sequence"
        currentRating={currentRating}
      />
    </div>
  );
};

export default SequenceReviewSection;
