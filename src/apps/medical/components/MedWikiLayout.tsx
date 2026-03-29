import React, { useState } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import MedWikiSidebar from "./MedWikiSidebar";
import { MedAppData } from "../data/medicalAppsData";

interface MedWikiLayoutProps {
  app: MedAppData;
  children: React.ReactNode;
}

const MedWikiLayout: React.FC<MedWikiLayoutProps> = ({ app, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0F] text-gray-900 dark:text-white flex flex-col font-sans">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
          <span className="font-bold text-lg" style={{ color: app.theme.primary }}>{app.name} Wiki</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate(`/${app.slug}`)}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
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
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <MedWikiSidebar app={app} className="h-full pt-16 lg:pt-4" />
      </div>

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        {/* Desktop Left Sidebar (Sticky) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-0 h-screen">
          <MedWikiSidebar app={app} />
        </aside>

        {/* Center Main Content */}
        <main className="flex-1 flex flex-col min-w-0 pb-32 lg:pb-10">
          <div className="px-4 py-8 md:px-8 lg:px-12 max-w-4xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-between hidden lg:flex">
                <Link to={`/${app.slug}`} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to {app.name}
                </Link>
            </div>
            {children}
          </div>
        </main>

        {/* Desktop Right Sidebar (Optional placeholder for ads or promo) */}
        <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-gray-200 dark:border-gray-800 p-6 space-y-8 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <h3 className="font-bold text-lg mb-2" style={{ color: app.theme.primary }}>Download {app.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{app.tagline}</p>
              <Button className="w-full rounded-full" style={{ backgroundColor: app.theme.primary }}>Get the App</Button>
          </div>
          
          <div className="sticky top-6">
            <h4 className="text-xs uppercase font-bold text-gray-500 mb-3 tracking-wider text-center">Resources</h4>
            <div className="space-y-3">
                {app.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
                        <span className="font-semibold block mb-1">{f.title}</span>
                        <span className="text-xs text-muted-foreground">{f.description}</span>
                    </div>
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Bottom App Promo */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: app.theme.heroBg }}>
              <span className="text-white font-bold text-xs">APP</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{app.name} App</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Interactive Education</p>
            </div>
          </div>
          <Button size="sm" className="text-white font-bold rounded-full px-5" style={{ backgroundColor: app.theme.primary }}>
            Open App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedWikiLayout;
