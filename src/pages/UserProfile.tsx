
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Music, Star } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import DisplayCard from '@/components/displays/DisplayCard';
import { useAuth } from '@/contexts/AuthContext';
import { mockDisplaysData } from '@/data/mockDisplaysData';
import { mockSongsData } from '@/data/mockSongsData';
import { Song } from '@/types/sequence';

const UserProfile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userDisplays, setUserDisplays] = useState(mockDisplaysData.slice(0, 1));
  const [userSongs, setUserSongs] = useState<Record<number, Song[]>>({});
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      navigate('/');
    }
    
    // In a real app, we would fetch the user's displays and songs from the database
    // For now, let's create mock data
    const mockGroupedSongs: Record<number, Song[]> = {};
    mockSongsData.forEach(song => {
      if (!mockGroupedSongs[song.year]) {
        mockGroupedSongs[song.year] = [];
      }
      mockGroupedSongs[song.year].push(song);
    });
    
    setUserSongs(mockGroupedSongs);
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading profile...</div>
        </main>
      </div>
    );
  }

  const years = Object.keys(userSongs).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* User Header */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user?.user_metadata?.full_name || user?.email}</h1>
                
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Music size={16} />
                    <span>{Object.values(userSongs).flat().length} Songs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    <span>{userDisplays.length} Display</span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Main Content */}
          <Tabs defaultValue="displays" className="mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="displays">My Displays</TabsTrigger>
              <TabsTrigger value="songs">My Songs</TabsTrigger>
            </TabsList>
            
            {/* Displays Tab */}
            <TabsContent value="displays" className="mt-0">
              <h2 className="text-2xl font-semibold mb-6">My Light Displays</h2>
              
              {userDisplays.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userDisplays.map(display => (
                    <DisplayCard key={display.id} display={display} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No displays yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't created any displays yet</p>
                  <Button>Create Your First Display</Button>
                </div>
              )}
            </TabsContent>
            
            {/* Songs Tab */}
            <TabsContent value="songs" className="mt-0">
              <h2 className="text-2xl font-semibold mb-6">My Sequence Songs</h2>
              
              {years.length > 0 ? (
                <div className="space-y-8">
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
                  <p className="text-muted-foreground mb-4">You haven't added any songs to your sequences yet</p>
                  <Button>Create Your First Sequence</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
