import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, CheckCircle, Target, Brain, Microscope } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchPublishedProducts, Product } from "@/lib/api";

const NeetNotes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchPublishedProducts();
      // Filter products relevant to NEET (Biology, Physics, Chemistry)
      const neetSubjects = ["biology", "physics", "chemistry", "zoology", "botany"];
      setProducts(data.filter((p) => 
        neetSubjects.includes(p.subject.toLowerCase())
      ));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subjects = [
    { name: "Biology", icon: Microscope },
    { name: "Physics", icon: Target },
    { name: "Chemistry", icon: Brain },
  ];
  
  const benefits = [
    "Complete NEET syllabus coverage (Class 11 + 12)",
    "NCERT-based content - the gold standard for NEET",
    "Important diagrams and flowcharts for Biology",
    "Physics numericals and derivations",
    "Organic Chemistry reactions and mechanisms",
    "Previous year question analysis included",
  ];

  const faqs = [
    {
      question: "Are these notes enough for NEET preparation?",
      answer: "Our notes cover the complete NEET syllabus based on NCERT. They're designed as your primary study material. We recommend using these alongside solving previous year papers and mock tests for comprehensive preparation."
    },
    {
      question: "Do Biology notes cover both Botany and Zoology?",
      answer: "Yes! Our Biology notes comprehensively cover both Botany and Zoology sections with detailed diagrams, important points, and NEET-specific content. All NCERT topics are covered in depth."
    },
    {
      question: "Which class notes should I buy for NEET - 11 or 12?",
      answer: "NEET covers both Class 11 and 12 syllabus. We recommend buying notes for both classes. Class 11 forms the foundation while Class 12 topics carry more weightage in NEET."
    },
    {
      question: "Are Physics formulas and derivations included?",
      answer: "Yes, our Physics notes include all important formulas, derivations explained step-by-step, and conceptual explanations. Perfect for NEET Physics section."
    },
    {
      question: "How are these notes different from regular notes?",
      answer: "Our notes are NEET-focused - they emphasize topics based on NEET weightage, include previous year patterns, and have quick revision sections. Created by NEET qualifiers who understand the exam."
    },
  ];

  const neetStats = [
    { label: "Biology Questions", value: "90/180" },
    { label: "Physics Questions", value: "45/180" },
    { label: "Chemistry Questions", value: "45/180" },
    { label: "Total Marks", value: "720" },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "NEET Notes - Biology, Physics, Chemistry | Handwritten Study Material",
      "description": "Premium handwritten notes for NEET preparation. Complete Biology, Physics, and Chemistry notes covering Class 11 & 12 NCERT syllabus. By NEET qualifiers.",
      "url": "https://examessentials.in/neet-notes",
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
        { "@type": "ListItem", "position": 2, "name": "NEET Notes", "item": "https://examessentials.in/neet-notes" }
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
        title="NEET Notes 2025 - Biology, Physics, Chemistry | Best Handwritten Notes PDF"
        description="Buy premium NEET handwritten notes for Biology, Physics & Chemistry. Complete NCERT-based content for Class 11 & 12. Created by NEET qualifiers. Score 600+ with our study material. Instant PDF."
        canonical="/neet-notes"
        keywords="NEET notes, NEET biology notes, NEET physics notes, NEET chemistry notes, NEET preparation, NEET study material, NEET 2025 notes, handwritten notes NEET, NCERT notes NEET, best NEET notes, NEET topper notes"
        structuredData={structuredData}
      />

      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">NEET Notes</span>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-accent text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              NEET 2025 Preparation
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              NEET Handwritten Notes
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Crack NEET with premium handwritten notes created by qualifiers. Complete NCERT-based Biology, Physics, and Chemistry notes covering both Class 11 & 12 syllabus. Study smarter, score higher.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  to={`/products?search=${subject.name.toLowerCase()}`}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-medium text-foreground transition-colors"
                >
                  <subject.icon className="w-4 h-4" />
                  {subject.name} Notes
                </Link>
              ))}
            </div>
          </motion.div>

          {/* NEET Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          >
            {neetStats.map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-4 border border-border text-center"
              >
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Introduction Content - for SEO */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-4xl mx-auto mb-12"
          >
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Your Complete NEET Study Companion</h2>
              <p className="text-muted-foreground mb-4">
                NEET (National Eligibility cum Entrance Test) is India's most competitive medical entrance exam with over 20 lakh students appearing annually. With Biology carrying 50% weightage (90 questions), followed by Physics and Chemistry (45 questions each), your study strategy matters.
              </p>
              <p className="text-muted-foreground mb-4">
                Our NEET notes are created by students who cleared NEET and are now pursuing MBBS. They understand exactly what works - NCERT mastery, diagram practice, and concept clarity. Every page is designed to maximize retention and help you score 600+.
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
              NEET Study Materials
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
                <p className="text-muted-foreground mb-4">No NEET notes available yet. Check out our Class 11 & 12 notes!</p>
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
            <h2 className="text-xl font-semibold text-foreground mb-6">Explore by Class</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/class-11-notes">Class 11 Notes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/class-12-notes">Class 12 Notes</Link>
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

export default NeetNotes;
