import React from "react";
import { Link } from "react-router-dom";
import TableOfContents, { extractHeadings } from "./TableOfContents";
import AdSensePlaceholder from "./AdSensePlaceholder";
export interface MedOrthoWikiArticle {
  id: string;
  category: string;
  title: string;
  content: string;
  references: string[];
  lastUpdated: string;
}

interface MedOrthoArticleProps {
  article: MedOrthoWikiArticle;
}

export const renderWikiContent = (content: string) => {
  // A simple hacky markdown parser since we don't have react-markdown installed.
  // It handles headers (## and ###) and links [Text](url).
  // Also handles paragraphs.
  
  const lines = content.split('\\n');
  const elements: React.ReactNode[] = [];
  
  let paragraphBuffer: string[] = [];

  const flushParagraph = (key: number) => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ');
      elements.push(
        <p key={`p-${key}`} className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
          {renderTextWithLinks(text)}
        </p>
      );
      paragraphBuffer = [];
    }
  };

  const renderTextWithLinks = (text: string) => {
    const parts = text.split(/(\\[.*?\\]\\(.*?\\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/\\[(.*?)\\]\\((.*?)\\)/);
      if (linkMatch) {
        return (
          <Link 
            key={i} 
            to={linkMatch[2]} 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {linkMatch[1]}
          </Link>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  let elementKey = 0;
  
  lines.forEach((line) => {
    const h2Match = line.match(/^##\\s+(.+)$/);
    const h3Match = line.match(/^###\\s+(.+)$/);
    
    if (h2Match) {
      flushParagraph(elementKey++);
      const title = h2Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h2 key={`h2-${elementKey++}`} id={id} className="text-3xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 scroll-mt-24">
          {title}
        </h2>
      );
    } else if (h3Match) {
      flushParagraph(elementKey++);
      const title = h3Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h3 key={`h3-${elementKey++}`} id={id} className="text-xl font-bold mt-6 mb-3 scroll-mt-24">
          {title}
        </h3>
      );
    } else if (line.trim() === '') {
      flushParagraph(elementKey++);
    } else {
      paragraphBuffer.push(line);
    }
  });

  flushParagraph(elementKey);

  // Inject AdSense every 2 headings just as a simple demo
  const finalElements: React.ReactNode[] = [];
  let h2Count = 0;
  elements.forEach((el: any) => {
    finalElements.push(el);
    if (el.type === 'h2') {
      h2Count++;
      if (h2Count % 2 === 0) {
        finalElements.push(
          <AdSensePlaceholder key={`ad-${h2Count}`} layout="in-article" />
        );
      }
    }
  });

  return finalElements;
};

const MedOrthoArticle: React.FC<MedOrthoArticleProps> = ({ article }) => {
  return (
    <article className="font-serif lg:font-sans">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-6">
          <span>Category: <strong className="text-gray-700 dark:text-gray-300">{article.category}</strong></span>
          <span>•</span>
          <span>Last Updated: {article.lastUpdated}</span>
        </div>
      </div>

      <AdSensePlaceholder layout="banner" className="mb-8" />

      <TableOfContents content={article.content} />

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {renderWikiContent(article.content)}
      </div>

      {article.references && article.references.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4">References</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            {article.references.map((ref, idx) => (
              <li key={idx} className="leading-relaxed">{ref}</li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
};

export default MedOrthoArticle;
