import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Music, Edit2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import ReviewComponent from '../shared/ReviewComponent';
import { formatSchedule } from '@/utils/formatters';

interface Display {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  schedule: string;
  display_type: string;
  holiday_type: string;
  review_rating: number;
  songCount: number;
}

const DisplayTab = () => {
  const [display, setDisplay] = useState<Display | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplay, setEditedDisplay] = useState<Display | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserDisplay();
    }
  }, [user]);

  const loadUserDisplay = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('displays')
      .select(`
        *,
        display_songs (
          id
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error loading display:', error);
      return;
    }

    if (data) {
      setDisplay({
        ...data,
        songCount: data.display_songs?.length || 0
      });
      setEditedDisplay({
        ...data,
        songCount: data.display_songs?.length || 0
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedDisplay || !user) return;

    const { error } = await supabase
      .from('displays')
      .update({
        name: editedDisplay.name,
        description: editedDisplay.description,
        location: editedDisplay.location,
        schedule: editedDisplay.schedule,
        display_type: editedDisplay.display_type,
        holiday_type: editedDisplay.holiday_type,
      })
      .eq('id', editedDisplay.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update display. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setDisplay(editedDisplay);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Display updated successfully!",
    });
  };

  if (!display) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't created a display yet.</p>
        <Button className="mt-4">Create Display</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Display Header */}
      <div className="relative">
        <div className="aspect-[21/9] w-full overflow-hidden rounded-lg">
          <img
            src={display.image_url}
            alt={display.name}
            className="w-full h-full object-cover"
          />
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4"
            onClick={handleEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Display Content */}
      <Card className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editedDisplay?.name}
                onChange={(e) => setEditedDisplay(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editedDisplay?.description}
                onChange={(e) => setEditedDisplay(prev => prev ? {...prev, description: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={editedDisplay?.location}
                onChange={(e) => setEditedDisplay(prev => prev ? {...prev, location: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Schedule</Label>
              <Input
                value={editedDisplay?.schedule}
                onChange={(e) => setEditedDisplay(prev => prev ? {...prev, schedule: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Display Type</Label>
              <Input
                value={editedDisplay?.display_type}
                onChange={(e) => setEditedDisplay(prev => prev ? {...prev, display_type: e.target.value} : null)}
              />
            </div>
            <div>
              <Label>Holiday Type</Label>
              <Input
                value={editedDisplay?.holiday_type}
                onChange={(e) => setEditedDisplay(prev => prev ? {...prev, holiday_type: e.target.value} : null)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{display.name}</h1>
              <div className="flex items-center mt-2 space-x-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {display.display_type}
                </Badge>
                {display.holiday_type && (
                  <Badge variant="outline">
                    {display.holiday_type}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-muted-foreground">{display.description}</p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-muted-foreground" />
                <span>{display.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span>{formatSchedule(display.schedule)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Music size={16} className="text-muted-foreground" />
                <span>{display.songCount} songs</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Reviews Section */}
      <div className="mt-8">
        <ReviewComponent
          itemId={display.id}
          type="display"
          currentRating={display.review_rating}
        />
      </div>
    </div>
  );
};

export default DisplayTab;
