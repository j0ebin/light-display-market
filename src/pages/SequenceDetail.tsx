
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Music, 
  Download, 
  Star, 
  DollarSign, 
  User, 
  Calendar, 
  MapPin,
  ExternalLink,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

// Mock data for a single sequence
const mockSequence = {
  id: '1',
  title: 'Winter Wonderland Mega Mix',
  displayName: 'Johnson Family Lights',
  displayId: 'display-1',
  imageUrl: 'https://images.unsplash.com/photo-1482350325005-eda5e677279b?q=80&w=1080',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example YouTube embed URL
  price: 15.99,
  rating: 4.8,
  downloads: 243,
  songCount: 3,
  software: 'xLights',
  description: 'A spectacular synchronized light show featuring three classic Christmas songs. This sequence includes over 20 different effects and is compatible with most standard xLights setups.',
  createdAt: '2023-11-15',
  seller: {
    id: 'user-1',
    name: 'Robert Johnson',
    avatar: 'https://i.pravatar.cc/150?img=68',
    rating: 4.9,
    sequencesCount: 12,
    joinedDate: 'November 2021'
  },
  display: {
    id: 'display-1',
    title: 'Johnson Family Lights',
    location: 'Seattle, WA',
    schedule: 'Nov 25 - Jan 5 • 5-10pm',
    rating: 4.9
  }
};

// Mock related sequences from the same display
const mockRelatedSequences = [
  {
    id: '2',
    title: 'Carol of the Bells',
    imageUrl: 'https://images.unsplash.com/photo-1573116456454-e02329be9ae2?q=80&w=1080',
    price: 12.99,
    software: 'xLights'
  },
  {
    id: '3',
    title: 'Silent Night Remix',
    imageUrl: 'https://images.unsplash.com/photo-1542262867-c4b517b92db8?q=80&w=1080',
    price: 0,
    software: 'xLights'
  }
];

const SequenceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // In a real app, we would fetch the sequence data based on the id
  // const sequence = useQuery(['sequence', id], () => fetchSequence(id))
  const sequence = mockSequence; // For now using mock data
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="text-sm text-muted-foreground mb-6">
            <span>Home</span> / <span>Sequences</span> / <span className="text-foreground">{sequence.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Video and details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Embed */}
              <Card className="overflow-hidden">
                <div className="relative pb-[56.25%] h-0">
                  <iframe 
                    src={sequence.videoUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={sequence.title}
                  ></iframe>
                </div>
              </Card>
              
              {/* Sequence Details */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{sequence.title}</h1>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {sequence.software}
                      </Badge>
                      <div className="flex items-center text-amber-500">
                        <Star size={16} className="fill-amber-500 mr-1" />
                        <span>{sequence.rating}</span>
                      </div>
                      <div className="text-muted-foreground text-sm flex items-center">
                        <Download size={14} className="mr-1" />
                        <span>{sequence.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      size={18}
                      className={cn(
                        "transition-colors",
                        isFavorite ? "fill-destructive stroke-destructive" : "fill-none"
                      )}
                    />
                  </Button>
                </div>
                
                <div className="prose prose-sm max-w-none mb-8">
                  <p>{sequence.description}</p>
                </div>
                
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center">
                    <Music size={18} className="text-muted-foreground mr-2" />
                    <span><strong>{sequence.songCount}</strong> songs included</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="text-muted-foreground mr-2" />
                    <span>Created on <strong>{sequence.createdAt}</strong></span>
                  </div>
                </div>
              </div>
              
              {/* Display information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Featured in Display</h3>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={sequence.imageUrl} 
                      alt={sequence.display.title} 
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-lg">{sequence.display.title}</h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          <span>{sequence.display.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{sequence.display.schedule}</span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          <Star size={14} className="fill-amber-500 mr-1" />
                          <span>{sequence.display.rating}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Display
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Purchase/Seller info */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-3xl font-bold">
                        {sequence.price === 0 ? 'Free' : `$${sequence.price.toFixed(2)}`}
                      </div>
                      <div className="text-sm text-muted-foreground">One-time purchase</div>
                    </div>
                    {sequence.price === 0 ? (
                      <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-200">
                        Free
                      </Badge>
                    ) : null}
                  </div>
                  
                  <Button 
                    className="w-full text-base py-6 mb-4"
                    variant={sequence.price === 0 ? "outline" : "default"}
                  >
                    {sequence.price === 0 ? (
                      <>
                        <Download size={18} className="mr-2" />
                        Download Now
                      </>
                    ) : (
                      <>
                        <DollarSign size={18} className="mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                  
                  <div className="text-sm text-center text-muted-foreground">
                    {sequence.price === 0 ? 
                      "No payment required" : 
                      "Secure payment processing by Stripe"
                    }
                  </div>
                </CardContent>
              </Card>
              
              {/* Seller Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About the Creator</h3>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={sequence.seller.avatar} alt={sequence.seller.name} />
                      <AvatarFallback>{sequence.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{sequence.seller.name}</div>
                      <div className="flex items-center text-sm text-amber-500">
                        <Star size={14} className="fill-amber-500 mr-1" />
                        <span>{sequence.seller.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span>{sequence.seller.joinedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sequences</span>
                      <span>{sequence.seller.sequencesCount}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                  >
                    <User size={16} className="mr-2" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
              
              {/* Related Sequences */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">More from this Display</h3>
                  
                  <div className="space-y-4">
                    {mockRelatedSequences.map(seq => (
                      <div key={seq.id} className="flex items-center space-x-3">
                        <img 
                          src={seq.imageUrl} 
                          alt={seq.title} 
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{seq.title}</div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-primary/10 text-primary border-primary/20"
                            >
                              {seq.software}
                            </Badge>
                            <div className="text-sm">
                              {seq.price === 0 ? 'Free' : `$${seq.price.toFixed(2)}`}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <ExternalLink size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SequenceDetail;
