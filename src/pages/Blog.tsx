import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Clock, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

// Placeholder blog posts - in future, these would come from database
const blogPosts = [
  {
    id: "how-to-score-330-neet-biology",
    title: "How to Score 330+ in NEET Biology - Complete Strategy",
    excerpt: "Biology carries 360 marks in NEET. Learn the proven strategies used by toppers to score 330+ in Biology section with proper time management and NCERT mastery.",
    category: "NEET Preparation",
    date: "2026-01-20",
    readTime: "8 min read",
    author: "Exam Essentials Team",
    image: "/og-image.png"
  },
  {
    id: "best-handwritten-notes-class-12-biology",
    title: "Best Handwritten Notes for Class 12 Biology - 2025 Edition",
    excerpt: "Discover why handwritten notes are preferred by NEET toppers and how our Class 12 Biology notes can help you master the subject efficiently.",
    category: "Study Tips",
    date: "2026-01-18",
    readTime: "5 min read",
    author: "Exam Essentials Team",
    image: "/og-image.png"
  },
  {
    id: "class-11-physics-notes-quick-revision",
    title: "Class 11 Physics Notes PDF for Quick Revision",
    excerpt: "Complete guide to effective Physics revision using handwritten notes. Includes tips for memorizing formulas, understanding concepts, and solving numericals.",
    category: "Class 11",
    date: "2026-01-15",
    readTime: "6 min read",
    author: "Exam Essentials Team",
    image: "/og-image.png"
  },
  {
    id: "chapter-wise-neet-revision-strategy",
    title: "Chapter-wise NEET Revision Strategy - 90 Day Plan",
    excerpt: "A detailed 90-day revision plan for NEET covering all subjects chapter by chapter. Includes daily schedules and revision techniques.",
    category: "NEET Preparation",
    date: "2026-01-12",
    readTime: "10 min read",
    author: "Exam Essentials Team",
    image: "/og-image.png"
  }
];

const categories = ["All", "NEET Preparation", "Study Tips", "Class 11", "Class 12", "JEE Preparation"];

const Blog = () => {
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

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Exam Essentials Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Expert study tips, preparation strategies, and insights from toppers to help you ace your exams. 
              Learn the right way to study for CBSE boards, NEET, and JEE.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All" 
                    ? "bg-foreground text-background" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-colors group"
              >
                <div className="aspect-video bg-secondary relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-12 bg-secondary/30 rounded-xl border border-border"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2">More Articles Coming Soon!</h3>
            <p className="text-muted-foreground mb-4">
              We're working on more helpful content for your exam preparation.
            </p>
            <Button asChild variant="outline">
              <Link to="/products">Browse Study Materials</Link>
            </Button>
          </motion.div>

          {/* Internal Links */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
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
