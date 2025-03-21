import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    }
  };

  if (!display) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Share your display with the community below!</p>
        <Button 
          className="mt-4"
          onClick={() => navigate('/display/edit')}
        >
          Create Display
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DisplayView display={display} />
      <div className="flex justify-end">
        <Button
          onClick={() => navigate(`/display/edit/${display.id}`)}
        >
          Edit Display
        </Button>
      </div>

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
