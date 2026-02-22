import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export const StickyCartBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { cart, totalPrice } = useCart();

    // Show only when scrolled past hero and not empty cart
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroHeight = 600; // Approx hero height
            if (scrollY > heroHeight && cart.length > 0) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [cart]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-white/10"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
                            <div className="text-lg font-bold">₹{totalPrice}</div>
                        </div>

                        <button
                            onClick={() => document.dispatchEvent(new CustomEvent('open-cart'))}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-900/50"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            View Cart ({totalItems})
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
