import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductImageHoverPreviewProps {
  images: string[];
  productTitle: string;
  isVisible: boolean;
  onClose: () => void;
}

const ProductImageHoverPreview = ({
  images,
  productTitle,
  isVisible,
  onClose,
}: ProductImageHoverPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayImages = images.slice(0, 4); // Show max 4 demo images

  useEffect(() => {
    if (!isVisible) {
      setCurrentIndex(0);
    }
  }, [isVisible]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  if (displayImages.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-0 z-20 bg-background/95 backdrop-blur-sm rounded-xl overflow-hidden"
          onClick={(e) => e.preventDefault()}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2 right-2 z-30 p-1.5 bg-secondary/80 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>

          {/* Main preview image */}
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={displayImages[currentIndex]}
                alt={`${productTitle} - Preview ${currentIndex + 1}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </AnimatePresence>

            {/* Navigation arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-secondary/90 hover:bg-secondary rounded-full transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-secondary/90 hover:bg-secondary rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail indicators */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === index
                      ? "bg-accent w-4"
                      : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Preview label */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-accent/90 text-accent-foreground text-[10px] font-semibold rounded-full">
            Demo Preview
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductImageHoverPreview;
