import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StarButtonProps } from './types';

const sizes = {
  sm: { star: 14, text: 'text-xs' },
  md: { star: 16, text: 'text-sm' },
  lg: { star: 20, text: 'text-base' }
};

export const StarButton: React.FC<StarButtonProps> = ({
  value,
  isActive,
  size,
  readOnly = false,
  onHover,
  onClick
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "p-0 h-auto hover:bg-transparent",
        !readOnly && "cursor-pointer"
      )}
      onMouseEnter={() => !readOnly && onHover?.(value)}
      onMouseLeave={() => !readOnly && onHover?.(0)}
      onClick={() => !readOnly && onClick?.(value)}
      disabled={readOnly}
    >
      <Star
        size={sizes[size].star}
        className={cn(
          "transition-colors",
          isActive
            ? "fill-amber-500 text-amber-500"
            : "fill-none text-muted-foreground",
          !readOnly && "hover:fill-amber-500 hover:text-amber-500"
        )}
      />
    </Button>
  );
}; 