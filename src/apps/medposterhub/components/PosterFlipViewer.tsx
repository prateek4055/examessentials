import { useState } from "react";
import { Poster } from "../data/posters";
import { Badge } from "@/components/ui/badge";
import { Star, ZoomIn } from "lucide-react";

interface PosterFlipViewerProps {
  frontPoster: Poster;
}

export const PosterFlipViewer = ({ frontPoster }: PosterFlipViewerProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* High-Definition Poster Frame Preview */}
      <div 
        className="relative rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] flex items-center justify-center p-3 sm:p-5 group cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
        title="Click to toggle full zoom view"
      >
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {frontPoster.bestseller && (
            <Badge className="bg-amber-400 text-amber-950 font-bold hover:bg-amber-400 shadow-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-950" />
              Bestseller
            </Badge>
          )}
        </div>

        <Badge className="absolute top-4 right-4 bg-white/95 text-slate-800 hover:bg-white shadow-xs border border-slate-200 font-semibold z-10 pointer-events-none">
          {frontPoster.category}
        </Badge>

        {/* Poster Image Container */}
        <div className={`w-full flex items-center justify-center transition-all duration-300 ${isZoomed ? "scale-105" : ""}`}>
          <img
            src={frontPoster.image}
            alt={frontPoster.title}
            className="max-h-[540px] max-w-full w-auto h-auto object-contain rounded-sm drop-shadow-md select-none"
            loading="eager"
          />
        </div>

        {/* Zoom Hint */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 shadow-xs border border-slate-200/80">
          <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
          <span>{isZoomed ? "Click to reset" : "Click to zoom"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>✨ Single-sided 300 GSM Archival Print</span>
        <span className="font-medium text-blue-600">Medically Verified Diagram</span>
      </div>
    </div>
  );
};
