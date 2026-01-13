import { motion } from "framer-motion";
import { Stethoscope, Brain, Bone, Radio, Pill, GraduationCap, Calculator, Briefcase, Building2, Award, Sparkles } from "lucide-react";

interface AppCard {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "medical" | "exam" | "parent";
  comingSoon?: boolean;
}

const apps: AppCard[] = [
  {
    name: "Exam Essentials",
    description: "Premium handwritten notes",
    icon: Sparkles,
    category: "parent",
  },
  // Medical Apps
  {
    name: "MedOrtho",
    description: "Orthopedic tests & notes",
    icon: Bone,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedNeuro",
    description: "Neuro education & rehab",
    icon: Brain,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedAnat",
    description: "Anatomy simplified",
    icon: Stethoscope,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedRadio",
    description: "Radiology learning",
    icon: Radio,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedPharma",
    description: "Pharmacology made easy",
    icon: Pill,
    category: "medical",
    comingSoon: true,
  },
  // Exam Apps
  {
    name: "NEET Essentials",
    description: "Medical entrance prep",
    icon: Stethoscope,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "JEE Essentials",
    description: "PCM exam prep",
    icon: Calculator,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "CAT Essentials",
    description: "MBA entrance prep",
    icon: Briefcase,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "SSC Essentials",
    description: "Government exams",
    icon: Building2,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "UPSC Essentials",
    description: "Civil services prep",
    icon: Award,
    category: "exam",
    comingSoon: true,
  },
];

const EcosystemSection = () => {
  const parentApp = apps.find((app) => app.category === "parent");
  const medicalApps = apps.filter((app) => app.category === "medical");
  const examApps = apps.filter((app) => app.category === "exam");

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            One Parent Brand.{" "}
            <span className="text-gradient-purple">Multiple Specialized Apps.</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Building the future of education with focused, specialized applications
          </p>
        </motion.div>

        {/* Parent App - Center Card */}
        {parentApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="ecosystem-card-parent">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gradient-purple/20 to-gradient-blue/20 mb-4">
                <parentApp.icon className="w-12 h-12 text-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {parentApp.name}
              </h3>
              <p className="font-body text-muted-foreground">
                {parentApp.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Medical Apps */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center"
          >
            Medical Education Apps
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {medicalApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ecosystem-card group">
                  {app.comingSoon && (
                    <span className="coming-soon-badge">Coming Soon</span>
                  )}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-brand-blue/20 to-gradient-purple/20 mb-3 group-hover:from-brand-blue/30 group-hover:to-gradient-purple/30 transition-all">
                    <app.icon className="w-6 h-6 text-brand-blue" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-1">
                    {app.name}
                  </h4>
                  <p className="font-body text-xs text-muted-foreground">
                    {app.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Exam Apps */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center"
          >
            Exam Preparation Apps
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {examApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ecosystem-card group">
                  {app.comingSoon && (
                    <span className="coming-soon-badge">Coming Soon</span>
                  )}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-brand-orange/20 to-gradient-pink/20 mb-3 group-hover:from-brand-orange/30 group-hover:to-gradient-pink/30 transition-all">
                    <app.icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-1">
                    {app.name}
                  </h4>
                  <p className="font-body text-xs text-muted-foreground">
                    {app.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
