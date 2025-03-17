
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DisplayDescriptionProps {
  description: string;
  tags: string[] | null;
}

const DisplayDescription: React.FC<DisplayDescriptionProps> = ({ description, tags }) => {
  return (
    <div>
      <div className="prose prose-sm max-w-none mb-8">
        <p>{description}</p>
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-secondary/50">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayDescription;
