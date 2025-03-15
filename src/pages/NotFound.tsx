
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-6">
      <div className="max-w-md w-full bg-card backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl font-bold text-primary">404</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} />
              Go Back
            </Button>
            
            <Link to="/" className="flex-1">
              <Button className="w-full gap-2">
                <Home size={18} />
                Home Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
