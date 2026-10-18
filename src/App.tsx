import { lazy, Suspense } from "react";
import MedOrthoAdLoader from "./apps/medortho/components/MedOrthoAdLoader";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import SocialProofPopup from "@/components/SocialProofPopup";
import { CartProvider } from "./apps/medposterhub/context/CartContext";

const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const PurchaseForm = lazy(() => import("./pages/PurchaseForm"));
const Cart = lazy(() => import("./pages/Cart"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminProductForm = lazy(() => import("./pages/AdminProductForm"));
const AdminBlogForm = lazy(() => import("./pages/AdminBlogForm"));
const AdminWikiEditor = lazy(() => import("./pages/AdminWikiEditor"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TermsRedirect = lazy(() => import("./pages/TermsRedirect"));
const Class11Notes = lazy(() => import("./pages/Class11Notes"));
const Class12Notes = lazy(() => import("./pages/Class12Notes"));
const NeetNotes = lazy(() => import("./pages/NeetNotes"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const MedPosterHubIndex = lazy(() => import("./apps/medposterhub/pages/MedPosterHubIndex"));
const MedPosterDetailPage = lazy(() => import("./apps/medposterhub/pages/MedPosterDetailPage"));
const MedShippingPolicy = lazy(() => import("./apps/medposterhub/pages/ShippingPolicy"));
const ReturnRefund = lazy(() => import("./apps/medposterhub/pages/ReturnRefund"));
const BulkOrders = lazy(() => import("./apps/medposterhub/pages/BulkOrders"));
const ContactUs = lazy(() => import("./apps/medposterhub/pages/ContactUs"));
const PrivacyTerms = lazy(() => import("./apps/medposterhub/pages/PrivacyTerms"));
const MedCheckoutPage = lazy(() => import("./apps/medposterhub/pages/CheckoutPage"));
const MedOrderSuccessPage = lazy(() => import("./apps/medposterhub/pages/OrderSuccessPage"));
const MedOrthoPage = lazy(() => import("./apps/medical/pages/MedOrthoPage"));
const MedWikiArticlePage = lazy(() => import("./apps/medical/pages/MedWikiArticlePage"));

const MedCardioPage = lazy(() => import("./apps/medical/pages/MedCardioPage"));
const MedNeuroPage = lazy(() => import("./apps/medical/pages/MedNeuroPage"));
const MedPhysioPage = lazy(() => import("./apps/medical/pages/MedPhysioPage"));
const MedRadioPage = lazy(() => import("./apps/medical/pages/MedRadioPage"));
const MedPharmaPage = lazy(() => import("./apps/medical/pages/MedPharmaPage"));
const NeetAppPage = lazy(() => import("./apps/neet/pages/NeetAppPage"));

const SiteOverlays = () => {
  const { pathname } = useLocation();
  if (/^\/medortho(?:\/|$)/.test(pathname)) return null;
  return <><WhatsAppButton /><SocialProofPopup /></>;
};

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <MedOrthoAdLoader />
              <Suspense fallback={<div role="status" className="p-12 text-center text-slate-500">Loading page…</div>}>
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
                <Route path="/admin/wiki-editor" element={<AdminWikiEditor />} />
                <Route path="/admin/wiki-editor/:id" element={<AdminWikiEditor />} />
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
                <Route path="/medposterhub/checkout" element={<MedCheckoutPage />} />
                <Route path="/medposterhub/success" element={<MedOrderSuccessPage />} />
                <Route path="/medortho" element={<MedOrthoPage />} />
                <Route path="/medortho/*" element={<MedWikiArticlePage />} />
                <Route path="/medcardio" element={<MedCardioPage />} />
                <Route path="/medcardio/*" element={<MedWikiArticlePage />} />
                <Route path="/medneuro" element={<MedNeuroPage />} />
                <Route path="/medneuro/*" element={<MedWikiArticlePage />} />
                <Route path="/medphysio" element={<MedPhysioPage />} />
                <Route path="/medphysio/*" element={<MedWikiArticlePage />} />
                <Route path="/medradio" element={<MedRadioPage />} />
                <Route path="/medradio/*" element={<MedWikiArticlePage />} />
                <Route path="/medpharma" element={<MedPharmaPage />} />
                <Route path="/medpharma/*" element={<MedWikiArticlePage />} />
                <Route path="/neet-app" element={<NeetAppPage />} />

                <Route path="*" element={<NotFound />} />

              </Routes>
              </Suspense>
              <SiteOverlays />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
