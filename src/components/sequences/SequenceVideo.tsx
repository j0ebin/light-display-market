
import React from 'react';
import { Card } from '@/components/ui/card';

interface SequenceVideoProps {
  videoUrl: string;
  title: string;
}

const SequenceVideo: React.FC<SequenceVideoProps> = ({ videoUrl, title }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative pb-[56.25%] h-0">
        <iframe 
          src={videoUrl}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        ></iframe>
      </div>
    </Card>
  );
};

export default SequenceVideo;
