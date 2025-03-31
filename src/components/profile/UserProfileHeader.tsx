import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Display } from '@/types/sequence';
import AvatarUpload from './AvatarUpload';

interface UserProfileHeaderProps {
  user: any;
  userDisplay: Display | null;
  onEditProfile: () => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  userDisplay,
  onEditProfile
}) => {
  const handleAvatarUpdated = (url: string) => {
    // The avatar update is handled in the AvatarUpload component
    // We don't need to do anything here as the user metadata is updated automatically
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <AvatarUpload 
        user={user}
        onAvatarUpdated={handleAvatarUpdated}
        size="md"
        editable={false}
      />
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{user?.user_metadata?.full_name || user?.email}</h1>
        
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
          {userDisplay && (
            <div className="flex items-center gap-1">
              <Star size={16} />
              <span>Display Owner</span>
            </div>
          )}
          {user?.user_metadata?.location && (
            <div className="flex items-center gap-1">
              <span>{user.user_metadata.location}</span>
            </div>
          )}
        </div>
        
        {user?.user_metadata?.bio && (
          <p className="mt-4 text-muted-foreground">{user.user_metadata.bio}</p>
        )}
        
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onEditProfile}>Edit Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
