
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Charity } from '@/types/charity';

interface CharityCardProps {
  charity: Charity;
  variant?: 'default' | 'compact';
}

const CharityCard: React.FC<CharityCardProps> = ({ charity, variant = 'default' }) => {
  if (!charity) return null;
  
  if (variant === 'compact') {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Supporting Charity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <h4 className="font-medium text-lg mb-1">{charity.name}</h4>
            <p className="text-sm text-muted-foreground">{charity.description}</p>
          </div>
          <Button className="w-full" variant="outline" asChild>
            <a href={charity.url} target="_blank" rel="noopener noreferrer">
              Donate <ExternalLink size={14} className="ml-1" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Supporting Charity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-medium text-lg mb-2">{charity.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{charity.description}</p>
          {charity.supporting_text && (
            <p className="text-sm italic">{charity.supporting_text}</p>
          )}
        </div>
        <Button className="w-full" asChild>
          <a href={charity.url} target="_blank" rel="noopener noreferrer">
            Donate Now <ExternalLink size={14} className="ml-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CharityCard;
