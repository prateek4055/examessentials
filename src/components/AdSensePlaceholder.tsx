import React, { useEffect } from "react";

interface AdSensePlaceholderProps {
  layout: "sidebar" | "banner" | "in-article" | "multiplex";
  className?: string;
  adSlot?: string;
}

const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({ 
  layout, 
  className = "", 
  adSlot 
}) => {
  useEffect(() => {
    try {
      // Initialize the AdSense ad unit
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      // Catch errors in local development where AdSense script might block or fail
      console.warn("AdSense script initialization warning:", e);
    }
  }, [layout]);

  // Client ID from index.html
  const adClient = "ca-pub-4205476272781282";

  // Production ad slots from Google AdSense
  const getSlotId = () => {
    if (adSlot) return adSlot;
    switch (layout) {
      case "sidebar":
        return "5310841463"; // medortho_sidebar
      case "banner":
        return "2988806161"; // medortho_banner
      case "multiplex":
        return "2684678128"; // medortho_multiplex (autorelaxed)
      case "in-article":
        return "2988806161"; // Fallback to medortho_banner Display layout or your preferred unit
      default:
        return "2988806161";
    }
  };

  const getLayoutStyles = () => {
    switch (layout) {
      case "sidebar":
        return "w-full min-h-[250px] my-4"; 
      case "banner":
        return "w-full min-h-[90px] md:min-h-[100px] my-6";
      case "multiplex":
        return "w-full min-h-[280px] my-8";
      case "in-article":
        return "w-full min-h-[250px] my-8";
      default:
        return "w-full min-h-[250px]";
    }
  };

  const getAdFormat = () => {
    switch (layout) {
      case "sidebar":
        return "vertical, rectangle";
      case "banner":
        return "horizontal";
      case "multiplex":
        return "autorelaxed";
      case "in-article":
        return "fluid";
      default:
        return "auto";
    }
  };

  return (
    <div className={`adsense-container text-center overflow-hidden flex flex-col items-center justify-center ${getLayoutStyles()} ${className}`}>
      <span className="block text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
        Advertisement
      </span>
      {layout === "in-article" ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format={getAdFormat()}
          data-ad-client={adClient}
          data-ad-slot={getSlotId()}
        />
      ) : layout === "multiplex" ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={getSlotId()}
          data-ad-format={getAdFormat()}
        />
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={getSlotId()}
          data-ad-format={getAdFormat()}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};

export default AdSensePlaceholder;
