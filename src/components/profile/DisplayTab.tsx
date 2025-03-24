import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Music, Edit2, PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import ReviewComponent from '@/components/shared/review/ReviewComponent';
import { formatSchedule } from '@/utils/formatters';
import DisplayEditForm from './DisplayEditForm';
import DisplayView from './DisplayView';
import { Display as DbDisplay } from '@/types/sequence';

// The type expected by DisplayView
interface ViewDisplay {
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

interface DisplayTabProps {
  userDisplay: DbDisplay | null;
}

const convertToViewDisplay = (dbDisplay: DbDisplay): ViewDisplay => ({
  id: dbDisplay.id.toString(),
  name: dbDisplay.name,
  description: dbDisplay.description || '',
  image_url: dbDisplay.image_url || '',
  location: dbDisplay.location,
  schedule: JSON.stringify(dbDisplay.schedule || {}),
  display_type: dbDisplay.display_type || 'Unknown',
  holiday_type: dbDisplay.holiday_type || 'Unknown',
  review_rating: dbDisplay.rating || 0,
  songCount: 0 // This should be fetched from the backend in a real app
});

const convertToDbDisplay = (viewDisplay: ViewDisplay): Partial<DbDisplay> => ({
  id: parseInt(viewDisplay.id),
  name: viewDisplay.name,
  description: viewDisplay.description,
  image_url: viewDisplay.image_url,
  location: viewDisplay.location,
  schedule: viewDisplay.schedule ? JSON.parse(viewDisplay.schedule) : null,
  display_type: viewDisplay.display_type,
  holiday_type: viewDisplay.holiday_type,
  rating: viewDisplay.review_rating
});

const DisplayTab: React.FC<DisplayTabProps> = ({ userDisplay }) => {
  const [display, setDisplay] = useState<ViewDisplay | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDisplay) {
      setDisplay(convertToViewDisplay(userDisplay));
    } else {
      setDisplay(null);
    }
  }, [userDisplay]);

  if (!display) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Create Your First Display</h2>
        <p className="text-muted-foreground mb-6">
          Share your holiday light display with the community!
        </p>
        <Button onClick={() => navigate('/display/edit')}>
          <PlusCircle className="mr-2" size={16} />
          Create Display
        </Button>
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <DisplayEditForm 
          display={display}
          onSave={(updatedDisplay) => {
            const dbDisplay = convertToDbDisplay(updatedDisplay as ViewDisplay);
            setDisplay(convertToViewDisplay({ ...userDisplay!, ...dbDisplay }));
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          onChange={(updatedDisplay) => {
            if (updatedDisplay) {
              setDisplay(updatedDisplay);
            }
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Display</h2>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="mr-2" size={16} />
              Edit Display
            </Button>
          </div>
          <DisplayView display={display} />
        </>
      )}
    </div>
  );
};

export default DisplayTab;
