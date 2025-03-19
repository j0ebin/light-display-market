
import React from 'react';
import { Button } from '@/components/ui/button';
import DisplayCard from '@/components/displays/DisplayCard';
import { Display } from '@/types/sequence';
import { DisplayWithOwner } from '@/data/mockDisplaysData';

interface DisplayTabProps {
  userDisplay: Display | null;
}

const DisplayTab: React.FC<DisplayTabProps> = ({ userDisplay }) => {
  // Convert Display to DisplayWithOwner if a display exists
  const displayWithOwner: DisplayWithOwner | null = userDisplay 
    ? {
        ...userDisplay,
        isFavorite: false, // Set a default value
        songCount: 0,      // Set a default value
        owner: undefined   // Optional in DisplayCard
      }
    : null;

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">My Light Display</h2>
      
      {displayWithOwner ? (
        <div className="max-w-md">
          <DisplayCard display={displayWithOwner} />
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
