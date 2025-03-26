import React from 'react';
import { Input } from '@/components/ui/input';
import { AddressAutofill } from '@mapbox/search-js-react';

interface MapboxAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const MapboxAddressInput: React.FC<MapboxAddressInputProps> = ({
  value,
  onChange,
  required = false,
  placeholder = "Start typing your address...",
  className = "",
}) => {
  return (
    <AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string}>
      <Input
        id="location"
        name="location"
        autoComplete="street-address"
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          // Basic validation - ensure it's not just numbers
          if (!/^\d+$/.test(value)) {
            onChange(value);
          }
        }}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    </AddressAutofill>
  );
}; 