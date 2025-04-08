import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthPopover from '@/components/auth/AuthPopover';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { CartButton } from '@/components/cart/CartButton';
import { ExpandingSearchBox } from '@/components/ExpandingSearchBox';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(true); // Always start with true
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(true); // Always keep it true
      }
    };
    
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

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view your favorites",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    navigate('/favorites');
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
        "bg-background/80 backdrop-blur-md shadow-sm" // Always apply background
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
          <Link to="/displays" className="text-foreground hover:text-primary font-medium transition-colors">
            Displays
          </Link>
          <Link to="/sequences" className="text-foreground hover:text-primary font-medium transition-colors">
            Sequences
          </Link>
          <Link to="/leaderboard" className="text-foreground hover:text-primary font-medium transition-colors">
            Leaderboard
          </Link>
        </nav>

        {/* Desktop Search and Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ExpandingSearchBox
            placeholder="Search displays or sequences..."
            onSearch={handleSearch}
            collapsedWidth="40px"
            expandedWidth="300px"
            className="bg-background"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={() => navigate('/displays')}
          >
            <MapPin size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={handleFavoriteClick}
          >
            <Heart size={18} />
          </Button>
          <CartButton />
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
          <div className="flex flex-col space-y-4">
            <ExpandingSearchBox
              placeholder="Search displays or sequences..."
              onSearch={handleSearch}
              collapsedWidth="40px"
              expandedWidth="100%"
              className="bg-background"
            />
          </div>
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
          
          <div className="flex items-center justify-center py-2">
            <CartButton />
          </div>
          
          {user ? (
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 py-3 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 py-3 text-left text-destructive"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 py-3 mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
