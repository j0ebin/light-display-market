
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
import CharityCard from '@/components/charity/CharityCard';
import { useCharity } from '@/hooks/useCharity';
import { SequenceDetail as SequenceDetailType } from '@/types/sequence';
import { getSequenceDetails, getRelatedSequences } from '@/utils/sequenceUtils';
import ReviewComponent from '@/components/shared/review/ReviewComponent';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SequenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sequence, setSequence] = useState<SequenceDetailType | undefined>(undefined);
  const [relatedSequences, setRelatedSequences] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPurchaseProcessing, setIsPurchaseProcessing] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // For charity integration
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const { charity, isLoading: isLoadingCharity } = useCharity(ownerId);
  const { toast: uiToast } = useToast();
  
  // Check if user has already purchased this sequence
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user || !id) {
        setIsCheckingPurchase(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.rpc('get_purchase_details', {
          p_user_id: user.id,
          p_sequence_id: id
        });
        
        if (error) throw error;
        
        setIsPurchased(data && Array.isArray(data) && data.length > 0);
      } catch (error) {
        console.error("Error checking purchase status:", error);
      } finally {
        setIsCheckingPurchase(false);
      }
    };
    
    checkPurchaseStatus();
  }, [id, user]);
  
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
        // In a real implementation, we would get the owner's ID from the sequence data
        setOwnerId('1'); // Mock owner ID for testing
        
        const related = getRelatedSequences(id, sequenceData.displayName);
        setRelatedSequences(related);
      }
      
      setIsLoading(false);
    }
  }, [id]);
  
  const handlePurchase = async () => {
    if (!sequence) return;
    
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to purchase this sequence",
      });
      navigate('/auth');
      return;
    }
    
    setIsPurchaseProcessing(true);
    
    try {
      // In a real implementation, this would call your payment API
      // For now, we'll create a purchase record directly
      const { data, error } = await supabase.rpc('create_purchase', {
        p_user_id: user.id,
        p_sequence_id: id,
        p_amount_paid: sequence.price,
        p_seller_id: sequence.seller.id,
        p_status: 'completed'
      });
      
      if (error) throw error;
      
      setIsPurchased(true);
      toast.success("Purchase successful", {
        description: `You have successfully purchased ${sequence.title}`,
      });
      
      // In a real app, this would redirect to a success page or start download
      handleDownload();
      
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error("Purchase failed", {
        description: "There was an error processing your purchase",
      });
    } finally {
      setIsPurchaseProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!sequence) return;
    
    // Create a dummy download link - in a real app, this would be a real file
    const element = document.createElement('a');
    const file = new Blob(
      [`This is a mock sequence file for ${sequence.title}`], 
      {type: 'text/plain'}
    );
    element.href = URL.createObjectURL(file);
    element.download = `${sequence.title.replace(/\s+/g, '_')}.xlights`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success("Download started", {
      description: "Your sequence is being downloaded"
    });
  };
  
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
            
            {/* Right column - Purchase/Seller info/Charity */}
            <div className="space-y-8">
              <PurchaseCard 
                price={sequence.price}
                isPurchased={isPurchased}
                isProcessing={isPurchaseProcessing}
                onPurchase={handlePurchase}
                onDownload={handleDownload}
              />
              
              <SellerCard seller={sequence.creator} />
              
              {sequence.charity && (
                <CharityCard charity={{
                  id: sequence.charity.id || 'temp-id',
                  owner_id: sequence.charity.owner_id || 'temp-owner',
                  name: sequence.charity.name,
                  description: sequence.charity.description,
                  url: sequence.charity.url || '',
                  supporting_text: sequence.charity.supporting_text,
                  created_at: sequence.charity.created_at || new Date().toISOString(),
                  updated_at: sequence.charity.updated_at || new Date().toISOString()
                }} />
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            <ReviewComponent
              itemId={sequence.id}
              type="sequence"
              currentRating={sequence.review_rating}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SequenceDetail;
