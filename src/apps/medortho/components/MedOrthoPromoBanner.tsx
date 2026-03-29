import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedOrthoPromoBannerProps {
  className?: string;
}

const MedOrthoPromoBanner: React.FC<MedOrthoPromoBannerProps> = ({ className = "" }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden ${className}`}>
      {/* Decorative background elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Mockup Placeholder */}
        <div className="w-32 h-40 bg-zinc-800 rounded-xl mb-4 shadow-2xl border-4 border-zinc-700 flex items-center justify-center overflow-hidden relative">
           <div className="absolute top-0 w-12 h-3 bg-zinc-700 rounded-b-lg"></div>
           <span className="text-zinc-500 font-bold text-sm">3D App View</span>
        </div>

        <h3 className="text-xl font-bold mb-2 leading-tight">Mastering Orthopedics?</h3>
        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
          Download the MedOrtho App for Interactive 3D Models & Quizzes.
        </p>

        <a href="#" target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full bg-white text-blue-900 hover:bg-gray-100 font-bold shadow-lg">
            <Download className="w-4 h-4 mr-2" />
            Get it on Google Play
          </Button>
        </a>
      </div>
    </div>
  );
};

export default MedOrthoPromoBanner;
