import { X, MessageCircle, Check, Package } from "lucide-react";
import { Poster, posters } from "../data/posters";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MedPosterDetailProps {
  poster: Poster;
  onClose: () => void;
}

const MedPosterDetail = ({ poster, onClose }: MedPosterDetailProps) => {
  const [selectedSize, setSelectedSize] = useState(0);

  const sizeKeys = ["small", "medium", "large"] as const;
  const currentPrice = poster.price[sizeKeys[selectedSize]];

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hi! I want to order this poster:\n\n` +
        `📋 Product: ${poster.title}\n` +
        `📐 Size: ${poster.sizes[selectedSize]}\n` +
        `💰 Price: ₹${currentPrice}\n\n` +
        `Please share payment details and delivery options.`
    );
    window.open(`https://wa.me/919460970342?text=${message}`, "_blank");
  };

  const suggestedPosters = posters
    .filter((p) =>
      poster.comboSuggestions.some((suggestion) =>
        p.title.toLowerCase().includes(suggestion.toLowerCase().split(" ")[0])
      )
    )
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-card shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-md transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 md:grid-cols-2">
          <div className="aspect-[3/4] bg-secondary md:aspect-auto">
            <img
              src={poster.image}
              alt={poster.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col p-6 md:p-8">
            <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {poster.category}
            </span>

            <h2 className="mb-3 text-2xl font-bold text-card-foreground md:text-3xl">
              {poster.title}
            </h2>

            <p className="mb-6 text-muted-foreground leading-relaxed">
              {poster.description}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-card-foreground">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {poster.sizes.map((size, idx) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(idx)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedSize === idx
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="mb-6 rounded-lg bg-secondary/50 p-4">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-card-foreground">Quality</h4>
                  <p className="text-sm text-muted-foreground">{poster.quality}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-card-foreground">₹{currentPrice}</span>
              <span className="ml-2 text-sm text-muted-foreground">per poster</span>
            </div>

            {/* WhatsApp Button */}
            <Button
              onClick={handleWhatsAppOrder}
              className="mb-6 w-full gap-2 bg-green-600 text-white hover:bg-green-700"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              Order on WhatsApp
            </Button>

            {/* Combo Suggestions */}
            {suggestedPosters.length > 0 && (
              <div className="border-t border-border pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-card-foreground">
                    Complete Your Collection
                  </h4>
                </div>
                <div className="flex gap-3">
                  {suggestedPosters.map((suggested) => (
                    <div key={suggested.id} className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2">
                      <img
                        src={suggested.image}
                        alt={suggested.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <span className="text-xs font-medium text-muted-foreground line-clamp-2">
                        {suggested.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedPosterDetail;
