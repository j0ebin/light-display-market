
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SequenceDetail from "./pages/SequenceDetail";
import DisplayDetail from "./pages/DisplayDetail";
import Displays from "./pages/Displays";
import Sequences from "./pages/Sequences";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sequence/:id" element={<SequenceDetail />} />
          <Route path="/display/:id" element={<DisplayDetail />} />
          <Route path="/displays" element={<Displays />} />
          <Route path="/sequences" element={<Sequences />} />
          {/* Add future routes here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
