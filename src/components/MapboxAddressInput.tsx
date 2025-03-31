import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Get the token from environment variable
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Debug log to check token
console.log('Mapbox token loaded:', MAPBOX_ACCESS_TOKEN ? 'Yes (length: ' + MAPBOX_ACCESS_TOKEN.length + ')' : 'No');

if (!MAPBOX_ACCESS_TOKEN) {
  console.error('Mapbox access token is not set. Please set VITE_MAPBOX_ACCESS_TOKEN in your environment variables.');
}

interface MapboxFeature {
  id?: string;
  place_name: string;
  geometry: {
    coordinates: [number, number];
  };
  properties?: Record<string, any>;
  text?: string;
  place_type?: string[];
}

export interface AddressData {
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  feature?: MapboxFeature;
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
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || justSelected) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (!MAPBOX_ACCESS_TOKEN) {
      setError('Mapbox access token is not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build the URL parameters
      const params = new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        country: 'US',
        types: 'address,place,poi',
        language: 'en',
        limit: '5',
        autocomplete: 'true'
      });

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch address suggestions: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data?.features && Array.isArray(data.features)) {
        setSuggestions(data.features);
        setOpen(true);
      } else {
        setSuggestions([]);
        setError('No suggestions found');
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
      setError(error instanceof Error ? error.message : 'Failed to fetch suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setError(null);
    setJustSelected(false);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);

    setDebounceTimeout(timeout);
  }, [onChange, debounceTimeout]);

  const handleSelect = useCallback((feature: MapboxFeature) => {
    if (!feature) return;

    const addressData: AddressData = {
      fullAddress: feature.place_name,
      latitude: feature.geometry?.coordinates?.[1],
      longitude: feature.geometry?.coordinates?.[0],
      feature: feature
    };

    onChange(feature.place_name);
    if (onAddressSelect) {
      onAddressSelect(addressData);
    }
    setSuggestions([]);
    setOpen(false);
    setJustSelected(true);
    
    // Restore focus to input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChange, onAddressSelect]);

  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (value) {
      fetchSuggestions(value);
    }
    setOpen(true);
  };

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // Maintain focus when popover closes
        if (!isOpen && inputRef.current) {
          inputRef.current.focus();
        }
      }}>
        <PopoverTrigger asChild>
          <Input
            ref={inputRef}
            type="text"
            name="address"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={`${className} ${error ? 'border-red-500' : ''}`}
            onFocus={() => {
              if (value && !justSelected) {
                fetchSuggestions(value);
              }
            }}
          />
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto" 
          align="start"
          side="bottom"
          sideOffset={5}
          onInteractOutside={(e) => {
            // Prevent closing popover when clicking inside
            if (e.target === inputRef.current) {
              e.preventDefault();
              return;
            }
            setOpen(false);
          }}
          onOpenAutoFocus={(e) => {
            // Prevent popover from stealing focus
            e.preventDefault();
          }}
        >
          <Command className="w-full" shouldFilter={false}>
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading suggestions...</CommandEmpty>
              ) : suggestions.length === 0 ? (
                <CommandEmpty>No suggestions found</CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((feature, index) => (
                    <CommandItem
                      key={feature.id || `${feature.place_name}-${index}`}
                      onSelect={() => handleSelect(feature)}
                      className="cursor-pointer w-full"
                    >
                      {feature.place_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}; 