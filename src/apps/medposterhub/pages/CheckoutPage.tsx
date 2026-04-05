import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { ClayButton } from "../components/ClayButton";
import { ClayCard } from "../components/ClayCard";
import SEOHead from "@/components/SEOHead";
import { 
    ChevronRight, 
    MapPin, 
    Phone, 
    Mail, 
    User, 
    ArrowLeft,
    CheckCircle2,
    Loader2,
    AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: () => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CheckoutPage = () => {
    const { totalPrice, cart, clearCart } = useCart();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, isLoading: authLoading } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to place your order and track its progress.",
            });
            navigate(`/auth?redirect=/medposterhub/checkout`);
        }
    }, [user, authLoading, navigate]);

    // Prefill form from user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.user_metadata?.full_name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [paymentPlan, setPaymentPlan] = useState<"full" | "partial">("full");

    const initialPayment = paymentPlan === "full" ? totalPrice : Math.ceil(totalPrice / 2);
    const balanceDue = totalPrice - initialPayment;

    if (cart.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
                <ClayCard className="max-w-md w-full p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h1>
                    <p className="text-slate-500 mb-6">Add some medical posters to your cart before checking out.</p>
                    <ClayButton asChild>
                        <Link to="/medposterhub">Browse Posters</Link>
                    </ClayButton>
                </ClayCard>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
            toast({
                title: "Incomplete details",
                description: "Please fill all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                throw new Error("Razorpay SDK failed to load. Are you online?");
            }

            // 2. Create Razorpay Order via Edge Function
            const { data: orderResponse, error: orderError } = await supabase.functions.invoke("create-razorpay-order", {
                body: { 
                    amount: initialPayment,
                    notes: {
                        customer_name: formData.name,
                        type: "poster_order",
                        payment_plan: paymentPlan
                    }
                }
            });

            if (orderError) throw orderError;

            // 3. Initialize Razorpay Checkout
            const options: RazorpayOptions = {
                key: orderResponse.keyId,
                amount: orderResponse.amount,
                currency: "INR",
                name: "MedPosterHub",
                description: "Purchase of Medical Posters",
                order_id: orderResponse.orderId,
                handler: async (response: any) => {
                    try {
                        // 4. Save order to Supabase
                        const { data: posterOrder, error: dbError } = await (supabase as any)
                            .from("poster_orders")
                            .insert({
                                customer_name: formData.name,
                                customer_email: formData.email,
                                customer_phone: formData.phone,
                                address_line1: formData.addressLine1,
                                address_line2: formData.addressLine2,
                                landmark: formData.landmark,
                                city: formData.city,
                                state: formData.state,
                                pincode: formData.pincode,
                                items: cart,
                                total_amount: totalPrice,
                                payment_plan: paymentPlan,
                                amount_paid: initialPayment,
                                balance_due: balanceDue,
                                payment_status: "completed",
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                user_id: user?.id
                            })
                            .select()
                            .single();

                        if (dbError) throw dbError;

                        // 5. Success!
                        clearCart();
                        navigate("/medposterhub/success", { state: { orderId: posterOrder.id } });
                    } catch (error: any) {
                        console.error("Database save error:", error);
                        toast({
                            title: "Payment Successful, but error saving order",
                            description: "Please contact support with your Payment ID: " + response.razorpay_payment_id,
                            variant: "destructive",
                        });
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#3b82f6",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast({
                title: "Checkout Failed",
                description: error.message || "An error occurred during checkout.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <SEOHead
                title="Checkout | MedPosterHub"
                description="Complete your order for premium medical posters."
                noIndex={true}
            />

            <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                        <Link to="/medposterhub" className="hover:text-slate-900 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900 font-medium">Checkout</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Form Section */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <MapPin className="w-8 h-8 text-blue-600" />
                                Shipping Details
                            </h1>

                            <form onSubmit={handleCheckout} className="space-y-8">
                                <ClayCard className="p-6 md:p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-slate-600 flex items-center gap-2">
                                                <User className="w-4 h-4" /> Full Name
                                            </Label>
                                            <Input 
                                                id="name" name="name" required 
                                                className="rounded-xl border-slate-200 h-12"
                                                placeholder="Dr. John Doe"
                                                value={formData.name} onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-slate-600 flex items-center gap-2">
                                                <Phone className="w-4 h-4" /> Phone Number
                                            </Label>
                                            <Input 
                                                id="phone" name="phone" type="tel" required 
                                                className="rounded-xl border-slate-200 h-12"
                                                placeholder="9876543210"
                                                value={formData.phone} onChange={handleInputChange} 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-600 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email Address
                                        </Label>
                                        <Input 
                                            id="email" name="email" type="email" required 
                                            className="rounded-xl border-slate-200 h-12"
                                            placeholder="john@example.com"
                                            value={formData.email} onChange={handleInputChange} 
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="addressLine1" className="text-slate-600">Address Line 1 (House No, Building, Street)</Label>
                                            <Input 
                                                id="addressLine1" name="addressLine1" required 
                                                className="rounded-xl border-slate-200 h-12"
                                                value={formData.addressLine1} onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="addressLine2" className="text-slate-600">Address Line 2 (Area, Locality)</Label>
                                            <Input 
                                                id="addressLine2" name="addressLine2" 
                                                className="rounded-xl border-slate-200 h-12"
                                                value={formData.addressLine2} onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="landmark" className="text-slate-600">Landmark (Optional)</Label>
                                                <Input 
                                                    id="landmark" name="landmark" 
                                                    className="rounded-xl border-slate-200 h-12"
                                                    value={formData.landmark} onChange={handleInputChange} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="text-slate-600">City</Label>
                                                <Input 
                                                    id="city" name="city" required 
                                                    className="rounded-xl border-slate-200 h-12"
                                                    value={formData.city} onChange={handleInputChange} 
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="state" className="text-slate-600">State</Label>
                                                <Input 
                                                    id="state" name="state" required 
                                                    className="rounded-xl border-slate-200 h-12"
                                                    value={formData.state} onChange={handleInputChange} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pincode" className="text-slate-600">Pincode</Label>
                                                <Input 
                                                    id="pincode" name="pincode" required 
                                                    className="rounded-xl border-slate-200 h-12"
                                                    placeholder="110001"
                                                    value={formData.pincode} onChange={handleInputChange} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </ClayCard>

                                <div className="flex items-center gap-4 pt-4">
                                    <ClayButton 
                                        type="button" 
                                        variant="secondary" 
                                        className="px-6 h-14"
                                        onClick={() => navigate(-1)}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                                    </ClayButton>
                                    <ClayButton 
                                        type="submit" 
                                        className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>Pay ₹{initialPayment} Now {paymentPlan === "partial" && <span className="ml-2 text-xs opacity-80">(50% Advance)</span>}</>
                                        )}
                                    </ClayButton>
                                    {paymentPlan === "partial" && (
                                        <p className="text-[10px] text-center text-amber-600 font-bold uppercase mt-2">
                                            ₹{balanceDue} Balance Due After Dispatch
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:w-[400px]">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Order Summary</h2>
                            <ClayCard className="p-6 bg-blue-50/50 border-blue-100 divide-y divide-blue-100">
                                <div className="space-y-4 pb-4">
                                    {cart.map((item) => {
                                        const itemPrice = item.selectedSize === "A1" ? item.price.large : 
                                                         (item.selectedSize === "A3" ? item.price.small : item.price.medium);
                                        const finalItemPrice = item.isDoubleSided ? itemPrice + 200 : itemPrice;
                                        
                                        return (
                                            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                                                <div className="w-16 h-20 rounded shadow-clay-sm overflow-hidden bg-white flex-shrink-0">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {item.selectedSize} × {item.quantity}
                                                    </p>
                                                    {item.isDoubleSided && (
                                                        <p className="text-[10px] text-green-600 font-medium">Double Sided</p>
                                                    )}
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">
                                                    ₹{finalItemPrice * item.quantity}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="py-4 space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Choose Payment Plan</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentPlan("full")}
                                                className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                                                    paymentPlan === "full"
                                                        ? "border-blue-600 bg-blue-100/50 text-blue-700"
                                                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                                }`}
                                            >
                                                Full Payment
                                                <span className="block text-[10px] font-normal mt-1 opacity-70">100% Upfront</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentPlan("partial")}
                                                className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                                                    paymentPlan === "partial"
                                                        ? "border-blue-600 bg-blue-100/50 text-blue-700"
                                                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                                }`}
                                            >
                                                Trust Plan (50/50)
                                                <span className="block text-[10px] font-normal mt-1 opacity-70">Pay ₹{Math.ceil(totalPrice/2)} now</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-4 space-y-2">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">Total Bill</span>
                                        <span className="text-2xl font-bold text-slate-800">₹{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 border-t border-blue-100/50 pt-2">
                                        <span className="text-sm font-semibold text-slate-500">Amount to Pay Now</span>
                                        <span className="text-xl font-bold text-blue-600">₹{initialPayment}</span>
                                    </div>
                                    {paymentPlan === "partial" && (
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs font-medium text-amber-600">Balance Due Later</span>
                                            <span className="text-sm font-bold text-amber-600">₹{balanceDue}</span>
                                        </div>
                                    )}
                                    <div className="mt-4 p-3 bg-white/50 rounded-xl border border-blue-100 text-[11px] text-slate-500 flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        You're covered by our safe delivery guarantee. Premium protective tubes used for all orders.
                                    </div>
                                    <div className="mt-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 text-[11px] text-amber-700 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                        <span>
                                            <strong className="block text-amber-900 mb-0.5 uppercase">Important Policy</strong>
                                            Posters are non-returnable as they are printed to order. No COD available on the website (Prepaid Only).
                                        </span>
                                    </div>
                                </div>
                            </ClayCard>
                        </div>
                    </div>
                </div>
            </main>

            <MedFooter />
        </div>
    );
};

export default CheckoutPage;
