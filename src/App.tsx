import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import SocialProofPopup from "@/components/SocialProofPopup";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import PurchaseForm from "./pages/PurchaseForm";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminProductForm from "./pages/AdminProductForm";
import AdminBlogForm from "./pages/AdminBlogForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import NotFound from "./pages/NotFound";
import TermsRedirect from "./pages/TermsRedirect";
import Class11Notes from "./pages/Class11Notes";
import Class12Notes from "./pages/Class12Notes";
import NeetNotes from "./pages/NeetNotes";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import MedPosterHubIndex from "./apps/medposterhub/pages/MedPosterHubIndex";
import MedPosterDetailPage from "./apps/medposterhub/pages/MedPosterDetailPage";
import MedShippingPolicy from "./apps/medposterhub/pages/ShippingPolicy";
import ReturnRefund from "./apps/medposterhub/pages/ReturnRefund";
import BulkOrders from "./apps/medposterhub/pages/BulkOrders";
import ContactUs from "./apps/medposterhub/pages/ContactUs";
import PrivacyTerms from "./apps/medposterhub/pages/PrivacyTerms";
import MedOrthoPage from "./apps/medical/pages/MedOrthoPage";
import MedCardioPage from "./apps/medical/pages/MedCardioPage";
import MedNeuroPage from "./apps/medical/pages/MedNeuroPage";
import MedPhysioPage from "./apps/medical/pages/MedPhysioPage";
import MedRadioPage from "./apps/medical/pages/MedRadioPage";
import MedPharmaPage from "./apps/medical/pages/MedPharmaPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/terms" element={<TermsRedirect />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/purchase/:id" element={<PurchaseForm />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/product/:id" element={<AdminProductForm />} />
              <Route path="/admin/blog/:id" element={<AdminBlogForm />} />
              {/* SEO Category Pages */}
              <Route path="/class-11-notes" element={<Class11Notes />} />
              <Route path="/class-12-notes" element={<Class12Notes />} />
              <Route path="/neet-notes" element={<NeetNotes />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              {/* Sub-Apps */}
              <Route path="/medposterhub" element={<MedPosterHubIndex />} />
              <Route path="/medposterhub/:slug" element={<MedPosterDetailPage />} />
              <Route path="/medposterhub/shipping" element={<MedShippingPolicy />} />
              <Route path="/medposterhub/returns" element={<ReturnRefund />} />
              <Route path="/medposterhub/bulk-orders" element={<BulkOrders />} />
              <Route path="/medposterhub/contact" element={<ContactUs />} />
              <Route path="/medposterhub/privacy-terms" element={<PrivacyTerms />} />
              <Route path="/medortho" element={<MedOrthoPage />} />
              <Route path="/medcardio" element={<MedCardioPage />} />
              <Route path="/medneuro" element={<MedNeuroPage />} />
              <Route path="/medphysio" element={<MedPhysioPage />} />
              <Route path="/medradio" element={<MedRadioPage />} />
              <Route path="/medpharma" element={<MedPharmaPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppButton />
            <SocialProofPopup />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
