
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, X, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface CharityDetails {
  id: string;
  name: string;
  description: string;
  url: string;
  owner_id: string;
}

const DonationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [charity, setCharity] = useState<CharityDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sellerName, setSellerName] = useState("Display Owner");
  
  useEffect(() => {
    const fetchCharityDetails = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from your database
        // First get the sequence to find the seller
        const { data: sequenceData, error: sequenceError } = await supabase
          .from('display_songs')
          .select(`
            id,
            title,
            artist,
            display_year_id
          `)
          .eq('id', id)
          .single();
          
        if (sequenceError) throw sequenceError;
        
        if (sequenceData && sequenceData.display_year_id) {
          // Get the display year to find the display
          const { data: yearData, error: yearError } = await supabase
            .from('display_years')
            .select(`
              id,
              display_id
            `)
            .eq('id', sequenceData.display_year_id)
            .single();
            
          if (yearError) throw yearError;
          
          if (yearData && yearData.display_id) {
            // Get the display to find the owner
            const { data: displayData, error: displayError } = await supabase
              .from('displays')
              .select(`
                id,
                name,
                owner_id
              `)
              .eq('id', yearData.display_id)
              .single();
              
            if (displayError) throw displayError;
            
            if (displayData && displayData.owner_id) {
              setSellerName(displayData.name);
              
              // Get the charity associated with this owner
              const { data: charityData, error: charityError } = await supabase
                .from('charities')
                .select('*')
                .eq('owner_id', displayData.owner_id)
                .single();
                
              if (charityError && charityError.code !== 'PGRST116') {
                throw charityError;
              }
              
              if (charityData) {
                setCharity(charityData);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching charity details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCharityDetails();
  }, [id]);
  
  const handleClose = () => {
    setIsDialogOpen(false);
  };
  
  const handleDonateClick = () => {
    if (charity && charity.url) {
      window.open(charity.url, '_blank');
    }
  };
  
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Heart className="mr-2 text-red-500" size={18} />
              Support {sellerName}
            </DialogTitle>
            <DialogDescription>
              Thank you for downloading this free sequence!
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="py-4 text-center">
              Loading charity information...
            </div>
          ) : charity ? (
            <div className="py-4">
              <p className="mb-4">
                {sellerName} supports the charity "{charity.name}". Would you like to make a donation?
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {charity.description}
              </p>
            </div>
          ) : (
            <div className="py-4">
              <p>
                Thank you for downloading this free sequence! If you enjoyed it, consider supporting {sellerName} by visiting their display during the holiday season.
              </p>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={handleClose}>
              Maybe Later
            </Button>
            {charity && (
              <Button onClick={handleDonateClick}>
                <Heart className="mr-2" size={16} />
                Donate Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 text-red-500" size={20} />
                  Thank you for your download!
                </CardTitle>
                <CardDescription>
                  Your download has completed successfully.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="py-4 text-center">
                    Loading charity information...
                  </div>
                ) : charity ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Support a Good Cause</h3>
                    <p>
                      {sellerName} has chosen to support {charity.name}, a charity that makes a difference.
                    </p>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-2">{charity.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {charity.description}
                        </p>
                        <Button className="w-full" onClick={handleDonateClick}>
                          <Globe className="mr-2" size={16} />
                          Visit Charity Website
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div>
                    <p>
                      Thank you for downloading this free sequence from {sellerName}! If you enjoyed it, consider supporting them by visiting their display during the holiday season.
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to="/">Return Home</Link>
                </Button>
                <Button asChild>
                  <Link to="/sequences">Browse More Sequences</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DonationPage;
