import { useState, useRef, useCallback, useEffect } from "react";
import { Poster } from "../data/posters";
import { Badge } from "@/components/ui/badge";
import { RotateCw, RotateCcw, Search, X } from "lucide-react";

interface PosterFlipViewerProps {
  frontPoster: Poster;
  allPosters: Poster[];
  backPoster: Poster | null;
  onBackPosterChange: (poster: Poster | null) => void;
}

export const PosterFlipViewer = ({
  frontPoster,
  allPosters,
  backPoster,
  onBackPosterChange,
}: PosterFlipViewerProps) => {
  const [rotationY, setRotationY] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState("");
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimestamp = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Available posters for back side (exclude current front poster)
  const availablePosters = allPosters.filter((p) => p.id !== frontPoster.id);
  const filteredPosters = selectorSearch
    ? availablePosters.filter(
        (p) =>
          p.title.toLowerCase().includes(selectorSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(selectorSearch.toLowerCase())
      )
    : availablePosters;

  // Auto-rotate animation loop
  useEffect(() => {
    if (!isAutoRotating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const delta = timestamp - lastTimestamp.current;
      lastTimestamp.current = timestamp;

      setRotationY((prev) => (prev + delta * 0.04) % 360);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimestamp.current = 0;
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating]);

  // Mouse drag handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isAutoRotating) return;
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartRotation.current = rotationY;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isAutoRotating, rotationY]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX.current;
      setRotationY(dragStartRotation.current + dx * 0.5);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Click to flip (only if not dragging)
  const handleClick = useCallback(() => {
    if (isAutoRotating) return;
    // Snap to nearest face
    const normalized = ((rotationY % 360) + 360) % 360;
    if (normalized < 90 || normalized >= 270) {
      // Currently showing front → flip to back
      setRotationY(180);
    } else {
      // Currently showing back → flip to front
      setRotationY(0);
    }
  }, [isAutoRotating, rotationY]);

  const handleReset = () => {
    setIsAutoRotating(false);
    setRotationY(0);
  };

  // Determine which side is currently visible
  const normalized = ((rotationY % 360) + 360) % 360;
  const showingFront = normalized < 90 || normalized >= 270;

  return (
    <div className="space-y-5">
      {/* 3D Flip Card */}
      <div
        ref={containerRef}
        className="flip-card-scene relative"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleClick}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          className="flip-card-inner"
          style={{
            transform: `rotateY(${rotationY}deg)`,
            transition: isDragging || isAutoRotating ? "none" : "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Front Face */}
          <div className="flip-card-face rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
            <img
              src={frontPoster.image}
              alt={`${frontPoster.title} – Front`}
              className="w-full h-full object-contain"
              draggable={false}
            />
            {frontPoster.bestseller && (
              <Badge className="absolute top-4 left-4 bg-amber-500 text-white hover:bg-amber-500 z-10">
                ⭐ Bestseller
              </Badge>
            )}
            <Badge className="absolute top-4 right-4 bg-white text-slate-900 hover:bg-white shadow-sm z-10">
              {frontPoster.category}
            </Badge>
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center">
                <span className="text-xs font-semibold text-slate-600">FRONT</span>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div className="flip-card-face flip-card-back rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
            {backPoster ? (
              <>
                <img
                  src={backPoster.image}
                  alt={`${backPoster.title} – Back`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white hover:bg-blue-600 z-10">
                  Back Side
                </Badge>
                <Badge className="absolute top-4 right-4 bg-white text-slate-900 hover:bg-white shadow-sm z-10">
                  {backPoster.category}
                </Badge>
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center">
                    <span className="text-xs font-semibold text-slate-600 line-clamp-1">{backPoster.title}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <RotateCw className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Back Side Preview</h3>
                <p className="text-sm text-slate-500 max-w-[200px]">
                  Select a poster below to preview it on the back side of this print
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Side indicator */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-20 pointer-events-none">
          <div className="flex flex-col gap-1">
            <div className={`w-2 h-8 rounded-full transition-colors ${showingFront ? "bg-blue-500" : "bg-slate-300"}`} />
            <div className={`w-2 h-8 rounded-full transition-colors ${!showingFront ? "bg-blue-500" : "bg-slate-300"}`} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoRotating(!isAutoRotating);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            isAutoRotating
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <RotateCw className={`w-4 h-4 ${isAutoRotating ? "animate-spin" : ""}`} />
          {isAutoRotating ? "Stop Rotation" : "Auto Rotate"}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Drag hint */}
      <p className="text-center text-xs text-slate-400">
        Click to flip · Drag to rotate · {backPoster ? "Showing front & back" : "Select a poster for the back side ↓"}
      </p>

      {/* Back Poster Selector */}
      <div className="mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSelector(!showSelector);
          }}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 text-blue-700 font-semibold text-sm hover:bg-blue-100/50 transition-all"
        >
          <span>
            {backPoster
              ? `✅ Back: ${backPoster.title}`
              : "🖼️ Select Poster for Back Side (Double-Sided Print)"}
          </span>
          <span className={`transition-transform ${showSelector ? "rotate-180" : ""}`}>▾</span>
        </button>

        {showSelector && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search posters..."
                  value={selectorSearch}
                  onChange={(e) => setSelectorSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
                {selectorSearch && (
                  <button
                    onClick={() => setSelectorSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Clear selection */}
            {backPoster && (
              <button
                onClick={() => {
                  onBackPosterChange(null);
                  setRotationY(0);
                  setIsAutoRotating(false);
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 border-b border-slate-100 text-left transition-colors"
              >
                ✕ Remove back poster
              </button>
            )}

            {/* Poster grid */}
            <div className="max-h-64 overflow-y-auto p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {filteredPosters.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onBackPosterChange(p);
                    setShowSelector(false);
                    setSelectorSearch("");
                    // Flip to show the back
                    setIsAutoRotating(false);
                    setRotationY(180);
                  }}
                  className={`group relative rounded-lg overflow-hidden border-2 transition-all aspect-[3/4] ${
                    backPoster?.id === p.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                    <p className="text-[9px] font-semibold text-white leading-tight line-clamp-2">
                      {p.title}
                    </p>
                  </div>
                  {backPoster?.id === p.id && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {filteredPosters.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-400">
                No posters found matching "{selectorSearch}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
