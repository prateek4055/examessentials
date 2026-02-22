import { useState, useEffect } from "react";
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
import { blogPosts as staticBlogPosts, BlogPost, categories } from "@/lib/blogData";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>(staticBlogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database posts to BlogPost format
        const dbPosts: BlogPost[] = data.map((post) => ({
          id: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          date: post.created_at.split("T")[0],
          readTime: post.read_time,
          author: post.author,
          image: post.image_url || "/og-image.png",
          featured: post.featured,
          content: post.content,
        }));
        // Combine database posts with static posts (DB posts first)
        const combinedPosts = [...dbPosts, ...staticBlogPosts.filter(
          (sp) => !dbPosts.some((dp) => dp.id === sp.id)
        )];
        setPosts(combinedPosts);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      // Keep static posts as fallback
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

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
        "logo": {
          "@type": "ImageObject",
          "url": "https://examessentials.in/logo.png",
          "width": 200,
          "height": 200
        }
      },
      "blogPost": posts.slice(0, 10).map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "url": `https://examessentials.in/blog/${post.id}`,
        "datePublished": post.date,
        "author": {
          "@type": "Organization",
          "name": post.author
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://examessentials.in/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://examessentials.in/blog" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best study tips for NEET preparation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Focus on NCERT textbooks, practice previous year questions, create handwritten notes for revision, and maintain a consistent study schedule. Biology should be your strongest subject as it carries 360 marks."
          }
        },
        {
          "@type": "Question",
          "name": "How can handwritten notes help in exam preparation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Handwritten notes improve memory retention by 40% compared to typed notes. They engage motor memory, encourage active processing of information, and serve as excellent revision material before exams."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best strategy for Class 12 board exams?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Start with NCERT textbooks, solve previous year papers, create subject-wise notes, practice sample papers under timed conditions, and revise regularly. Focus on high-weightage chapters first."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://examessentials.in",
      "name": "Exam Essentials",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://examessentials.in/blog?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <>
      <SEOHead
        title="Study Tips & Exam Preparation Blog | NEET, JEE, CBSE"
        description="Expert study tips, NEET & JEE preparation strategies, and CBSE board exam guides. Learn from toppers with proven methods to score 95%+ in exams."
        canonical="/blog"
        keywords="NEET study tips, JEE preparation strategy, CBSE board exam tips, class 12 study tips, how to score 95 in boards, NEET biology strategy, handwritten notes benefits, topper study schedule, exam preparation guide 2025"
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

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
            </div>
          ) : (
            <>
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
            </>
          )}

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
