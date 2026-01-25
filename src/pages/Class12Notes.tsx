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

const Class12Notes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchPublishedProducts();
      setProducts(data.filter((p) => p.class === "12"));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subjects = ["Physics", "Chemistry", "Maths", "Biology"];
  
  const benefits = [
    "Complete CBSE Class 12 board syllabus coverage",
    "Handwritten by toppers who scored 95%+",
    "Important questions and previous year patterns",
    "Detailed derivations and solved numericals",
    "Final revision notes and quick summaries",
    "Instant PDF delivery after purchase",
  ];

  const faqs = [
    {
      question: "Are these notes sufficient for CBSE Class 12 board exams?",
      answer: "Yes! Our Class 12 notes comprehensively cover the entire CBSE syllabus. They include all important topics, previous year question patterns, and detailed explanations - perfect for scoring 90%+ in boards."
    },
    {
      question: "Will these notes help me in NEET 2025/2026?",
      answer: "Absolutely! Our Class 12 notes are designed keeping NEET syllabus in mind. Biology, Physics, and Chemistry notes cover all NEET-relevant topics with the depth required for competitive exams."
    },
    {
      question: "Do Physics notes include derivations and numericals?",
      answer: "Yes, our Class 12 Physics notes include all important derivations step-by-step, solved numericals, and conceptual explanations. Perfect for both boards and JEE/NEET."
    },
    {
      question: "Can I use Chemistry notes for both Organic and Inorganic?",
      answer: "Our Chemistry notes cover all three sections - Physical, Organic, and Inorganic Chemistry - with named reactions, mechanisms, and important concepts clearly explained."
    },
    {
      question: "How soon will I receive the notes after payment?",
      answer: "You'll receive the PDF notes instantly after successful payment. The download link will be sent to your email and will also be available in your account."
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Class 12 Handwritten Notes - Physics, Chemistry, Maths, Biology",
      "description": "Premium handwritten notes for Class 12 CBSE students. Complete Physics, Chemistry, Maths, and Biology notes by toppers. Perfect for board exams, NEET & JEE preparation.",
      "url": "https://examessentials.in/class-12-notes",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": products.length,
        "itemListElement": products.slice(0, 10).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.title,
            "url": `https://examessentials.in/product/${product.id}`
          }
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://examessentials.in/" },
        { "@type": "ListItem", "position": 2, "name": "Class 12 Notes", "item": "https://examessentials.in/class-12-notes" }
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
        title="Class 12 Notes - Physics, Chemistry, Maths, Biology | Handwritten Notes PDF"
        description="Buy premium Class 12 handwritten notes for Physics, Chemistry, Maths & Biology. CBSE board exam focused content by 95%+ scorers. Essential for NEET & JEE 2025. Instant PDF delivery."
        canonical="/class-12-notes"
        keywords="class 12 notes, class 12 physics notes, class 12 chemistry notes, class 12 maths notes, class 12 biology notes, CBSE class 12 notes, handwritten notes class 12, topper notes class 12, NEET notes, JEE notes, board exam notes"
        structuredData={structuredData}
      />

      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Class 12 Notes</span>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Class 12 Handwritten Notes
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Premium handwritten notes for CBSE Class 12 board exams. Complete syllabus coverage for Physics, Chemistry, Maths, and Biology. Score 90%+ in boards and crack NEET/JEE with notes written by toppers who achieved it.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {subjects.map((subject) => (
                <Link
                  key={subject}
                  to={`/products?class=12&search=${subject.toLowerCase()}`}
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
              <h2 className="text-xl font-semibold mb-4 text-foreground">Why Our Class 12 Notes Are a Game-Changer</h2>
              <p className="text-muted-foreground mb-4">
                Class 12 is the most important year for any student. Board exam results matter for college admissions, and the same syllabus forms the base for NEET and JEE. Our handwritten notes are created by students who scored 95%+ in boards and cracked top competitive exams.
              </p>
              <p className="text-muted-foreground mb-4">
                Every note is designed for maximum efficiency - clear explanations, important formulas highlighted, derivations explained step-by-step, and quick revision points. Whether you need Physics notes with all derivations, Chemistry notes with organic reactions, or Biology notes with diagrams - we've got you covered.
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
              All Class 12 Notes
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
                <p className="text-muted-foreground mb-4">No Class 12 notes available yet.</p>
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
                <Link to="/class-11-notes">Class 11 Notes</Link>
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

export default Class12Notes;
