import React, { useState, useEffect } from 'react';
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
  readOnly?: boolean;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  rating,
  itemId,
  type,
  size = 'md',
  showRateButton = false,
  onRatingUpdate,
  readOnly = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const sizes = {
    sm: { star: 14, text: 'text-xs' },
    md: { star: 16, text: 'text-sm' },
    lg: { star: 20, text: 'text-base' }
  };

  const handleStarClick = (value: number) => {
    if (readOnly) return;
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a rating",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setCurrentRating(value);
    if (onRatingUpdate) {
      onRatingUpdate(value);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            className={cn(
              "p-0 h-auto hover:bg-transparent",
              !readOnly && "cursor-pointer"
            )}
            onMouseEnter={() => !readOnly && setHoverRating(value)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            onClick={() => handleStarClick(value)}
            disabled={readOnly}
          >
            <Star
              size={sizes[size].star}
              className={cn(
                "transition-colors",
                value <= (hoverRating || currentRating)
                  ? "fill-amber-500 text-amber-500"
                  : "fill-none text-muted-foreground",
                !readOnly && "hover:fill-amber-500 hover:text-amber-500"
              )}
            />
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {renderStars()}
      {showRateButton && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground ml-2"
          onClick={() => handleStarClick(0)}
        >
          Rate
        </Button>
      )}
    </div>
  );
};

export default RatingComponent; 