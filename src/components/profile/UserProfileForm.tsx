import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import AvatarUpload from './AvatarUpload';

export interface ProfileFormValues {
  fullName: string;
  bio: string;
  location: string;
}

interface UserProfileFormProps {
  user: any;
  onSave: (values: ProfileFormValues) => void;
  onCancel: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      bio: user?.user_metadata?.bio || '',
      location: user?.user_metadata?.location || '',
    }
  });

  const handleAvatarUpdated = (url: string) => {
    // The avatar update is handled in the AvatarUpload component
    // We don't need to do anything here as the user metadata is updated automatically
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AvatarUpload 
            user={user}
            onAvatarUpdated={handleAvatarUpdated}
            size="md"
          />
          
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself and your display" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UserProfileForm;
