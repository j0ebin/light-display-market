
import React from 'react';
import { Star, Download, Music, Calendar, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface SequenceInfoProps {
  title: string;
  software: string;
  rating: number;
  downloads: number;
  description: string;
  song: {
    title: string;
    artist: string;
    genre?: string;
  };
  channelCount?: number;
  createdAt: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  displayName: string;
}

const SequenceInfo: React.FC<SequenceInfoProps> = ({
  title,
  software,
  rating,
  downloads,
  description,
  song,
  channelCount,
  createdAt,
  isFavorite,
  onToggleFavorite,
  displayName
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    onToggleFavorite();
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">{displayName}</p>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {software}
            </Badge>
            <div className="flex items-center text-amber-500">
              <Star size={16} className="fill-amber-500 mr-1" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleFavoriteClick}
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
          <span>
            <strong>{song.artist}</strong>
            {song.genre ? ` • ${song.genre}` : ''}
          </span>
        </div>
        {channelCount && software === 'LOR' && (
          <div className="flex items-center">
            <Download size={18} className="text-muted-foreground mr-2" />
            <span><strong>{channelCount}</strong> channels</span>
          </div>
        )}
        <div className="flex items-center">
          <Calendar size={18} className="text-muted-foreground mr-2" />
          <span>Created on <strong>{createdAt}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default SequenceInfo;
