
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SequenceSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const SequenceSearchBar = ({ searchQuery, setSearchQuery, handleSearch }: SequenceSearchBarProps) => {
  return (
    <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Search sequences by title, song, artist or genre" 
          className="pl-10 pr-4 py-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit" variant="outline" className="py-6 px-4 flex items-center gap-2">
        <Search size={18} />
        <span>Search</span>
      </Button>
    </form>
  );
};

export default SequenceSearchBar;
