import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ChevronDown, ChevronRight, BookOpen, Activity, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MedAppData } from "../data/medicalAppsData";

interface NavNode {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavNode[];
}

const WIKI_NAVIGATION: NavNode[] = [
  {
    title: "Anatomy",
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      { title: "Bones", path: "/blog?category=Med&q=Bones" },
      { title: "Joints", path: "/blog?category=Med&q=Joints" },
      { title: "Muscles", path: "/blog?category=Med&q=Muscles" },
      { title: "Ligaments", path: "/blog?category=Med&q=Ligaments" },
    ],
  },
  {
    title: "Pathologies",
    icon: <Activity className="w-4 h-4" />,
    children: [
      { title: "Fractures", path: "/blog?category=Med&q=Fracture" },
      { title: "Inflammation", path: "/blog?category=Med&q=Inflammation" },
      { title: "Chronic Conditions", path: "/blog?category=Med&q=Chronic" },
    ],
  },
  {
    title: "Clinical Assessments",
    icon: <Stethoscope className="w-4 h-4" />,
    children: [
      { title: "Examination", path: "/blog?category=Med&q=Examination" },
      { title: "Tests", path: "/blog?category=Med&q=Test" },
    ],
  },
];

const NavTreeItem = ({ node, level = 0, appId }: { node: NavNode; level?: number, appId: string }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const location = useLocation();

  const getPath = (originalPath?: string) => {
      if (!originalPath) return undefined;
      // Replace category with app name if needed, or keep it generic
      return originalPath.replace("category=Med", `category=${appId}`);
  };

  return (
    <div className="flex flex-col">
      <div 
        className={`flex items-center py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer ${level === 0 ? "font-semibold text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400 text-sm"}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && (
          <span className="mr-1">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {!hasChildren && <span className="mr-5 inline-block" />}
        
        {node.icon && <span className="mr-2 opacity-70">{node.icon}</span>}
        
        {node.path ? (
          <Link 
            to={getPath(node.path)!} 
            onClick={(e) => e.stopPropagation()} 
            className={`flex-1 hover:text-primary transition-colors ${location.search.includes(appId) && node.path && location.search.includes(node.path.split('q=')[1]) ? 'text-primary font-medium' : ''}`}
          >
            {node.title}
          </Link>
        ) : (
          <span className="flex-1">{node.title}</span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="flex flex-col mt-1">
          {node.children!.map((child, idx) => (
            <NavTreeItem key={idx} node={child} level={level + 1} appId={appId} />
          ))}
        </div>
      )}
    </div>
  );
};

interface MedWikiSidebarProps {
  app: MedAppData;
  className?: string;
}

const MedWikiSidebar: React.FC<MedWikiSidebarProps> = ({ app, className = "" }) => {
  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4" style={{ 
            backgroundImage: `linear-gradient(to right, ${app.theme.primary}, ${app.theme.accent})` 
        }}>
          {app.name} Wiki
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder={`Search ${app.name} Wiki...`} 
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      <nav className="flex-1">
        {WIKI_NAVIGATION.map((node, idx) => (
          <NavTreeItem key={idx} node={node} appId={app.id} />
        ))}
      </nav>
      
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-center text-gray-500">
          Medical Education Resource
        </p>
      </div>
    </div>
  );
};

export default MedWikiSidebar;
