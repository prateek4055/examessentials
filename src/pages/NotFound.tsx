import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead 
        title="Page Not Found | Exam Essentials" 
        description="The page you're looking for doesn't exist or has been moved."
        noIndex={true}
      />
      
      <Navbar />
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-display text-8xl font-bold text-secondary mb-4">
            404
          </h1>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild variant="gradient" size="lg">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
