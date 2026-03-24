import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { CartProvider } from "../context/CartContext";
import { CartDrawer } from "../components/CartDrawer";
import { StickyCartBar } from "../components/StickyCartBar";
import SEOHead from "@/components/SEOHead";
import { Shield } from "lucide-react";

const PrivacyTermsContent = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <SEOHead
        title="Privacy Policy & Terms | MedPosterHub"
        description="Privacy policy and terms of service for MedPosterHub."
      />

      <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />
      <CartDrawer />
      <StickyCartBar />

      <main className="pt-28 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-slate-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Privacy Policy & Terms</h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Terms of Service</h2>
            <p>Welcome to MedPosterHub, a division of Exam Essentials. By accessing our website, you agree to be bound by these Terms and Conditions.</p>
            
            <h3>Intellectual Property</h3>
            <p>All poster designs, illustrations, and content on this website are the intellectual property of Exam Essentials and our creators. You may not reproduce, distribute, or modify our artwork for commercial purposes without explicit permission.</p>

            <h3>Pricing and Availability</h3>
            <p>We strive to ensure all pricing is accurate. Prices are listed in INR (₹) and include applicable taxes. We reserve the right to change prices at any time. All orders are subject to availability.</p>

            <h3>Medical Disclaimer</h3>
            <p>While we partner with anatomists to ensure our posters are medically accurate, they are intended for educational and reference purposes only. They do not constitute professional medical advice or diagnosis.</p>

            <hr className="my-10" />

            <h2>Privacy Policy</h2>
            <p>We take your privacy seriously. This policy explains how we handle your personal information.</p>

            <h3>Information Collection</h3>
            <p>We collect information necessary to process your orders, such as your name, shipping address, and phone number (primarily via WhatsApp for order fulfillment).</p>

            <h3>How We Use Your Data</h3>
            <p>We use your information exclusively to:</p>
            <ul>
                <li>Process and deliver your medical poster orders.</li>
                <li>Communicate with you regarding shipping updates.</li>
                <li>Provide customer support.</li>
            </ul>

            <h3>Data Sharing</h3>
            <p>We do not sell, trade, or rent your personal identification information to others. We only share necessary details with trusted courier partners specifically for delivering your order.</p>

            <h3>WhatsApp Ordering</h3>
            <p>When you use our "Order on WhatsApp" feature, your conversation is subject to Meta's (WhatsApp) privacy encryption. We only use the chat to finalize your order, share payment links, and dispatch updates.</p>
          </div>
        </div>
      </main>

      <MedFooter />
    </div>
  );
};

const PrivacyTerms = () => (
  <CartProvider>
    <PrivacyTermsContent />
  </CartProvider>
);

export default PrivacyTerms;
