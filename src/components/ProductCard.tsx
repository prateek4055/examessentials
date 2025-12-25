import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
            Sale!
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display text-sm md:text-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body font-bold text-foreground">₹{product.price}</span>
            <span className="font-body text-sm text-muted-foreground line-through">₹{Math.round(product.price * 1.5)}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">{product.subject}</span>
            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">Class {product.class}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;