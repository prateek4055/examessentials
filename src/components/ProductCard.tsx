import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-card border border-border rounded-2xl p-6 hover:border-muted-foreground/30 transition-all duration-300"
    >
      {/* Class Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 text-xs font-body font-medium bg-secondary text-secondary-foreground rounded-full">
          Class {product.class}
        </span>
      </div>

      {/* Product Image or Icon */}
      {product.images && product.images.length > 0 ? (
        <div className="rounded-xl overflow-hidden mb-4 border border-border bg-secondary">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-auto max-h-48 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gradient-purple to-gradient-blue flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-foreground" />
        </div>
      )}

      {/* Content */}
      <div className="mb-6">
        <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">
          {product.subject}
        </p>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </div>

      {/* Price & CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <span className="text-2xl font-display font-bold text-foreground">
            ₹{product.price}
          </span>
        </div>
        <Button asChild variant="outline" size="sm" className="group/btn">
          <Link to={`/product/${product.id}`}>
            View Details
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
