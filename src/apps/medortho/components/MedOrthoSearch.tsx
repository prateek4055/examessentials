import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MedOrthoSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MedOrthoSearch: React.FC<MedOrthoSearchProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search for orthopedic conditions, tests, or anatomy..." 
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10">
        <Search className="w-full h-full" />
      </div>
      <Input
        id="wiki-search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 h-14 text-lg bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-md shadow-2xl rounded-2xl w-full focus-visible:ring-blue-500/30 text-white placeholder:text-white/30 transition-all duration-300 hover:border-white/20"
      />
    </div>
  );
};

export default MedOrthoSearch;
