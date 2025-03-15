
import React from 'react';
import { Star, Download, Music, Calendar, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SequenceInfoProps {
  title: string;
  software: string;
  rating: number;
  downloads: number;
  description: string;
  songCount: number;
  createdAt: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const SequenceInfo: React.FC<SequenceInfoProps> = ({
  title,
  software,
  rating,
  downloads,
  description,
  songCount,
  createdAt,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {software}
            </Badge>
            <div className="flex items-center text-amber-500">
              <Star size={16} className="fill-amber-500 mr-1" />
              <span>{rating}</span>
            </div>
            <div className="text-muted-foreground text-sm flex items-center">
              <Download size={14} className="mr-1" />
              <span>{downloads} downloads</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={onToggleFavorite}
        >
          <Heart
            size={18}
            className={cn(
              "transition-colors",
              isFavorite ? "fill-destructive stroke-destructive" : "fill-none"
            )}
          />
        </Button>
      </div>
      
      <div className="prose prose-sm max-w-none mb-8">
        <p>{description}</p>
      </div>
      
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center">
          <Music size={18} className="text-muted-foreground mr-2" />
          <span><strong>{songCount}</strong> songs included</span>
        </div>
        <div className="flex items-center">
          <Calendar size={18} className="text-muted-foreground mr-2" />
          <span>Created on <strong>{createdAt}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default SequenceInfo;
