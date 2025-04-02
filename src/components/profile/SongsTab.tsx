import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Pencil } from 'lucide-react';
import { Song } from '@/types/sequence';
import AddSongForm from './AddSongForm';
import { Avatar } from '@/components/ui/avatar';

interface SongsTabProps {
  userSongs: Record<number, Song[]>;
  displayId: string;
  onSongAdded: (song: Song) => void;
}

const SongsTab: React.FC<SongsTabProps> = ({ userSongs, displayId, onSongAdded }) => {
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const years = Object.keys(userSongs).sort((a, b) => Number(b) - Number(a));

  const handleAddSong = (song: Song) => {
    onSongAdded(song);
  };

  const handleEditClick = (song: Song) => {
    setEditingSong(song);
    setIsAddSongOpen(true);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">My Display Songs</h2>
      
      {years.length > 0 ? (
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditingSong(null);
              setIsAddSongOpen(true);
            }}>
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
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userSongs[Number(year)].map(song => (
                      <TableRow key={song.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {song.albumCover ? (
                              <Avatar className="h-8 w-8">
                                <img src={song.albumCover} alt={`${song.title} cover`} className="object-cover" />
                              </Avatar>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <Clock size={14} />
                              </div>
                            )}
                            {song.title}
                          </div>
                        </TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>
                          {song.genre && (
                            <Badge variant="outline">{song.genre}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end">
                            <Clock size={14} className="mr-1" />
                            {song.duration}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(song)}
                          >
                            <Pencil size={14} />
                          </Button>
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
          <Button onClick={() => {
            setEditingSong(null);
            setIsAddSongOpen(true);
          }}>Add Your First Song</Button>
        </div>
      )}

      <AddSongForm
        isOpen={isAddSongOpen}
        onClose={() => {
          setIsAddSongOpen(false);
          setEditingSong(null);
        }}
        onSongAdded={handleAddSong}
        displayId={displayId}
        editingSong={editingSong}
      />
    </>
  );
};

export default SongsTab;
