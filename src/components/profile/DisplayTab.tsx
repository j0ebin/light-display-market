
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DisplayView from '@/components/profile/DisplayView';
import DisplayEditForm from '@/components/profile/DisplayEditForm';
import { PlusCircle } from 'lucide-react';

const DisplayTab = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [userDisplay, setUserDisplay] = React.useState(null);

  return (
    <div>
      {userDisplay ? (
        <>
          {isEditing ? (
            <DisplayEditForm 
              display={userDisplay} 
              onSave={(updatedDisplay) => {
                setUserDisplay(updatedDisplay);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Display</h2>
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Display
                </Button>
              </div>
              <DisplayView display={userDisplay} />
            </>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Create Your First Display</h2>
          <p className="text-muted-foreground mb-6">
            Share your holiday light display with the community!
          </p>
          <Button asChild>
            <Link to="/display/edit">
              <PlusCircle className="mr-2" size={16} />
              Create Display
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DisplayTab;
