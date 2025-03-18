
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, MapPin, Heart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthPopover from '@/components/auth/AuthPopover';
import AuthDialog from '@/components/auth/AuthDialog';
import { useToast } from '@/hooks/use-toast';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initial state - set background for index page
    setIsScrolled(true);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center space-x-2 group"
        >
          <span className="bg-primary text-primary-foreground rounded-lg p-1 transition-transform group-hover:scale-110">
            LH
          </span>
          <span className="transition-colors">Light Hunt</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/displays" className="text-foreground/80 hover:text-foreground transition-colors">
            Displays
          </Link>
          <Link to="/sequences" className="text-foreground/80 hover:text-foreground transition-colors">
            Sequences
          </Link>
          <Link to="/leaderboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Leaderboard
          </Link>
        </nav>

        {/* Desktop Search and Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Search size={18} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <MapPin size={18} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Heart size={18} />
          </Button>
          
          <AuthPopover />
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden rounded-full"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-background pt-20 px-6 z-40 md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-6 text-lg font-medium">
          <Link 
            to="/displays" 
            className="flex items-center py-3 border-b border-border"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Displays
          </Link>
          <Link 
            to="/sequences" 
            className="flex items-center py-3 border-b border-border"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sequences
          </Link>
          <Link 
            to="/leaderboard" 
            className="flex items-center py-3 border-b border-border"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Leaderboard
          </Link>
          
          <div className="flex flex-col space-y-4 mt-8">
            <Button variant="outline" className="w-full justify-start">
              <Search size={18} className="mr-2" /> Search
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin size={18} className="mr-2" /> Near Me
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart size={18} className="mr-2" /> Favorites
            </Button>
            
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <User size={18} className="mr-2" /> Profile
                  </Button>
                </Link>
                <Button 
                  variant="default" 
                  className="w-full mt-4"
                  onClick={handleSignOut}
                >
                  <LogOut size={18} className="mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <AuthDialog triggerClassName="w-full mt-4" />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
