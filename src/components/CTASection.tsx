import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lightbulb, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddDisplay = () => {
    if (user) {
      navigate('/display/edit');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 z-0"></div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Main CTA */}
          <div className="space-y-6">
            <div 
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full",
                "bg-primary/10 text-primary text-sm font-medium"
              )}
            >
              <Sparkles size={14} />
              <span>Join Our Community</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Ready to Share Your <span className="text-primary">Holiday Magic</span> with the World?
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Create a display profile, upload your synchronized sequences, and connect with holiday light enthusiasts from around the globe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-full px-8"
                onClick={handleAddDisplay}
              >
                Add Your Display
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Right column - Feature cards */}
          <div className="space-y-6">
            <FeatureCard 
              icon={<Lightbulb size={24} className="text-primary" />}
              title="Showcase Your Display"
              description="Create a beautiful profile for your holiday light display and attract visitors from your area."
              delay={0}
            />
            
            <FeatureCard 
              icon={<Upload size={24} className="text-primary" />}
              title="Share Your Sequences"
              description="Upload your synchronized light sequences and optionally monetize your creations."
              delay={100}
            />
            
            <FeatureCard 
              icon={<Sparkles size={24} className="text-primary" />}
              title="Join the Community"
              description="Connect with other display creators and holiday light enthusiasts."
              delay={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
