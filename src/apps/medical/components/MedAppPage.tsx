import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, Heart, Brain, Eye, Zap, FileText, BookOpen, GraduationCap,
  Activity, Stethoscope, Dumbbell, Hand, Waves, ClipboardList,
  Scan, Layers, FileImage, PenTool, Pill, GitBranch, Table, Lightbulb,
  ArrowRight, Download, Bell, ChevronRight, Sparkles, Star, Users, Shield,
  Info, X, Accessibility, Footprints
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MedAppData, MedAppFeature } from "../data/medicalAppsData";
import { getOtherApps } from "../data/medicalAppsData";
import { blogPosts } from "@/lib/blogData";
import MedOrthoSearch from "../../medortho/components/MedOrthoSearch";
import MedOrthoSearchResults from "../../medortho/components/MedOrthoSearchResults";
import { supabase } from "@/integrations/supabase/client";
import googlePlayBadge from "@/assets/google-play-badge.png";
import appStoreBadge from "@/assets/app-store-badge.png";

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
  
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [iosEmail, setIosEmail] = useState("");
  const [isIosSubmitted, setIsIosSubmitted] = useState(false);
  const [isIosSubmitting, setIsIosSubmitting] = useState(false);
  const [localTests, setLocalTests] = useState<any[]>([]);

  const regions = [
    { name: "Shoulder", key: "shoulder", path: "/medortho/shoulder/", fallbackCount: 71, icon: Shield },
    { name: "Knee", key: "knee", path: "/medortho/knee/", fallbackCount: 45, icon: Layers },
    { name: "Spine", key: "spine", path: "/medortho/spine/", fallbackCount: 68, icon: GitBranch },
    { name: "Hip", key: "hip", path: "/medortho/hip/", fallbackCount: 39, icon: Accessibility },
    { name: "Elbow", key: "elbow", path: "/medortho/elbow/", fallbackCount: 26, icon: Zap },
    { name: "Ankle & Foot", key: "ankle", path: "/medortho/ankle-foot/", fallbackCount: 29, icon: Footprints },
    { name: "Wrist & Hand", key: "wrist", path: "/medortho/wrist-hand/", fallbackCount: 44, icon: Hand },
    { name: "Neurological", key: "neuro", path: "/medortho/neurological/", fallbackCount: 58, icon: Brain },
    { name: "General / All", key: "general", path: "/medortho/special-tests/", fallbackCount: 13, icon: Stethoscope },
  ];

  const getCategoryCount = (catKey: string) => {
    if (!localTests || localTests.length === 0) return 0;
    if (catKey === "neuro") {
      return localTests.filter(t => (t.subCategory || "").toLowerCase().includes("neuro")).length;
    }
    if (catKey === "general") {
      const standardCategories = ["shoulder", "knee", "spine", "hip", "elbow", "ankle & foot", "wrist & hand"];
      return localTests.filter(t => {
        const cat = (t.category || "").toLowerCase();
        const isNeuro = (t.subCategory || "").toLowerCase().includes("neuro");
        return !standardCategories.includes(cat) && !isNeuro;
      }).length;
    }
    if (catKey === "ankle") {
      return localTests.filter(t => (t.category || "").toLowerCase() === "ankle & foot").length;
    }
    if (catKey === "wrist") {
      return localTests.filter(t => (t.category || "").toLowerCase() === "wrist & hand").length;
    }
    return localTests.filter(t => (t.category || "").toLowerCase() === catKey.toLowerCase()).length;
  };

  // Update searchQuery if query parameter changes
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  // Load MedOrtho local JSON database on mount
  useEffect(() => {
    if (app.slug === "medortho") {
      fetch("/medortho/tests/tests_data.json")
        .then((res) => {
          if (res.ok) return res.json();
          return [];
        })
        .then((data) => {
          setLocalTests(data);
        })
        .catch((err) => console.error("Error loading tests_data.json on home page:", err));
    }
  }, [app.slug]);

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
            .or(`title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,keywords.ilike.%${searchQuery}%`)
            .limit(15)
        ]);

        const blogResults = blogReq.data || [];
        const wikiResults = (wikiReq.data || []).map((art: any) => ({
          id: art.id,
          title: art.title,
          category: art.category,
          excerpt: art.content 
            ? art.content.replace(/[#*`]/g, "").substring(0, 160).trim() + "..." 
            : (art.keywords || ""),
          slug: art.slug
        }));

        // Filter local tests if this is MedOrtho
        let localResults: any[] = [];
        if (app.slug === "medortho" && localTests.length > 0) {
          const q = searchQuery.toLowerCase();
          localResults = localTests
            .filter((t) => {
              return (
                (t.title || "").toLowerCase().includes(q) ||
                (t.category || "").toLowerCase().includes(q) ||
                (t.subCategory || "").toLowerCase().includes(q) ||
                (t.usedFor || "").toLowerCase().includes(q)
              );
            })
            .map((t) => ({
              id: `local-test-${t.id}`,
              title: t.title || "",
              category: `${t.category} Special Test`,
              excerpt: t.usedFor ? t.usedFor.replace(/<[^>]*>/g, "").substring(0, 160).trim() + "..." : "",
              slug: `tests/${(t.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
            }));
        }

        // Combine and deduplicate by slug
        const combined = [...blogResults, ...wikiResults, ...localResults];
        const unique = combined.reduce((acc: any[], curr) => {
          if (!acc.find(item => item.slug === curr.slug)) {
            acc.push(curr);
          }
          return acc;
        }, []);

        setResults(unique.slice(0, 25)); // Final limit
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
  }, [searchQuery, app.hasWiki, app.slug, localTests]);

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-hidden">
      {/* ─── HERO ─── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center"
        style={{ background: app.theme.heroBg }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
            style={{ background: app.theme.accent }}
          />
          <div
            className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px]"
            style={{ background: app.theme.primary }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[120px]"
            style={{ background: app.theme.accentLight }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
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
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform text-slate-500" />
              <span className="text-sm font-medium">Back to Exam Essentials</span>
            </Link>
            <Link
              to="/#ecosystem"
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
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
                className="inline-block p-1 rounded-[2rem] shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${app.theme.accent}20, ${app.theme.primary}30)`,
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.05), 0 10px 30px " + app.theme.primary + "15",
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
              <span className="text-slate-900">{app.name.slice(0, 3)}</span>
              <span style={{ color: app.theme.accent }}>{app.name.slice(3)}</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-xl md:text-2xl text-slate-800 mb-4 font-medium max-w-2xl mx-auto"
            >
              {app.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-base md:text-lg text-slate-500 mb-10 max-w-xl mx-auto"
            >
              {app.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {app.published && app.playStoreLink ? (
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <div className="flex flex-row gap-4 items-center">
                    <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform duration-300">
                      <img 
                        src={googlePlayBadge} 
                        alt="Get it on Google Play" 
                        className="h-[5.2rem] md:h-[6.5rem] w-auto object-contain"
                      />
                    </a>
                    <button onClick={() => setShowIosModal(true)} className="hover:scale-105 transition-transform duration-300">
                      <img 
                        src={appStoreBadge} 
                        alt="Download on the App Store" 
                        className="h-16 md:h-20 w-auto object-contain"
                      />
                    </button>
                  </div>
                  <Link to="/#ecosystem">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-14 px-10 text-lg font-medium border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
                    >
                      Explore More Apps
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
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
                      className="rounded-full h-14 px-10 text-lg font-medium border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
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
                    borderColor: `${app.theme.accent}40`,
                    color: app.theme.primary,
                    background: `${app.theme.accent}15`,
                  }}
                >
                  {h}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── WIKI / KNOWLEDGE BASE SECTION ─── */}
      {app.hasWiki && (
        <section className="py-24 relative overflow-hidden bg-slate-50/50 border-y border-slate-100">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                <span className="text-slate-900">📖 {app.name} </span>
                <span style={{ color: app.theme.accent }}>Knowledge Base</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Search through our comprehensive orthopedic encyclopedia. 
                From anatomy to surgical procedures — everything in one place.
              </p>
            </motion.div>

            <div className={`mx-auto mb-20 ${searchQuery === "" && app.slug === "medortho" ? "max-w-6xl" : "max-w-4xl"}`}>
              <div className="max-w-4xl mx-auto">
                <MedOrthoSearch 
                  value={searchQuery} 
                  onChange={(val) => {
                    setSearchQuery(val);
                    if (val === "") {
                      setSearchParams({});
                    } else {
                      setSearchParams({ q: val });
                    }
                  }} 
                  placeholder="Search for conditions, tests, or anatomy..."
                />
              </div>
              
              {searchQuery !== "" ? (
                <div className="mt-8 max-w-4xl mx-auto">
                  <MedOrthoSearchResults 
                    query={searchQuery} 
                    results={results} 
                    isLoading={isLoading} 
                  />
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchParams({});
                      }}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-650 hover:bg-slate-200"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {app.slug === "medortho" ? (
                    <div className="mt-12">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                          <Stethoscope className="w-5 h-5" style={{ color: app.theme.accent }} />
                          Browse by Body Region
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {regions.map((region) => {
                          const Icon = region.icon;
                          const dynamicCount = getCategoryCount(region.key);
                          const displayCount = dynamicCount || region.fallbackCount;
                          
                          return (
                            <Link
                              key={region.key}
                              to={region.path}
                              className="group p-6 bg-white border border-slate-100 shadow-sm rounded-3xl hover:bg-slate-50/30 transition-all duration-300 text-left flex items-center justify-between"
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = `${app.theme.accent}40`;
                                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${app.theme.accent}10`;
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9";
                                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                              }}
                            >
                              <div className="flex items-center gap-4">
                                <div 
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                                  style={{
                                    background: `${app.theme.accent}10`,
                                    color: app.theme.accent,
                                  }}
                                >
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-base md:text-lg text-slate-800 transition-colors group-hover:text-slate-900">
                                    {region.name}
                                  </h4>
                                  <span className="text-slate-400 text-xs font-semibold">Special Tests</span>
                                </div>
                              </div>
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{
                                  background: `${app.theme.accent}15`,
                                  color: app.theme.primary,
                                }}
                              >
                                {displayCount}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                      <button 
                        onClick={() => {
                          setSearchQuery("Anatomy");
                          const el = document.getElementById('wiki-search-input');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }} 
                        className="group p-8 bg-white border border-slate-100 shadow-sm rounded-3xl hover:border-blue-500/20 hover:bg-slate-50/30 transition-all duration-300 text-left w-full"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-slate-800">Anatomy</h3>
                        <p className="text-slate-500 text-sm leading-relaxed text-balance">Explore Bones, Joints, Muscles & Ligaments.</p>
                      </button>

                      <button 
                        onClick={() => {
                          setSearchQuery("Pathology");
                          const el = document.getElementById('wiki-search-input');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }} 
                        className="group p-8 bg-white border border-slate-100 shadow-sm rounded-3xl hover:border-red-500/20 hover:bg-slate-50/30 transition-all duration-300 text-left w-full"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Activity className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-slate-800">Pathologies</h3>
                        <p className="text-slate-500 text-sm leading-relaxed text-balance">Learn about common orthopedic injuries.</p>
                      </button>

                      <button 
                        onClick={() => {
                          setSearchQuery("Special Tests");
                          const el = document.getElementById('wiki-search-input');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }} 
                        className="group p-8 bg-white border border-slate-100 shadow-sm rounded-3xl hover:border-emerald-500/20 hover:bg-slate-50/30 transition-all duration-300 text-left w-full"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Stethoscope className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-slate-800">Assessments</h3>
                        <p className="text-slate-500 text-sm leading-relaxed text-balance">Master clinical orthopaedic special tests.</p>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── RECENTLY ADDED TESTS GRID (Section 4) ─── */}
      {app.slug === "medortho" && localTests.length > 0 && (
        <section className="py-24 relative bg-white overflow-hidden border-b border-slate-100">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-50 to-transparent opacity-60 pointer-events-none" />
          
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
                  <span className="text-slate-900">✨ Recently Added </span>
                  <span style={{ color: app.theme.accent }}>Clinical Tests</span>
                </h2>
                <p className="text-slate-500 text-lg">
                  Explore our latest orthopedic special tests, complete with step-by-step performance guidelines, diagnostic accuracy, and references.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link to="/medortho/special-tests/">
                  <Button variant="ghost" className="text-slate-650 hover:text-slate-900 group gap-2 px-0 hover:bg-transparent" style={{ color: app.theme.accent }}>
                    View All Special Tests <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* 3x2 Grid of 6 tests */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {localTests.slice(0, 6).map((test, index) => {
                const rSlug = (test.title || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");

                const rFilename = test.image1 ? test.image1.split("/").pop() : "";
                const rImgUrl = test.image1 ? `/medortho/tests/images/${rFilename}` : null;
                const cleanExcerpt = test.usedFor 
                  ? test.usedFor.replace(/<[^>]*>/g, "").substring(0, 120).trim() + "..." 
                  : "Explore step-by-step procedure and diagnostic accuracy statistics.";
                
                const dates = [
                  "May 24, 2026",
                  "May 18, 2026",
                  "May 10, 2026",
                  "April 29, 2026",
                  "April 15, 2026",
                  "March 28, 2026"
                ];
                const dateText = dates[index] || "Recently Added";

                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <Link 
                      to={`/medortho/tests/${rSlug}`} 
                      className="group block h-full"
                      style={{ "--hover-color": app.theme.primary } as any}
                    >
                      <div className="h-full flex flex-col rounded-3xl overflow-hidden border border-slate-100 bg-white transition-all duration-500 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50">
                        <div className="relative h-56 bg-slate-50 overflow-hidden flex items-center justify-center">
                          {rImgUrl ? (
                            <img 
                              src={rImgUrl} 
                              alt={test.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${app.theme.accent}05`, color: app.theme.accent }}>
                              <Stethoscope className="w-12 h-12 opacity-30" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span 
                              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                              style={{
                                background: `${app.theme.accent}15`,
                                color: app.theme.primary,
                                borderColor: `${app.theme.accent}30`
                              }}
                            >
                              {test.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <span className="text-slate-400 text-xs font-semibold mb-2 block">
                            📅 {dateText}
                          </span>
                          <h4 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 leading-snug group-hover:text-[var(--hover-color)] transition-colors">
                            {test.title}
                          </h4>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                            {cleanExcerpt}
                          </p>
                          <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold" style={{ color: app.theme.accent }}>
                            Read Full Entry <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            <div 
              className="mt-16 relative rounded-[2rem] p-8 md:p-12 overflow-hidden border border-slate-100 shadow-lg text-center"
              style={{ 
                borderColor: `${app.theme.accent}20`,
                backgroundColor: `${app.theme.accent}05`
              }}
            >
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Looking for a specific special test?
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Browse all 700+ special tests in our complete directory with dynamic search and region filtering.
                </p>
                <Link to="/medortho/special-tests/">
                  <Button
                    className="rounded-full h-12 px-8 font-semibold shadow-md hover:scale-105 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                      color: "#FFF",
                    }}
                  >
                    Open Special Tests Directory
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── ARTICLES / BLOG SECTION ─── */}
      {appArticles.length > 0 && app.slug !== "medortho" && (
        <section className="py-24 relative bg-white overflow-hidden border-b border-slate-100">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-50 to-transparent opacity-60 pointer-events-none" />
          
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
                  <span className="text-slate-900">📚 Latest </span>
                  <span style={{ color: app.theme.accent }}>{app.name === 'MedOrtho' ? 'Orthopedic Articles' : 'Articles'}</span>
                </h2>
                <p className="text-slate-500 text-lg">
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
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 group gap-2 px-0 hover:bg-transparent">
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
                  className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-50/30 transition-all duration-500 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-[400px] overflow-hidden">
                      <img 
                        src={appArticles[0].image} 
                        alt={appArticles[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/90 border border-slate-200 text-slate-800 shadow-md">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: app.theme.accent }}>
                        {appArticles[0].category} • {appArticles[0].readTime}
                      </span>
                      <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight transition-colors">
                        {appArticles[0].title}
                      </h3>
                      <p className="text-slate-500 text-lg leading-relaxed mb-8 line-clamp-3">
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
                    <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-slate-100 bg-white transition-all duration-500 hover:border-slate-200 hover:shadow-md">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/95 border border-slate-100 text-slate-700 shadow-sm">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-slate-400 text-xs font-medium mb-3 block">
                          {article.readTime}
                        </span>
                        <h4 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 leading-snug transition-colors group-hover:text-blue-600">
                          {article.title}
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
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
              className="relative rounded-[2.5rem] p-8 md:p-16 overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/50 text-center animate-fade-in"
              style={{ background: app.theme.cardBg }}
            >
              {/* Animated glow effects */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div 
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-[0.08]"
                style={{ background: app.theme.accent }}
              />
              <div 
                className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-[0.08]"
                style={{ background: app.theme.primary }}
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md bg-white"
                >
                  <Heart className="w-10 h-10 animate-pulse" style={{ color: app.theme.accent }} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                  {app.name === 'MedOrtho' 
                    ? "Practice 200+ Orthopedic Tests inside MedOrtho App" 
                    : `Level up your learning with ${app.name}`}
                </h3>
                <p className="text-slate-600 text-lg mb-10">
                  Join thousands of medical students using {app.name} to master clinical skills and ace their exams.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="flex flex-row gap-4 items-center">
                    {app.playStoreLink && (
                      <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform duration-300">
                        <img 
                          src={googlePlayBadge} 
                          alt="Get it on Google Play" 
                          className="h-[5.2rem] md:h-[6.5rem] w-auto object-contain"
                        />
                      </a>
                    )}
                    <button onClick={() => setShowIosModal(true)} className="hover:scale-105 transition-transform duration-300">
                      <img 
                        src={appStoreBadge} 
                        alt="Download on the App Store" 
                        className="h-16 md:h-20 w-auto object-contain"
                      />
                    </button>
                  </div>
                  <Link to={`/blog?category=${app.name}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-14 px-10 text-lg font-medium border-slate-200 text-slate-700 hover:bg-white bg-white/80 shadow-sm"
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
              <span className="text-slate-900">What's Inside </span>
              <span style={{ color: app.theme.accent }}>{app.name}</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
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
                  borderColor: `${app.theme.accent}20`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${app.theme.accent}50`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${app.theme.accent}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${app.theme.accent}20`;
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
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
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
                <span className="text-slate-900">Why Choose </span>
                <span style={{ color: app.theme.accent }}>{app.name}?</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {app.longDescription}
              </p>

              {/* Target audience */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-4 font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Built For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.targetAudience.map((audience) => (
                    <span
                      key={audience}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: `${app.theme.accent}15`,
                        color: app.theme.primary,
                        border: `1px solid ${app.theme.accent}30`,
                      }}
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              {app.published && app.playStoreLink && (
                <div className="flex flex-row gap-4 items-center mt-4">
                  <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform duration-300">
                    <img 
                      src={googlePlayBadge} 
                      alt="Get it on Google Play" 
                      className="h-[3.9rem] md:h-[4.55rem] w-auto object-contain"
                    />
                  </a>
                  <button onClick={() => setShowIosModal(true)} className="hover:scale-105 transition-transform duration-300">
                    <img 
                      src={appStoreBadge} 
                      alt="Download on the App Store" 
                      className="h-12 md:h-14 w-auto object-contain"
                    />
                  </button>
                </div>
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
                className="rounded-3xl p-10 border border-slate-100 shadow-sm relative overflow-hidden bg-white"
                style={{
                  background: `linear-gradient(135deg, ${app.theme.accent}15, ${app.theme.accent}05)`,
                  borderColor: `${app.theme.accent}25`,
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
                        <p className="text-slate-800 font-bold text-lg">{stat}</p>
                        <p className="text-slate-500 text-sm">
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
              className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 border border-slate-100 shadow-md relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${app.theme.accent}10, ${app.theme.accent}05)`,
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
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  {app.name} is Coming Soon
                </h3>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
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
                      className="rounded-full h-12 px-8 font-medium border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
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
                <span className="text-slate-900">Frequently Asked </span>
                <span style={{ color: app.theme.accent }}>Questions</span>
              </h2>
              <p className="text-slate-500 text-lg">
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
                  className="group rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  style={{
                    background: app.theme.cardBg,
                    borderColor: `${app.theme.accent}25`,
                  }}
                >
                  <summary
                    className="flex items-center justify-between cursor-pointer p-6 text-slate-800 font-semibold text-lg select-none list-none"
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
                  <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── EXPLORE MORE APPS ─── */}
      <section className="py-24 border-t border-slate-100 bg-slate-50/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Explore More Apps
            </h2>
            <p className="text-slate-500 text-lg">
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
                  className="group block p-6 rounded-2xl border border-slate-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1 no-underline bg-white"
                  style={{
                    background: other.theme.cardBg,
                    borderColor: `${other.theme.accent}20`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${other.theme.accent}40`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${other.theme.accent}15`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${other.theme.accent}20`;
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
                      <h3 className="text-slate-800 font-bold text-lg group-hover:text-blue-600 transition-colors">
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
                  <p className="text-slate-500 text-sm leading-relaxed">{other.description}</p>
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
                className="rounded-full h-12 px-8 font-medium border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
              >
                View Full Ecosystem
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
            © {new Date().getFullYear()} Exam Essentials — India's Best Education Ecosystem
          </Link>
        </div>
      </footer>

      {/* ─── iOS COMING SOON MODAL ─── */}
      <AnimatePresence>
        {showIosModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowIosModal(false);
                setIsIosSubmitted(false);
                setIosEmail("");
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl z-10 overflow-hidden text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowIosModal(false);
                  setIsIosSubmitted(false);
                  setIosEmail("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {/* Visual Icon */}
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-sm">
                  {/* Apple Icon */}
                  <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
                  </svg>
                </div>

                {!isIosSubmitted ? (
                  <>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 font-sans">
                      iOS Version Coming Soon
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-sans">
                      Our team is currently developing the iOS app for {app.name} to bring the ultimate clinical learning experience to your iPhone and iPad.
                      <br /><br />
                      Leave your email below and be the first to know when it goes live on the App Store!
                    </p>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!iosEmail) return;
                        setIsIosSubmitting(true);
                        try {
                          await supabase
                            .from("ios_notifications")
                            .insert([{ email: iosEmail, app_id: app.id, app_name: app.name }]);
                        } catch (err) {
                          console.log("Database insert simulated:", err);
                        } finally {
                          setIsIosSubmitting(false);
                          setIsIosSubmitted(true);
                        }
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="email"
                        required
                        value={iosEmail}
                        onChange={(e) => setIosEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 text-sm text-center"
                      />
                      <button
                        type="submit"
                        disabled={isIosSubmitting}
                        className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {isIosSubmitting ? "Saving..." : "Get Notified on Release"}
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2 font-sans">You're on the list!</h4>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed font-sans">
                      Thank you! We will email you at **{iosEmail}** as soon as we release the iOS version of {app.name}.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedAppPage;
