import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchProductById, Product } from "@/lib/api";

// Combo pricing options
const comboOptions = [
  { id: "single", label: "Single Subject", price: null }, // Uses product price
  { id: "phy-chem", label: "Physics + Chemistry", price: 99 },
  { id: "pcm", label: "PCM Combo", price: 139 },
  { id: "pcb", label: "PCB Combo", price: 149 },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCombo, setSelectedCombo] = useState("single");

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayPrice = () => {
    const selected = comboOptions.find(opt => opt.id === selectedCombo);
    if (selected?.price !== null) return selected?.price;
    return product?.price || 0;
  };

  const features = [
    "Handwritten for better retention",
    "Exam-focused content only",
    "Clear diagrams & flowcharts",
    "Quick revision summaries",
    "Instant PDF delivery",
  ];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground font-body">
            Loading...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <Button asChild variant="outline">
              <Link to="/products">Browse All Notes</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.title} | Exam Essentials</title>
        <meta
          name="description"
          content={`${product.title} - ${product.description}. Premium handwritten notes for Class ${product.class} ${product.subject}.`}
        />
      </Helmet>

      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Product Image / Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative rounded-2xl border border-border overflow-hidden bg-secondary">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={product.images[currentImageIndex]}
                        alt={`${product.title} - Image ${currentImageIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                    </AnimatePresence>
                    
                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev === 0 ? product.images!.length - 1 : prev - 1
                          )}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => 
                            prev === product.images!.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-foreground" />
                        </button>
                      </>
                    )}

                    {/* Class Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 text-sm font-body font-medium bg-secondary text-secondary-foreground rounded-full border border-border">
                        Class {product.class}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.images.map((img, index) => (
                        <button
                          key={img}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? "border-gold"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-card to-secondary border border-border flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gradient-purple to-gradient-blue flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-foreground" />
                    </div>
                    <p className="font-display text-2xl font-bold text-foreground mb-2">
                      {product.subject}
                    </p>
                    <p className="text-muted-foreground font-body">
                      Premium Handwritten Notes
                    </p>
                  </div>

                  {/* Class Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 text-sm font-body font-medium bg-secondary text-secondary-foreground rounded-full border border-border">
                      Class {product.class}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Subject */}
              <p className="text-sm font-body text-gold uppercase tracking-wider mb-2">
                {product.subject}
              </p>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.title}
              </h1>

              {/* Description */}
              <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* What's Included */}
              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="font-body text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Combo Selection */}
              <div className="mb-8">
                <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Select Option
                </h3>
                <div className="flex flex-wrap gap-2">
                  {comboOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedCombo(option.id)}
                      className={`px-4 py-2 rounded-lg border text-sm font-body font-medium transition-all ${
                        selectedCombo === option.id
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground hover:border-accent/50"
                      }`}
                    >
                      {option.label}
                      {option.price !== null && (
                        <span className="ml-2 text-xs opacity-75">₹{option.price}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="mt-auto pt-8 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">
                      {selectedCombo !== "single" ? "Combo Price" : "One-time payment"}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-4xl font-display font-bold text-foreground">
                        ₹{getDisplayPrice()}
                      </p>
                      {selectedCombo !== "single" && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{(comboOptions.find(o => o.id === selectedCombo)?.label.includes("PCM") ? 199 : 
                             comboOptions.find(o => o.id === selectedCombo)?.label.includes("PCB") ? 209 : 149)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button asChild variant="gradient" size="xl" className="w-full">
                  <Link to={`/purchase/${product.id}?combo=${selectedCombo}&price=${getDisplayPrice()}`}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4 font-body">
                  Secure payment via Razorpay. Instant PDF delivery.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
