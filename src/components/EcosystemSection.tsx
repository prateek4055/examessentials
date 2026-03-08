import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Import app logos
import neetLogo from "@/assets/apps/neet.png";
import upscLogo from "@/assets/apps/upsc.png";
import catLogo from "@/assets/apps/cat.png";
import sscLogo from "@/assets/apps/ssc.png";
import jeeLogo from "@/assets/apps/jee.png";
import medcardioLogo from "@/assets/apps/medcardio.png";
import medneuroLogo from "@/assets/apps/medneuro.png";
import medpharmaLogo from "@/assets/apps/medpharma.png";
import medphysioLogo from "@/assets/apps/medphysio.png";
import medradioLogo from "@/assets/apps/medradio.png";
import medorthoLogo from "@/assets/apps/medortho.png";

interface AppCard {
  name: string;
  description: string;
  image?: string;
  category: "medical" | "exam" | "parent";
  comingSoon?: boolean;
  link?: string;
}

const apps: AppCard[] = [
  {
    name: "Exam Essentials",
    description: "Premium handwritten notes",
    category: "parent",
  },
  // Medical Apps
  {
    name: "MedOrtho",
    description: "Orthopedic tests & notes",
    image: medorthoLogo,
    category: "medical",
    link: "https://play.google.com/store/apps/details?id=com.prateek.orthoexam",
  },
  {
    name: "MedCardio",
    description: "Cardiology education & ECG",
    image: medcardioLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedNeuro",
    description: "Neuro education & rehab",
    image: medneuroLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedPhysio",
    description: "Physiotherapy & movement",
    image: medphysioLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedRadio",
    description: "Radiology learning",
    image: medradioLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedPharma",
    description: "Pharmacology made easy",
    image: medpharmaLogo,
    category: "medical",
    comingSoon: true,
  },
  // Exam Apps
  {
    name: "NEET Essentials",
    description: "Medical entrance prep",
    image: neetLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "JEE Essentials",
    description: "PCM exam prep",
    image: jeeLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "CAT Essentials",
    description: "MBA entrance prep",
    image: catLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "SSC Essentials",
    description: "Government exams",
    image: sscLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "UPSC Essentials",
    description: "Civil services prep",
    image: upscLogo,
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
      {/* Static gradient background — no JS animation */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gradient-purple) / 0.15) 0%, transparent 70%)",
            filter: "blur(60px)"
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gradient-blue) / 0.15) 0%, transparent 70%)",
            filter: "blur(60px)"
          }}
        />
      </div>

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
            className="flex justify-center mb-16"
          >
            <div
              className="ecosystem-card-parent relative group cursor-default transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-1"
            >
              {/* Static glow — no animation */}
              <div
                className="absolute -inset-1 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--gradient-purple)), hsl(var(--gradient-blue)), hsl(var(--gradient-pink)))",
                  opacity: 0.2,
                  filter: "blur(20px)",
                  zIndex: -1
                }}
              />
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gradient-purple/20 to-gradient-blue/20 mb-4">
                <Sparkles className="w-12 h-12 text-foreground" />
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
            className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8 text-center"
          >
            Medical Education Apps
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {medicalApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {app.link ? (
                  <a href={app.link} target="_blank" rel="noopener noreferrer" className="ecosystem-card group relative overflow-hidden block no-underline">
                    <div className="mb-4 flex justify-center">
                      {app.image && (
                        <img src={app.image} alt={app.name} className="w-24 h-24 min-w-[96px] min-h-[96px] object-cover rounded-xl drop-shadow-lg" loading="lazy" />
                      )}
                    </div>
                    <h4 className="font-display text-base font-semibold text-foreground mb-1">{app.name}</h4>
                    <p className="font-body text-xs text-muted-foreground">{app.description}</p>
                  </a>
                ) : (
                  <div className="ecosystem-card group relative overflow-hidden">
                    {app.comingSoon && (
                      <span className="coming-soon-badge">
                        Coming Soon
                      </span>
                    )}

                    <div className="mb-4 flex justify-center">
                      {app.image ? (
                        <img src={app.image} alt={app.name} className="w-24 h-24 min-w-[96px] min-h-[96px] object-cover rounded-xl drop-shadow-lg" loading="lazy" />
                      ) : (
                        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-blue/20 to-gradient-purple/20">
                          <Sparkles className="w-8 h-8 text-brand-blue" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-display text-base font-semibold text-foreground mb-1">{app.name}</h4>
                    <p className="font-body text-xs text-muted-foreground">{app.description}</p>
                  </div>
                )}
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
            className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8 text-center"
          >
            Exam Preparation Apps
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {examApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="ecosystem-card group relative overflow-hidden">
                  {app.comingSoon && (
                    <span className="coming-soon-badge">
                      Coming Soon
                    </span>
                  )}

                  {/* App Logo */}
                  <div className="mb-4 flex justify-center">
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-24 h-24 min-w-[96px] min-h-[96px] object-cover rounded-xl drop-shadow-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-brand-orange/20 to-gradient-pink/20">
                        <Sparkles className="w-8 h-8 text-brand-orange" />
                      </div>
                    )}
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
