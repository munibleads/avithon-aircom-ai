import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Plane, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="glass-card border-0 professional-card max-w-md w-full mx-6">
        <CardContent className="py-10 px-6 text-center">
          {/* Professional plane icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 aviation-gradient rounded-lg shadow-medium">
              <Plane className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* 404 Error */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-primary mb-3">404</h1>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-amber-600 font-medium text-sm uppercase tracking-wide">Route Not Found</span>
            </div>
          </div>

          {/* Error message */}
          <div className="mb-8 space-y-3">
            <p className="text-xl font-semibold text-foreground">
              Navigation Error
            </p>
            <p className="text-muted-foreground">
              The requested route does not exist in the system. 
              Please verify the URL and try again.
            </p>
            <div className="glass-card p-3 rounded-lg bg-muted/20 border-l-4 border-amber-500/50 mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Request Path:</span> {location.pathname}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="aviation-gradient hover:opacity-90 transition-opacity shadow-sm text-white font-medium px-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="glass-card border-border/50 hover:bg-muted/50 transition-colors font-medium"
            >
              Go Back
            </Button>
          </div>

          {/* Footer message */}
          <div className="mt-8 pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              ATC Communication Assistant
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
