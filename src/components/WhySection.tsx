import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, FileText, Zap, Compass, Trophy } from "lucide-react";

const features = [
  {
    icon: FileText,
    accentColor: "from-blue-500/20 to-indigo-500/10 text-blue-600",
    title: "Exam-Focused Precision",
    description:
      "Engineered specifically for NEET, JEE & CBSE Boards. Every formula, trap, and NCERT reference is aligned with real weightage.",
    badge: "100% Aligned",
  },
  {
    icon: Sparkles,
    accentColor: "from-purple-500/20 to-pink-500/10 text-purple-600",
    title: "Topper Handwritten Visuals",
    description:
      "Handwritten clarity with mnemonic callouts, high-resolution flowcharts, and zero visual clutter to speed up cognitive recall.",
    badge: "Visual Recall",
  },
  {
    icon: Zap,
    accentColor: "from-amber-500/20 to-orange-500/10 text-amber-600",
    title: "Rapid 15-Minute Revision",
    description:
      "Curated cheat-sheets and high-yield unit summaries designed to compress entire 60-page chapters into crisp 5-minute passes.",
    badge: "3x Faster",
  },
  {
    icon: Trophy,
    accentColor: "from-emerald-500/20 to-teal-500/10 text-emerald-600",
    title: "Proven Medical Track Record",
    description:
      "Created with inputs from top medical students and GMC toppers who cracked the nation's most competitive rank boundaries.",
    badge: "Top Tier",
  },
];

const WhySection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 mb-4">
            <Compass className="w-3.5 h-3.5" />
            Engineering The Standard
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
            }}
          >
            Why Exam Essentials?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            We removed the filler textbooks and endless video playlists. Everything
            is crafted for maximum retention in minimum hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative p-7 rounded-3xl bg-card/60 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Subtle top-right badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center border border-black/[0.04] dark:border-white/[0.06] group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-secondary/80 text-muted-foreground border border-black/[0.04] dark:border-white/[0.06]">
                    {feature.badge}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors"
                  style={{
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                  }}
                >
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
