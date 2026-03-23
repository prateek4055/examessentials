import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Poster } from "../data/posters";
import { useCart } from "../context/CartContext";
import { ClayCard } from "./ClayCard";
import { ClayButton } from "./ClayButton";

interface ProductCardProps {
    poster: Poster;
    onViewDetails: (poster: Poster) => void;
}

export const ProductCard = ({ poster, onViewDetails }: ProductCardProps) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("A3"); // Default A3

    // Helper to get price
    const getPrice = (size: string) => {
        if (size === "A3") return poster.price.small;
        if (size === "A2") return poster.price.medium;
        if (size === "A1") return poster.price.large;
        return poster.price.small; // Default fallback to small (A3)
    };

    return (
        <ClayCard hoverEffect className="flex flex-col h-full overflow-hidden p-4 group relative">
            {/* Bestseller Badge */}
            {poster.bestseller && (
                <div className="absolute top-4 left-4 z-20 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-950" />
                    Bestseller
                </div>
            )}

            {/* Image Container with Inner Shadow */}
            <Link
                to={`/medposterhub/${poster.slug}`}
                className="relative bg-[#F4F7FB] rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-clay-inner mb-4 p-3 block"
            >
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img
                        src={poster.image}
                        alt={poster.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity" />

                    {/* Add to Cart Overlay Button (Desktop) */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                        <ClayButton
                            className="w-full py-3 text-sm bg-white/95 text-slate-900 shadow-lg hover:bg-white"
                            onClick={(e) => { e.stopPropagation(); addToCart(poster, selectedSize, 1); }}
                        >
                            Quick Add - ₹{getPrice(selectedSize)}
                        </ClayButton>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 px-1">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600/80">
                        {poster.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{poster.rating || 4.8}</span>
                        <span className="text-[10px] text-slate-400">({poster.reviewCount || 120})</span>
                    </div>
                </div>

                <Link
                    to={`/medposterhub/${poster.slug}`}
                    className="font-handwritten font-bold text-slate-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors text-xl leading-tight tracking-wide block"
                    title={poster.title}
                >
                    {poster.title}
                </Link>

                {/* Price & Size Selector */}
                <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-slate-900">₹{getPrice(selectedSize)}</span>

                        {/* Size Chips */}
                        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg">
                            {["A3", "A2", "A1"].map((size) => (
                                <button
                                    key={size}
                                    onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                                    className={`
                                        text-[10px] font-bold px-2 py-1 rounded-md transition-all
                                        ${selectedSize === size
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                                        }
                                    `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-green-600 font-medium mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Ships in 2–4 days
                    </div>

                    {/* Mobile Add to Cart (Change from hidden/block logic if needed, keeping visible for now) */}
                    <ClayButton
                        variant="primary"
                        className="w-full py-2.5 rounded-xl text-sm md:hidden"
                        onClick={() => addToCart(poster, selectedSize, 1)}
                    >
                        Add to Cart
                    </ClayButton>
                </div>
            </div>
        </ClayCard>
    );
};
