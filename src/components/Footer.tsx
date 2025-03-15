
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - About */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
              <span className="bg-primary text-primary-foreground rounded-lg p-1">
                LH
              </span>
              <span>Light Hunt</span>
            </Link>
            <p className="text-muted-foreground">
              Connecting holiday light enthusiasts with amazing displays and synchronized sequences.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialLink href="#" icon={<Facebook size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Youtube size={18} />} />
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="/displays" label="Displays" />
              <FooterLink href="/sequences" label="Sequences" />
              <FooterLink href="/leaderboard" label="Leaderboard" />
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/contact" label="Contact" />
            </nav>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="/getting-started" label="Getting Started" />
              <FooterLink href="/faq" label="FAQ" />
              <FooterLink href="/display-guide" label="Display Owner Guide" />
              <FooterLink href="/sequence-guide" label="Sequence Creator Guide" />
              <FooterLink href="/terms" label="Terms of Service" />
              <FooterLink href="/privacy" label="Privacy Policy" />
            </nav>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="font-medium text-lg mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest displays and sequences.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-lg"
              />
              <Button className="w-full rounded-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Light Hunt. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  href: string;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, label }) => {
  return (
    <Link 
      to={href} 
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
    </Link>
  );
};

export default Footer;
