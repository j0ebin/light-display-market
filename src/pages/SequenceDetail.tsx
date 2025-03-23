
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getSequenceDetails, getRelatedSequences } from '@/utils/sequenceUtils';
import { SequenceDetail as SequenceDetailType } from '@/types/sequence';
import { useSequencePurchase } from '@/hooks/useSequencePurchase';
import SequenceDetailHeader from '@/components/sequences/SequenceDetailHeader';
import SequenceDetailContent from '@/components/sequences/SequenceDetailContent';
import SequenceSidePanel from '@/components/sequences/SequenceSidePanel';
import SequenceReviewSection from '@/components/sequences/SequenceReviewSection';

const SequenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sequence, setSequence] = useState<SequenceDetailType | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // For charity integration
  const [ownerId, setOwnerId] = useState<string | null>(null);
  
  const {
    isPurchased,
    isPurchaseProcessing,
    isCheckingPurchase,
    checkPurchaseStatus,
    handlePurchase,
    handleDownload
  } = useSequencePurchase(id);
  
  // Check if user has already purchased this sequence
  useEffect(() => {
    checkPurchaseStatus();
  }, [id]);
  
  useEffect(() => {
    if (id) {
      // For IDs that look like they're generated from song titles (from DisplayYearContent)
      const isFromDisplayHistory = id.length === 8 && !id.includes('-');
      
      let sequenceData;
      
      if (isFromDisplayHistory) {
        // Create a mock sequence data for display history songs
        sequenceData = {
          id: id,
          title: 'Holiday Light Sequence',
          displayName: 'Winter Wonderland Symphony',
          displayId: 1, // Link back to the original display
          imageUrl: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
          price: 19.99,
          rating: 4.8,
          review_rating: 4.8,
          downloads: 156,
          software: 'xLights',
          song: {
            title: 'Carol of the Bells', // This would be dynamic in a real app
            artist: 'Trans-Siberian Orchestra',
            genre: 'Rock',
            yearIntroduced: 2021 // The year it was introduced to the display
          },
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'This sequence was created for the Winter Wonderland Symphony display in 2021. It features over 15,000 lights synchronized to Carol of the Bells by Trans-Siberian Orchestra.',
          createdAt: 'December 15, 2021',
          creator: {
            id: 'user-1',
            name: 'John Johnson',
            avatar: 'https://i.pravatar.cc/150?img=1',
            rating: 4.9,
            sequencesCount: 12,
            joinedDate: 'November 2021'
          },
          display: {
            id: '1',
            title: 'Winter Wonderland Symphony',
            location: 'Seattle, WA',
            schedule: 'Nov 25 - Jan 5 • 5-10pm',
            rating: 4.9
          },
          seller: {
            id: 'user-1',
            name: 'John Johnson',
            avatar: 'https://i.pravatar.cc/150?img=1',
            rating: 4.9,
            sequencesCount: 12,
            joinedDate: 'November 2021'
          }
        };
      } else {
        sequenceData = getSequenceDetails(id);
      }
      
      setSequence(sequenceData);
      
      if (sequenceData) {
        // In a real implementation, we would get the owner's ID from the sequence data
        setOwnerId('1'); // Mock owner ID for testing
      }
      
      setIsLoading(false);
    }
  }, [id]);
  
  if (isLoading || isCheckingPurchase) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading sequence details...</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!sequence) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow">
          <SequenceDetailHeader title="" />
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <SequenceDetailHeader title={sequence.song.title} id={sequence.id} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Video and details */}
            <SequenceDetailContent 
              sequence={sequence} 
              isFavorite={isFavorite} 
              onToggleFavorite={() => setIsFavorite(!isFavorite)} 
            />
            
            {/* Right column - Purchase/Seller info/Charity */}
            <SequenceSidePanel 
              sequence={sequence}
              isPurchased={isPurchased}
              isPurchaseProcessing={isPurchaseProcessing}
              onPurchase={() => handlePurchase(sequence)}
              onDownload={() => handleDownload(sequence)}
            />
          </div>

          {/* Reviews Section */}
          <SequenceReviewSection 
            id={sequence.id}
            currentRating={sequence.review_rating}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SequenceDetail;
