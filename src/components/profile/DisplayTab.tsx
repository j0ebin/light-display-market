
import React from 'react';
import { Button } from '@/components/ui/button';
import DisplayCard from '@/components/displays/DisplayCard';
import { Display } from '@/types/sequence';

interface DisplayTabProps {
  userDisplay: Display | null;
}

const DisplayTab: React.FC<DisplayTabProps> = ({ userDisplay }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">My Light Display</h2>
      
      {userDisplay ? (
        <div className="max-w-md">
          <DisplayCard display={userDisplay} />
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No display yet</h3>
          <p className="text-muted-foreground mb-4">You haven't created a display yet</p>
          <Button>Create Your Display</Button>
        </div>
      )}
    </>
  );
};

export default DisplayTab;
