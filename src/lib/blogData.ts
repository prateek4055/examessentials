export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  featured?: boolean;
  content: string;
}

export const blogPosts: BlogPost[] = [];

export const categories = ["All", "MedOrtho", "MedNeuro", "MedCardio", "MedPhysio", "MedRadio", "MedPharma"];

export const CategoryColors: Record<string, string> = {
  "MedOrtho": "#4DA6FF", // Blue
  "MedNeuro": "#A855F7", // Purple
  "MedCardio": "#BE185D", // Pink
  "MedPhysio": "#84CC16", // Green
  "MedRadio": "#2DD4BF", // Teal
  "MedPharma": "#7C3AED", // Violet
  "default": "#4DA6FF"
};

export const getCategoryColor = (category: string): string => {
  return CategoryColors[category] || CategoryColors["default"];
};
