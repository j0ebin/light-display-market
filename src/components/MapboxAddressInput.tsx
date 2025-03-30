import React, { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';

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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>();

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` + 
        new URLSearchParams({
          access_token: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
          country: 'US',
          types: 'address',
          language: 'en',
          limit: '5',
        })
      );

      const data = await response.json();
      
      if (data.features) {
        setSuggestions(data.features.map((feature: any) => ({
          full_address: feature.place_name,
          coordinates: {
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1]
          }
        })));
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300); // 300ms debounce

    setDebounceTimeout(timeout);
  }, [onChange, debounceTimeout]);

  const handleSelect = useCallback((suggestion: any) => {
    if (suggestion?.full_address) {
      const addressData: AddressData = {
        fullAddress: suggestion.full_address,
        latitude: suggestion.coordinates?.latitude,
        longitude: suggestion.coordinates?.longitude,
        feature: {
          place_name: suggestion.full_address,
          geometry: {
            coordinates: [suggestion.coordinates?.longitude || 0, suggestion.coordinates?.latitude || 0]
          }
        }
      };

      onChange(suggestion.full_address);
      onAddressSelect?.(addressData);
      setSuggestions([]);
    }
  }, [onChange, onAddressSelect]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        name="address"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={className}
        onFocus={() => value && fetchSuggestions(value)}
      />

      {suggestions.length > 0 && (
        <div className="absolute w-full z-50 mt-1 bg-white rounded-md border shadow-lg">
          <Command>
            <CommandGroup>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelect(suggestion)}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                >
                  {suggestion.full_address}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
}; 