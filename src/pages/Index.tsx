
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import FeaturedDisplays from '@/components/FeaturedDisplays';
import PopularSequences from '@/components/PopularSequences';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedDisplays />
        <PopularSequences />
        <HowItWorks />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
