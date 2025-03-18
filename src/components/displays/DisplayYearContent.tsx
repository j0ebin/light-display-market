import React, { useState, useEffect } from 'react';
import { 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger, 
  Accordion 
} from '@/components/ui/accordion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { AlertCircle, Music, Image, Video, Download, Tag } from 'lucide-react';
import { DisplayYear, DisplayMedia, DisplaySong } from '@/types/displayHistory';
import { 
  fetchYearMedia, 
  fetchYearSongs, 
  mockDisplayMedia, 
  mockDisplaySongs 
} from '@/utils/displayHistoryUtils';

interface DisplayYearContentProps {
  year: DisplayYear;
}

const DisplayYearContent: React.FC<DisplayYearContentProps> = ({ year }) => {
  const [media, setMedia] = useState<DisplayMedia[]>([]);
  const [songs, setSongs] = useState<DisplaySong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from Supabase
        const mediaData = await fetchYearMedia(year.id);
        const songsData = await fetchYearSongs(year.id);
        
        // If no real data, use mock data for development
        setMedia(mediaData.length > 0 ? mediaData : mockDisplayMedia[year.id] || []);
        setSongs(songsData.length > 0 ? songsData : mockDisplaySongs[year.id] || []);
      } catch (error) {
        console.error('Error fetching year data:', error);
        
        // Fallback to mock data on error
        setMedia(mockDisplayMedia[year.id] || []);
        setSongs(mockDisplaySongs[year.id] || []);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [year.id]);

  if (isLoading) {
    return <div className="py-4">Loading {year.year} data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Year description */}
      <div className="prose prose-sm max-w-none">
        <p>{year.description}</p>
      </div>
      
      {/* Media section */}
      <Accordion type="single" collapsible defaultValue="media" className="w-full">
        <AccordionItem value="media">
          <AccordionTrigger className="text-lg">
            Display Photos & Videos
          </AccordionTrigger>
          <AccordionContent>
            {media.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>No media available for {year.year}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                {media.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-md border">
                    {item.type === 'image' ? (
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={item.url}
                          alt={item.description || `Display in ${year.year}`}
                          className="h-full w-full object-cover"
                        />
                      </AspectRatio>
                    ) : (
                      <AspectRatio ratio={16 / 9}>
                        <iframe
                          src={item.url}
                          title={item.description || `Display video from ${year.year}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                        />
                      </AspectRatio>
                    )}
                    {item.description && (
                      <div className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          {item.type === 'image' ? (
                            <Image size={14} />
                          ) : (
                            <Video size={14} />
                          )}
                          <span>{item.description}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Songs section */}
        <AccordionItem value="songs">
          <AccordionTrigger className="text-lg">
            Songs & Sequences
          </AccordionTrigger>
          <AccordionContent>
            {songs.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>No songs available for {year.year}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Song</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Sequence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {songs.map((song) => (
                      <TableRow key={song.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Music className="mr-2" size={16} />
                            {song.title}
                          </div>
                        </TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>
                          {song.reused_from ? (
                            <Badge variant="outline" className="text-xs">
                              Reused from {song.year_introduced}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              New in {song.year_introduced}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {song.sequence_available ? (
                            <Button size="sm" variant="outline" className="h-8">
                              <Download className="mr-2" size={14} />
                              {song.sequence_price ? (
                                <span>${song.sequence_price.toFixed(2)}</span>
                              ) : (
                                <span>Free</span>
                              )}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="bg-muted">
                              Not available
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DisplayYearContent;
