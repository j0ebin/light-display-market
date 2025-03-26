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
import { supabase } from '@/lib/supabase';
import RatingTest from './components/test/RatingTest';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  // Initialize app and check Supabase connection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Test Supabase connection
        const { data, error } = await supabase.from('displays').select('count').single();
        if (error) {
          throw new Error(`Supabase connection error: ${error.message}`);
        }
        console.log('Supabase connection successful');

        // Initialize dummy data
        await initDummyData();
        console.log('App initialization complete');
        
        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitError(error instanceof Error ? error : new Error('Unknown initialization error'));
        toast.error('Failed to initialize application', {
          description: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    };

    initializeApp();
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">Initialization Error</h1>
          <p className="text-muted-foreground">{initError.message}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
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
