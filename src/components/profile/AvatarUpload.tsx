import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File must be a JPEG, PNG, GIF, or WebP image');
      }

      // Ensure we have a user ID
      if (!user?.id) {
        throw new Error('User ID is required for avatar upload');
      }

      // Get the current session to ensure we're authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Authentication required for avatar upload');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
        throw new Error('Invalid file extension');
      }

      // Create a folder structure with user ID
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Uploading file:', {
        bucket: 'avatars',
        filePath,
        fileSize: file.size,
        fileType: file.type
      });

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError.message.includes('row-level security')) {
          throw new Error('Permission denied. Please ensure you are logged in.');
        }
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        console.error('Metadata update error:', updateError);
        throw updateError;
      }

      onAvatarUpdated(publicUrl);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile picture');
    } finally {
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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