
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Display } from '@/types/sequence';
import DisplayCard from '@/components/displays/DisplayCard';

interface DisplayWithOwner extends Display {
  isFavorite: boolean;
  owner?: {
    name: string;
    avatar: string;
  };
  songCount: number;
}

interface DisplayCategoriesProps {
  categories: { id: string; name: string }[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  displayItems: DisplayWithOwner[];
}

const DisplayCategories = ({
  categories,
  activeCategory,
  setActiveCategory,
  displayItems,
}: DisplayCategoriesProps) => {
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
            {displayItems.map(display => (
              <DisplayCard key={display.id} display={display} />
            ))}
          </div>
          
          {displayItems.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No displays found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DisplayCategories;
