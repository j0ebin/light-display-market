
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Preload background image for smooth transitions
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1576692155415-95f820a2c4c1?q=80&w=2080";
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Background Image with lazy loading and blur animation */}
      <div 
        className={cn(
          "absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1576692155415-95f820a2c4c1?q=80&w=2080')`,
        }}
      />

      {/* Hero Content */}
      <div className="container z-20 px-6 md:px-10 max-w-6xl mx-auto">
        <div 
          className={cn(
            "flex flex-col items-start space-y-8 max-w-2xl transition-all duration-1000",
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div>
            <div className="inline-block bg-primary/90 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full mb-4">
              Discover Holiday Magic
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Find Spectacular Holiday <span className="text-primary">Light Displays</span> Near You
            </h1>
          </div>
          
          <p className="text-white/90 text-lg md:text-xl max-w-xl">
            Explore, share, and discover amazing holiday light spectacles in your neighborhood. Connect with display creators and their synchronized light sequences.
          </p>
          
          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-1 rounded-full flex items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
              <Input 
                placeholder="Search for displays..." 
                className="border-0 bg-transparent pl-10 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button className="rounded-full ml-1 px-4">
              <Search size={18} className="mr-2" /> Search
            </Button>
          </div>
          
          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full">
            <MapPin size={18} className="mr-2" /> Displays Near Me
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
