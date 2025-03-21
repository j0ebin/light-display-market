import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Song } from '@/types/sequence';

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
}

const AddSongForm: React.FC<AddSongFormProps> = ({ isOpen, onClose, onSongAdded, displayId }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      artist: '',
      duration: '',
      genre: '',
      year: new Date().getFullYear()
    }
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      // First, insert the display year if it doesn't exist
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

      if (yearError) throw yearError;

      // Then insert the song
      const { data: songData, error: songError } = await supabase
        .from('display_songs')
        .insert({
          title: values.title,
          artist: values.artist,
          year_introduced: values.year,
          display_year_id: yearData.id,
          sequence_available: false,
          duration: values.duration,
          genre: values.genre || null
        })
        .select<'display_songs', DisplaySong>()
        .single();

      if (songError) throw songError;

      // Transform the database response to match the Song type
      const newSong: Song = {
        id: parseInt(songData.id),
        title: songData.title,
        artist: songData.artist,
        duration: songData.duration || '0:00',
        year: songData.year_introduced,
        genre: songData.genre
      };

      // Call the onSongAdded callback with the new song
      onSongAdded(newSong);
      
      // Show success message
      toast.success('Song added successfully');
      
      // Close the modal
      onClose();
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Error adding song:', error);
      toast.error('Failed to add song');
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
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Song
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongForm; 