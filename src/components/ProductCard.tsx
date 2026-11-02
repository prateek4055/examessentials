import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/api";
import ProductImageHoverPreview from "./ProductImageHoverPreview";
import { getProxiedImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const hasImages = product.images && product.images.length > 0;

  // For desktop hover
  const handleMouseEnter = useCallback(() => {
    if (hasImages && window.innerWidth >= 768) {
      setShowPreview(true);
    }
  }, [hasImages]);

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth >= 768) {
      setShowPreview(false);
    }
  }, []);

  // Mobile touch to toggle preview
  const handleMobileTouch = (e: React.TouchEvent) => {
    if (window.innerWidth < 768 && hasImages) {
      e.preventDefault();
      setIsMobilePreviewOpen((prev) => !prev);
    }
  };

  return (
    <div>
      <Link
        to={`/product/${product.id}`}
        className="group block rounded-[1.75rem] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 bg-card/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-primary/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative bg-secondary/50 overflow-hidden aspect-[4/3] flex items-center justify-center"
          onTouchStart={handleMobileTouch}
        >
          {hasImages ? (
            <>
              <img
                src={getProxiedImageUrl(product.images![0]) || ""}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {/* Auto-scroll preview overlay */}
              <ProductImageHoverPreview
                images={product.images!}
                productTitle={product.title}
                isVisible={showPreview || isMobilePreviewOpen}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Premium Glass Sale Tag */}
          <span className="absolute top-3 right-3 backdrop-blur-md bg-black/65 text-white dark:bg-white/90 dark:text-black text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm z-10">
            Special Offer
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-secondary rounded-full text-muted-foreground">
              {product.subject}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
              Class {product.class}
            </span>
          </div>

          <h3
            className="text-sm md:text-base font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
            }}
          >
            {product.title}
          </h3>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-baseline gap-2">
              <span className="text-base md:text-lg font-bold text-foreground">
                ₹{product.price}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                ₹{Math.round(product.price * 1.5)}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;