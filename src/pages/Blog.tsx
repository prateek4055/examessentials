import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import BlogHero from "@/components/blog/BlogHero";
import BlogCategories from "@/components/blog/BlogCategories";
import BlogPostCard from "@/components/blog/BlogPostCard";
import BlogNewsletter from "@/components/blog/BlogNewsletter";
import { blogPosts } from "@/lib/blogData";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Exam Essentials Blog",
      "description": "Study tips, preparation strategies, and educational content for CBSE, NEET, and JEE students",
      "url": "https://examessentials.in/blog",
      "publisher": {
        "@type": "Organization",
        "name": "Exam Essentials",
        "logo": "https://examessentials.in/logo.png"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://examessentials.in/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://examessentials.in/blog" }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="Blog - Study Tips, NEET & JEE Preparation Strategies | Exam Essentials"
        description="Expert study tips, exam preparation strategies, and educational content for CBSE Class 11 & 12, NEET, and JEE students. Learn from toppers and score better."
        canonical="/blog"
        keywords="study tips, NEET preparation tips, JEE preparation strategy, class 12 study tips, how to study for boards, CBSE exam tips, handwritten notes benefits, topper study schedule"
        structuredData={structuredData}
      />

      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Blog</span>
          </nav>

          <BlogHero />
          <BlogCategories selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <BlogPostCard key={post.id} post={post} index={index} featured />
              ))}
            </div>
          )}

          {/* Regular Posts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {regularPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>

          <BlogNewsletter />

          {/* Internal Links */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Explore Our Notes</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/class-11-notes">Class 11 Notes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/class-12-notes">Class 12 Notes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/neet-notes">NEET Notes</Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
