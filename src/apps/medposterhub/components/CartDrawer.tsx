import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ClayButton } from "./ClayButton";
import { ClayCard } from "./ClayCard";

export const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();

    const handleCheckout = () => {
        // Generate WhatsApp message
        let message = "Hi, I would like to order the following posters:\n\n";
        cart.forEach((item) => {
            message += `• ${item.title} (${item.selectedSize})`;
            if (item.isDoubleSided) {
                message += ` [${item.backPosterTitle ? `Double Sided: Back is ${item.backPosterTitle}` : 'Double Sided'}] (+₹200)`;
            }
            message += ` x ${item.quantity}\n`;
        });
        message += `\nTotal: ₹${totalPrice}`;

        const url = `https://wa.me/919460970342?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-[#F4F7FB] border-l-0 shadow-clay-lg p-0">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                        Your Cart ({cart.length})
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 px-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <div className="w-20 h-20 rounded-full bg-[#F4F7FB] shadow-clay-inner flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 opacity-40" />
                            </div>
                            <p className="font-medium">Your cart is empty.</p>
                            <ClayButton variant="secondary" onClick={() => setIsCartOpen(false)} className="mt-4 px-6 py-2">Start Browsing</ClayButton>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            {cart.map((item) => (
                                <ClayCard key={`${item.id}-${item.selectedSize}-${item.isDoubleSided}`} variant="flat" className="flex gap-4 p-3 bg-white/50">
                                    <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-clay-inner bg-white">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-tight">
                                            {item.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="text-xs text-slate-500 font-medium bg-blue-50 px-2 py-0.5 rounded w-fit text-blue-600">
                                                Size: {item.selectedSize}
                                            </span>
                                            {item.isDoubleSided && (
                                                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded w-fit border border-green-200">
                                                    + Double Sided (₹200)
                                                </span>
                                            )}
                                        </div>
                                        {item.backPosterTitle && (
                                            <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">Back: {item.backPosterTitle}</span>
                                        )}
                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-[#F4F7FB] rounded-lg shadow-clay-inner p-1">
                                                <button
                                                    className="p-1 hover:text-blue-600 disabled:opacity-30 transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1, item.isDoubleSided)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center text-slate-700">{item.quantity}</span>
                                                <button
                                                    className="p-1 hover:text-blue-600 transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1, item.isDoubleSided)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <ClayButton
                                                variant="icon"
                                                className="h-8 w-8 text-red-400 hover:text-red-500 bg-transparent shadow-none hover:bg-red-50"
                                                onClick={() => removeFromCart(item.id, item.selectedSize, item.isDoubleSided)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </ClayButton>
                                        </div>
                                    </div>
                                </ClayCard>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {cart.length > 0 && (
                    <SheetFooter className="p-6 bg-white/50 backdrop-blur-sm border-t border-slate-100">
                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-between font-bold text-slate-900 text-lg">
                                <span>Subtotal</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <Separator className="bg-slate-200" />
                            <ClayButton variant="primary" className="w-full py-4 rounded-xl text-lg hover:bg-green-600 bg-green-500 border-none" onClick={handleCheckout}>
                                Checkout on WhatsApp
                            </ClayButton>
                            <p className="text-xs text-center text-slate-400 font-medium">
                                Secure checkout powered by WhatsApp
                            </p>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};
