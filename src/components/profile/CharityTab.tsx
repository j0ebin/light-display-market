
import React from 'react';
import { Button } from '@/components/ui/button';
import CharityCard from '@/components/charity/CharityCard';
import CharityForm from '@/components/charity/CharityForm';
import { Charity } from '@/types/charity';

interface CharityTabProps {
  charity: Charity | null;
  userId: string;
  isEditingCharity: boolean;
  onEditCharity: () => void;
  onCharitySaved: (charity: Charity) => void;
  onCancelEditCharity: () => void;
}

const CharityTab: React.FC<CharityTabProps> = ({
  charity,
  userId,
  isEditingCharity,
  onEditCharity,
  onCharitySaved,
  onCancelEditCharity
}) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Supporting Charity</h2>
      
      {isEditingCharity ? (
        <div className="max-w-2xl">
          <CharityForm 
            charity={charity} 
            userId={userId} 
            onSaved={onCharitySaved} 
          />
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={onCancelEditCharity}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          {charity ? (
            <div className="max-w-md mb-6">
              <CharityCard charity={charity} />
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={onEditCharity}
              >
                Edit Charity Information
              </Button>
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-lg max-w-md">
              <h3 className="text-lg font-medium mb-2">No charity yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't set up a charity for your display yet
              </p>
              <Button onClick={onEditCharity}>
                Add a Charity
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CharityTab;
