import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Song } from '@/types/sequence';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface AddSongFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSongAdded: (song: Song) => void;
  displayId: string;
}

interface FormValues {
  title: string;
  artist: string;
  duration: string;
  genre?: string;
  year: number;
  albumCover?: File;
}

interface DisplayYear {
  id: string;
  display_id: string;
  year: number;
  description?: string;
}

interface DisplaySong {
  id: string;
  display_year_id: string;
  title: string;
  artist: string;
  year_introduced: number;
  duration?: string;
  genre?: string;
  sequence_available: boolean;
  album_cover_url?: string;
}

const AddSongForm: React.FC<AddSongFormProps> = ({ isOpen, onClose, onSongAdded, displayId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      artist: '',
      duration: '',
      genre: '',
      year: new Date().getFullYear()
    }
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update form value
    form.setValue('albumCover', file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const uploadAlbumCover = async (file: File): Promise<string | null> => {
    try {
      console.log('Starting album cover upload:', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `album-covers/${fileName}`;
      
      console.log('Generated file path:', { filePath, fileExt });

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File must be a JPEG, PNG, GIF, or WebP image');
      }

      console.log('File validation passed');

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('displays')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      console.log('Upload response:', { uploadError, uploadData });

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          name: uploadError.name,
          stack: uploadError.stack
        });
        if (uploadError.message.includes('bucket')) {
          throw new Error('Storage configuration error. Please contact support.');
        }
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('displays')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading album cover:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload album cover');
      return null;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsUploading(true);
      console.log('Starting song submission:', values);

      // Upload album cover if provided
      let albumCoverUrl = null;
      if (values.albumCover) {
        console.log('Uploading album cover...');
        albumCoverUrl = await uploadAlbumCover(values.albumCover);
        console.log('Album cover upload result:', albumCoverUrl);
      }

      // First, insert the display year if it doesn't exist
      console.log('Upserting display year:', { displayId, year: values.year });
      const { data: yearData, error: yearError } = await supabase
        .from('display_years')
        .upsert({
          display_id: parseInt(displayId),
          year: values.year,
          description: `Songs from ${values.year}`
        }, {
          onConflict: 'display_id,year'
        })
        .select<'display_years', DisplayYear>()
        .single();

      if (yearError) {
        console.error('Year upsert error:', yearError);
        throw yearError;
      }
      console.log('Year upsert successful:', yearData);

      // Then insert the song
      const songData = {
        title: values.title,
        artist: values.artist,
        year_introduced: values.year,
        display_year_id: yearData.id,
        sequence_available: false,
        duration: values.duration,
        genre: values.genre || null,
        album_cover_url: albumCoverUrl
      };
      console.log('Inserting song:', songData);

      const { data: insertedSong, error: songError } = await supabase
        .from('display_songs')
        .insert(songData)
        .select<'display_songs', DisplaySong>()
        .single();

      if (songError) {
        console.error('Song insert error:', songError);
        throw songError;
      }
      console.log('Song insert successful:', insertedSong);

      // Transform the database response to match the Song type
      const newSong: Song = {
        id: parseInt(insertedSong.id),
        title: insertedSong.title,
        artist: insertedSong.artist,
        duration: insertedSong.duration || '0:00',
        year: insertedSong.year_introduced,
        genre: insertedSong.genre,
        albumCover: insertedSong.album_cover_url
      };

      // Call the onSongAdded callback with the new song
      onSongAdded(newSong);
      
      // Show success message
      toast.success('Song added successfully');
      
      // Close the modal
      onClose();
      
      // Reset the form and preview
      form.reset();
      setPreviewUrl(null);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add song');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Song Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter song title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter artist name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3:45" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rock, Pop, Classical" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter year" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="albumCover"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Album Cover (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center gap-4">
                      {previewUrl ? (
                        <div className="relative w-32 h-32">
                          <img
                            src={previewUrl}
                            alt="Album cover preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onClick={() => {
                              setPreviewUrl(null);
                              onChange(undefined);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="album-cover-upload"
                            onChange={handleImageChange}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('album-cover-upload')?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Cover
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Adding Song...' : 'Add Song'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongForm; 