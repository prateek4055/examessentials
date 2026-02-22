import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Poster } from "../data/posters";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

interface ProductDetailModalProps {
    poster: Poster | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductDetailModal = ({ poster, isOpen, onClose }: ProductDetailModalProps) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("A2");
    const [quantity, setQuantity] = useState(1);

    // Reset state when poster changes
    useEffect(() => {
        if (isOpen) {
            setSelectedSize("A2");
            setQuantity(1);
        }
    }, [isOpen, poster]);

    if (!poster) return null;

    const getPrice = (size: string) => {
        if (size === "A3") return poster.price.small;
        if (size === "A2") return poster.price.medium;
        if (size === "A1") return poster.price.large;
        return poster.price.medium;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden rounded-3xl bg-white">
                <div className="grid md:grid-cols-2 h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                    {/* Image Side */}
                    <div className="bg-slate-50 p-6 flex items-center justify-center relative">
                        <img
                            src={poster.image}
                            alt={poster.title}
                            className="w-full h-auto max-h-[500px] object-contain drop-shadow-2xl rounded-lg"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-white text-slate-900 hover:bg-white shadow-sm">
                                {poster.category}
                            </Badge>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-8 flex flex-col h-full bg-white">
                        <div className="mb-auto">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-500">(24 Reviews)</span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                {poster.title}
                            </h2>

                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {poster.description}
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    High-Resolution 300 DPI Print
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    {poster.quality || "Premium Matte Finish"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                        Select Size
                                    </label>
                                    <div className="flex gap-2">
                                        {["A3", "A2", "A1"].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${selectedSize === size
                                                        ? "border-slate-900 bg-slate-900 text-white"
                                                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full sm:w-32">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                        Quantity
                                    </label>
                                    <div className="flex items-center border border-slate-200 rounded-lg p-1">
                                        <button
                                            className="p-1 hover:bg-slate-100 rounded-md disabled:opacity-50"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4 text-slate-600" />
                                        </button>
                                        <span className="flex-1 text-center font-semibold text-slate-900">{quantity}</span>
                                        <button
                                            className="p-1 hover:bg-slate-100 rounded-md"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="w-4 h-4 text-slate-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-2xl font-bold text-slate-900">
                                    ₹{getPrice(selectedSize) * quantity}
                                    <span className="text-sm font-normal text-slate-400 ml-2">Total</span>
                                </div>
                                <Button
                                    size="lg"
                                    className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200"
                                    onClick={() => {
                                        addToCart(poster, selectedSize, quantity);
                                        onClose();
                                    }}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Order
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
