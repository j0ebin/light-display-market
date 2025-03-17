
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Youtube, Facebook, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OwnerSocialLinksProps {
  socialLinks?: {
    website?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
}

const OwnerSocialLinks: React.FC<OwnerSocialLinksProps> = ({ socialLinks }) => {
  if (!socialLinks) return null;
  
  const hasSocialLinks = Object.values(socialLinks).some(link => !!link);
  
  if (!hasSocialLinks) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Connect</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {socialLinks.website && (
          <a 
            href={socialLinks.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Globe size={16} />
            <span>Website</span>
          </a>
        )}
        
        {socialLinks.youtube && (
          <a 
            href={socialLinks.youtube} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Youtube size={16} />
            <span>YouTube</span>
          </a>
        )}
        
        {socialLinks.facebook && (
          <a 
            href={socialLinks.facebook} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Facebook size={16} />
            <span>Facebook</span>
          </a>
        )}
        
        {socialLinks.instagram && (
          <a 
            href={socialLinks.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Instagram size={16} />
            <span>Instagram</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerSocialLinks;
