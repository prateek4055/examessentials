import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchPublishedProducts, Product } from "@/lib/api";

const categoryLabels: Record<string, string> = {
  "formula-sheet": "Formula Sheets",
  "mindmaps": "Mindmaps",
  "handwritten-notes": "Handwritten Notes",
  "pyqs": "PYQs",
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const classFilter = searchParams.get("class");
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(localSearch.trim())}`);
    } else {
      navigate("/products");
    }
  };

  // Filter products
  let filteredProducts = products;
  
  if (classFilter) {
    filteredProducts = filteredProducts.filter((p) => p.class === classFilter);
  }

  if (categoryFilter) {
    filteredProducts = filteredProducts.filter((p) => p.category === categoryFilter);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.subject.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  const class11Products = filteredProducts.filter((p) => p.class === "11");
  const class12Products = filteredProducts.filter((p) => p.class === "12");

  const pageTitle = categoryFilter
    ? `${categoryLabels[categoryFilter] || categoryFilter} for Class ${classFilter || "11 & 12"} | Best Study Notes`
    : classFilter
    ? `Class ${classFilter} Handwritten Notes | Physics, Chemistry, Maths, Biology`
    : searchQuery
    ? `Search: ${searchQuery} | Study Notes`
    : "All Premium Handwritten Notes | Class 11 & 12 | CBSE, NEET, JEE";

  const pageDescription = categoryFilter
    ? `Buy premium ${categoryLabels[categoryFilter] || categoryFilter} for Class ${classFilter || "11 & 12"}. Best handwritten Physics, Chemistry, Maths, Biology notes by toppers. Instant PDF delivery.`
    : classFilter
    ? `Premium handwritten notes for Class ${classFilter} CBSE students. Physics, Chemistry, Maths, Biology notes for boards, NEET & JEE. Buy now with instant delivery.`
    : "India's best handwritten notes for Class 11 & 12 students. Premium Physics, Chemistry, Maths, Biology notes by toppers. Perfect for CBSE Boards, NEET, JEE preparation.";

  // Use clean canonical URL without query params to avoid duplicate content issues
  const canonicalPath = "/products";

  // Default fallback image for products without images
  const defaultProductImage = "https://examessentials.in/og-image.png";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": pageTitle,
      "description": pageDescription,
      "url": `https://examessentials.in${canonicalPath}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": filteredProducts.length,
        "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.title,
            "description": product.description.slice(0, 200),
            "image": product.images?.[0] || defaultProductImage,
            "url": `https://examessentials.in/product/${product.id}`,
            "sku": product.id,
            "brand": {
              "@type": "Brand",
              "name": "Exam Essentials"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "url": `https://examessentials.in/product/${product.id}`,
              "priceValidUntil": "2026-12-31",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "INR"
                },
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "IN"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "h"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "h"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "IN",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "merchantReturnDays": 0
              }
            }
          }
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://examessentials.in/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": classFilter ? `Class ${classFilter} Notes` : "All Products",
          "item": `https://examessentials.in${canonicalPath}`
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalPath}
        keywords={`${categoryFilter ? categoryLabels[categoryFilter] + " class 11, " + categoryLabels[categoryFilter] + " class 12, " : ""}${classFilter ? "class " + classFilter + " notes, class " + classFilter + " handwritten notes, " : ""}handwritten notes India, CBSE notes PDF, physics notes, chemistry notes, maths notes, biology notes, best study notes, topper notes, NEET notes, JEE notes`}
        structuredData={structuredData}
      />

      <Navbar />
      <main className="min-h-screen pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="search-input pr-14"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-foreground text-background rounded-full hover:opacity-80 transition-opacity"
            >
              <Search className="w-5 h-5" />
            </button>
          </motion.form>

          {/* Class Filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Button
              asChild
              variant={!classFilter && !categoryFilter && !searchQuery ? "default" : "outline"}
              size="sm"
            >
              <Link to="/products">All</Link>
            </Button>
            <Button
              asChild
              variant={classFilter === "11" ? "default" : "outline"}
              size="sm"
            >
              <Link to={categoryFilter ? `/products?class=11&category=${categoryFilter}` : "/products?class=11"}>Class 11</Link>
            </Button>
            <Button
              asChild
              variant={classFilter === "12" ? "default" : "outline"}
              size="sm"
            >
              <Link to={categoryFilter ? `/products?class=12&category=${categoryFilter}` : "/products?class=12"}>Class 12</Link>
            </Button>
          </motion.div>

          {/* Category Filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
          >
            <Button
              asChild
              variant={categoryFilter === "handwritten-notes" ? "default" : "outline"}
              size="sm"
            >
              <Link to={classFilter ? `/products?class=${classFilter}&category=handwritten-notes` : "/products?category=handwritten-notes"}>
                Handwritten Notes
              </Link>
            </Button>
            <Button
              asChild
              variant={categoryFilter === "formula-sheet" ? "default" : "outline"}
              size="sm"
            >
              <Link to={classFilter ? `/products?class=${classFilter}&category=formula-sheet` : "/products?category=formula-sheet"}>
                Formula Sheets
              </Link>
            </Button>
            <Button
              asChild
              variant={categoryFilter === "mindmaps" ? "default" : "outline"}
              size="sm"
            >
              <Link to={classFilter ? `/products?class=${classFilter}&category=mindmaps` : "/products?category=mindmaps"}>
                Mindmaps
              </Link>
            </Button>
            <Button
              asChild
              variant={categoryFilter === "pyqs" ? "default" : "outline"}
              size="sm"
            >
              <Link to={classFilter ? `/products?class=${classFilter}&category=pyqs` : "/products?category=pyqs"}>
                PYQs
              </Link>
            </Button>
          </motion.div>

          {/* Search Results Info */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <p className="text-muted-foreground font-body">
                Showing results for "{searchQuery}" ({filteredProducts.length} products)
              </p>
            </motion.div>
          )}

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
              {!classFilter && !categoryFilter && !searchQuery ? (
                <>
                  {/* Class 11 Section */}
                  {class11Products.length > 0 && (
                    <section className="mb-12">
                      <h2 className="section-header rounded-lg mb-6">
                        Class 11 Notes
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {class11Products.map((product, index) => (
                          <ProductCard key={product.id} product={product} index={index} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Class 12 Section */}
                  {class12Products.length > 0 && (
                    <section>
                      <h2 className="section-header rounded-lg mb-6">
                        Class 12 Notes
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {class12Products.map((product, index) => (
                          <ProductCard key={product.id} product={product} index={index} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <>
                  {(classFilter || categoryFilter) && (
                    <h2 className="section-header rounded-lg mb-6">
                      {categoryFilter ? categoryLabels[categoryFilter] : ""} 
                      {categoryFilter && classFilter ? " - " : ""}
                      {classFilter ? `Class ${classFilter}` : ""}
                    </h2>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                </>
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground font-body mb-4">
                    {searchQuery
                      ? `No products found for "${searchQuery}"`
                      : "No products available yet. Check back soon!"}
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/products">View All Products</Link>
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
