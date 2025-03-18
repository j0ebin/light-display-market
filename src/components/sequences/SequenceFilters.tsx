
import React from 'react';
import { Music, Podcast, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SequenceFiltersProps {
  songFilter: string;
  setSongFilter: (filter: string) => void;
  artistFilter: string;
  setArtistFilter: (filter: string) => void;
  selectedGenres: string[];
  allGenres: string[];
  handleGenreChange: (genre: string) => void;
  clearFilters: () => void;
}

const SequenceFilters = ({
  songFilter,
  setSongFilter,
  artistFilter,
  setArtistFilter,
  selectedGenres,
  allGenres,
  handleGenreChange,
  clearFilters
}: SequenceFiltersProps) => {
  return (
    <>
      {/* Song Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
            <Music size={18} />
            <span>Song</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filter by Song</h4>
            <Input 
              placeholder="Song title..." 
              value={songFilter}
              onChange={(e) => setSongFilter(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Artist Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
            <Podcast size={18} />
            <span>Artist</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filter by Artist</h4>
            <Input 
              placeholder="Artist name..." 
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Genre Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
            <Tag size={18} />
            <span>Genre</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter by Genre</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-auto text-xs p-0"
              >
                Clear filters
              </Button>
            </div>
            <div className="space-y-2">
              {allGenres.map(genre => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`genre-${genre}`} 
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => handleGenreChange(genre)}
                  />
                  <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SequenceFilters;
