
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SequenceDetails {
  id: string;
  title: string;
  price: number;
  seller: {
    id: string;
    name: string;
  };
  song: {
    title: string;
    artist: string;
  };
}

export const useSequenceDetails = (id: string | undefined, user: any) => {
  const [sequence, setSequence] = useState<SequenceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      sessionStorage.setItem('afterAuthAction', JSON.stringify({
        action: 'purchase',
        sequenceId: id,
      }));
      navigate('/auth');
      return;
    }
    
    // Fetch sequence details
    const fetchSequenceDetails = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from your database
        // Replace with your actual data fetching logic
        const mockSequenceData = {
          id: id,
          title: "Holiday Light Sequence",
          price: 19.99,
          seller: {
            id: "seller-123",
            name: "John Johnson",
          },
          song: {
            title: "Carol of the Bells",
            artist: "Trans-Siberian Orchestra",
          }
        };
        
        setSequence(mockSequenceData);
      } catch (error) {
        console.error("Error fetching sequence details:", error);
        toast.error("Failed to load sequence details", {
          description: "Please try again or contact support."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSequenceDetails();
  }, [id, user, navigate]);
  
  return {
    sequence,
    isLoading
  };
};
