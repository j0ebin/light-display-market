
import React, { useEffect, useRef } from 'react';
import { Search, MapPin, Heart, Music, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: <Search size={24} className="text-primary" />,
    title: "Discover Displays",
    description: "Find holiday light displays near you or search for specific locations and themes."
  },
  {
    icon: <MapPin size={24} className="text-primary" />,
    title: "Visit in Person",
    description: "Get directions to visit displays and enjoy the holiday magic with family and friends."
  },
  {
    icon: <Heart size={24} className="text-primary" />,
    title: "Save Favorites",
    description: "Bookmark your favorite displays to easily find them again or share with others."
  },
  {
    icon: <Music size={24} className="text-primary" />,
    title: "Find Sequences",
    description: "Browse synchronized light show sequences created by display owners."
  },
  {
    icon: <Download size={24} className="text-primary" />,
    title: "Download & Use",
    description: "Purchase sequences for your own display or download free ones to get started."
  }
];

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    stepsRef.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => {
      stepsRef.current.forEach((step) => {
        if (step) observer.unobserve(step);
      });
    };
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-sm text-primary font-medium mb-2">GET STARTED</div>
          <h2 className="text-3xl md:text-4xl font-bold">How Light Hunt Works</h2>
          <p className="text-muted-foreground mt-4">
            Light Hunt connects holiday enthusiasts with amazing light displays and the creators behind them.
            Here's how you can make the most of our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepsRef.current[index] = el)}
              className={cn(
                "flex flex-col items-center text-center opacity-0 transition-all duration-700",
                "transform translate-y-4"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block w-full h-0.5 bg-border absolute left-1/2 top-8 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
