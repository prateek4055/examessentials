import { motion } from "framer-motion";
import { Sparkles, FileText, Stethoscope, Image as ImageIcon, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: FileText,
    accentColor: "from-blue-500/20 to-indigo-500/10 text-blue-600",
    title: "Topper Handwritten Notes",
    description:
      "Handcrafted by top-ranking students for CBSE Class 11, 12, NEET & JEE. Mnemonics, color-coded diagrams, and zero textbook filler.",
    badge: "NCERT Aligned",
  },
  {
    icon: ImageIcon,
    accentColor: "from-emerald-500/20 to-teal-500/10 text-emerald-600",
    title: "Clinical-Grade Anatomy Posters",
    description:
      "Printed on 300 GSM heavyweight matte paper with fade-resistant inks. Designed for clinics, hospitals, physiotherapy OPDs, and study walls.",
    badge: "MedPosterHub",
  },
  {
    icon: Stethoscope,
    accentColor: "from-sky-500/20 to-cyan-500/10 text-sky-600",
    title: "Evidence-Based Medical Apps",
    description:
      "292 orthopedic special tests with sensitivity, specificity, and video demonstrations on MedOrtho, trusted by physiotherapists and clinicians.",
    badge: "MedOrtho Live",
  },
  {
    icon: ShieldCheck,
    accentColor: "from-purple-500/20 to-pink-500/10 text-purple-600",
    title: "Protected Instant Delivery",
    description:
      "Personalized watermarked PDFs encrypted with your phone number, dispatched automatically to your WhatsApp and Email within seconds.",
    badge: "Instant Delivery",
  },
];

export const WhySection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/80 border border-black/[0.06] dark:border-white/[0.08] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Built For Precision
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Why Exam Essentials?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            We focus on what matters: high-retention study resources, clinical accuracy, and seamless digital and physical delivery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative p-7 rounded-3xl bg-card/60 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center border border-black/[0.04] dark:border-white/[0.06] group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-secondary/80 text-muted-foreground border border-black/[0.04] dark:border-white/[0.06]">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
