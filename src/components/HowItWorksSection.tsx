import { motion } from "framer-motion";
import { Search, ShoppingCart, Download } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse Notes",
    description: "Explore our collection of handwritten notes for your class and subjects.",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Quick Purchase",
    description: "Fill a simple form and complete secure payment via Razorpay.",
  },
  {
    icon: Download,
    step: "03",
    title: "Receive PDF",
    description: "Get your notes delivered to your email instantly after payment.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Get started in minutes. No complicated signup, no waiting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative z-10">
                {/* Step number */}
                <div className="inline-block mb-4">
                  <span className="text-6xl font-display font-bold text-secondary">
                    {step.step}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gradient-purple to-gradient-blue flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
