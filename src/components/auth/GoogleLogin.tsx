import { GoogleLogin as GoogleOAuthLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

interface GoogleResponse {
  credential?: string;
  code?: string;
}

interface GoogleCredential {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export function GoogleLogin() {
  const { login } = useAuth();

  return (
    <div className="flex justify-center">
      <GoogleOAuthLogin
        onSuccess={async (response: GoogleResponse) => {
          try {
            if (response.credential) {
              // Client-side flow
              const decoded = jwtDecode<GoogleCredential>(response.credential);
              await login({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
              });
              toast.success('Successfully signed in with Google!');
            } else if (response.code) {
              // Server-side flow - we need to provide a temporary email that will be updated
              // after token exchange in the AuthContext
              await login({ 
                code: response.code,
                email: 'pending@google.auth', // This will be updated with actual email after token exchange
              });
              toast.success('Successfully signed in with Google!');
            }
          } catch (error) {
            console.error('Google sign-in error:', error);
            toast.error('Failed to sign in with Google. Please try again.');
          }
        }}
        onError={() => {
          console.error('Google Login Failed');
          toast.error('Failed to sign in with Google. Please try again.');
        }}
        useOneTap={false}
      />
    </div>
  );
} 