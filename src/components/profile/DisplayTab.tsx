import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Music, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import ReviewComponent from '@/components/shared/review/ReviewComponent';
import { formatSchedule } from '@/utils/formatters';
import DisplayEditForm from './DisplayEditForm';
import DisplayView from './DisplayView';

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
      const displayData = {
        ...data,
        songCount: data.display_songs?.length || 0
      };
      setDisplay(displayData);
      setEditedDisplay(displayData);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedDisplay: Partial<Display>) => {
    if (!editedDisplay || !user) return;

    const { error } = await supabase
      .from('displays')
      .update(updatedDisplay)
      .eq('id', editedDisplay.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update display. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setDisplay({ ...editedDisplay, ...updatedDisplay });
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Display updated successfully!",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDisplay(display);
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
      {isEditing ? (
        <DisplayEditForm
          display={editedDisplay!}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={setEditedDisplay}
        />
      ) : (
        <DisplayView display={display} />
      )}

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
