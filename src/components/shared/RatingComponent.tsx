import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface RatingComponentProps {
  rating: number;
  itemId: string;
  type: 'display' | 'sequence';
  size?: 'sm' | 'md' | 'lg';
  showRateButton?: boolean;
  onRatingUpdate?: (newRating: number) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  rating,
  itemId,
  type,
  size = 'md',
  showRateButton = false,
  onRatingUpdate
}) => {
  const [isRating, setIsRating] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const sizes = {
    sm: { star: 14, text: 'text-xs' },
    md: { star: 16, text: 'text-sm' },
    lg: { star: 20, text: 'text-base' }
  };

  const handleRateClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to rate",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setIsRating(true);
  };

  const handleRatingSubmit = async (value: number) => {
    if (!user) return;

    const table = type === 'display' ? 'display_ratings' : 'sequence_ratings';
    const idField = type === 'display' ? 'display_id' : 'sequence_id';

    try {
      const { error } = await supabase
        .from(table)
        .upsert({
          [idField]: itemId,
          user_id: user.id,
          rating: value
        }, {
          onConflict: `${idField},user_id`
        });

      if (error) throw error;

      setUserRating(value);
      setIsRating(false);
      if (onRatingUpdate) {
        onRatingUpdate(value);
      }

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      {isRating ? (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              className="p-0 h-auto hover:bg-transparent"
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRatingSubmit(value)}
            >
              <Star
                size={sizes[size].star}
                className={cn(
                  "transition-colors",
                  value <= (hoverRating || userRating)
                    ? "fill-amber-500 text-amber-500"
                    : "fill-none text-muted-foreground"
                )}
              />
            </Button>
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center text-amber-500">
            <Star size={sizes[size].star} className="fill-amber-500" />
            <span className={cn("font-medium", sizes[size].text)}>
              {rating.toFixed(1)}
            </span>
          </div>
          {showRateButton && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground ml-2"
              onClick={handleRateClick}
            >
              Rate
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default RatingComponent; 