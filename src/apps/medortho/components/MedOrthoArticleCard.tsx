import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  title: string;
  category: string;
  excerpt: string;
  slug: string;
}

const MedOrthoArticleCard: React.FC<ArticleCardProps> = ({ 
  title, 
  category, 
  excerpt, 
  slug 
}) => {
  return (
    <Link 
      to={`/medortho/${slug}`}
      className="group block p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-none font-medium px-2.5 py-0.5 rounded-full text-xs">
            {category}
          </Badge>
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
          <span>Read Article</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </div>
      </div>
    </Link>
  );
};

export default MedOrthoArticleCard;
