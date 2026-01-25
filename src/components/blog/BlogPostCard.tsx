import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/blogData";

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
  featured?: boolean;
}

const BlogPostCard = ({ post, index, featured = false }: BlogPostCardProps) => {
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="col-span-full lg:col-span-2 group"
      >
        <Link to={`/blog/${post.id}`} className="block">
          <div className="relative bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto lg:h-full bg-secondary relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:bg-gradient-to-r" />
                <span className="absolute top-4 left-4 px-4 py-1.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                  Featured
                </span>
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <span className="text-accent text-sm font-medium mb-3">{post.category}</span>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-6 line-clamp-3 text-base">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="text-accent font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/blog/${post.id}`} className="block h-full">
        <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-all duration-300 h-full flex flex-col hover:shadow-lg hover:shadow-accent/5">
          <div className="aspect-video bg-secondary relative overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col">
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
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
            <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
              Read More
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogPostCard;
