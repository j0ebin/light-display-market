
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
      const sequenceData = getSequenceDetails(id);
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse text-xl">Loading sequence details...</div>
      </div>
    );
  }
  
  if (!sequence) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl">Sequence not found</div>
        <Link to="/">
          <Button className="mt-4">
            <ArrowLeft className="mr-2" size={16} />
            Return Home
          </Button>
        </Link>
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
