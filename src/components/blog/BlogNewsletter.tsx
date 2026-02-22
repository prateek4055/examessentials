import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const BlogNewsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing! Check your email for confirmation.");
      setEmail("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/20 p-8 lg:p-12 mb-16"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/20 rounded-full mb-6">
          <Mail className="w-7 h-7 text-accent" />
        </div>
        
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
          Get Weekly Study Tips
        </h3>
        
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Subscribe to our newsletter for exclusive study strategies, exam tips, and updates on new notes. 
          Join 10,000+ students already learning with us.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-background/80 border-border focus:border-accent"
            required
          />
          <Button type="submit" variant="accent" className="gap-2">
            Subscribe
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </motion.div>
  );
};

export default BlogNewsletter;
