
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sequence } from '@/types/sequence';

interface RelatedSequencesProps {
  sequences: Sequence[];
}

const RelatedSequences: React.FC<RelatedSequencesProps> = ({ sequences }) => {
  if (sequences.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">More from this Display</h3>
        
        <div className="space-y-4">
          {sequences.map(seq => (
            <div key={seq.id} className="flex items-center space-x-3">
              <img 
                src={seq.imageUrl} 
                alt={seq.title} 
                className="w-16 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{seq.title}</div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {seq.software}
                  </Badge>
                  <div className="text-sm">
                    {seq.price === 0 ? 'Free' : `$${seq.price.toFixed(2)}`}
                  </div>
                </div>
              </div>
              <Link to={`/sequence/${seq.id}`}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ExternalLink size={16} />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedSequences;
