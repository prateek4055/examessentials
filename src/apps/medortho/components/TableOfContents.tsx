import React from "react";

interface TOCNode {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export const extractHeadings = (content: string): TOCNode[] => {
  const lines = content.split('\\n');
  const headings: TOCNode[] = [];
  
  lines.forEach(line => {
    const match = line.match(/^(#{2,3})\\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, title, level });
    }
  });
  
  return headings;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ content, className = "" }) => {
  const headings = extractHeadings(content);
  
  if (headings.length === 0) return null;

  return (
    <div className={`bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-lg inline-block min-w-[250px] mb-8 ${className}`}>
      <h3 className="font-bold text-lg mb-3 border-b border-gray-200 dark:border-zinc-800 pb-2">Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading, idx) => (
          <li 
            key={idx} 
            className={`${heading.level === 3 ? "ml-4 text-sm" : "font-medium"} text-blue-600 dark:text-blue-400 hover:underline`}
          >
            <a href={`#${heading.id}`}>{heading.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
