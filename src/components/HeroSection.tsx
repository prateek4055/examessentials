import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, Brain, PenTool } from "lucide-react";
import { useState } from "react";
import heroBackground from "@/assets/hero-background.png";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categoryIcons = [
    {
      icon: FileText,
      label: "Formula Sheet",
      color: "bg-blue-500",
      link: "/products?category=formula-sheet",
    },
    {
      icon: Brain,
      label: "Mindmaps",
      color: "bg-purple-500",
      link: "/products?category=mindmaps",
    },
    {
      icon: PenTool,
      label: "Handwritten Notes",
      color: "bg-green-500",
      link: "/products?category=handwritten-notes",
    },
  ];

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />


      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            Exam Essentials
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10"
          >
            <span className="gradient-text text-2xl md:text-3xl">&nbsp;Handwritten Notes&nbsp;</span> That Make Learning Simple
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mb-12"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pr-14"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-foreground text-background rounded-full hover:opacity-80 transition-opacity"
            >
              <Search className="w-5 h-5" />
            </button>
          </motion.form>

          {/* Category Icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            {categoryIcons.map((category, index) => (
              <Link
                key={category.label}
                to={category.link}
                className="category-icon group"
              >
                <div
                  className={`p-3 rounded-full ${category.color} text-accent-foreground group-hover:scale-110 transition-transform`}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <span className="font-body text-sm font-medium text-foreground">
                  {category.label}
                </span>
              </Link>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;