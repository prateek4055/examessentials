import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Poster, PosterMaterial, calculateVariantPrice, MEDPOSTER_AMAZON_URL } from "../data/posters";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, Minus, Plus, ShoppingCart, ExternalLink } from "lucide-react";
import { useCart } from "../context/CartContext";

interface ProductDetailModalProps {
    poster: Poster | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductDetailModal = ({ poster, isOpen, onClose }: ProductDetailModalProps) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<"A3" | "A2" | "A1">("A2");
    const [selectedMaterial, setSelectedMaterial] = useState<PosterMaterial>("matte");
    const [quantity, setQuantity] = useState(1);

    // Reset state when poster changes
    useEffect(() => {
        if (isOpen) {
            setSelectedSize("A2");
            setSelectedMaterial("matte");
            setQuantity(1);
        }
    }, [isOpen, poster]);

    if (!poster) return null;

    const unitPrice = calculateVariantPrice(poster.price, selectedMaterial, selectedSize);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden rounded-3xl bg-white max-h-[92vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 h-full">
                    {/* Image Side */}
                    <div className="bg-slate-50 p-4 sm:p-6 flex items-center justify-center relative">
                        <div className={`transition-all duration-300 flex items-center justify-center max-h-[440px] ${
                            selectedMaterial === "framed"
                                ? "p-3 bg-slate-900 rounded-lg shadow-xl"
                                : selectedMaterial === "acrylic"
                                ? "p-1.5 ring-2 ring-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.18)] rounded-md"
                                : ""
                        }`}>
                            <img
                                src={poster.image}
                                alt={poster.title}
                                className="max-h-[380px] max-w-full w-auto h-auto object-contain drop-shadow-md rounded-xs"
                            />
                        </div>
                        <div className="absolute top-4 left-4 flex gap-1.5">
                            <Badge className="bg-white text-slate-900 hover:bg-white shadow-xs border border-slate-200">
                                {poster.category}
                            </Badge>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-6 sm:p-8 flex flex-col justify-between bg-white">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 shadow-none border border-blue-100">
                                    {poster.category}
                                </Badge>
                                <a
                                    href={poster.amazonUrl || MEDPOSTER_AMAZON_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 hover:bg-amber-100"
                                >
                                    <span className="font-extrabold text-amber-700">Amazon</span>
                                    <span>Available</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                                {poster.title}
                            </h2>

                            <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">
                                {poster.description}
                            </p>

                            {/* Format selector */}
                            <div className="mb-4">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Format
                                </label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { key: "matte" as const, label: "Matte Print" },
                                        { key: "framed" as const, label: "Framed" },
                                        { key: "acrylic" as const, label: "Acrylic" },
                                    ].map((mat) => (
                                        <button
                                            key={mat.key}
                                            type="button"
                                            onClick={() => setSelectedMaterial(mat.key)}
                                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                                                selectedMaterial === mat.key
                                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                            }`}
                                        >
                                            {mat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size selector */}
                            <div className="mb-4">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                    Size
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: "A3" as const, label: "A3", dim: "11.7\" × 16.5\"" },
                                        { 
                                            key: "A2" as const, 
                                            label: selectedMaterial === "acrylic" ? "16\" × 24\"" : "A2", 
                                            dim: selectedMaterial === "acrylic" ? "Wall Acrylic" : "18\" × 24\"" 
                                        },
                                    ].map((s) => (
                                        <button
                                            key={s.key}
                                            type="button"
                                            onClick={() => setSelectedSize(s.key)}
                                            className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left ${
                                                selectedSize === s.key
                                                    ? "border-blue-600 bg-blue-50 text-blue-800"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                            }`}
                                        >
                                            <div className="font-bold">{s.label}</div>
                                            <div className="text-[10px] text-slate-500">{s.dim}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                            <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total</span>
                                <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                    ₹{unitPrice * quantity}
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 shadow-sm"
                                onClick={() => {
                                    addToCart(poster, selectedSize, quantity, selectedMaterial);
                                    onClose();
                                }}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
