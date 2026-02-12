import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchPublishedProducts, Product } from "@/lib/api";

const Class11Notes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchPublishedProducts();
      setProducts(data.filter((p) => p.class === "11"));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subjects = ["Physics", "Chemistry", "Maths", "Biology"];
  
  const benefits = [
    "Comprehensive coverage of CBSE Class 11 syllabus",
    "Handwritten by toppers for better retention",
    "Exam-focused content with important questions",
    "Clear diagrams, flowcharts and derivations",
    "Perfect foundation for NEET & JEE preparation",
    "Instant PDF delivery after purchase",
  ];

  const faqs = [
    {
      question: "Are these notes good for CBSE Class 11 board exams?",
      answer: "Yes! Our Class 11 notes are specifically designed for CBSE board exams. They cover the complete syllabus with exam-focused content, important questions, and clear explanations."
    },
    {
      question: "Can I use these notes for NEET preparation?",
      answer: "Absolutely! Class 11 forms the foundation for NEET. Our notes cover all NEET-relevant topics with detailed explanations and diagrams that help in competitive exam preparation."
    },
    {
      question: "Are JEE topics covered in these notes?",
      answer: "Yes, our Class 11 notes include all JEE Main and Advanced topics. Physics and Chemistry notes have derivations and problem-solving approaches suitable for JEE."
    },
    {
      question: "What format are the notes delivered in?",
      answer: "All notes are delivered as high-quality PDF files instantly after payment. You can view them on any device and print them if needed."
    },
    {
      question: "Do you offer combo discounts?",
      answer: "Yes! We offer combo discounts when you purchase multiple subjects together. PCM (Physics + Chemistry + Maths), PCB (Physics + Chemistry + Biology), and PCMB combos are available at discounted prices."
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Class 11 Handwritten Notes - Physics, Chemistry, Maths, Biology",
      "description": "Premium handwritten notes for Class 11 CBSE students. Complete Physics, Chemistry, Maths, and Biology notes by toppers. Perfect for board exams, NEET & JEE preparation.",
      "url": "https://examessentials.in/class-11-notes",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": products.length,
        "itemListElement": products.slice(0, 10).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.title,
            "description": product.description.slice(0, 200),
            "image": product.images?.[0] || "https://examessentials.in/og-image.png",
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
                "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
                "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "IN" },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "HUR" },
                  "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "HUR" }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "IN",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "merchantReturnDays": 0
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150",
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://examessentials.in/" },
        { "@type": "ListItem", "position": 2, "name": "Class 11 Notes", "item": "https://examessentials.in/class-11-notes" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  return (
    <>
      <SEOHead
        title="Class 11 Notes - Physics, Chemistry, Maths, Biology | Handwritten Notes PDF"
        description="Buy premium Class 11 handwritten notes for Physics, Chemistry, Maths & Biology. CBSE board exam focused content by toppers. Perfect for NEET & JEE foundation. Instant PDF delivery."
        canonical="/class-11-notes"
        keywords="class 11 notes, class 11 physics notes, class 11 chemistry notes, class 11 maths notes, class 11 biology notes, CBSE class 11 notes, handwritten notes class 11, topper notes class 11, NEET class 11, JEE class 11 notes"
        structuredData={structuredData}
      />

      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Class 11 Notes</span>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Class 11 Handwritten Notes
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Premium handwritten notes for CBSE Class 11 students. Complete syllabus coverage for Physics, Chemistry, Maths, and Biology. Build a strong foundation for board exams, NEET, and JEE with notes written by toppers.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {subjects.map((subject) => (
                <Link
                  key={subject}
                  to={`/products?class=11&search=${subject.toLowerCase()}`}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-medium text-foreground transition-colors"
                >
                  {subject} Notes
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Introduction Content - for SEO */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-4xl mx-auto mb-12"
          >
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Why Choose Our Class 11 Notes?</h2>
              <p className="text-muted-foreground mb-4">
                Class 11 is a crucial year that lays the foundation for Class 12 board exams, NEET, and JEE. Our handwritten notes are carefully crafted by toppers who understand exactly what students need to succeed. Each note is designed to help you understand concepts deeply while saving valuable study time.
              </p>
              <p className="text-muted-foreground mb-4">
                Whether you're preparing for CBSE board exams, building your foundation for NEET medical entrance, or getting ready for JEE engineering entrance, our Class 11 notes provide the perfect study material. We cover all subjects - Physics, Chemistry, Mathematics, and Biology - with complete syllabus coverage.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Products Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="section-header rounded-lg mb-6">
              <BookOpen className="w-5 h-5 inline-block mr-2" />
              All Class 11 Notes
            </h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-pulse text-muted-foreground">Loading products...</div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No Class 11 notes available yet.</p>
                <Button asChild variant="outline">
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            )}
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Internal Links */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Explore More Notes</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/class-12-notes">Class 12 Notes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/neet-notes">NEET Notes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/products">All Products</Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Class11Notes;
