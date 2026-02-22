import { motion } from "framer-motion";
import { Poster } from "../data/posters";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Poster[];
    onViewDetails: (poster: Poster) => void;
}

export const ProductGrid = ({ products, onViewDetails }: ProductGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((poster) => (
                <ProductCard
                    key={poster.id}
                    poster={poster}
                    onViewDetails={onViewDetails}
                />
            ))}

            {products.length === 0 && (
                <div className="col-span-full text-center py-20">
                    <p className="text-slate-500 text-lg">No posters found in this category.</p>
                </div>
            )}
        </div>
    );
};
