import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { CheckCircle } from "lucide-react";

const About = () => {
  const features = [
    "Easy to understand",
    "Cleanly handwritten for better recall",
    "Focused on important concepts and formulas",
    "Made to save time during revision",
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Exam Essentials",
      "description": "India's #1 premium handwritten notes for Class 11 & 12 students",
      "url": "https://examessentials.in/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "Exam Essentials",
        "description": "Premium handwritten notes for Class 11 & 12 students. We create exam-focused study materials for CBSE Boards, NEET & JEE preparation.",
        "foundingDate": "2024",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "knowsAbout": ["CBSE Education", "NEET Preparation", "JEE Preparation", "Class 11 Notes", "Class 12 Notes"]
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
          "name": "About Us",
          "item": "https://examessentials.in/about"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us - India's #1 Handwritten Notes Provider"
        description="Exam Essentials creates premium handwritten notes that simplify complex topics for Class 11 & 12 students. Trusted by thousands for CBSE Boards, NEET & JEE preparation."
        canonical="/about"
        keywords="about exam essentials, handwritten notes company India, best study materials, CBSE notes provider, NEET notes, JEE notes, topper notes"
        structuredData={structuredData}
      />
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                About <span className="gradient-text">Exam Essentials</span>
              </h1>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 text-muted-foreground font-body text-lg leading-relaxed"
            >
              <p>
                At Exam Essentials, we believe that good notes can change the way students learn.
              </p>

              <p>
                Most students struggle not because they don't study hard, but because they don't have clear, focused, and well-organized study material. Textbooks are often lengthy, scattered, and time-consuming to revise. That's where we come in.
              </p>

              <p>
                We create carefully structured handwritten notes that simplify complex topics, highlight what actually matters for exams, and make revision faster and more effective. Every note is designed with one goal in mind — <span className="text-foreground font-semibold">clarity</span>.
              </p>

              {/* Features List */}
              <div className="py-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Our notes are:</h2>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <p>
                Whether you're revising a chapter, preparing for an exam, or just want better study material, Exam Essentials is built to support smarter learning.
              </p>

              <div className="pt-4 border-t border-border">
                <p className="text-foreground font-medium">
                  We're not here to overwhelm you with content —
                </p>
                <p className="text-foreground font-medium">
                  we're here to help you <span className="gradient-text">learn better</span>, <span className="gradient-text">revise faster</span>, and <span className="gradient-text">feel more confident</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
