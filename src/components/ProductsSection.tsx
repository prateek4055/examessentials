import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import PosterCard from "./PosterCard";
import { fetchPublishedProducts, Product } from "@/lib/api";
import { posters } from "@/apps/medposterhub/data/posters";

export const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"notes" | "posters">("notes");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchPublishedProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const class11Products = products.filter((p) => p.class === "11");
  const class12Products = products.filter((p) => p.class === "12");
  const featuredPosters = posters.slice(0, 8);

  return (
    <section id="offerings" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-secondary/80 border border-black/[0.06] dark:border-white/[0.08] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Official Store
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Explore Our Offerings.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            High-yield handwritten notes delivered directly to your device, and clinical-grade anatomy wall posters for study and clinics.
          </p>

          {/* Simple, Aligned Apple Tab Switcher */}
          <div className="inline-flex items-center p-1.5 mt-8 rounded-full bg-secondary/70 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md">
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === "notes"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Handwritten Notes ({products.length || "10"})</span>
            </button>

            <button
              onClick={() => setActiveTab("posters")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === "posters"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Medical Posters ({posters.length})</span>
            </button>
          </div>
        </motion.div>

        {/* ─── TAB 1: HANDWRITTEN NOTES ─── */}
        {activeTab === "notes" && (
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                <Sparkles className="w-4 h-4 animate-spin mr-2 text-primary" />
                Loading study materials...
              </div>
            ) : (
              <>
                {/* Class 11 Section */}
                {class11Products.length > 0 && (
                  <div className="mb-14">
                    <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <h3 className="text-lg font-bold text-foreground tracking-tight">
                          Class 11 Topper Notes
                        </h3>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          · Physics, Chemistry &amp; Biology
                        </span>
                      </div>
                      <Link
                        to="/class-11-notes"
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View Class 11 <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {class11Products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Class 12 Section */}
                {class12Products.length > 0 && (
                  <div className="mb-14">
                    <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <h3 className="text-lg font-bold text-foreground tracking-tight">
                          Class 12 Boards &amp; Entrance Mastery
                        </h3>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          · High-Yield Revision
                        </span>
                      </div>
                      <Link
                        to="/class-12-notes"
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View Class 12 <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {class12Products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* View Complete Notes Store Button */}
                <div className="text-center mt-10">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-8 h-12 text-sm font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                  >
                    <Link to="/products" className="flex items-center gap-2">
                      <span>View Complete Notes Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── TAB 2: MEDICAL POSTERS ─── */}
        {activeTab === "posters" && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2.5 border-b border-border/60">
              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Clinical &amp; Anatomy Wall Charts
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  High-definition 300 GSM matte paper, laminated frames &amp; acrylic finishes for clinics, OPDs and study rooms.
                </p>
              </div>
              <Link
                to="/medposterhub"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
              >
                Explore MedPosterHub <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredPosters.map((poster) => (
                <PosterCard key={poster.id} poster={poster} />
              ))}
            </div>

            {/* Poster Quality Perks Banner */}
            <div className="mt-12 p-6 rounded-3xl bg-secondary/50 border border-black/[0.05] dark:border-white/[0.08] flex flex-wrap items-center justify-around gap-4 text-center">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>300 GSM Heavyweight Matte Finish</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Safe Tube &amp; Frame Packing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sizes: A3, A2 &amp; A1 Available</span>
              </div>
            </div>

            {/* View Complete Poster Hub Button */}
            <div className="text-center mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-12 text-sm font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 shadow-sm"
              >
                <Link to="/medposterhub" className="flex items-center gap-2">
                  <span>Browse All 20+ Posters on MedPosterHub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
