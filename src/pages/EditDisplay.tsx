import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapboxAddressInput } from '@/components/MapboxAddressInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, X, Upload } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Json } from '@/integrations/supabase/types';

interface DisplaySong {
  id?: string;
  title: string;
  artist: string;
  year_introduced: number;
  youtube_url?: string;
  display_year_id?: string;
}

interface DisplaySchedule {
  start_date: string;
  end_date: string;
  days: string[];
  hours: {
    start: string;
    end: string;
  };
  [key: string]: unknown;  // Add index signature to make it compatible with Json type
}

interface DisplayForm {
  name: string;
  description: string;
  location: string;
  display_type: string;
  holiday_type: string[];
  schedule: DisplaySchedule | null;
  images: string[];
  songs: DisplaySong[];
}

interface DisplayData {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  location: string;
  display_type: string;
  holiday_type: string;
  schedule: Json | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  display_songs?: DisplaySong[];
}

interface SupabaseDisplay {
  id: number;
  name: string;
  description: string | null;
  location: string;
  display_type: string;
  holiday_type: string;
  schedule: Json | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  display_songs?: Array<{
    id: string;
    title: string;
    artist: string;
    year_introduced: number;
    sequence_file_url: string | null;
  }>;
}

interface DisplayYear {
  id: string;
  display_id: number;
  year: number;
  description: string | null;
  display_songs?: Array<{
    id: string;
    title: string;
    artist: string;
    year_introduced: number;
    sequence_file_url: string | null;
  }>;
}

const MAX_IMAGES = 5;
const INITIAL_SONG = {
  title: '',
  artist: '',
  year_introduced: new Date().getFullYear(),
  youtube_url: ''
};

const EditDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [form, setForm] = useState<DisplayForm>({
    name: '',
    description: '',
    location: '',
    display_type: 'Residential',
    holiday_type: ['Christmas'],
    schedule: null,
    images: [],
    songs: [{ ...INITIAL_SONG }]
  });

  useEffect(() => {
    if (id) {
      loadDisplay(id);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadDisplay = async (displayId: string) => {
    try {
      // First get the display
      const { data: rawDisplay, error: displayError } = await supabase
        .from('displays')
        .select('*')
        .eq('id', parseInt(displayId, 10))
        .single();

      if (displayError) throw displayError;

      // Then get the latest display year and its songs
      type DisplayYearResponse = {
        data: DisplayYear | null;
        error: any;
      };

      const { data: displayYear, error: yearError } = await supabase
        .from('display_years')
        .select(`
          *,
          display_songs (
            id,
            title,
            artist,
            year_introduced,
            sequence_file_url
          )
        `)
        .eq('display_id', parseInt(displayId, 10))
        .order('year', { ascending: false })
        .limit(1)
        .single() as unknown as DisplayYearResponse;

      if (yearError && yearError.code !== 'PGRST116') { // Ignore "no rows returned" error
        throw yearError;
      }

      if (rawDisplay) {
        const display = rawDisplay as unknown as SupabaseDisplay;
        let songs: DisplaySong[] = [{ ...INITIAL_SONG }];
        
        if (displayYear && Array.isArray(displayYear.display_songs)) {
          songs = displayYear.display_songs.map(song => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            year_introduced: song.year_introduced,
            youtube_url: song.sequence_file_url || undefined,
            display_year_id: displayYear.id
          }));
        }

        setForm({
          name: display.name || '',
          description: display.description || '',
          location: display.location || '',
          display_type: display.display_type || 'Residential',
          holiday_type: display.holiday_type ? display.holiday_type.split(',') : ['Christmas'],
          schedule: display.schedule as DisplaySchedule | null,
          images: display.image_url ? [display.image_url] : [],
          songs
        });
      }
    } catch (error) {
      console.error('Error loading display:', error);
      toast({
        title: "Error",
        description: "Failed to load display details.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const remainingSlots = MAX_IMAGES - form.images.length;
    if (remainingSlots <= 0) {
      toast({
        title: "Error",
        description: `Maximum ${MAX_IMAGES} images allowed.`,
        variant: "destructive",
      });
      return;
    }

    setUploadingImages(true);
    const files = Array.from(e.target.files).slice(0, remainingSlots);
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Create a preview URL first
        const previewUrl = URL.createObjectURL(file);
        
        // Add to form state immediately for preview
        setForm(prev => ({
          ...prev,
          images: [...prev.images, previewUrl]
        }));

        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `display-images/${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('displays')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Get the permanent public URL
          const { data: { publicUrl } } = supabase.storage
            .from('displays')
            .getPublicUrl(filePath);

          // Replace the preview URL with the permanent URL
          setForm(prev => ({
            ...prev,
            images: prev.images.map(url => url === previewUrl ? publicUrl : url)
          }));

          // Clean up the preview URL
          URL.revokeObjectURL(previewUrl);

          return publicUrl;
        } catch (error) {
          // Remove the preview URL if upload fails
          setForm(prev => ({
            ...prev,
            images: prev.images.filter(url => url !== previewUrl)
          }));
          // Clean up the preview URL
          URL.revokeObjectURL(previewUrl);
          throw error;
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSong = () => {
    setForm(prev => ({
      ...prev,
      songs: [...prev.songs, { ...INITIAL_SONG }]
    }));
  };

  const removeSong = (index: number) => {
    setForm(prev => ({
      ...prev,
      songs: prev.songs.filter((_, i) => i !== index)
    }));
  };

  const updateSong = (index: number, field: keyof DisplaySong, value: string | number) => {
    setForm(prev => ({
      ...prev,
      songs: prev.songs.map((song, i) => 
        i === index ? { ...song, [field]: value } : song
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to save a display.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user's ID from Supabase
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (!supabaseUser?.id) {
        throw new Error('Could not get user ID');
      }

      // Validate required fields
      if (!form.name || !form.location) {
        throw new Error('Name and location are required');
      }

      const displayData = {
        user_id: supabaseUser.id,
        name: form.name.trim(),
        description: form.description?.trim() || null,
        location: form.location.trim(),
        display_type: form.display_type || 'Residential',
        holiday_type: Array.isArray(form.holiday_type) ? form.holiday_type.join(',') : form.holiday_type,
        schedule: form.schedule as Json,
        image_url: form.images[0] || null,
        updated_at: new Date().toISOString()
      };

      let displayId = id;
      if (!id) {
        // Create new display - let Supabase handle ID generation
        const { data: newDisplay, error: createError } = await supabase
          .from('displays')
          .insert([displayData])
          .select()
          .single();

        if (createError) {
          console.error('Error creating display:', createError);
          throw new Error(createError.message || 'Failed to create display');
        }
        displayId = newDisplay?.id?.toString();
      } else {
        // Update existing display
        const { error: updateError } = await supabase
          .from('displays')
          .update(displayData)
          .eq('id', parseInt(id, 10));

        if (updateError) {
          console.error('Error updating display:', updateError);
          throw new Error(updateError.message || 'Failed to update display');
        }
      }

      // Handle songs
      if (displayId) {
        // Create or get the display year for the current year
        const currentYear = new Date().getFullYear();
        const { data: displayYear, error: yearError } = await supabase
          .from('display_years')
          .upsert({
            display_id: parseInt(displayId, 10),
            year: currentYear,
            description: `${currentYear} Show`
          })
          .select()
          .single();

        if (yearError) {
          console.error('Error creating display year:', yearError);
          throw new Error('Failed to create display year');
        }

        if (!displayYear?.id) {
          throw new Error('Failed to get display year ID');
        }

        // Delete existing songs for this display year
        const { error: deleteError } = await supabase
          .from('display_songs')
          .delete()
          .eq('display_year_id', displayYear.id);

        if (deleteError) {
          console.error('Error deleting existing songs:', deleteError);
          throw new Error('Failed to update songs');
        }

        // Then insert new songs
        const validSongs = form.songs.filter(song => 
          song.title?.trim() && 
          song.artist?.trim() && 
          song.year_introduced
        ).map(song => ({
          title: song.title.trim(),
          artist: song.artist.trim(),
          year_introduced: song.year_introduced,
          sequence_file_url: song.youtube_url?.trim() || null,
          display_year_id: displayYear.id
        }));

        if (validSongs.length > 0) {
          const { error: songsError } = await supabase
            .from('display_songs')
            .insert(validSongs);

          if (songsError) {
            console.error('Error saving songs:', songsError);
            throw new Error('Failed to save songs');
          }
        }
      }

      toast({
        title: "Success",
        description: "Display saved successfully!",
      });

      navigate(`/profile`);
    } catch (error) {
      console.error('Error saving display:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save display.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">
        {id ? 'Edit Display' : 'Add Your Display'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Display Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Display Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location">Address</Label>
              <MapboxAddressInput
                value={form.location}
                onChange={(value) => setForm(prev => ({ ...prev, location: value }))}
                required
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your display's street address to help visitors find you
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display_type">Display Type</Label>
                <Select
                  value={form.display_type}
                  onValueChange={value => setForm(prev => ({ ...prev, display_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="holiday_type">Holidays Display is On</Label>
                <ToggleGroup
                  type="multiple"
                  value={form.holiday_type}
                  onValueChange={(value) => {
                    // Ensure at least one value is selected
                    const newValue = value.length === 0 ? ['Christmas'] : value;
                    setForm(prev => ({ ...prev, holiday_type: newValue }));
                  }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  <ToggleGroupItem value="Christmas" variant="outline">
                    Christmas
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Halloween" variant="outline">
                    Halloween
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Thanksgiving" variant="outline">
                    Thanksgiving
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Fourth of July" variant="outline">
                    Fourth of July
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Easter" variant="outline">
                    Easter
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Other" variant="outline">
                    Other
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Textarea
                id="schedule"
                value={form.schedule ? JSON.stringify(form.schedule, null, 2) : ''}
                onChange={e => {
                  try {
                    const scheduleValue = e.target.value ? JSON.parse(e.target.value) : null;
                    setForm(prev => ({ ...prev, schedule: scheduleValue }));
                  } catch (error) {
                    // If the JSON is invalid, don't update the form
                    console.error('Invalid schedule JSON:', error);
                  }
                }}
                placeholder="Enter schedule in JSON format, e.g.:
{
  'start_date': '2025-11-25',
  'end_date': '2025-12-31',
  'days': ['Monday', 'Tuesday', 'Wednesday'],
  'hours': {
    'start': '18:00',
    'end': '22:00'
  }
}"
                rows={10}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your display's schedule in JSON format
              </p>
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Display Images</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {form.images.map((url, index) => (
                <div key={url} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Display ${index + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-200"
                    onLoad={(e) => {
                      // Make image visible once loaded
                      (e.target as HTMLImageElement).style.opacity = '1';
                      // Hide the loading overlay
                      const loadingOverlay = (e.target as HTMLImageElement).nextElementSibling;
                      if (loadingOverlay) {
                        (loadingOverlay as HTMLElement).style.opacity = '0';
                      }
                    }}
                    style={{ opacity: '0' }}
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-background/50 transition-opacity duration-200" 
                    style={{ opacity: '1' }}
                  >
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => removeImage(index)}
                    disabled={uploadingImages}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {form.images.length < MAX_IMAGES && (
              <div>
                <Label htmlFor="images">Add Images</Label>
                <div className="mt-2 space-y-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                  />
                  {uploadingImages && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading images...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Songs */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Songs</h2>
            <Button
              type="button"
              onClick={addSong}
              disabled={form.songs.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          </div>

          <div className="space-y-6">
            {form.songs.map((song, index) => (
              <div key={index} className="relative border rounded-lg p-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeSong(index)}
                  disabled={form.songs.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="grid gap-4">
                  <div>
                    <Label>Song Title</Label>
                    <Input
                      value={song.title}
                      onChange={e => updateSong(index, 'title', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Artist</Label>
                    <Input
                      value={song.artist}
                      onChange={e => updateSong(index, 'artist', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Year Introduced</Label>
                    <Input
                      type="number"
                      value={song.year_introduced}
                      onChange={e => updateSong(index, 'year_introduced', parseInt(e.target.value))}
                      min={1900}
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div>
                    <Label>Youtube/Vimeo Video URL of Song on Your Display</Label>
                    <Input
                      value={song.youtube_url || ''}
                      onChange={e => updateSong(index, 'youtube_url', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Display
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDisplay; 