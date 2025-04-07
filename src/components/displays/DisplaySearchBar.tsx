import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DisplaySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const DisplaySearchBar = ({ searchQuery, setSearchQuery, handleSearch }: DisplaySearchBarProps) => {
  return (
    <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Search displays or sequences" 
          className="pl-10 pr-4 py-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit" variant="outline" className="py-6 px-4 flex items-center gap-2">
        <Search size={18} />
        <span>Search</span>
      </Button>
      <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
        <MapPin size={18} />
        <span>Near Me</span>
      </Button>
      <Button variant="outline" className="py-6 px-4 flex items-center gap-2">
        <Filter size={18} />
        <span>Filters</span>
      </Button>
    </form>
  );
};

export default DisplaySearchBar;
