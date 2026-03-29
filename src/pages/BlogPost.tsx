import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Clock, User, ArrowLeft, Share2, Twitter, Linkedin, Copy, ArrowRight } from "lucide-react";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { blogPosts, BlogPost, getCategoryColor } from "@/lib/blogData";
import { toast } from "sonner";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.id === id);
  const relatedPosts = post 
    ? blogPosts.filter(p => p.category === post.category && p.id !== id).slice(0, 3) 
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-[#CBD5E1] mb-8">The article you're looking for doesn't exist or was removed.</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4DA6FF] text-[#0A0F1C] rounded-full font-semibold hover:bg-[#3ba1ff] transition-colors"
            >
              Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
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

  const renderContent = (content: string) => {
    const rawHtml = content
      .split('\n')
      .map((line) => {
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
        if (line.trim() === '---') return '<hr/>';
        
        // Blockquotes
        if (line.trim().startsWith('> [!IMPORTANT]')) return `<div class="important-block"><strong>Important:</strong>`;
        if (line.trim().startsWith('> ')) return `<blockquote>${line.trim().slice(2)}</blockquote>`;
        
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
          const sanitizedUrl = url.trim();
          if (sanitizedUrl.startsWith('javascript:') || sanitizedUrl.startsWith('data:') || sanitizedUrl.startsWith('vbscript:')) {
            return text;
          }
          return `<a href="${sanitizedUrl}">${text}</a>`;
        });
        
        if (processed.trim().startsWith('- ')) return `<li>${processed.trim().slice(2)}</li>`;
        if (/^\d+\.\s/.test(processed.trim())) return `<li>${processed.trim().replace(/^\d+\.\s/, '')}</li>`;
        
        if (processed.includes('|')) return ''; 
        if (processed.trim() === '') return '<br/>';
        
        return `<p>${processed}</p>`;
      })
      .join('\n');

    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['h2', 'h3', 'p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'br', 'hr', 'blockquote', 'div'],
      ALLOWED_ATTR: ['href', 'class'],
      ALLOW_DATA_ATTR: false
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col font-sans">
      <SEOHead
        title={`${post.title} | Exam Essentials`}
        description={post.excerpt}
        canonical={`/blog/${post.id}`}
        ogType="article"
        ogImage={post.image.startsWith('http') ? post.image : `https://examessentials.in${post.image}`}
        keywords={`${post.category.toLowerCase()}, medical, studying, ${post.title.toLowerCase().split(' ').join(', ')}`}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image.startsWith('http') ? post.image : `https://examessentials.in${post.image}`,
            "author": {
              "@type": "Organization",
              "name": "Exam Essentials",
              "url": "https://examessentials.in"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Exam Essentials",
              "logo": {
                "@type": "ImageObject",
                "url": "https://examessentials.in/logo.png"
              }
            },
            "datePublished": post.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://examessentials.in/blog/${post.id}`
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://examessentials.in/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://examessentials.in/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://examessentials.in/blog/${post.id}`
              }
            ]
          }
        ]}
      />

      <Navbar />

      <main 
        className="flex-1 pt-32 pb-24"
        style={{ ["--accent-color" as any]: getCategoryColor(post.category) }}
      >
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb & Back */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-[#CBD5E1] hover:text-white transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <nav className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/blog" className="hover:text-white transition-colors">Articles</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white line-clamp-1">{post.title}</span>
            </nav>
          </div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span 
              className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full mb-6 border"
              style={{ 
                backgroundColor: `var(--accent-color)15`,
                color: `var(--accent-color)`,
                borderColor: `var(--accent-color)33`
              }}
            >
              {post.category}
            </span>
            
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            <p className="text-xl text-[#CBD5E1] mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10 mb-10">
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#CBD5E1]">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: "var(--accent-color)" }} />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: "var(--accent-color)" }} />
                  {new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: "var(--accent-color)" }} />
                  {post.readTime}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#CBD5E1] mr-2">Share:</span>
                <button onClick={handleShare} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#121826] hover:bg-[#1A2333] border border-white/5 text-white transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-[#121826] mb-12 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] border border-white/5">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559757175-9e351c9a1301?w=800&q=80";
                }}
              />
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
              prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-12 prose-h3:mb-6
              prose-p:text-[#E2E8F0] prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg
              prose-strong:text-white prose-strong:font-bold
              prose-a:text-[var(--accent-color)] prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-4
              prose-ul:my-8 prose-ol:my-8
              prose-li:text-[#E2E8F0] prose-li:my-3 prose-li:text-lg
              prose-li:marker:text-[var(--accent-color)]
              prose-blockquote:border-l-[4px] prose-blockquote:border-[var(--accent-color)] prose-blockquote:bg-[#121826] prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-white prose-blockquote:not-italic prose-blockquote:my-10
              prose-hr:border-white/10 prose-hr:my-16"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />
        </article>

        {/* Related Posts */}
          <div className="container mx-auto px-4 mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white mb-10 tracking-tight text-center">
              More from <span style={{ color: "var(--accent-color)" }}>{post.category}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-[#121826] border border-white/5 shadow-lg transition-all hover:-translate-y-1"
                  style={{ 
                    ["--card-hover-shadow" as any]: `0 8px 32px -8px ${getCategoryColor(relatedPost.category)}33`,
                    ["--card-hover-border" as any]: `${getCategoryColor(relatedPost.category)}4d`
                  } as any}
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#0A0F1C]/10 transition-opacity group-hover:opacity-0" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#CBD5E1] mb-3">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" style={{ color: getCategoryColor(relatedPost.category) }} /> {relatedPost.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" style={{ color: getCategoryColor(relatedPost.category) }} /> {relatedPost.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-white transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <div className="mt-auto pt-4">
                      <span 
                        className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: getCategoryColor(relatedPost.category) }}
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
