import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Song } from '@/types/sequence';
import AddSongForm from './AddSongForm';

interface SongsTabProps {
  userSongs: Record<number, Song[]>;
  displayId: string;
  onSongAdded: (song: Song) => void;
}

const SongsTab: React.FC<SongsTabProps> = ({ userSongs, displayId, onSongAdded }) => {
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const years = Object.keys(userSongs).sort((a, b) => Number(b) - Number(a));

  const handleAddSong = (song: Song) => {
    onSongAdded(song);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">My Display Songs</h2>
      
      {years.length > 0 ? (
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button onClick={() => setIsAddSongOpen(true)}>
              Add New Song
            </Button>
          </div>
          {years.map(year => (
            <Card key={year}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{year} Songs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userSongs[Number(year)].map(song => (
                      <TableRow key={song.id}>
                        <TableCell className="font-medium">{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{song.genre}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end">
                            <Clock size={14} className="mr-1" />
                            {song.duration}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No songs yet</h3>
          <p className="text-muted-foreground mb-4">You haven't added any songs to your display yet</p>
          <Button onClick={() => setIsAddSongOpen(true)}>Add Your First Song</Button>
        </div>
      )}

      <AddSongForm
        isOpen={isAddSongOpen}
        onClose={() => setIsAddSongOpen(false)}
        onSongAdded={handleAddSong}
        displayId={displayId}
      />
    </>
  );
};

export default SongsTab;
