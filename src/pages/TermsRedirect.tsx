import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const TermsRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 301 redirect equivalent - replace in history
    navigate("/terms-and-conditions", { replace: true });
  }, [navigate]);

  return (
    <>
      <SEOHead
        title="Redirecting..."
        description="Redirecting to Terms and Conditions"
        noIndex={true}
      />
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    </>
  );
};

export default TermsRedirect;
