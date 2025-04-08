import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { mockDisplaysData } from '@/data/mockDisplaysData';
import { mockSongsData } from '@/data/mockSongsData';
import { Song } from '@/types/sequence';
import { toast } from 'sonner';
import { useCharity } from '@/hooks/useCharity';
import { supabase } from '@/lib/supabase';

// Import new components
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import UserProfileForm, { ProfileFormValues } from '@/components/profile/UserProfileForm';
import DisplayTab from '@/components/profile/DisplayTab';
import SongsTab from '@/components/profile/SongsTab';
import CharityTab from '@/components/profile/CharityTab';
import { EarningsDashboard } from '@/components/stripe/EarningsDashboard';

const UserProfile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userDisplay, setUserDisplay] = useState(mockDisplaysData[0] || null);
  const [userSongs, setUserSongs] = useState<Record<number, Song[]>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCharity, setIsEditingCharity] = useState(false);
  const { charity, isLoading: isLoadingCharity, setCharity } = useCharity(user?.id);
  
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

  const handleSaveProfile = async (values: ProfileFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: values.fullName,
          bio: values.bio,
          location: values.location,
        }
      });

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCharitySaved = (savedCharity) => {
    setCharity(savedCharity);
    setIsEditingCharity(false);
  };

  const handleSongAdded = (newSong: Song) => {
    // Add the new song to the appropriate year
    setUserSongs(prevSongs => {
      const year = newSong.year || new Date().getFullYear();
      const yearSongs = prevSongs[year] || [];
      return {
        ...prevSongs,
        [year]: [...yearSongs, newSong]
      };
    });
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {!isEditing && (
            <UserProfileHeader 
              user={user}
              userDisplay={userDisplay}
              onEditProfile={handleEditProfile}
            />
          )}
          
          {isEditing ? (
            <UserProfileForm 
              user={user}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Tabs defaultValue="display" className="mt-8">
              <TabsList className="mb-6">
                <TabsTrigger value="display">My Display</TabsTrigger>
                <TabsTrigger value="songs">My Songs</TabsTrigger>
                <TabsTrigger value="charity">Charity</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="display" className="mt-0">
                <DisplayTab userDisplay={userDisplay} />
              </TabsContent>
              
              <TabsContent value="songs" className="mt-0">
                <SongsTab 
                  userSongs={userSongs} 
                  displayId={userDisplay?.id?.toString() || ''} 
                  onSongAdded={handleSongAdded}
                />
              </TabsContent>

              <TabsContent value="charity" className="mt-0">
                <CharityTab 
                  charity={charity}
                  userId={user?.id || ''}
                  isEditingCharity={isEditingCharity}
                  onEditCharity={() => setIsEditingCharity(true)}
                  onCharitySaved={handleCharitySaved}
                  onCancelEditCharity={() => setIsEditingCharity(false)}
                />
              </TabsContent>

              <TabsContent value="earnings" className="mt-0">
                <EarningsDashboard userId={user?.id || ''} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
