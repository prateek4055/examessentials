import React from "react";

interface AdSensePlaceholderProps {
  layout: "sidebar" | "banner" | "in-article";
  className?: string;
}

const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({ layout, className = "" }) => {
  // In a real application, this would render actual Google AdSense tags or another ad network's script tags.
  // For the UI, we just render a clean placeholder.
  
  const getLayoutStyles = () => {
    switch (layout) {
      case "sidebar":
        return "w-full aspect-[300/250] md:aspect-[300/600]"; 
      case "banner":
        return "w-full h-[90px] md:h-[120px]";
      case "in-article":
        return "w-full h-[250px] my-8";
      default:
        return "w-full h-[250px]";
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden relative ${getLayoutStyles()} ${className}`}
    >
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold rounded">
        Advertisement
      </div>
      <div className="text-gray-400 dark:text-gray-500 font-medium">
        Ad Slot ({layout})
      </div>
    </div>
  );
};

export default AdSensePlaceholder;
