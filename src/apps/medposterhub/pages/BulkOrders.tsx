import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { CartProvider } from "../context/CartContext";
import { CartDrawer } from "../components/CartDrawer";
import { StickyCartBar } from "../components/StickyCartBar";
import SEOHead from "@/components/SEOHead";
import { Users, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

const BulkOrdersContent = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <SEOHead
        title="Bulk Orders for Clinics | MedPosterHub"
        description="Special pricing and packages for medical colleges, hospitals, and new clinic setups ordering 10 or more posters."
      />

      <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />
      <CartDrawer />
      <StickyCartBar />

      <main className="pt-28 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Bulk Orders for Clinics & Hospitals</h1>
              <p className="text-xl text-slate-500">Setting up a new practice or upgrading your hospital walls? We offer special discounts for bulk purchases.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Combo Discounts</h3>
              <p className="text-slate-600">Order 10 or more posters (mix and match any designs and sizes) to automatically qualify for our bulk pricing tier.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Sizing</h3>
              <p className="text-slate-600">Need a larger size like A0 or custom dimensions to fit a specific wall? We can accommodate custom print sizes for bulk orders.</p>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Get Your Custom Quote Today</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Contact our B2B team directly on WhatsApp to discuss your requirements. We'll help you select the most relevant posters for your specialty and provide a tailored invoice.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100 rounded-full h-14 px-8 text-lg font-bold shadow-lg"
              onClick={() => window.open("https://wa.me/919460970342?text=Hi! I am interested in a bulk order for my clinic.", "_blank")}
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              WhatsApp Us at +91 94609 70342
            </Button>
          </div>
        </div>
      </main>

      <MedFooter />
    </div>
  );
};

const BulkOrders = () => (
  <CartProvider>
    <BulkOrdersContent />
  </CartProvider>
);

export default BulkOrders;
