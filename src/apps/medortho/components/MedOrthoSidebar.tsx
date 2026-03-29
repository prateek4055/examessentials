import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ChevronRight, BookOpen, Activity, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";

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
      { title: "Bones", path: "/blog?category=MedOrtho&q=Bones" },
      { title: "Joints", path: "/blog?category=MedOrtho&q=Joints" },
      { title: "Muscles", path: "/blog?category=MedOrtho&q=Muscles" },
      { title: "Ligaments", path: "/blog?category=MedOrtho&q=Ligaments" },
    ],
  },
  {
    title: "Pathologies",
    icon: <Activity className="w-4 h-4" />,
    children: [
      { title: "Fractures", path: "/blog?category=MedOrtho&q=Fracture" },
      { title: "Tendinopathies", path: "/blog?category=MedOrtho&q=Tendinopathy" },
      { title: "Ligament Tears", path: "/blog?category=MedOrtho&q=Tear" },
    ],
  },
  {
    title: "Clinical Assessments",
    icon: <Stethoscope className="w-4 h-4" />,
    children: [
      { title: "Special Tests", path: "/blog?category=MedOrtho&q=Test" },
      { title: "Range of Motion", path: "/blog?category=MedOrtho&q=ROM" },
    ],
  },
];

const NavTreeItem = ({ node, level = 0 }: { node: NavNode; level?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

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
        
        {node.icon && <span className="mr-2 text-blue-600">{node.icon}</span>}
        
        {node.path ? (
          <Link to={node.path} onClick={(e) => e.stopPropagation()} className="flex-1 hover:text-blue-600 dark:hover:text-blue-400">
            {node.title}
          </Link>
        ) : (
          <span className="flex-1">{node.title}</span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="flex flex-col mt-1">
          {node.children!.map((child, idx) => (
            <NavTreeItem key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface MedOrthoSidebarProps {
  className?: string;
}

const MedOrthoSidebar: React.FC<MedOrthoSidebarProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          MedOrtho Wiki
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search Wiki..." 
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      <nav className="flex-1">
        {WIKI_NAVIGATION.map((node, idx) => (
          <NavTreeItem key={idx} node={node} />
        ))}
      </nav>
      
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-center text-gray-500">
          Last updated: Oct 2023
        </p>
      </div>
    </div>
  );
};

export default MedOrthoSidebar;
