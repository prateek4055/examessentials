import { motion } from "framer-motion";
import { Poster } from "../data/posters";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Poster[];
    onViewDetails: (poster: Poster) => void;
}

export const ProductGrid = ({ products, onViewDetails }: ProductGridProps) => {
    return (
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
            {products.map((poster) => (
                <ProductCard
                    key={poster.id}
                    poster={poster}
                    onViewDetails={onViewDetails}
                />
            ))}

            {products.length === 0 && (
                <div className="col-span-full text-center py-20 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-lg mx-auto">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-2xl">
                        ✨
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Aesthetic Decor Posters Coming Soon</h3>
                    <p className="text-slate-500 text-sm">
                        We are finalizing premium clinic and study room decor designs. In the meantime, explore our clinical & teaching anatomy posters!
                    </p>
                </div>
            )}
        </div>
    );
};
