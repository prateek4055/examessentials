import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Heart, Brain, Eye, Zap, FileText, BookOpen, GraduationCap,
  Activity, Stethoscope, Dumbbell, Hand, Waves, ClipboardList,
  Scan, Layers, FileImage, PenTool, Pill, GitBranch, Table, Lightbulb,
  ArrowRight, Download, Bell, ChevronRight, Sparkles, Star, Users, Shield,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MedAppData, MedAppFeature } from "../data/medicalAppsData";
import { getOtherApps } from "../data/medicalAppsData";
import { blogPosts } from "@/lib/blogData";
import MedOrthoSearch from "../../medortho/components/MedOrthoSearch";
import MedOrthoSearchResults from "../../medortho/components/MedOrthoSearchResults";
import { supabase } from "@/integrations/supabase/client";

// Icon mapping from string names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, Heart, Brain, Eye, Zap, FileText, BookOpen, GraduationCap,
  Activity, Stethoscope, Dumbbell, Hand, Waves, ClipboardList,
  Scan, Layers, FileImage, PenTool, Pill, GitBranch, Table, Lightbulb,
  Bone: Shield, // fallback
};

const FeatureIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = iconMap[name] || Sparkles;
  return <Icon className={className} />;
};

interface MedAppPageProps {
  app: MedAppData;
}

const MedAppPage = ({ app }: MedAppPageProps) => {
  const otherApps = getOtherApps(app.slug);
  const appArticles = blogPosts.filter(post => post.category === app.name);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim() === "") {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Query both tables in parallel
        const [blogReq, wikiReq] = await Promise.all([
          supabase
            .from("blog_posts")
            .select("id, title, category, excerpt, slug")
            .eq("published", true)
            .eq("category", app.name)
            .or(`title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
            .limit(15),
          (supabase as any)
            .from("articles")
            .select("id, title, category, content, slug, keywords")
            .eq("published", true)
            // Removed app.name filter for articles as they use sub-categories like "Anatomy"
            .or(`title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,keywords.ilike.%${searchQuery}%`)
            .limit(15)
        ]);

        const blogResults = blogReq.data || [];
        const wikiResults = (wikiReq.data || []).map((art: any) => ({
          id: art.id,
          title: art.title,
          category: art.category,
          // Generate an excerpt from content if not present
          excerpt: art.content 
            ? art.content.replace(/[#*`]/g, "").substring(0, 160).trim() + "..." 
            : (art.keywords || ""),
          slug: art.slug
        }));

        // Combine and deduplicate by slug
        const combined = [...blogResults, ...wikiResults];
        const unique = combined.reduce((acc: any[], curr) => {
          if (!acc.find(item => item.slug === curr.slug)) {
            acc.push(curr);
          }
          return acc;
        }, []);

        setResults(unique.slice(0, 20)); // Final limit
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (app.hasWiki) {
      const timer = setTimeout(() => {
        fetchResults();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, app.hasWiki]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* ─── HERO ─── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center"
        style={{ background: app.theme.heroBg }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
            style={{ background: app.theme.accent }}
          />
          <div
            className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]"
            style={{ background: app.theme.primary }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
            style={{ background: app.theme.accentLight }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${app.theme.accent}40 1px, transparent 1px), linear-gradient(90deg, ${app.theme.accent}40 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Navigation bar */}
        <nav className="absolute top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-5 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Exam Essentials</span>
            </Link>
            <Link
              to="/#ecosystem"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              All Apps
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              <div
                className="inline-block p-1 rounded-[2rem] shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${app.theme.accent}40, ${app.theme.primary}60)`,
                  boxShadow: `0 20px 60px ${app.theme.primary}60`,
                }}
              >
                <img
                  src={app.logo}
                  alt={`${app.name} Logo`}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-[1.75rem] object-cover"
                />
              </div>
            </motion.div>

            {/* Coming Soon badge */}
            {!app.published && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${app.theme.badgeBg}, ${app.theme.accentLight})`,
                    color: app.theme.badgeText,
                    boxShadow: `0 4px 20px ${app.theme.badgeBg}50`,
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Coming Soon
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
            >
              <span className="text-white">{app.name.slice(0, 3)}</span>
              <span style={{ color: app.theme.accent }}>{app.name.slice(3)}</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/80 mb-4 font-medium max-w-2xl mx-auto"
            >
              {app.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-base md:text-lg text-white/50 mb-10 max-w-xl mx-auto"
            >
              {app.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {app.published && app.playStoreLink ? (
                <>
                  <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      className="rounded-full h-14 px-10 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                        color: "#FFF",
                        boxShadow: `0 8px 30px ${app.theme.accent}40`,
                      }}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download on Play Store
                    </Button>
                  </a>
                  <Link to="/#ecosystem">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-14 px-10 text-lg font-medium border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    >
                      Explore More Apps
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="rounded-full h-14 px-10 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300 cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                      color: "#FFF",
                      boxShadow: `0 8px 30px ${app.theme.accent}40`,
                    }}
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Launching Soon — Stay Tuned!
                  </Button>
                  <Link to="/#ecosystem">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-14 px-10 text-lg font-medium border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    >
                      Explore Available Apps
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Highlights pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-3 justify-center mt-10"
            >
              {app.highlights.map((h) => (
                <span
                  key={h}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{
                    borderColor: `${app.theme.accent}30`,
                    color: app.theme.accentLight,
                    background: `${app.theme.accent}10`,
                  }}
                >
                  {h}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
      </section>

      {/* ─── WIKI / KNOWLEDGE BASE SECTION ─── */}
      {app.hasWiki && (
        <section className="py-24 relative overflow-hidden bg-[#0A0A0F]">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                <span className="text-white">📖 {app.name} </span>
                <span style={{ color: app.theme.accent }}>Knowledge Base</span>
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                Search through our comprehensive orthopedic encyclopedia. 
                From anatomy to surgical procedures — everything in one place.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto mb-20">
              <MedOrthoSearch 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Search for conditions, tests, or anatomy..."
              />
              
              {searchQuery !== "" ? (
                <div className="mt-8">
                  <MedOrthoSearchResults 
                    query={searchQuery} 
                    results={results} 
                    isLoading={isLoading} 
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                  <button 
                    onClick={() => {
                      setSearchQuery("Anatomy");
                      const el = document.getElementById('wiki-search-input');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }} 
                    className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-blue-500/50 hover:bg-white/[0.07] transition-all duration-300 text-left w-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white">Anatomy</h3>
                    <p className="text-white/40 text-sm leading-relaxed text-balance">Explore Bones, Joints, Muscles & Ligaments.</p>
                  </button>

                  <button 
                    onClick={() => {
                      setSearchQuery("Pathology");
                      const el = document.getElementById('wiki-search-input');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }} 
                    className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-red-500/50 hover:bg-white/[0.07] transition-all duration-300 text-left w-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Activity className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white">Pathologies</h3>
                    <p className="text-white/40 text-sm leading-relaxed text-balance">Learn about common orthopedic injuries.</p>
                  </button>

                  <button 
                    onClick={() => {
                      setSearchQuery("Special Tests");
                      const el = document.getElementById('wiki-search-input');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }} 
                    className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-emerald-500/50 hover:bg-white/[0.07] transition-all duration-300 text-left w-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Stethoscope className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white">Assessments</h3>
                    <p className="text-white/40 text-sm leading-relaxed text-balance">Master clinical orthopaedic special tests.</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── ARTICLES / BLOG SECTION ─── */}
      {appArticles.length > 0 && (
        <section className="py-24 relative bg-[#0A0A0F] overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#1A1A24] to-transparent opacity-30 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                  <span className="text-white">📚 Latest </span>
                  <span style={{ color: app.theme.accent }}>{app.name === 'MedOrtho' ? 'Orthopedic Articles' : 'Articles'}</span>
                </h2>
                <p className="text-white/50 text-lg">
                  Learn faster with simplified clinical explanations and evidence-based insights.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link to={`/blog?category=${app.name}`}>
                  <Button variant="ghost" className="text-white/70 hover:text-white group gap-2 px-0 hover:bg-transparent">
                    View All Articles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Featured Article */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <Link to={`/blog/${appArticles[0].id}`} className="group block">
                <div 
                  className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-[400px] overflow-hidden">
                      <img 
                        src={appArticles[0].image} 
                        alt={appArticles[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-lg">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: app.theme.accent }}>
                        {appArticles[0].category} • {appArticles[0].readTime}
                      </span>
                      <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight group-hover:text-white/90 transition-colors">
                        {appArticles[0].title}
                      </h3>
                      <p className="text-white/60 text-lg leading-relaxed mb-8 line-clamp-3">
                        {appArticles[0].excerpt}
                      </p>
                      <div className="flex items-center gap-2 font-bold text-lg" style={{ color: app.theme.accent }}>
                        Read Article <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Grid of Other Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {appArticles.slice(1).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link to={`/blog/${article.id}`} className="group block h-full">
                    <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/5 transition-all duration-500 hover:border-white/20 hover:shadow-xl">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-black/40 border border-white/10 text-white">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-white/40 text-xs font-medium mb-3 block">
                          {article.readTime}
                        </span>
                        <h4 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-snug transition-colors group-hover:text-white/80">
                          {article.title}
                        </h4>
                        <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold" style={{ color: app.theme.accent }}>
                          Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Premium CTA for App Download */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[2.5rem] p-8 md:p-16 overflow-hidden border border-white/10 shadow-3xl text-center"
              style={{ background: app.theme.cardBg }}
            >
              {/* Animated glow effects */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div 
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20"
                style={{ background: app.theme.accent }}
              />
              <div 
                className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-20"
                style={{ background: app.theme.primary }}
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${app.theme.accent}30, ${app.theme.primary}20)` }}
                >
                  <Heart className="w-10 h-10" style={{ color: app.theme.accent }} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                  {app.name === 'MedOrtho' 
                    ? "Practice 200+ Orthopedic Tests inside MedOrtho App" 
                    : `Level up your learning with ${app.name}`}
                </h3>
                <p className="text-white/60 text-lg mb-10">
                  Join thousands of medical students using {app.name} to master clinical skills and ace their exams.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {app.playStoreLink && (
                    <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer">
                      <Button
                        size="lg"
                        className="rounded-full h-14 px-10 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                          color: "#FFF",
                          boxShadow: `0 8px 30px ${app.theme.accent}40`,
                        }}
                      >
                        <Download className="w-5 h-5 mr-3" />
                        Download Now
                      </Button>
                    </a>
                  )}
                  <Link to={`/blog?category=${app.name}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-14 px-10 text-lg font-medium border-white/20 text-white hover:bg-white/10"
                    >
                      Browse Articles
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── FEATURES ─── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">What's Inside </span>
              <span style={{ color: app.theme.accent }}>{app.name}</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Powerful features designed to accelerate your medical learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {app.features.map((feature: MedAppFeature, index: number) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: app.theme.cardBg,
                  borderColor: `${app.theme.accent}15`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${app.theme.accent}40`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${app.theme.primary}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${app.theme.accent}15`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `linear-gradient(135deg, ${app.theme.primary}40, ${app.theme.accent}20)`,
                    color: app.theme.accent,
                  }}
                >
                  <FeatureIcon name={feature.icon} className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / DETAILS ─── */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${app.theme.accent} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-white">Why Choose </span>
                <span style={{ color: app.theme.accent }}>{app.name}?</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                {app.longDescription}
              </p>

              {/* Target audience */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-wider text-white/40 mb-4 font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Built For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.targetAudience.map((audience) => (
                    <span
                      key={audience}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: `${app.theme.primary}30`,
                        color: app.theme.accentLight,
                        border: `1px solid ${app.theme.primary}40`,
                      }}
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              {app.published && app.playStoreLink && (
                <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    className="rounded-full h-12 px-8 font-bold hover:scale-105 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                      color: "#FFF",
                    }}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Get it on Play Store
                  </Button>
                </a>
              )}
            </motion.div>

            {/* Right — stats / visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div
                className="rounded-3xl p-10 border relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${app.theme.primary}15, ${app.theme.accent}08)`,
                  borderColor: `${app.theme.accent}15`,
                }}
              >
                {/* Decorative glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-30"
                  style={{ background: app.theme.accent }}
                />

                <div className="relative z-10 space-y-8">
                  {app.highlights.map((stat, i) => (
                    <div key={stat} className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${app.theme.accent}30, ${app.theme.primary}20)`,
                        }}
                      >
                        <Star className="w-5 h-5" style={{ color: app.theme.accent }} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{stat}</p>
                        <p className="text-white/40 text-sm">
                          {i === 0 && "Comprehensive content library"}
                          {i === 1 && "Crystal clear visual learning"}
                          {i === 2 && "Learn without internet"}
                          {i === 3 && "Fresh content every month"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── COMING SOON NOTIFY (only for unpublished) ─── */}
      {!app.published && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center rounded-3xl p-12 border relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${app.theme.primary}15, ${app.theme.accent}08)`,
                borderColor: `${app.theme.accent}20`,
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `radial-gradient(ellipse at center, ${app.theme.accent}30, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${app.theme.accent}30, ${app.theme.primary}20)`,
                  }}
                >
                  <Bell className="w-10 h-10" style={{ color: app.theme.accent }} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {app.name} is Coming Soon
                </h3>
                <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
                  We're working hard to bring you the best {app.name.slice(3).toLowerCase()} learning experience.
                  Follow us to be the first to know when we launch!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://wa.me/919460970342" target="_blank" rel="noopener noreferrer">
                    <Button
                      className="rounded-full h-12 px-8 font-bold hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                        color: "#FFF",
                        boxShadow: `0 4px 20px ${app.theme.accent}30`,
                      }}
                    >
                      Get Notified on WhatsApp
                    </Button>
                  </a>
                  <Link to="/#ecosystem">
                    <Button
                      variant="outline"
                      className="rounded-full h-12 px-8 font-medium border-white/20 text-white hover:bg-white/10"
                    >
                      See Available Apps
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── FAQ SECTION ─── */}
      {app.faqs && app.faqs.length > 0 && (
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="text-white">Frequently Asked </span>
                <span style={{ color: app.theme.accent }}>Questions</span>
              </h2>
              <p className="text-white/40 text-lg">
                Everything you need to know about {app.name}
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {app.faqs.map((faq, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="group rounded-2xl border overflow-hidden"
                  style={{
                    background: app.theme.cardBg,
                    borderColor: `${app.theme.accent}15`,
                  }}
                >
                  <summary
                    className="flex items-center justify-between cursor-pointer p-6 text-white font-semibold text-lg select-none list-none"
                    style={{ WebkitAppearance: "none" } as React.CSSProperties}
                  >
                    <span>{faq.question}</span>
                    <span
                      className="ml-4 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-open:rotate-45"
                      style={{
                        background: `${app.theme.accent}20`,
                        color: app.theme.accent,
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-white/50 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── EXPLORE MORE APPS ─── */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Explore More Apps
            </h2>
            <p className="text-white/40 text-lg">
              Part of the Exam Essentials medical education ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {otherApps.slice(0, 5).map((other, index) => (
              <motion.div
                key={other.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Link
                  to={`/${other.slug}`}
                  className="group block p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 no-underline"
                  style={{
                    background: other.theme.cardBg,
                    borderColor: `${other.theme.accent}15`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${other.theme.accent}40`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${other.theme.primary}25`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${other.theme.accent}15`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={other.logo}
                      alt={other.name}
                      className="w-14 h-14 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-white/90 transition-colors">
                        {other.name}
                      </h3>
                      {!other.published && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${other.theme.badgeBg}30`,
                            color: other.theme.accent,
                          }}
                        >
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{other.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: other.theme.accent }}>
                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Back to ecosystem */}
          <div className="text-center mt-12">
            <Link to="/#ecosystem">
              <Button
                variant="outline"
                className="rounded-full h-12 px-8 font-medium border-white/20 text-white hover:bg-white/10"
              >
                View Full Ecosystem
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="text-white/50 hover:text-white/80 transition-colors text-sm">
            © {new Date().getFullYear()} Exam Essentials — India's Best Education Ecosystem
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default MedAppPage;
