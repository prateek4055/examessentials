import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { blogPosts, categories, getCategoryColor } from "@/lib/blogData";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    if (initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col font-sans">
      <SEOHead
        title="Medical Resources & Articles Blog"
        description="Premium educational articles for medical students and professionals. Read about orthopedic tests, neurology exams, and more."
        canonical="/blog"
        keywords="medical blog, orthopedic test, neurology exam, medical students"
      />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#CBD5E1] mb-12">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-[#4DA6FF]" />
          <span className="text-white">Articles</span>
        </nav>

        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Latest <span style={{ color: getCategoryColor(selectedCategory) }}>Articles</span>
          </h1>
          <p className="text-lg text-[#CBD5E1] leading-relaxed">
            Demystifying complex medical concepts. Discover simplified clinical explanations, premium study guides, and actionable techniques for students.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                selectedCategory === category
                  ? "shadow-lg bg-opacity-20 translate-y-[-2px]"
                  : "bg-[#121826] text-[#CBD5E1] hover:bg-[#1A2333] hover:text-white border-white/5"
              }`}
              style={selectedCategory === category ? { 
                backgroundColor: `${getCategoryColor(category)}26`,
                color: getCategoryColor(category),
                borderColor: `${getCategoryColor(category)}80`,
                boxShadow: `0 8px 24px -8px ${getCategoryColor(category)}55`
              } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#121826] border border-white/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1"
                style={{ 
                  ["--hover-shadow" as any]: `0 8px 32px -8px ${getCategoryColor(post.category)}33`,
                  ["--hover-border" as any]: `${getCategoryColor(post.category)}4d`
                } as any}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-[#0A0F1C]">
                  <div className="absolute inset-0 bg-[#0A0F1C]/20 z-10 transition-opacity group-hover:opacity-0" />
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559757175-9e351c9a1301?w=800&q=80";
                    }}
                  />
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 z-20">
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg"
                      style={{ 
                        backgroundColor: `${getCategoryColor(post.category)}26`,
                        color: getCategoryColor(post.category),
                        borderColor: `${getCategoryColor(post.category)}40`
                      }}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-4 text-xs text-[#CBD5E1] mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-[#4DA6FF] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#CBD5E1] text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <Link 
                    to={`/blog/${post.id}`}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold group/btn transition-colors hover:text-white"
                    style={{ color: getCategoryColor(post.category) }}
                  >
                    Read Article 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-[#CBD5E1] bg-[#121826]/50 rounded-3xl border border-white/5 max-w-2xl mx-auto mb-12">
            <p className="text-xl font-medium mb-2">No articles found in this category yet.</p>
            <p className="text-[#94A3B8]">We are strictly adding verified medical articles. Stay tuned!</p>
            <button 
              onClick={() => handleCategoryChange("All")}
              className="mt-6 text-[#4DA6FF] hover:underline transition-all"
            >
              View All Articles
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
