import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, Video, Users } from "lucide-react";
import { useState } from "react";
import MathDoodleBackground from "./MathDoodleBackground";

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
      color: "bg-brand-red",
      link: "/products",
    },
    {
      icon: Video,
      label: "Video Lectures",
      color: "bg-brand-red",
      link: "/products",
    },
    {
      icon: Users,
      label: "Students Shop",
      color: "bg-brand-red",
      link: "/products",
    },
  ];

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
      {/* Math Doodle Background */}
      <MathDoodleBackground />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft curved lines */}
        <svg
          className="absolute top-1/3 left-1/4 w-64 h-64 opacity-20"
          viewBox="0 0 200 200"
        >
          <path
            d="M 20 100 Q 100 20 180 100 Q 100 180 20 100"
            fill="none"
            stroke="hsl(var(--brand-green))"
            strokeWidth="3"
          />
        </svg>
        <svg
          className="absolute bottom-1/4 right-1/4 w-48 h-48 opacity-20"
          viewBox="0 0 200 200"
        >
          <path
            d="M 20 100 Q 100 20 180 100 Q 100 180 20 100"
            fill="none"
            stroke="hsl(var(--brand-pink))"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            The Best Notes For You
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10"
          >
            Unlock your Full potential with our Most Engaging Notes & Score High
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

          {/* Boost Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-accent-foreground font-body font-semibold"
          >
            <span>Boost Your Marks</span>
            <span className="text-xl">97%</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;