import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { CartProvider } from "../context/CartContext";
import { CartDrawer } from "../components/CartDrawer";
import { StickyCartBar } from "../components/StickyCartBar";
import SEOHead from "@/components/SEOHead";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReturnRefundContent = () => {
  const { toast } = useToast();

  const handleAmazonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Amazon Store Coming Soon",
      description: "We are currently setting up our Amazon catalog. Please buy directly from our website for priority delivery.",
      variant: "default",
    });
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <SEOHead
        title="Returns & Refunds | MedPosterHub"
        description="Read our hassle-free return and replacement policy for damaged medical posters."
      />

      <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />
      <CartDrawer />
      <StickyCartBar />

      <main className="pt-28 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
              <RefreshCcw className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Returns & Replacements</h1>
          </div>

          <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Damaged in Transit</h2>
              <p>While we use crush-proof cardboard tubes for all shipments, transit accidents can occasionally happen. <strong>If your poster arrives damaged, creased, or torn, we will replace it entirely free of charge.</strong></p>
              <p className="mt-4">Simply send us a clear video or photo of the damaged poster and the unboxing process via WhatsApp within 48 hours of delivery.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Replacement Process</h2>
              <ol className="list-decimal pl-6 mt-4 space-y-2">
                <li>Message us on WhatsApp at <strong>+91 94609 70342</strong>.</li>
                <li>Share your order details and photos/videos of the damage.</li>
                <li>Once verified, we will dispatch a fresh replacement poster within 24 hours via express shipping at no extra cost to you.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Refunds and Cancellations</h2>
              <p>Each medical poster is custom-printed to order in the specific size you requested. <strong>Due to the nature of custom printing, we do not offer refunds or accept returns for any reason (change of mind, size error, etc.).</strong></p>
              <p className="mt-4 italic text-sm text-slate-500">Note: COD is available only on our <a href="#" onClick={handleAmazonClick} className="text-blue-600 underline font-medium">Amazon store</a>. Orders placed on our website are prepaid and priority-processed.</p>
              <p className="mt-4">Order cancellations are only accepted if you contact us on WhatsApp within 2 hours of placing the order, before the printing process begins.</p>
            </section>
          </div>
        </div>
      </main>

      <MedFooter />
    </div>
  );
};

const ReturnRefund = () => (
  <ReturnRefundContent />
);

export default ReturnRefund;
