import { motion } from "framer-motion";
import { CheckCircle, Sparkles, FileText, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Exam-Focused Content",
    description:
      "Notes crafted specifically for board exams and competitive entrance tests. Every topic is curated based on exam patterns and weightage.",
  },
  {
    icon: Sparkles,
    title: "Handwritten Clarity",
    description:
      "Beautiful handwritten notes that feel personal and are easier to understand. Diagrams, flowcharts, and memory aids included.",
  },
  {
    icon: Zap,
    title: "Quick Revision",
    description:
      "Concise summaries and key points highlighted for last-minute revision. Save hours of study time with organized content.",
  },
  {
    icon: CheckCircle,
    title: "Proven Results",
    description:
      "Created by top scorers who understand what it takes to excel. Join thousands of successful students.",
  },
];

const WhySection = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Why <span className="gradient-text">&nbsp;Exam Essentials&nbsp;</span>?
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            We understand the pressure of exams. That's why we created notes that
            actually help you learn faster and remember longer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-muted-foreground/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-gradient-purple/20 to-gradient-blue/20 border border-border">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
