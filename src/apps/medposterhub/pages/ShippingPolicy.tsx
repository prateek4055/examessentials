import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { CartProvider } from "../context/CartContext";
import { CartDrawer } from "../components/CartDrawer";
import { StickyCartBar } from "../components/StickyCartBar";
import SEOHead from "@/components/SEOHead";
import { Package } from "lucide-react";

const ShippingPolicyContent = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <SEOHead
        title="Shipping Policy | MedPosterHub"
        description="Learn about our shipping times, packaging methods, and delivery partners for medical posters across India."
      />

      <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />
      <CartDrawer />
      <StickyCartBar />

      <main className="pt-28 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Shipping Policy</h1>
          </div>

          <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Delivery Timeline</h2>
              <p>We process all orders within 24 hours. Once dispatched, standard delivery across India takes <strong>3 to 5 business days</strong> depending on your location. Deliveries to Metro cities are typically faster.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Premium Protective Packaging</h2>
              <p>Since our posters are printed on high-quality 250gsm matte paper, we take extreme care in packaging to prevent any creases or damage during transit.</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>All posters are carefully rolled (never folded).</li>
                <li>They are placed inside heavy-duty, crush-proof cardboard mailing tubes.</li>
                <li>Both ends are securely sealed with plastic end caps.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipping Charges</h2>
              <p>We offer <strong>Free Standard Shipping</strong> on all orders across India. There are no hidden fees at checkout.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Tracking Your Order</h2>
              <p>Once your order is shipped, we will share the tracking link and courier details with you directly via WhatsApp on the number you used to place the order.</p>
            </section>
          </div>
        </div>
      </main>

      <MedFooter />
    </div>
  );
};

const ShippingPolicy = () => (
  <CartProvider>
    <ShippingPolicyContent />
  </CartProvider>
);

export default ShippingPolicy;
