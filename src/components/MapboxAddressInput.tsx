import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { AddressAutofill } from '@mapbox/search-js-react';

export interface AddressData {
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  feature?: {
    place_name: string;
    geometry: {
      coordinates: [number, number];
    };
  };
}

interface MapboxAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: AddressData) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const MapboxAddressInput: React.FC<MapboxAddressInputProps> = ({
  value,
  onChange,
  onAddressSelect,
  required = false,
  placeholder = "Start typing your address...",
  className = "",
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleRetrieve = useCallback((response: { features: Array<{ place_name: string; geometry: { coordinates: [number, number] } }> }) => {
    if (!response?.features?.length) return;
    
    const feature = response.features[0];
    if (feature?.geometry?.coordinates) {
      const [longitude, latitude] = feature.geometry.coordinates;
      
      const addressData: AddressData = {
        fullAddress: feature.place_name,
        latitude,
        longitude,
        feature
      };

      onAddressSelect?.(addressData);
    }
  }, [onAddressSelect]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <AddressAutofill 
        accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onRetrieve={handleRetrieve}
        options={{
          country: 'US',
          language: 'en'
        }}
      >
        <Input
          type="text"
          name="address"
          autoComplete="shipping address-line1"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={className}
        />
      </AddressAutofill>
    </form>
  );
}; 