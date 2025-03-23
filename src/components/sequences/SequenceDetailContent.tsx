
import React from 'react';
import SequenceVideo from '@/components/sequences/SequenceVideo';
import SequenceInfo from '@/components/sequences/SequenceInfo';
import DisplayInfo from '@/components/sequences/DisplayInfo';
import { SequenceDetail } from '@/types/sequence';

interface SequenceDetailContentProps {
  sequence: SequenceDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const SequenceDetailContent: React.FC<SequenceDetailContentProps> = ({ 
  sequence, 
  isFavorite, 
  onToggleFavorite 
}) => {
  return (
    <div className="lg:col-span-2 space-y-8">
      <SequenceVideo 
        videoUrl={sequence.videoUrl || ''} 
        title={sequence.song.title} 
      />
      
      <SequenceInfo 
        title={sequence.title}
        software={sequence.software}
        rating={sequence.rating}
        downloads={sequence.downloads}
        description={sequence.description}
        song={sequence.song}
        channelCount={sequence.channelCount}
        createdAt={sequence.createdAt}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        displayName={sequence.displayName}
        displayId={sequence.displayId}
      />
      
      <DisplayInfo 
        display={sequence.display} 
        imageUrl={sequence.imageUrl || ''} 
      />
    </div>
  );
};

export default SequenceDetailContent;
