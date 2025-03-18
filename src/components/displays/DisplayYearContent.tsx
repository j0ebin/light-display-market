
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
import { AlertCircle, Music, Image, Video, Download, ExternalLink } from 'lucide-react';
import { DisplayYear, DisplayMedia, DisplaySong } from '@/types/displayHistory';
import { 
  fetchYearMedia, 
  fetchYearSongs, 
  mockDisplayMedia, 
  mockDisplaySongs 
} from '@/utils/displayHistoryUtils';

// Global cache for media and songs data
const mediaCache: Record<string, DisplayMedia[]> = {};
const songsCache: Record<string, DisplaySong[]> = {};

interface DisplayYearContentProps {
  year: DisplayYear;
}

const DisplayYearContent: React.FC<DisplayYearContentProps> = ({ year }) => {
  const [media, setMedia] = useState<DisplayMedia[]>([]);
  const [songs, setSongs] = useState<DisplaySong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate sequence IDs for songs
  const getSequenceIdForSong = useMemo(() => (song: DisplaySong) => {
    // Create a deterministic ID based on song title and artist
    const baseString = `${song.title}-${song.artist}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    return baseString.substring(0, 8);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Check if data is already in cache
      if (mediaCache[year.id] && songsCache[year.id]) {
        setMedia(mediaCache[year.id]);
        setSongs(songsCache[year.id]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch real data from Supabase
        const mediaData = await fetchYearMedia(year.id);
        const songsData = await fetchYearSongs(year.id);
        
        // If no real data, use mock data for development
        const finalMedia = mediaData.length > 0 ? mediaData : mockDisplayMedia[year.id] || [];
        const finalSongs = songsData.length > 0 ? songsData : mockDisplaySongs[year.id] || [];
        
        // Store in cache
        mediaCache[year.id] = finalMedia;
        songsCache[year.id] = finalSongs;
        
        setMedia(finalMedia);
        setSongs(finalSongs);
      } catch (error) {
        console.error('Error fetching year data:', error);
        
        // Fallback to mock data on error
        const fallbackMedia = mockDisplayMedia[year.id] || [];
        const fallbackSongs = mockDisplaySongs[year.id] || [];
        
        mediaCache[year.id] = fallbackMedia;
        songsCache[year.id] = fallbackSongs;
        
        setMedia(fallbackMedia);
        setSongs(fallbackSongs);
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
                          <Link to={`/sequence/${getSequenceIdForSong(song)}`} className="flex items-center hover:text-primary hover:underline">
                            <Music className="mr-2" size={16} />
                            {song.title}
                            <ExternalLink size={14} className="ml-2 opacity-50" />
                          </Link>
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
                            <Link to={`/sequence/${getSequenceIdForSong(song)}`}>
                              <Button size="sm" variant="outline" className="h-8">
                                <Download className="mr-2" size={14} />
                                {song.sequence_price ? (
                                  <span>${song.sequence_price.toFixed(2)}</span>
                                ) : (
                                  <span>Free</span>
                                )}
                              </Button>
                            </Link>
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
