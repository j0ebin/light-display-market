import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface DonationInfo {
  displayName: string;
  displayId: string;
  sequenceName: string;
  charityName: string;
  charityDescription: string;
  charityUrl: string;
}

const DonationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDonationInfo = async () => {
      setIsLoading(true);
      try {
        // For now, we'll use mock data since we need to setup the proper queries
        // In a real implementation, this would query your database for the sequence,
        // display, and charity information
        
        const mockDonationInfo = {
          displayName: "Johnson Family Christmas Display",
          displayId: "display-123",
          sequenceName: "Carol of the Bells",
          charityName: "Local Food Bank",
          charityDescription: "We provide meals to families in need throughout the holiday season.",
          charityUrl: "https://example.com/donate"
        };
        
        setDonationInfo(mockDonationInfo);
      } catch (error) {
        console.error("Error fetching donation info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonationInfo();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            Loading donation information...
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!donationInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Information Not Found</h2>
            <p className="mb-6">We couldn't find the donation information for this sequence.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            asChild
          >
            <Link to={`/sequence/${id}`}>
              <ArrowLeft className="mr-2" size={16} />
              Back to Sequence
            </Link>
          </Button>
          
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 bg-red-100 p-3 rounded-full inline-block">
                <Heart size={32} className="text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-700">Consider Supporting This Display</CardTitle>
              <CardDescription className="text-red-600">
                Thank you for downloading "{donationInfo.sequenceName}". Please consider making a donation!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">About the Charity</h3>
                  <p className="text-muted-foreground">
                    The creator of {donationInfo.displayName} supports:
                  </p>
                  <p className="font-semibold mt-2">{donationInfo.charityName}</p>
                  <p className="mt-1">
                    {donationInfo.charityDescription}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-red-100">
                  <p className="text-sm text-center mb-3">
                    Your donation helps keep holiday displays free for everyone to enjoy and supports important causes.
                  </p>
                  
                  <Button 
                    className="w-full" 
                    variant="default"
                    size="lg"
                    asChild
                  >
                    <a href={donationInfo.charityUrl} target="_blank" rel="noopener noreferrer">
                      Make a Donation
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button 
                variant="ghost" 
                asChild
              >
                <Link to="/">
                  Maybe Later
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonationPage;
