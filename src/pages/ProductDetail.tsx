import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, ShoppingCart, ChevronLeft, ChevronRight, Shield, BadgeCheck, Lock, Headphones, MessageCircle, Users } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MindMapsComboSection from "@/components/MindMapsComboSection";
import { Button } from "@/components/ui/button";
import { fetchProductById, fetchPublishedProducts, Product } from "@/lib/api";
import { addToCart, addMultipleToCart, getComboSubjects, comboConfigs, clearCart } from "@/lib/cartUtils";
import { toast } from "sonner";

// Combo pricing options - ONLY for non-mindmaps products
const comboOptions = [
  { id: "single", label: "Single Subject", price: null }, // Uses product price
  { id: "phy-chem", label: "Physics + Chemistry", price: 99 },
  { id: "pcm", label: "PCM Combo", price: 139 },
  { id: "pcb", label: "PCB Combo", price: 149 },
  { id: "pcmb", label: "PCMB Combo", price: 179 },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCombo, setSelectedCombo] = useState("single");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      const [data, products] = await Promise.all([
        fetchProductById(id),
        fetchPublishedProducts()
      ]);
      setProduct(data);
      setAllProducts(products);
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

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      if (selectedCombo === "single") {
        // Add just this product
        addToCart(product.id);
        toast.success("Added to cart!", {
          description: `${product.title} added successfully.`,
          action: {
            label: "View Cart",
            onClick: () => navigate("/cart"),
          },
        });
      } else {
        // Add all products in the combo
        const comboSubjects = getComboSubjects(selectedCombo);
        const sameClassProducts = allProducts.filter(p => p.class === product.class);
        const comboProductIds = sameClassProducts
          .filter(p => comboSubjects.map(s => s.toLowerCase()).includes(p.subject.toLowerCase()))
          .map(p => p.id);
        
        if (comboProductIds.length > 0) {
          addMultipleToCart(comboProductIds);
          const comboLabel = comboConfigs.find(c => c.id === selectedCombo)?.label || "Combo";
          toast.success(`${comboLabel} added to cart!`, {
            description: `${comboProductIds.length} subjects added. Discount will be applied at checkout.`,
            action: {
              label: "View Cart",
              onClick: () => navigate("/cart"),
            },
          });
        }
      }
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Check if product is a Mind Map
  const isMindMap = product?.category === "mindmaps";

  // Handle Mind Maps combo selection from the dedicated section
  const handleMindMapsComboSelect = (comboProductIds: string[]) => {
    clearCart(); // Clear cart first
    addMultipleToCart(comboProductIds);
    toast.success("Combo added to cart!", {
      description: `${comboProductIds.length} Mind Maps added. Proceeding to cart.`,
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
    navigate("/cart");
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

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images?.[0] || "https://examessentials.in/favicon.png",
    "brand": {
      "@type": "Brand",
      "name": "Exam Essentials"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://examessentials.in/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Exam Essentials"
      }
    },
    "category": `Class ${product.class} ${product.subject} Notes`
  };

  return (
    <>
      <SEOHead
        title={`${product.title} - Class ${product.class} ${product.subject} Notes`}
        description={`${product.title} - ${product.description.slice(0, 150)}. Premium handwritten notes for Class ${product.class} ${product.subject}. Instant PDF delivery.`}
        canonical={`/product/${product.id}`}
        ogImage={product.images?.[0] || "https://examessentials.in/favicon.png"}
        ogType="product"
        keywords={`${product.subject} notes, class ${product.class} ${product.subject}, ${product.title}, CBSE ${product.subject} notes, handwritten notes`}
        structuredData={productStructuredData}
      />

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
              <div className="mb-8">
                <ul className="space-y-2">
                  {product.description
                    .split(/[.•\n]/)
                    .map(point => point.trim())
                    .filter(point => point.length > 0)
                    .map((point, index) => (
                      <li key={index} className="font-body text-muted-foreground leading-relaxed">
                        {point}
                      </li>
                    ))}
                </ul>
              </div>

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

              {/* Combo Selection - Only for non-mindmaps products */}
              {!isMindMap && (
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
              )}

              {/* Price & CTA */}
              <div className="mt-auto pt-8 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">
                      {!isMindMap && selectedCombo !== "single" ? "Combo Price" : "One-time payment"}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-4xl font-display font-bold text-foreground">
                        ₹{isMindMap ? product?.price : getDisplayPrice()}
                      </p>
                      {!isMindMap && selectedCombo !== "single" && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{selectedCombo === "pcmb" ? 259 : 
                             selectedCombo === "pcb" ? 209 : 
                             selectedCombo === "pcm" ? 199 : 149}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="gradient" 
                  size="xl" 
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>

                {/* Trust Bar */}
                <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground font-body">Razorpay</p>
                        <p className="text-[10px] text-emerald-500 font-body">Trusted Business</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground font-body">Verified</p>
                        <p className="text-[10px] text-muted-foreground font-body">Business</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground font-body">Secured</p>
                        <p className="text-[10px] text-muted-foreground font-body">Payments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground font-body">Prompt</p>
                        <p className="text-[10px] text-muted-foreground font-body">Support</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href="https://api.whatsapp.com/send?phone=919876543210&text=Hi!%20I'm%20interested%20in%20Exam%20Essentials%20notes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary border border-border rounded-xl text-foreground font-body font-medium hover:bg-secondary/80 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  Enquire on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl mx-auto mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center p-6 bg-secondary/30 rounded-xl border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                  100% Safe & Secure Payments
                </h4>
                <p className="text-sm text-muted-foreground font-body">
                  All transactions are encrypted and secure
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-secondary/30 rounded-xl border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                  Trusted by 1000+ Students
                </h4>
                <p className="text-sm text-muted-foreground font-body">
                  Join our community of successful learners
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mind Maps Combo Section - Only for Mind Maps products */}
          {isMindMap && (
            <MindMapsComboSection
              currentProduct={product}
              allProducts={allProducts}
              onSelectCombo={handleMindMapsComboSelect}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
