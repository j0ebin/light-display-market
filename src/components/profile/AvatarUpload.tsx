import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AvatarUploadProps {
  user: any;
  onAvatarUpdated: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  user,
  onAvatarUpdated,
  size = 'md',
  editable = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24 md:h-32 md:w-32',
    lg: 'h-32 w-32 md:h-40 md:w-40'
  };

  const handleClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      onAvatarUpdated(publicUrl);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile picture');
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar 
        className={`${sizeClasses[size]} border-4 border-background cursor-pointer transition-opacity hover:opacity-90`}
        onClick={handleClick}
      >
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
      
      {editable && (
        <>
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleClick}
          >
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default AvatarUpload; 