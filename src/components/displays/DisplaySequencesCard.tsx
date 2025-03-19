
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DisplaySong } from '@/types/displayHistory';
import { seedSequences } from '@/utils/seedSequences';
import { useToast } from '@/hooks/use-toast';

interface DisplaySequencesCardProps {
  displayId?: number;
  isAdmin?: boolean;
}

const DisplaySequencesCard: React.FC<DisplaySequencesCardProps> = ({ displayId, isAdmin = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: sequences, isLoading, refetch } = useQuery({
    queryKey: ['displaySequences', displayId],
    queryFn: async (): Promise<DisplaySong[]> => {
      if (!displayId) return [];
      
      // First get all years for this display
      const { data: years, error: yearsError } = await supabase
        .from('display_years')
        .select('id')
        .eq('display_id', displayId);
      
      if (yearsError || !years || years.length === 0) {
        return [];
      }
      
      // Get all songs for these years
      const yearIds = years.map(year => year.id);
      const { data, error } = await supabase
        .from('display_songs')
        .select('*')
        .in('display_year_id', yearIds)
        .eq('sequence_available', true);
      
      if (error) {
        console.error('Error fetching display sequences:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!displayId
  });
  
  const handleViewSequences = () => {
    navigate(`/sequences?display=${displayId}`);
  };
  
  const handleGenerateSequences = async () => {
    try {
      const result = await seedSequences();
      if (result.success) {
        refetch();
      }
    } catch (error) {
      console.error('Error generating sequences:', error);
    }
  };
  
  // Count unique sequences (removing duplicates from reused songs)
  const uniqueSequences = sequences ? 
    [...new Set(sequences.map(seq => `${seq.title} - ${seq.artist}`))] : [];
    
  // Count free sequences
  const freeSequences = sequences ? 
    sequences.filter(seq => seq.sequence_price === 0).length : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Sequences Available</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading available sequences...
          </p>
        ) : uniqueSequences.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              {uniqueSequences.length} sequence{uniqueSequences.length !== 1 ? 's' : ''} available
              {freeSequences > 0 ? ` (${freeSequences} free)` : ''}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Purchase sequences used in this display to recreate it yourself!
            </p>
            <Button className="w-full" onClick={handleViewSequences}>
              View Sequences
            </Button>
            
            {isAdmin && (
              <Button 
                className="w-full mt-2" 
                variant="outline" 
                onClick={handleGenerateSequences}
              >
                Regenerate Sequences
              </Button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              No sequences available for this display yet.
            </p>
            
            {isAdmin && (
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleGenerateSequences}
              >
                Generate Sequences
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DisplaySequencesCard;
