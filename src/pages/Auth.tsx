import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Lightbulb, Upload, Users, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GoogleLogin } from '@/components/auth/GoogleLogin';
import { FacebookLogin } from '@/components/auth/FacebookLogin';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
        name: formData.email.split('@')[0],
      });
      toast.success('Successfully signed in!');
      navigate('/profile/displays/add');
    } catch (error) {
      toast.error('Failed to sign in. Please check your credentials and try again.');
      console.error('Signin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
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
      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-12">
        <div className="max-w-md space-y-8">
          <h3 className="text-2xl font-bold tracking-tight">
            Join our growing community
          </h3>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-background p-2 rounded-full">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Discover Amazing Displays</h4>
                <p className="text-sm text-muted-foreground">
                  Browse through unique and creative light displays
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-background p-2 rounded-full">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Share Your Creations</h4>
                <p className="text-sm text-muted-foreground">
                  Upload and showcase your own light displays
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-background p-2 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Connect with Others</h4>
                <p className="text-sm text-muted-foreground">
                  Join a community of light display enthusiasts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-background p-2 rounded-full">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Save Your Favorites</h4>
                <p className="text-sm text-muted-foreground">
                  Bookmark displays you love for future reference
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 