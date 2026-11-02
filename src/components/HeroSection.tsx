import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Star, ShieldCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

import lungsDoodle from "@/assets/doodles/lungs.webp";
import heartDoodle from "@/assets/doodles/heart.webp";
import brainDoodle from "@/assets/doodles/brain.webp";
import prismDoodle from "@/assets/doodles/prism.webp";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-20 bg-background">
      {/* Clean Ambient Lighting & Soft Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[130px] pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.12), transparent 70%)"
          }}
        />
        <div 
          className="absolute top-1/2 -left-20 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.25), transparent 70%)"
          }}
        />
        <div 
          className="absolute bottom-10 -right-20 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.2), transparent 70%)"
          }}
        />

        {/* Elegant Floating Doodles */}
        <div className="hidden lg:block absolute left-[6%] top-[22%] w-24 h-24 opacity-35 doodle-float pointer-events-none">
          <img src={brainDoodle} alt="" className="w-full h-full object-contain filter drop-shadow-sm" loading="lazy" />
        </div>
        <div className="hidden lg:block absolute right-[7%] top-[18%] w-24 h-24 opacity-35 doodle-float pointer-events-none" style={{ animationDelay: "-2.5s" }}>
          <img src={heartDoodle} alt="" className="w-full h-full object-contain filter drop-shadow-sm" loading="lazy" />
        </div>
        <div className="hidden lg:block absolute left-[8%] bottom-[12%] w-20 h-20 opacity-30 doodle-float pointer-events-none" style={{ animationDelay: "-4s" }}>
          <img src={prismDoodle} alt="" className="w-full h-full object-contain filter drop-shadow-sm" loading="lazy" />
        </div>
        <div className="hidden lg:block absolute right-[8%] bottom-[15%] w-20 h-20 opacity-30 doodle-float pointer-events-none" style={{ animationDelay: "-1.5s" }}>
          <img src={lungsDoodle} alt="" className="w-full h-full object-contain filter drop-shadow-sm" loading="lazy" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Apple Pill Badge with Shimmer Rim */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl bg-white/75 dark:bg-black/50 border border-black/[0.08] dark:border-white/[0.12] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:border-primary/40 transition-all cursor-pointer group"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-foreground/85 uppercase">
              Next-Gen Learning Platform
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore 2026 Ecosystem <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Precision Apple Typography Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-tight text-foreground leading-[1.08] mb-6"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
            }}
          >
            Master High-Stakes Exams.{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Zero Fluff.
            </span>
          </motion.h1>

          {/* Refined Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-normal leading-relaxed tracking-normal"
          >
            Curated medical notes, gold-standard NTA mocks, and focused exam
            essentials engineered for NEET, JEE & Medical Specialists.
          </motion.p>

          {/* Action CTAs: Apple Studio Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Button
              asChild
              size="lg"
              className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <a href="#ecosystem" className="flex items-center gap-2">
                <span>Explore Ecosystem</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide backdrop-blur-xl bg-white/60 dark:bg-white/5 border-black/[0.1] dark:border-white/[0.15] text-foreground hover:bg-white/90 hover:border-black/[0.2] hover:-translate-y-0.5 active:translate-y-0 shadow-sm transition-all duration-200"
            >
              <Link to="/products" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Browse Notes & Posters</span>
              </Link>
            </Button>
          </motion.div>

          {/* Apple Trust Indicator Floating Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-3 px-6 rounded-2xl backdrop-blur-md bg-white/50 dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08]"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground/80">4.9/5 Rating</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-border" />

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-muted-foreground">100% NCERT & NMC Verified</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-border" />

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-medium text-muted-foreground">11+ Specialized Medical Apps</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
