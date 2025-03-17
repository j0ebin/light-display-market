
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Index from '@/pages/Index';
import Displays from '@/pages/Displays';
import Sequences from '@/pages/Sequences';
import DisplayDetail from '@/pages/DisplayDetail';
import SequenceDetail from '@/pages/SequenceDetail';
import OwnerProfile from '@/pages/OwnerProfile';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/displays" element={<Displays />} />
        <Route path="/display/:id" element={<DisplayDetail />} />
        <Route path="/sequences" element={<Sequences />} />
        <Route path="/sequence/:id" element={<SequenceDetail />} />
        <Route path="/owner/:id" element={<OwnerProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;
