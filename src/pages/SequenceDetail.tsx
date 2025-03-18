
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SequenceBreadcrumbs from '@/components/sequences/SequenceBreadcrumbs';
import SequenceVideo from '@/components/sequences/SequenceVideo';
import SequenceInfo from '@/components/sequences/SequenceInfo';
import DisplayInfo from '@/components/sequences/DisplayInfo';
import PurchaseCard from '@/components/sequences/PurchaseCard';
import SellerCard from '@/components/sequences/SellerCard';
import RelatedSequences from '@/components/sequences/RelatedSequences';
import { SequenceDetail as SequenceDetailType } from '@/types/sequence';
import { getSequenceDetails, getRelatedSequences } from '@/utils/sequenceUtils';

const SequenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sequence, setSequence] = useState<SequenceDetailType | undefined>(undefined);
  const [relatedSequences, setRelatedSequences] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      // For IDs that look like they're generated from song titles (from DisplayYearContent)
      const isFromDisplayHistory = id.length === 8 && !id.includes('-');
      
      let sequenceData;
      
      if (isFromDisplayHistory) {
        // Create a mock sequence data for display history songs
        // In a real app, you would fetch this from the API
        sequenceData = {
          id: id,
          title: 'Holiday Light Sequence',
          displayName: 'Winter Wonderland Symphony',
          displayId: 1, // Link back to the original display
          imageUrl: 'https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=1080',
          price: 19.99,
          rating: 4.8,
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
          creatorName: 'John Johnson',
          creatorAvatar: 'https://i.pravatar.cc/150?img=1',
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
        const related = getRelatedSequences(id, sequenceData.displayName);
        setRelatedSequences(related);
      }
      
      setIsLoading(false);
    }
  }, [id]);
  
  if (isLoading) {
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
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="text-xl mb-4">Sequence not found</div>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2" size={16} />
              Return Home
            </Button>
          </Link>
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
          <SequenceBreadcrumbs title={sequence.song.title} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Video and details */}
            <div className="lg:col-span-2 space-y-8">
              <SequenceVideo 
                videoUrl={sequence.videoUrl} 
                title={sequence.song.title} 
              />
              
              <SequenceInfo 
                title={sequence.title}
                software={sequence.software}
                rating={sequence.rating}
                downloads={sequence.downloads}
                description={sequence.description}
                song={sequence.song}
                channelCount={sequence.channelCount}
                createdAt={sequence.createdAt}
                isFavorite={isFavorite}
                onToggleFavorite={() => setIsFavorite(!isFavorite)}
                displayName={sequence.displayName}
                displayId={sequence.displayId}
              />
              
              <DisplayInfo 
                display={sequence.display} 
                imageUrl={sequence.imageUrl} 
              />
            </div>
            
            {/* Right column - Purchase/Seller info */}
            <div className="space-y-6">
              <PurchaseCard price={sequence.price} />
              <SellerCard seller={sequence.seller} />
              <RelatedSequences sequences={relatedSequences} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SequenceDetail;
