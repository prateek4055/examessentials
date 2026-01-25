import { motion } from "framer-motion";
import { categories } from "@/lib/blogData";

interface BlogCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const BlogCategories = ({ selectedCategory, onCategoryChange }: BlogCategoriesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap justify-center gap-2 mb-12"
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === category 
              ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" 
              : "bg-secondary text-foreground hover:bg-secondary/80 hover:scale-105"
          }`}
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
};

export default BlogCategories;
