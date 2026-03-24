import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { CartProvider } from "../context/CartContext";
import { CartDrawer } from "../components/CartDrawer";
import { StickyCartBar } from "../components/StickyCartBar";
import SEOHead from "@/components/SEOHead";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const ContactUsContent = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <SEOHead
        title="Contact Us | MedPosterHub"
        description="Get in touch with MedPosterHub for order inquiries, bulk clinic posters, or support."
      />

      <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />
      <CartDrawer />
      <StickyCartBar />

      <main className="pt-28 pb-20 container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contact Our Support Team</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Need help with an order or looking for custom clinic posters? Reach out to us directly through WhatsApp or email.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Quick Contact */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">WhatsApp Support</h3>
            <p className="text-slate-600 mb-6 font-medium">Fastest response time (9 AM - 7 PM IST)</p>
            <a 
              href="https://wa.me/919460970342" 
              target="_blank" 
              rel="noreferrer"
              className="text-2xl font-bold tracking-wider text-green-600 hover:text-green-700 transition-colors"
            >
              +91 94609 70342
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Email Us</h3>
            <p className="text-slate-600 mb-6 font-medium">For business inquiries and partnerships</p>
            <a 
              href="mailto:contact@examessentials.in" 
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              contact@examessentials.in
            </a>
          </div>
        </div>

        {/* Corporate Info Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-3xl rounded-full opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Exam Essentials</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                MedPosterHub is a specialized division of Exam Essentials India, dedicated solely to premium clinical wall charts.
              </p>
              
              <div className="flex items-start gap-3 mb-6">
                <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <p className="text-slate-300">
                  <strong className="block text-white mb-1">Corporate Office</strong>
                  Deewan complex, Deewan Mohalla<br />
                  Behror, Rajasthan 301701<br />
                  India
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <h3 className="text-xl font-bold mb-4">Looking for Medical Notes?</h3>
              <p className="text-slate-300 mb-6 text-sm">
                If you're a medical student looking for handwritten notes, formula sheets, or study materials, please visit our main Exam Essentials store.
              </p>
              <a 
                href="https://examessentials.in" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors gap-2"
              >
                Visit Exam Essentials <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <MedFooter />
    </div>
  );
};

const ContactUs = () => (
  <CartProvider>
    <ContactUsContent />
  </CartProvider>
);

export default ContactUs;
