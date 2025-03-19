
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Display } from '@/types/sequence';

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
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
      
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
