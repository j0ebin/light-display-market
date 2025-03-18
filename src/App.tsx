
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Displays from '@/pages/Displays';
import DisplayDetail from '@/pages/DisplayDetail';
import OwnerProfile from '@/pages/OwnerProfile';
import Sequences from '@/pages/Sequences';
import SequenceDetail from '@/pages/SequenceDetail';
import SearchResults from '@/pages/SearchResults';
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';
import Favorites from '@/pages/Favorites';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/displays" element={<Displays />} />
        <Route path="/display/:id" element={<DisplayDetail />} />
        <Route path="/owner/:id" element={<OwnerProfile />} />
        <Route path="/sequences" element={<Sequences />} />
        <Route path="/sequence/:id" element={<SequenceDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
