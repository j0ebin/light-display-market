import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Upload, Image as ImageIcon, X, Plus, Loader2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Song } from '@/types/sequence';

interface AddSongFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSongAdded: (song: Song) => void;
  displayId: string;
  editingSong?: Song | null;
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
  sequence_file_url: string | null;
  sequence_price: number | null;
  created_at: string;
  updated_at: string;
  album_cover_url: string | null;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  duration: z.string().regex(/^\d+:\d{2}$/, 'Duration must be in format M:SS or MM:SS'),
  genre: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear()),
  albumCover: z.instanceof(File).optional(),
});

const AddSongForm: React.FC<AddSongFormProps> = ({ isOpen, onClose, onSongAdded, displayId, editingSong }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artist: '',
      duration: '',
      genre: '',
      year: new Date().getFullYear(),
    }
  });

  // Reset form when editing song changes
  useEffect(() => {
    if (editingSong) {
      form.reset({
        title: editingSong.title,
        artist: editingSong.artist,
        duration: editingSong.duration,
        genre: editingSong.genre,
        year: editingSong.year || new Date().getFullYear(),
      });
      setPreviewUrl(editingSong.albumCover || null);
    } else {
      form.reset({
        title: '',
        artist: '',
        duration: '',
        genre: '',
        year: new Date().getFullYear(),
      });
      setPreviewUrl(null);
    }
  }, [editingSong, form]);

  const uploadAlbumCover = async (file: File): Promise<string | null> => {
    if (!file) return null;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Album cover must be less than 5MB');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Album cover must be JPEG, PNG, GIF, or WebP');
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `album-covers/${fileName}`;
    console.log('Uploading album cover to path:', filePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('displays')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Album cover upload error:', uploadError);
      throw uploadError;
    }

    console.log('Album cover upload successful:', uploadData);

    const { data: { publicUrl } } = supabase.storage
      .from('displays')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsUploading(true);

      // Get the display year ID
      let yearData = await supabase
        .from('display_years')
        .select('id')
        .eq('display_id', displayId)
        .eq('year', values.year)
        .single()
        .then(({ data }) => data);

      if (!yearData) {
        // Year doesn't exist, create it
        const { data: newYearData, error: createYearError } = await supabase
          .from('display_years')
          .insert({ display_id: displayId, year: values.year })
          .select('id')
          .single();

        if (createYearError) throw createYearError;
        yearData = newYearData;
      }

      // Upload album cover if provided
      let albumCoverUrl = previewUrl;
      if (values.albumCover) {
        albumCoverUrl = await uploadAlbumCover(values.albumCover);
      }

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

      let insertedSong;
      if (editingSong) {
        // Update existing song
        const { data: updatedSong, error: updateError } = await supabase
          .from('display_songs')
          .update(songData)
          .eq('id', editingSong.id)
          .select<'display_songs', DisplaySong>()
          .single();

        if (updateError) throw updateError;
        insertedSong = updatedSong;
      } else {
        // Insert new song
        const { data: newSong, error: insertError } = await supabase
          .from('display_songs')
          .insert(songData)
          .select<'display_songs', DisplaySong>()
          .single();

        if (insertError) throw insertError;
        insertedSong = newSong;
      }

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

      onSongAdded(newSong);
      toast({
        variant: "default",
        title: "Success",
        description: editingSong ? 'Song updated successfully' : 'Song added successfully'
      });
      onClose();
      form.reset();
      setPreviewUrl(null);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save song'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('albumCover', file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('albumCover', undefined);
    setPreviewUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingSong ? 'Edit Song' : 'Add New Song'}</DialogTitle>
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
                  <FormLabel>Year First Added to Display</FormLabel>
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

            <div className="space-y-2">
              <FormLabel>Album Cover (Optional)</FormLabel>
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Album cover preview"
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex items-center justify-center">
                      <Plus className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingSong ? 'Save Changes' : 'Add Song'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongForm; 