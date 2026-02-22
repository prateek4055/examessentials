import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What are Exam Essentials handwritten notes?",
    answer:
      "Exam Essentials provides premium handwritten notes for Class 11 & 12 students covering Physics, Chemistry, Maths, and Biology. Our notes are created by toppers and are specifically designed for CBSE Board exams, NEET, and JEE preparation.",
  },
  {
    question: "How are the notes delivered?",
    answer:
      "All our notes are delivered instantly as digital PDFs. After successful payment, you'll receive the download link via email and can also access it from your account dashboard.",
  },
  {
    question: "Are these notes good for NEET and JEE preparation?",
    answer:
      "Yes! Our notes are comprehensive and cover all important concepts, formulas, and diagrams required for both CBSE Board exams and competitive exams like NEET and JEE. They are created with exam-focused content by toppers.",
  },
  {
    question: "Which subjects are available?",
    answer:
      "We offer handwritten notes for Physics, Chemistry, Mathematics, and Biology for both Class 11 and Class 12. We also have formula sheets, mind maps, and previous year question papers (PYQs).",
  },
  {
    question: "Are combo offers available?",
    answer:
      "Yes! We offer special combo pricing for multiple subjects. You can get Physics + Chemistry combo, PCM (Physics, Chemistry, Maths), PCB (Physics, Chemistry, Biology), and PCMB (all 4 subjects) at discounted prices.",
  },
];

// Structured data for FAQ
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQSection = () => {
  return (
    <section className="py-20 bg-secondary/30" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="faq-heading" className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Find answers to common questions about our handwritten notes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-display text-lg font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
