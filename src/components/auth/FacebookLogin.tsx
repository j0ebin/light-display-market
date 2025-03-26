import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Facebook } from 'lucide-react';

export function FacebookLogin() {
  const { signInWithFacebook } = useAuth();

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (error) {
      console.error('Facebook sign-in error:', error);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleFacebookLogin}
    >
      <Facebook className="mr-2 h-4 w-4" />
      Facebook
    </Button>
  );
}