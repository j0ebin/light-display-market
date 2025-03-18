
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sequence } from '@/types/sequence';
import SequenceCard from '@/components/sequences/SequenceCard';

interface SequenceCategoriesProps {
  categories: { id: string; name: string }[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filteredSequences: Sequence[];
}

const SequenceCategories = ({
  categories,
  activeCategory,
  setActiveCategory,
  filteredSequences
}: SequenceCategoriesProps) => {
  return (
    <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="bg-muted mb-6 p-1 flex flex-wrap">
        {categories.map(category => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="flex-1 min-w-fit data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map(category => (
        <TabsContent key={category.id} value={category.id} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSequences.map(sequence => (
              <SequenceCard key={sequence.id} sequence={sequence} />
            ))}
          </div>
          
          {filteredSequences.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No sequences found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default SequenceCategories;
