import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from "lucide-react";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { blogPosts as staticBlogPosts, BlogPost } from "@/lib/blogData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (slug: string) => {
    setLoading(true);
    try {
      // First try to fetch from database
      const { data: dbPost, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (dbPost) {
        const mappedPost: BlogPost = {
          id: dbPost.slug,
          title: dbPost.title,
          excerpt: dbPost.excerpt,
          category: dbPost.category,
          date: dbPost.created_at.split("T")[0],
          readTime: dbPost.read_time,
          author: dbPost.author,
          image: dbPost.image_url || "/og-image.png",
          featured: dbPost.featured,
          content: dbPost.content,
        };
        setPost(mappedPost);

        // Fetch related posts from database
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("category", dbPost.category)
          .eq("published", true)
          .neq("slug", slug)
          .limit(3);

        if (relatedData && relatedData.length > 0) {
          setRelatedPosts(relatedData.map((p) => ({
            id: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            date: p.created_at.split("T")[0],
            readTime: p.read_time,
            author: p.author,
            image: p.image_url || "/og-image.png",
            featured: p.featured,
            content: p.content,
          })));
        } else {
          // Fall back to static related posts
          const staticRelated = staticBlogPosts
            .filter(p => p.category === dbPost.category && p.id !== slug)
            .slice(0, 3);
          setRelatedPosts(staticRelated);
        }
      } else {
        // Fall back to static posts
        const staticPost = staticBlogPosts.find(p => p.id === slug);
        if (staticPost) {
          setPost(staticPost);
          const staticRelated = staticBlogPosts
            .filter(p => p.category === staticPost.category && p.id !== slug)
            .slice(0, 3);
          setRelatedPosts(staticRelated);
        }
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      // Fall back to static posts
      const staticPost = staticBlogPosts.find(p => p.id === id);
      if (staticPost) {
        setPost(staticPost);
        const staticRelated = staticBlogPosts
          .filter(p => p.category === staticPost.category && p.id !== id)
          .slice(0, 3);
        setRelatedPosts(staticRelated);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Generate keyword-rich description for SEO
  const generateKeywords = (post: BlogPost) => {
    const baseKeywords = [
      post.category.toLowerCase(),
      "study tips",
      "exam preparation",
      "NEET preparation",
      "CBSE notes",
      "class 11 notes",
      "class 12 notes",
      "handwritten notes",
      "board exam tips"
    ];
    
    // Extract keywords from title
    const titleKeywords = post.title.toLowerCase()
      .split(/[\s-]+/)
      .filter(word => word.length > 3 && !["with", "from", "that", "this", "your", "what", "best"].includes(word));
    
    return [...new Set([...titleKeywords, ...baseKeywords])].join(", ");
  };

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://examessentials.in/blog/${post.id}`
      },
      "headline": post.title,
      "description": post.excerpt,
      "image": {
        "@type": "ImageObject",
        "url": post.image.startsWith("http") ? post.image : `https://examessentials.in${post.image}`,
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Organization",
        "name": post.author,
        "url": "https://examessentials.in/about"
      },
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
      "datePublished": post.date,
      "dateModified": post.date,
      "articleSection": post.category,
      "wordCount": post.content.split(/\s+/).length,
      "keywords": generateKeywords(post)
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://examessentials.in/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://examessentials.in/blog" },
        { "@type": "ListItem", "position": 3, "name": post.category, "item": `https://examessentials.in/blog?category=${encodeURIComponent(post.category)}` },
        { "@type": "ListItem", "position": 4, "name": post.title, "item": `https://examessentials.in/blog/${post.id}` }
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

  // Convert markdown-like content to HTML with XSS sanitization
  const renderContent = (content: string) => {
    const rawHtml = content
      .split('\n')
      .map((line) => {
        // Headers
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
        // Horizontal rule
        if (line.trim() === '---') return '<hr/>';
        // Bold
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Links - sanitize href to prevent javascript: URLs
        processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
          // Only allow http, https, mailto, and relative URLs
          const sanitizedUrl = url.trim();
          if (sanitizedUrl.startsWith('javascript:') || 
              sanitizedUrl.startsWith('data:') || 
              sanitizedUrl.startsWith('vbscript:')) {
            return text; // Return just the text without the link
          }
          return `<a href="${sanitizedUrl}" class="text-accent hover:underline">${text}</a>`;
        });
        // List items
        if (processed.trim().startsWith('- ')) {
          return `<li>${processed.trim().slice(2)}</li>`;
        }
        if (/^\d+\.\s/.test(processed.trim())) {
          return `<li>${processed.trim().replace(/^\d+\.\s/, '')}</li>`;
        }
        // Tables (basic support)
        if (processed.includes('|')) {
          return ''; // Skip table syntax for now
        }
        // Empty line
        if (processed.trim() === '') return '<br/>';
        // Regular paragraph
        return `<p>${processed}</p>`;
      })
      .join('\n');

    // Sanitize the HTML output to prevent XSS attacks
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['h2', 'h3', 'p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'br', 'hr'],
      ALLOWED_ATTR: ['href', 'class'],
      ALLOW_DATA_ATTR: false
    });
  };

  // Generate SEO-optimized title under 60 chars
  const seoTitle = post.title.length > 50 
    ? `${post.title.slice(0, 47)}...` 
    : post.title;

  // Generate rich keywords
  const seoKeywords = generateKeywords(post);

  return (
    <>
      <SEOHead
        title={`${seoTitle} | Exam Essentials`}
        description={post.excerpt.length > 155 ? `${post.excerpt.slice(0, 152)}...` : post.excerpt}
        canonical={`/blog/${post.id}`}
        ogType="article"
        ogImage={post.image.startsWith("http") ? post.image : `https://examessentials.in${post.image}`}
        keywords={seoKeywords}
        structuredData={structuredData}
      />

      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-background">
        <article className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </nav>

          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-accent text-accent-foreground text-sm font-medium rounded-full mb-6">
              {post.category}
            </span>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              {post.excerpt}
            </p>

            {/* Featured Image */}
            {post.image && post.image !== "/og-image.png" && (
              <div className="aspect-video rounded-xl overflow-hidden bg-secondary mb-8">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-border">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-display prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:marker:text-accent prose-li:my-1
                prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground prose-blockquote:italic
                prose-hr:border-border prose-hr:my-8"
              dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
            />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent rounded-2xl border border-accent/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Ready to Boost Your Preparation?
                </h3>
                <p className="text-muted-foreground">
                  Get comprehensive handwritten notes designed by toppers for quick revision and better retention.
                </p>
              </div>
              <Button asChild variant="accent" size="lg">
                <Link to="/products">Browse Notes</Link>
              </Button>
            </div>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-6xl mx-auto mt-16"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="group bg-card rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-colors"
                  >
                    <div className="aspect-video bg-secondary overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-accent font-medium">{relatedPost.category}</span>
                      <h3 className="font-display text-base font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-accent transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPostPage;
