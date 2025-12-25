import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchPublishedProducts, Product } from "@/lib/api";

const Products = () => {
  const [searchParams] = useSearchParams();
  const classFilter = searchParams.get("class");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

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

  const filteredProducts = classFilter
    ? products.filter((p) => p.class === classFilter)
    : products;

  const class11Products = filteredProducts.filter((p) => p.class === "11");
  const class12Products = filteredProducts.filter((p) => p.class === "12");

  const pageTitle = classFilter
    ? `Class ${classFilter} Notes | Exam Essentials`
    : "All Notes | Exam Essentials";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Browse premium handwritten notes for ${classFilter ? `Class ${classFilter}` : "Class 11 & 12"}. Physics, Chemistry, Maths, Biology notes available.`}
        />
      </Helmet>

      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              {classFilter ? (
                <>
                  Class {classFilter}{" "}
                  <span className="gradient-text">Handwritten Notes</span>
                </>
              ) : (
                <>
                  Browse All{" "}
                  <span className="gradient-text">Handwritten Notes</span>
                </>
              )}
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
              Premium notes designed to help you excel in your exams.
            </p>

            {/* Filter buttons */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                asChild
                variant={!classFilter ? "gradient" : "outline"}
                size="sm"
              >
                <Link to="/products">All</Link>
              </Button>
              <Button
                asChild
                variant={classFilter === "11" ? "gradient" : "outline"}
                size="sm"
              >
                <Link to="/products?class=11">Class 11</Link>
              </Button>
              <Button
                asChild
                variant={classFilter === "12" ? "gradient" : "outline"}
                size="sm"
              >
                <Link to="/products?class=12">Class 12</Link>
              </Button>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse text-muted-foreground font-body">
                Loading products...
              </div>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              {!classFilter ? (
                <>
                  {/* Class 11 Section */}
                  {class11Products.length > 0 && (
                    <section className="mb-16">
                      <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-blue" />
                        Class 11 Notes
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {class11Products.map((product, index) => (
                          <ProductCard key={product.id} product={product} index={index} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Class 12 Section */}
                  {class12Products.length > 0 && (
                    <section>
                      <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gradient-pink to-gradient-orange" />
                        Class 12 Notes
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {class12Products.map((product, index) => (
                          <ProductCard key={product.id} product={product} index={index} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground font-body mb-4">
                    No products available yet. Check back soon!
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/">Go Home</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
