import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Index from '@/pages/Index';
import Displays from '@/pages/Displays';
import DisplayDetail from '@/pages/DisplayDetail';
import EditDisplay from '@/pages/EditDisplay';
import OwnerProfile from '@/pages/OwnerProfile';
import Sequences from '@/pages/Sequences';
import SequenceDetail from '@/pages/SequenceDetail';
import SearchResults from '@/pages/SearchResults';
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';
import Favorites from '@/pages/Favorites';
import Auth from '@/pages/Auth';
import ForgotPassword from '@/pages/ForgotPassword';
import CustomSignUp from '@/pages/CustomSignUp';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import { AuthCallback } from '@/components/auth/AuthCallback';
import { initDummyData } from './utils/initDummyData';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import RatingTest from './components/test/RatingTest';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const [initStatus, setInitStatus] = useState<string>('Starting initialization...');

  // Initialize app and check Supabase connection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check environment variables
        const requiredEnvVars = {
          'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
          'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY
        };

        const missingEnvVars = Object.entries(requiredEnvVars)
          .filter(([_, value]) => !value)
          .map(([key]) => key);

        if (missingEnvVars.length > 0) {
          throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
        }
        
        setInitStatus('Testing Supabase connection...');
        
        // Test Supabase connection
        const { error: connectionError } = await supabase.from('displays').select('count').single();
        if (connectionError) {
          throw new Error(`Supabase connection error: ${connectionError.message}`);
        }

        setInitStatus('Initializing dummy data...');
        await initDummyData();
        
        setIsInitialized(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
        setInitError(error instanceof Error ? error : new Error(errorMessage));
        toast.error('Failed to initialize application', {
          description: errorMessage
        });
      }
    };

    initializeApp();
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-3xl font-bold text-red-600">Initialization Error</h1>
          <div className="space-y-4">
            <p className="text-lg font-medium">{initError.message}</p>
            <div className="bg-muted p-4 rounded-lg text-sm text-left">
              <p className="font-mono">Please check:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
                <li>Your Supabase project is running</li>
                <li>Your network connection</li>
              </ul>
            </div>
            <pre className="bg-muted p-4 rounded-lg text-xs text-left overflow-auto">
              {JSON.stringify({ 
                url: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
                key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
              }, null, 2)}
            </pre>
          </div>
          <button
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">Initializing application...</p>
          <p className="text-sm text-muted-foreground">{initStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/signup" element={<CustomSignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/displays" element={<Displays />} />
          <Route path="/display/:id" element={<DisplayDetail />} />
          <Route path="/display/edit/:id?" element={<EditDisplay />} />
          <Route path="/owner/:id" element={<OwnerProfile />} />
          <Route path="/sequences" element={<Sequences />} />
          <Route path="/sequence/:id" element={<SequenceDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/test/rating" element={<RatingTest />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
