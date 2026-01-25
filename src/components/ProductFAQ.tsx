import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Product } from "@/lib/api";

interface ProductFAQProps {
  product: Product;
}

const ProductFAQ = ({ product }: ProductFAQProps) => {
  // Generate dynamic FAQs based on product details
  const generateFAQs = () => {
    const faqs = [
      {
        question: `What is included in the ${product.title}?`,
        answer: `This ${product.subject} notes package includes complete handwritten notes covering the entire Class ${product.class} syllabus. You'll get detailed explanations, diagrams, flowcharts, important formulas, and revision summaries - all in a clear, easy-to-understand format written by toppers.`
      },
      {
        question: `Are these notes good for CBSE board exams?`,
        answer: `Absolutely! Our Class ${product.class} ${product.subject} notes are specifically designed for CBSE board exams. They cover all NCERT topics with exam-focused content, previous year question patterns, and important points highlighted for quick revision.`
      },
      {
        question: `Can I use these notes for ${product.class === "11" || product.class === "12" ? "NEET/JEE" : "competitive exams"}?`,
        answer: `Yes! Our ${product.subject} notes are designed to serve dual purposes - board exam preparation and competitive exam foundation. The content depth and coverage make them suitable for NEET, JEE, and other entrance exams.`
      },
      {
        question: `In what format will I receive the notes?`,
        answer: `You'll receive the notes as a high-quality PDF file immediately after successful payment. The PDF can be viewed on any device (mobile, tablet, laptop) and can be printed if you prefer physical copies.`
      },
      {
        question: `How are these notes different from textbooks?`,
        answer: `Unlike textbooks, our handwritten notes are concise, exam-focused, and written by students who excelled in these subjects. They highlight only what matters for exams, include memory tricks, and present information in a way that's easier to retain and revise.`
      },
    ];

    return faqs;
  };

  const faqs = generateFAQs();

  // Structured data for FAQPage
  const faqStructuredData = {
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
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="max-w-4xl mx-auto mt-16"
    >
      {/* Add FAQ structured data */}
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-card rounded-xl p-6 border border-border hover:border-accent/30 transition-colors"
          >
            <h3 className="font-semibold text-foreground mb-2 text-lg">
              {faq.question}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ProductFAQ;
