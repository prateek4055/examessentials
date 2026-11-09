import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface AdSensePlaceholderProps {
  layout: "sidebar" | "banner" | "in-article" | "multiplex";
  className?: string;
  adSlot?: string;
}

const AD_CLIENT = "ca-pub-4205476272781282";

const SLOT_MAP: Record<string, string> = {
  sidebar: "5310841463",
  banner: "2988806161",
  multiplex: "2684678128",
  "in-article": "2988806161",
};

const FORMAT_MAP: Record<string, string> = {
  sidebar: "auto",
  banner: "auto",
  multiplex: "autorelaxed",
  "in-article": "fluid",
};

const SIZE_MAP: Record<string, React.CSSProperties> = {
  sidebar: { display: "block", minWidth: "160px", minHeight: "250px", width: "100%" },
  banner: { display: "block", minWidth: "320px", minHeight: "90px", width: "100%" },
  multiplex: { display: "block", minWidth: "300px", minHeight: "250px", width: "100%" },
  "in-article": { display: "block", textAlign: "center", minWidth: "300px", minHeight: "250px", width: "100%" },
};

const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({
  layout,
  className = "",
  adSlot,
}) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const location = useLocation(); // Re-trigger push on every SPA route change

  useEffect(() => {
    // Small delay to ensure DOM has non-zero dimensions before AdSense reads size
    const timer = setTimeout(() => {
      try {
        if (!insRef.current) return;

        // Only push if this <ins> hasn't been filled yet by AdSense
        const status = insRef.current.getAttribute("data-adsbygoogle-status");
        if (!status) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (e) {
        console.warn("AdSense push error:", e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname, layout]);

  const containerStyles: Record<string, string> = {
    sidebar: "w-full min-h-[250px] my-4",
    banner: "w-full min-h-[90px] my-6",
    multiplex: "w-full min-h-[280px] my-8",
    "in-article": "w-full min-h-[250px] my-8",
  };

  const slot = adSlot || SLOT_MAP[layout] || SLOT_MAP.banner;
  const format = FORMAT_MAP[layout] || "auto";
  const inlineStyle = SIZE_MAP[layout] || SIZE_MAP.banner;

  return (
    <div
      className={`adsense-container text-center overflow-hidden flex flex-col items-center justify-center ${containerStyles[layout] || ""} ${className}`}
    >
      <span className="block text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 font-semibold">
        Advertisement
      </span>
      {layout === "in-article" ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={inlineStyle}
          data-ad-layout="in-article"
          data-ad-format={format}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
        />
      ) : layout === "multiplex" ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={inlineStyle}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
        />
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={inlineStyle}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};

export default AdSensePlaceholder;
