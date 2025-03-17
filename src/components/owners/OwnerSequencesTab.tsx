
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockSequences } from '@/data/mockSequences';

interface OwnerSequencesTabProps {
  owner: {
    id: number;
    name: string;
  };
}

const OwnerSequencesTab: React.FC<OwnerSequencesTabProps> = ({ owner }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Available Sequences</h2>
      <p className="text-muted-foreground">
        Browse and purchase synchronized light sequences created by {owner.name}.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {mockSequences.slice(0, 4).map(sequence => (
          <div key={sequence.id} className="bg-card rounded-lg overflow-hidden border">
            <div className="aspect-video bg-muted relative">
              <img 
                src={sequence.imageUrl} 
                alt={sequence.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{sequence.title}</h3>
              <div className="flex justify-between items-center">
                <Badge 
                  variant="outline" 
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {sequence.software}
                </Badge>
                <div className="font-medium">
                  {sequence.price === 0 ? 'Free' : `$${sequence.price.toFixed(2)}`}
                </div>
              </div>
              <Button className="w-full mt-3" asChild>
                <Link to={`/sequence/${sequence.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerSequencesTab;
