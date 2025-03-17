
import React from 'react';
import { Owner } from '@/types/owner';

interface OwnerAboutTabProps {
  owner: Owner;
}

const OwnerAboutTab: React.FC<OwnerAboutTabProps> = ({ owner }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">About {owner.name}</h2>
      <div className="prose max-w-none">
        <p>{owner.biography}</p>
        <p>
          {owner.name} has been creating holiday light displays since {owner.joinedDate}. 
          They currently have {owner.displayCount} display and have created {owner.sequenceCount} sequences.
        </p>
        <p>Based in {owner.location}.</p>
      </div>
    </div>
  );
};

export default OwnerAboutTab;
