import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <div className="animate-pulse text-muted-foreground font-body">
              Loading products...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Products
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Premium handwritten notes for Class 11 & 12 students
          </p>
        </motion.div>

        {/* Class 11 Section */}
        {class11Products.length > 0 && (
          <div className="mb-12">
            <div className="section-header rounded-lg mb-6">
              Class 11 Notes
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
          <div className="mb-12">
            <div className="section-header rounded-lg mb-6">
              Class 12 Notes
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
            <p className="text-muted-foreground font-body mb-4">
              No products available yet. Check back soon!
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
            className="text-center mt-8"
          >
            <Button asChild size="lg">
              <Link to="/products">View All Products</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
