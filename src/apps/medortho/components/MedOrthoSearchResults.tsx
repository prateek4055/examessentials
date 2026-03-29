import React from "react";
import MedOrthoArticleCard from "./MedOrthoArticleCard";
import { Search, Info } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  slug: string;
}

interface MedOrthoSearchResultsProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
}

const MedOrthoSearchResults: React.FC<MedOrthoSearchResultsProps> = ({ 
  query, 
  results, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Searching Wiki...</p>
      </div>
    );
  }

  if (results.length === 0 && query !== "") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No articles found for &quot;{query}&quot;
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
          Try searching for different keywords like &quot;Lachman Test&quot;, &quot;ACL&quot; or &quot;Anterior Cruciate Ligament&quot;.
        </p>
        <div className="flex items-center gap-2 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 max-w-sm">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700/80 dark:text-blue-400/80 text-left">
            Check your spelling or try broader terms if you can&apos;t find what you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Search Results ({results.length})
        </h2>
        <div className="h-0.5 flex-grow mx-6 bg-gradient-to-r from-blue-100 to-transparent dark:from-blue-900/30"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
        {results.map((result) => (
          <MedOrthoArticleCard
            key={result.id}
            title={result.title}
            category={result.category}
            excerpt={result.excerpt}
            slug={result.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default MedOrthoSearchResults;
