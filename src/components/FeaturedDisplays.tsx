
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DisplayCard from '@/components/displays/DisplayCard';
import { mockDisplaysData } from '@/data/mockDisplaysData';

const FeaturedDisplays = () => {
  const [displays, setDisplays] = useState(mockDisplaysData);
  
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-sm text-primary font-medium mb-2">EXPLORE</div>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Displays</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Discover spectacular holiday light displays handpicked by our community.
            </p>
          </div>
          <Button variant="link" className="md:self-end" asChild>
            <Link to="/displays">View All Displays</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displays.map(display => (
            <DisplayCard key={display.id} display={display} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="rounded-full px-8" asChild>
            <Link to="/displays">Discover More Displays</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDisplays;
