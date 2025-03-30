import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { MapboxAddressInput, AddressData } from '@/components/MapboxAddressInput';

interface MapboxFeature {
  geometry: {
    coordinates: [number, number];
    type: string;
  };
  properties: {
    full_address?: string;
    feature_name?: string;
    place_name?: string;
  };
}

interface ViewDisplay {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  schedule: string;
  display_type: string;
  holiday_type: string;
  review_rating: number;
  songCount: number;
}

interface DisplayEditFormProps {
  display: ViewDisplay;
  onSave: (display: ViewDisplay) => void;
  onCancel: () => void;
  onChange: (display: ViewDisplay | null) => void;
}

const DisplayEditForm: React.FC<DisplayEditFormProps> = ({
  display,
  onSave,
  onCancel,
  onChange,
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave(display);
  };

  const handleAddressChange = (value: string) => {
    handleChange('location', value);
  };

  const handleAddressSelect = (address: AddressData) => {
    onChange({
      ...display,
      latitude: address.latitude || null,
      longitude: address.longitude || null,
      location: address.fullAddress
    });
  };

  const handleChange = (field: keyof ViewDisplay, value: string | number) => {
    onChange({
      ...display,
      [field]: value,
    });
  };

  return (
    <Card className="p-6">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={display.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter display name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={display.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter display description"
            />
          </div>

          <div>
            <Label htmlFor="location">Address</Label>
            <MapboxAddressInput
              value={display.location}
              onChange={handleAddressChange}
              onAddressSelect={handleAddressSelect}
              placeholder="Start typing your address..."
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Start typing to see address suggestions
            </p>
          </div>

          <div>
            <Label htmlFor="display_type">Display Type</Label>
            <Input
              id="display_type"
              value={display.display_type}
              onChange={(e) => handleChange('display_type', e.target.value)}
              placeholder="Enter display type"
            />
          </div>

          <div>
            <Label htmlFor="holiday_type">Holiday Type</Label>
            <Input
              id="holiday_type"
              value={display.holiday_type}
              onChange={(e) => handleChange('holiday_type', e.target.value)}
              placeholder="Enter holiday type"
            />
          </div>

          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Textarea
              id="schedule"
              value={display.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
              placeholder="Enter display schedule (JSON format)"
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={display.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="Enter image URL"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default DisplayEditForm; 