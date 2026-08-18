import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const AD_CLIENT = "ca-pub-4205476272781282";
// Use your existing banner slot — anchor format uses same slot
const ANCHOR_SLOT = "2988806161";

const AnchorAd: React.FC = () => {
  const insRef = useRef<HTMLModElement | null>(null);
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show anchor ad only after user has scrolled 300px — feels natural, not aggressive
  useEffect(() => {
    setDismissed(false);
    setVisible(false);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!visible || dismissed) return;

    const timer = setTimeout(() => {
      try {
        if (!insRef.current) return;
        const status = insRef.current.getAttribute("data-adsbygoogle-status");
        if (!status) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (e) {
        console.warn("Anchor ad push error:", e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [visible, dismissed, location.pathname]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 xl:hidden"
      style={{
        // Sits ABOVE the mobile app promo bar (which is z-40)
        // On desktop, sidebar ad is sufficient — anchor only shows on mobile/tablet
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Close ad"
        className="absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
      >
        <X className="w-3 h-3 text-gray-600" />
      </button>

      {/* Tiny label */}
      <p className="text-center text-[8px] text-gray-400 uppercase tracking-widest pt-1 mb-0.5 font-semibold">
        Ad
      </p>

      {/* The actual ad unit — 320×50 banner (smallest standard size) */}
      <div className="flex justify-center items-center min-h-[50px] overflow-hidden">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: "inline-block",
            width: "320px",
            height: "50px",
          }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={ANCHOR_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AnchorAd;
