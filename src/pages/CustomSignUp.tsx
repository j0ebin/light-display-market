import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Lightbulb, Upload, Users, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleLogin } from '@/components/auth/GoogleLogin';
import { FacebookLogin } from '@/components/auth/FacebookLogin';

const CustomSignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
        name: formData.firstName || formData.email.split('@')[0],
      });
      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/profile/displays/add');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    if (provider === 'facebook') {
      // TODO: Implement Facebook sign-in
      console.log('Facebook signup coming soon');
      return;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="mt-2 text-muted-foreground">
              Join the community of holiday light enthusiasts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <GoogleLogin />
              </div>
              <div className="col-span-1">
                <FacebookLogin />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 to-accent/5 p-12">
        <div className="w-full max-w-lg mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Welcome to Light Hunt
            </h2>
            <p className="text-muted-foreground">
              Join our community and unlock all these amazing features
            </p>
          </div>

          <div className="space-y-6">
            <BenefitCard
              icon={<Lightbulb />}
              title="Showcase Your Display"
              description="Create a beautiful profile for your holiday light display and attract visitors from your area."
            />
            
            <BenefitCard
              icon={<Upload />}
              title="Share Your Sequences"
              description="Upload and sell your synchronized light sequences to other enthusiasts."
            />
            
            <BenefitCard
              icon={<Users />}
              title="Join the Community"
              description="Connect with fellow holiday light enthusiasts from around the world."
            />
            
            <BenefitCard
              icon={<Heart />}
              title="Support Charities"
              description="Use your holiday display to raise money for causes you care about."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm">
      <div className="text-primary">{icon}</div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default CustomSignUp; 