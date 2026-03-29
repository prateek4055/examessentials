import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MedOrthoSidebar from "../components/MedOrthoSidebar";
import MedOrthoPromoBanner from "../components/MedOrthoPromoBanner";
import AdSensePlaceholder from "../components/AdSensePlaceholder";

interface MedOrthoLayoutProps {
  children: React.ReactNode;
}

const MedOrthoLayout: React.FC<MedOrthoLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0F] text-gray-900 dark:text-white flex flex-col font-sans">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-bold text-lg text-blue-700 dark:text-blue-400">MedOrtho Wiki</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <MedOrthoSidebar className="h-full pt-16 lg:pt-4" />
      </div>

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        {/* Desktop Left Sidebar (Sticky) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-0 h-screen">
          <MedOrthoSidebar />
        </aside>

        {/* Center Main Content */}
        <main className="flex-1 flex flex-col min-w-0 pb-32 lg:pb-10">
          <div className="px-4 py-8 md:px-8 lg:px-12 max-w-4xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Desktop Right Sidebar (Sticky Monetization) */}
        <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-gray-200 dark:border-gray-800 p-6 space-y-8 bg-gray-50/50 dark:bg-gray-900/50">
          <MedOrthoPromoBanner />
          
          <div className="sticky top-6">
            <h4 className="text-xs uppercase font-bold text-gray-500 mb-3 tracking-wider text-center">Sponsored</h4>
            <AdSensePlaceholder layout="sidebar" />
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Bottom App Promo */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-xs">APP</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">MedOrtho App</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Interactive 3D Models</p>
            </div>
          </div>
          <a href="#" target="_blank" rel="noopener noreferrer">
             <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-5">
               Open App
             </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MedOrthoLayout;
