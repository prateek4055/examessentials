import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { fetchPublishedProducts, Product } from "@/lib/api";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-muted-foreground font-medium text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-primary" />
              Loading curriculum catalog...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Apple Style Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-secondary/80 border border-black/[0.06] dark:border-white/[0.08] mb-4">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Topper Edition Publishing
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
            }}
          >
            Current Offerings.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            High-yield handwritten notes, formulas, and visual memory diagrams ready
            for instant digital access.
          </p>
        </motion.div>

        {/* Class 11 Section */}
        {class11Products.length > 0 && (
          <div className="mb-16 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-border/60">
              <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Class 11 Foundation Notes
              </h3>
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
          <div className="mb-16 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-border/60">
              <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Class 12 Boards & Entrance Mastery
              </h3>
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

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-normal mb-4">
              Catalog updating for the upcoming session. Check back soon!
            </p>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-12 text-sm font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 shadow-sm"
            >
              <Link to="/products" className="flex items-center gap-2">
                <span>View Complete Store Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
