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
import { initDummyData } from './utils/initDummyData';
import { useEffect } from 'react';
import RatingTest from './components/test/RatingTest';

function App() {
  // Initialize dummy data once when the app loads
  useEffect(() => {
    initDummyData();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
