import { useLocation, Link, Navigate } from "react-router-dom";
import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { ClayButton } from "../components/ClayButton";
import { ClayCard } from "../components/ClayCard";
import SEOHead from "@/components/SEOHead";
import { 
    CheckCircle2, 
    ShoppingBag, 
    Truck, 
    ArrowRight,
    MessageCircle,
    Copy,
    Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderSuccessPage = () => {
    const location = useLocation();
    const { toast } = useToast();
    const orderId = location.state?.orderId || "EE-POSTER-TEST-12345";
    const paymentPlan = location.state?.paymentPlan || "full";
    const balanceDue = location.state?.balanceDue || 0;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(orderId);
        toast({
            title: "Order ID Copied",
            description: "You can use this for tracking.",
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <SEOHead
                title="Order Success | MedPosterHub"
                description="Your order has been placed successfully."
                noIndex={true}
            />

            <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-clay-sm animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display">Order Confirmed!</h1>
                        <p className="text-slate-600 text-lg">Thank you for your purchase. Your premium medical posters are being prepared for dispatch.</p>
                    </div>

                    <ClayCard className="p-8 mb-8 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="text-blue-600 font-bold text-lg">{orderId.substring(0, 8)}...</code>
                                    <button 
                                        onClick={copyToClipboard}
                                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-400 transition-colors"
                                        title="Copy Order ID"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <ClayButton 
                                variant="secondary" 
                                className="h-12 px-6"
                                onClick={() => window.open(`https://wa.me/919460970342?text=Hi, Checking status of my order ${orderId}`, "_blank")}
                            >
                                <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                                Track via WhatsApp
                            </ClayButton>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-blue-500" />
                                Next Steps
                            </h3>
                            
                                {paymentPlan === "partial" ? (
                                    <>
                                        <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-blue-600">1</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Custom Printing</h4>
                                                <p className="text-sm text-slate-500">We are preparing your posters on 250gsm matte paper. Special double-sided prints take up to 5 days.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                                            <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-amber-700">2</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-amber-900">Order Photo (WhatsApp)</h4>
                                                <p className="text-sm text-amber-700">Once ready, we will send you a **photograph of your order** and a secure **QR/UPI ID** for the final payment.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-blue-600">3</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Dispatch & Delivery</h4>
                                                <p className="text-sm text-slate-500">Your order will be dispatched in a protective tube immediately after final payment. Delivery: 3-5 days after dispatch.</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-blue-600">1</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Review & Printing</h4>
                                                <p className="text-sm text-slate-500">Our team checks your order for quality and starts the printing process on 250gsm matte paper.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-blue-600">2</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Premium Packaging</h4>
                                                <p className="text-sm text-slate-500">Posters are rolled into heavy-duty protective mailing tubes. Dispatched in 2-5 days.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-blue-600">3</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Dispatch & Tracking</h4>
                                                <p className="text-sm text-slate-500">Once shipped, you receive a tracking link via WhatsApp. Delivery: 3-5 days after dispatch.</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                        </div>
                    </ClayCard>

                    {paymentPlan === "partial" && (
                        <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-center">
                            <p className="text-sm font-bold uppercase tracking-wider mb-1">Trust Plan Activated</p>
                            <p className="text-xs">Your 50% advance has been received. Order is being processed!</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <ClayButton asChild className="h-14 px-8 text-lg flex-1 sm:flex-none">
                            <Link to="/medposterhub">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Continue Shopping
                            </Link>
                        </ClayButton>
                        <ClayButton asChild variant="secondary" className="h-14 px-8 text-lg flex-1 sm:flex-none">
                            <Link to="/">
                                Back to Home <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </ClayButton>
                    </div>
                </div>
            </main>

            <MedFooter />
        </div>
    );
};

export default OrderSuccessPage;
