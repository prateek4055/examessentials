import { motion } from "framer-motion";
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react";

const stats = [
  { icon: FileText, value: "50+", label: "Articles" },
  { icon: Users, value: "10K+", label: "Readers" },
  { icon: BookOpen, value: "6", label: "Categories" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
];

const BlogHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-3xl -z-10" />
      
      <div className="text-center py-12 px-6 lg:py-16 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6"
        >
          <BookOpen className="w-4 h-4" />
          <span>Expert Study Tips & Strategies</span>
        </motion.div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Exam Essentials
          <span className="block text-accent mt-2">Knowledge Hub</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Expert study tips, preparation strategies, and insights from NEET & JEE toppers. 
          Learn the proven methods to ace your exams and achieve your dream scores.
        </p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card/50 backdrop-blur border border-border rounded-xl p-4 hover:border-accent/30 transition-colors"
            >
              <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogHero;
