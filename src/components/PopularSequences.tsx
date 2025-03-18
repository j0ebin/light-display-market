
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SequenceCard from '@/components/sequences/SequenceCard';
import { mockSequences } from '@/data/mockSequences';

const PopularSequences = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(current => 
      current.includes(id) 
        ? current.filter(itemId => itemId !== id)
        : [...current, id]
    );
  };

  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-sm text-primary font-medium mb-2">SYNCHRONIZED MAGIC</div>
            <h2 className="text-3xl md:text-4xl font-bold">Popular Sequences</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Find and purchase synchronized light sequences created by talented display owners.
            </p>
          </div>
          <Link to="/sequences">
            <Button variant="link" className="md:self-end">
              View All Sequences
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockSequences.map(sequence => (
            <SequenceCard 
              key={sequence.id} 
              sequence={sequence} 
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(sequence.id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/sequences">
            <Button variant="outline" className="rounded-full px-8">
              Explore All Sequences
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularSequences;
