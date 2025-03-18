
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Clock } from 'lucide-react';
import { DisplayYear } from '@/types/displayHistory';
import DisplayYearContent from './DisplayYearContent';

interface DisplayHistoryCardProps {
  displayId: number;
  years: DisplayYear[];
}

const DisplayHistoryCard: React.FC<DisplayHistoryCardProps> = ({ displayId, years }) => {
  // If there are no years, don't render the component
  if (!years || years.length === 0) {
    return null;
  }

  // Sort years in descending order
  const sortedYears = [...years].sort((a, b) => b.year - a.year);
  const defaultYear = sortedYears[0]?.year.toString() || '';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2" size={18} />
          Display History & Evolution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultYear} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            {sortedYears.map((year) => (
              <TabsTrigger
                key={year.id}
                value={year.year.toString()}
              >
                {year.year}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sortedYears.map((year) => (
            <TabsContent key={year.id} value={year.year.toString()} className="pt-4">
              <DisplayYearContent year={year} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DisplayHistoryCard;
