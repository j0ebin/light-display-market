import { GoogleLogin as GoogleOAuthLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface GoogleResponse {
  credential?: string;
  code?: string;
}

export function GoogleLogin() {
  const { login } = useAuth();

  return (
    <div className="flex justify-center">
      <GoogleOAuthLogin
        onSuccess={async (response: GoogleResponse) => {
          if (response.credential) {
            // Client-side flow
            const decoded: any = jwtDecode(response.credential);
            await login(decoded);
          } else if (response.code) {
            // Server-side flow
            await login({ code: response.code });
          }
        }}
        onError={() => {
          console.error('Login Failed');
        }}
        useOneTap={false}
      />
    </div>
  );
} 