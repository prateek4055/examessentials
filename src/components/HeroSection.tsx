import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Target } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-blue/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink animate-pulse" />
            <span className="text-sm font-body text-muted-foreground">
              Trusted by 1000+ students
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Premium{" "}
            <span className="gradient-text">Handwritten Notes</span>
            <br />
            for Class 11 & 12
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Exam-focused, beautifully organized notes that help you understand,
            remember, and score better. Made by toppers, for toppers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button asChild variant="gradient" size="xl">
              <Link to="/products?class=11">
                View Class 11 Notes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/products?class=12">
                View Class 12 Notes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Features Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              {
                icon: Target,
                title: "Exam Focused",
                desc: "Only what matters for your exams",
              },
              {
                icon: BookOpen,
                title: "Crystal Clear",
                desc: "Handwritten for better retention",
              },
              {
                icon: Clock,
                title: "Time Saving",
                desc: "Learn faster, score higher",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50"
              >
                <div className="p-2 rounded-lg bg-secondary">
                  <feature.icon className="w-5 h-5 text-gold" />
                </div>
                <div className="text-left">
                  <p className="font-body font-medium text-foreground text-sm">
                    {feature.title}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
