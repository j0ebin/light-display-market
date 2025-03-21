import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

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

interface DisplayEditFormProps {
  display: Display;
  onSave: (display: Partial<Display>) => void;
  onCancel: () => void;
  onChange: (display: Display | null) => void;
}

const DisplayEditForm: React.FC<DisplayEditFormProps> = ({
  display,
  onSave,
  onCancel,
  onChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: display.name,
      description: display.description,
      location: display.location,
      schedule: display.schedule,
      display_type: display.display_type,
      holiday_type: display.holiday_type,
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={display.name}
            onChange={(e) => onChange({ ...display, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={display.description}
            onChange={(e) => onChange({ ...display, description: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Location</Label>
          <Input
            value={display.location}
            onChange={(e) => onChange({ ...display, location: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Schedule</Label>
          <Input
            value={display.schedule}
            onChange={(e) => onChange({ ...display, schedule: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Display Type</Label>
          <Input
            value={display.display_type}
            onChange={(e) => onChange({ ...display, display_type: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Holiday Type</Label>
          <Input
            value={display.holiday_type}
            onChange={(e) => onChange({ ...display, holiday_type: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default DisplayEditForm; 