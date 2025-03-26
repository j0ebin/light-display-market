import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, X, Upload } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface DisplaySong {
  id?: string;
  title: string;
  artist: string;
  year_introduced: number;
  youtube_url?: string;
  display_id?: string;
}

interface DisplayForm {
  name: string;
  description: string;
  location: string;
  display_type: string;
  holiday_type: string;
  schedule: string;
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
  schedule: string | null;
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
  schedule: string | null;
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
    youtube_url?: string;
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
    holiday_type: 'Christmas',
    schedule: '',
    images: [],
    songs: [{ ...INITIAL_SONG }]
  });

  useEffect(() => {
    if (id) {
      loadDisplay(id);
    }
  }, [id]);

  const loadDisplay = async (displayId: string) => {
    try {
      const { data: rawDisplay, error } = await supabase
        .from('displays')
        .select(`
          *,
          display_songs (
            id,
            title,
            artist,
            year_introduced,
            youtube_url
          )
        `)
        .eq('id', parseInt(displayId, 10))
        .single();

      if (error) throw error;

      if (rawDisplay) {
        const display = rawDisplay as unknown as SupabaseDisplay;
        const displaySongs = Array.isArray(display.display_songs) 
          ? display.display_songs 
          : [{ ...INITIAL_SONG }];

        setForm({
          name: display.name || '',
          description: display.description || '',
          location: display.location || '',
          display_type: display.display_type || 'Residential',
          holiday_type: display.holiday_type || 'Christmas',
          schedule: display.schedule || '',
          images: display.image_url ? [display.image_url] : [],
          songs: displaySongs
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
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `display-images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('displays')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('displays')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images.",
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

      const displayData = {
        user_id: supabaseUser.id,
        name: form.name,
        description: form.description,
        location: form.location,
        display_type: form.display_type,
        holiday_type: form.holiday_type,
        schedule: form.schedule,
        image_url: form.images[0] || null,
        updated_at: new Date().toISOString()
      };

      let displayId = id;
      if (!id) {
        // Create new display
        const { data: newDisplay, error: createError } = await supabase
          .from('displays')
          .insert([displayData])
          .select()
          .single();

        if (createError) throw createError;
        displayId = newDisplay?.id?.toString();
      } else {
        // Update existing display
        const { error: updateError } = await supabase
          .from('displays')
          .update(displayData)
          .eq('id', parseInt(id, 10));

        if (updateError) throw updateError;
      }

      // Handle songs
      if (displayId) {
        const { error: songsError } = await supabase
          .from('display_songs')
          .upsert(
            form.songs.map(song => ({
              ...song,
              display_id: parseInt(displayId, 10)
            }))
          );

        if (songsError) throw songsError;
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
        description: "Failed to save display.",
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
              <Input
                id="location"
                name="location"
                autoComplete="street-address"
                value={form.location}
                onChange={e => {
                  const value = e.target.value;
                  // Basic validation - ensure it's not just numbers
                  if (!/^\d+$/.test(value)) {
                    setForm(prev => ({ ...prev, location: value }));
                  }
                }}
                placeholder="Start typing your address..."
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
                <Label htmlFor="holiday_type">Holiday Type</Label>
                <Select
                  value={form.holiday_type}
                  onValueChange={value => setForm(prev => ({ ...prev, holiday_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Christmas">Christmas</SelectItem>
                    <SelectItem value="Halloween">Halloween</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                value={form.schedule}
                onChange={e => setForm(prev => ({ ...prev, schedule: e.target.value }))}
                placeholder="e.g., Daily 6-10pm, Nov 25 - Dec 31"
              />
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Display Images</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {form.images.map((url, index) => (
                <div key={index} className="relative aspect-video">
                  <img
                    src={url}
                    alt={`Display ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {form.images.length < MAX_IMAGES && (
              <div>
                <Label htmlFor="images">Add Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="mt-2"
                />
                {uploadingImages && (
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading images...
                  </div>
                )}
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
                    <Label>YouTube Video URL (optional)</Label>
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