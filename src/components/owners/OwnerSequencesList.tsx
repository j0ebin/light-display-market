
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Music } from 'lucide-react';
import { Sequence } from '@/types/sequence';
import { mockSequences } from '@/data/mockSequences';

interface OwnerSequencesListProps {
  ownerId: number;
}

const OwnerSequencesList: React.FC<OwnerSequencesListProps> = ({ ownerId }) => {
  // Filter sequences that belong to this owner
  // In a real application, this would filter based on owner_id or display relationship
  // For mock data, we'll just use the first few sequences
  const ownerSequences = mockSequences.slice(0, 3);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Available Sequences</span>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sequences">View All</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ownerSequences.map(sequence => (
          <div key={sequence.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 last:pb-0">
            <div className="flex-shrink-0 w-20 h-16 rounded overflow-hidden">
              <img 
                src={sequence.imageUrl} 
                alt={sequence.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate text-base">{sequence.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  {sequence.software}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Music size={12} className="mr-1" />
                  <span>1 song</span>
                </div>
              </div>
              <div className="text-sm mt-1">
                {sequence.price === 0 ? 'Free' : `$${sequence.price.toFixed(2)}`}
              </div>
            </div>
            
            <Link to={`/sequence/${sequence.id}`} className="flex-shrink-0">
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <ExternalLink size={14} />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OwnerSequencesList;
