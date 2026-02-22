import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImageHoverPreviewProps {
  images: string[];
  productTitle: string;
  isVisible: boolean;
}

const ProductImageHoverPreview = ({
  images,
  productTitle,
  isVisible,
}: ProductImageHoverPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayImages = images.slice(0, 4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible && displayImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length);
      }, 1200);
    } else {
      setCurrentIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, displayImages.length]);

  if (displayImages.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-0 z-20 bg-background/95 backdrop-blur-sm overflow-hidden"
        >
          {/* Auto-scrolling images */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={displayImages[currentIndex]}
                alt={`${productTitle} - Preview ${currentIndex + 1}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="max-w-full max-h-full object-contain p-2"
              />
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-accent w-4"
                      : "bg-muted-foreground/30 w-1.5"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductImageHoverPreview;
