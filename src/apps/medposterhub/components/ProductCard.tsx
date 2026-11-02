import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, ExternalLink, ShieldCheck } from "lucide-react";
import { Poster, PosterMaterial, calculateVariantPrice, MEDPOSTER_AMAZON_URL } from "../data/posters";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
    poster: Poster;
    onViewDetails: (poster: Poster) => void;
}

export const ProductCard = ({ poster, onViewDetails }: ProductCardProps) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<"A3" | "A2" | "A1">("A3");
    const [selectedMaterial, setSelectedMaterial] = useState<PosterMaterial>("matte");

    const currentPrice = calculateVariantPrice(poster.price, selectedMaterial, selectedSize);

    const materialOptions: { key: PosterMaterial; label: string }[] = [
        { key: "matte", label: "Matte Print" },
        { key: "framed", label: "Wood Frame" },
        { key: "acrylic", label: "Acrylic Glass" },
    ];

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all duration-300 overflow-hidden group">
            {/* Poster Preview Frame */}
            <div className="relative bg-slate-50 aspect-[3/4] p-3 overflow-hidden">
                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                    {poster.bestseller && (
                        <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-950" />
                            Bestseller
                        </span>
                    )}
                    {poster.collectionType === "decorative" && (
                        <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                            Aesthetic Art
                        </span>
                    )}
                </div>

                {/* Amazon Trust Link */}
                <a
                    href={poster.amazonUrl || MEDPOSTER_AMAZON_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Available on Amazon"
                    className="absolute top-2.5 right-2.5 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 hover:border-amber-400 hover:text-amber-700 transition-colors shadow-xs"
                >
                    <span className="text-amber-600 font-bold">Amazon</span>
                    <span className="hidden xs:inline">Available</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>

                {/* Framed / Acrylic dynamic visual feedback */}
                <Link
                    to={`/medposterhub/${poster.slug}`}
                    className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden relative cursor-pointer"
                >
                    <div
                        className={`w-full h-full flex items-center justify-center transition-all duration-300 group-hover:scale-[1.02] ${
                            selectedMaterial === "framed"
                                ? "p-2 bg-slate-900 shadow-xl rounded-sm"
                                : selectedMaterial === "acrylic"
                                ? "p-1.5 bg-slate-100 ring-2 ring-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.15)] rounded-sm"
                                : ""
                        }`}
                    >
                        <img
                            src={poster.image}
                            alt={poster.title}
                            className="max-h-full max-w-full object-contain drop-shadow-sm rounded-xs"
                            loading="lazy"
                        />
                        {selectedMaterial === "acrylic" && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                        )}
                    </div>
                </Link>
            </div>

            {/* Poster Details */}
            <div className="flex flex-col flex-1 p-3.5 sm:p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {poster.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{poster.rating || 4.9}</span>
                        <span className="text-slate-400 text-[10px]">({poster.reviewCount || 90})</span>
                    </div>
                </div>

                <Link
                    to={`/medposterhub/${poster.slug}`}
                    className="font-sans font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-blue-600 transition-colors mb-2.5"
                    title={poster.title}
                >
                    {poster.title}
                </Link>

                {/* Variant: Material Selector */}
                <div className="mb-2.5">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                        <span>Format:</span>
                        <span className="text-blue-600 font-bold capitalize">{selectedMaterial}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-medium">
                        {materialOptions.map((mat) => (
                            <button
                                key={mat.key}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMaterial(mat.key);
                                }}
                                className={`py-1 px-0.5 rounded text-center transition-all truncate ${
                                    selectedMaterial === mat.key
                                        ? "bg-white text-blue-700 font-bold shadow-xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {mat.label.split(" ")[0]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Variant: Size Selector */}
                <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-[10px] font-semibold text-slate-500">Size:</span>
                    <div className="flex gap-1.5">
                        {[
                            { key: "A3" as const, dim: "11.7×16.5\"" },
                            { key: "A2" as const, dim: "18×24\"" },
                        ].map((sizeObj) => (
                            <button
                                key={sizeObj.key}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSize(sizeObj.key);
                                }}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                                    selectedSize === sizeObj.key
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <span>{sizeObj.key}</span>
                                <span className={`text-[8px] ${selectedSize === sizeObj.key ? "text-blue-100" : "text-slate-400"}`}>
                                    {sizeObj.dim}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price & Add to Cart button */}
                <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                            Total
                        </span>
                        <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                            ₹{currentPrice}
                        </div>
                    </div>

                    <Button
                        size="sm"
                        onClick={() => addToCart(poster, selectedSize, 1, selectedMaterial)}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 h-8.5 shadow-xs flex items-center gap-1.5"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
