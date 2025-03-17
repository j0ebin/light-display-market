
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DisplaySequencesCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sequences Available</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Purchase sequences used in this display to recreate it yourself!
        </p>
        <Button className="w-full">
          View Sequences
        </Button>
      </CardContent>
    </Card>
  );
};

export default DisplaySequencesCard;
