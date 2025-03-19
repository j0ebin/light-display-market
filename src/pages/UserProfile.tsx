import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Music, Star, Save } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import DisplayCard from '@/components/displays/DisplayCard';
import { useAuth } from '@/contexts/AuthContext';
import { mockDisplaysData } from '@/data/mockDisplaysData';
import { mockSongsData } from '@/data/mockSongsData';
import { Song } from '@/types/sequence';
import { toast } from 'sonner';
import CharityForm from '@/components/charity/CharityForm';
import CharityCard from '@/components/charity/CharityCard';
import { useCharity } from '@/hooks/useCharity';

interface ProfileFormValues {
  fullName: string;
  bio: string;
  location: string;
}

const UserProfile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userDisplay, setUserDisplay] = useState(mockDisplaysData[0] || null);
  const [userSongs, setUserSongs] = useState<Record<number, Song[]>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCharity, setIsEditingCharity] = useState(false);
  const { charity, isLoading: isLoadingCharity, setCharity } = useCharity(user?.id);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      bio: user?.user_metadata?.bio || '',
      location: user?.user_metadata?.location || '',
    }
  });
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      navigate('/');
    }
    
    // In a real app, we would fetch the user's display and songs from the database
    // For mock data, let's create a focused set of years based on the display start year
    if (userDisplay) {
      const displayStartYear = userDisplay.year_started || 2020;
      const currentYear = new Date().getFullYear();
      
      // Create songs for each year the display has been active
      const mockGroupedSongs: Record<number, Song[]> = {};
      
      for (let year = displayStartYear; year <= currentYear; year++) {
        // Filter songs by year or create some placeholder songs for each year
        const songsForYear = mockSongsData.filter(song => song.year === year);
        
        if (songsForYear.length > 0) {
          mockGroupedSongs[year] = songsForYear;
        }
      }
      
      setUserSongs(mockGroupedSongs);
    }
  }, [user, isLoading, navigate, userDisplay]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (values: ProfileFormValues) => {
    // In a real app, we would save to Supabase or another backend
    console.log('Saving profile:', values);
    
    // Simulate successful save
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleCharitySaved = (savedCharity) => {
    setCharity(savedCharity);
    setIsEditingCharity(false);
  };

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
            {!isEditing ? (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{user?.user_metadata?.full_name || user?.email}</h1>
                  
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    {userDisplay && (
                      <div className="flex items-center gap-1">
                        <Star size={16} />
                        <span>Display Owner</span>
                      </div>
                    )}
                    {user?.user_metadata?.location && (
                      <div className="flex items-center gap-1">
                        <span>{user.user_metadata.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {user?.user_metadata?.bio && (
                    <p className="mt-4 text-muted-foreground">{user.user_metadata.bio}</p>
                  )}
                  
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={handleEditProfile}>Edit Profile</Button>
                  </div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, State" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself and your display" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex items-center gap-2">
                          <Save size={16} />
                          Save Changes
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </section>
          
          {/* Main Content */}
          <Tabs defaultValue="display" className="mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="display">My Display</TabsTrigger>
              <TabsTrigger value="songs">My Songs</TabsTrigger>
              <TabsTrigger value="charity">Charity</TabsTrigger>
            </TabsList>
            
            {/* Display Tab */}
            <TabsContent value="display" className="mt-0">
              <h2 className="text-2xl font-semibold mb-6">My Light Display</h2>
              
              {userDisplay ? (
                <div className="max-w-md">
                  <DisplayCard display={userDisplay} />
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No display yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't created a display yet</p>
                  <Button>Create Your Display</Button>
                </div>
              )}
            </TabsContent>
            
            {/* Songs Tab */}
            <TabsContent value="songs" className="mt-0">
              <h2 className="text-2xl font-semibold mb-6">My Display Songs</h2>
              
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
                  <p className="text-muted-foreground mb-4">You haven't added any songs to your display yet</p>
                  <Button>Add Your First Song</Button>
                </div>
              )}
            </TabsContent>

            {/* Charity Tab */}
            <TabsContent value="charity" className="mt-0">
              <h2 className="text-2xl font-semibold mb-6">Supporting Charity</h2>
              
              {isEditingCharity ? (
                <div className="max-w-2xl">
                  <CharityForm 
                    charity={charity} 
                    userId={user?.id || ''} 
                    onSaved={handleCharitySaved} 
                  />
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setIsEditingCharity(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  {charity ? (
                    <div className="max-w-md mb-6">
                      <CharityCard charity={charity} />
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={() => setIsEditingCharity(true)}
                      >
                        Edit Charity Information
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-muted/30 rounded-lg max-w-md">
                      <h3 className="text-lg font-medium mb-2">No charity yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't set up a charity for your display yet
                      </p>
                      <Button onClick={() => setIsEditingCharity(true)}>
                        Add a Charity
                      </Button>
                    </div>
                  )}
                </>
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
