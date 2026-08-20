import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// Import app logos
import neetLogo from "@/assets/apps/neet.webp";
import upscLogo from "@/assets/apps/upsc.webp";
import catLogo from "@/assets/apps/cat.webp";
import sscLogo from "@/assets/apps/ssc.webp";
import jeeLogo from "@/assets/apps/jee.webp";
import medcardioLogo from "@/assets/apps/medcardio.webp";
import medneuroLogo from "@/assets/apps/medneuro.webp";
import medpharmaLogo from "@/assets/apps/medpharma.webp";
import medphysioLogo from "@/assets/apps/medphysio.webp";
import medradioLogo from "@/assets/apps/medradio.webp";
import medorthoLogo from "@/assets/apps/medortho.webp";

interface AppCard {
  name: string;
  description: string;
  image?: string;
  category: "medical" | "exam" | "parent";
  comingSoon?: boolean;
  link?: string;
  internalLink?: string;
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
    internalLink: "/medortho",
  },
  {
    name: "MedCardio",
    description: "Cardiology education & ECG",
    image: medcardioLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medcardio",
  },
  {
    name: "MedNeuro",
    description: "Neuro education & rehab",
    image: medneuroLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medneuro",
  },
  {
    name: "MedPhysio",
    description: "Physiotherapy & movement",
    image: medphysioLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medphysio",
  },
  {
    name: "MedRadio",
    description: "Radiology learning",
    image: medradioLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medradio",
  },
  {
    name: "MedPharma",
    description: "Pharmacology made easy",
    image: medpharmaLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medpharma",
  },
  // Exam Apps
  {
    name: "CAT Essentials",
    description: "MBA entrance prep",
    image: catLogo,
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
  {
    name: "NEET Essentials",
    description: "NCERT Cockpit & 720M CBT Mocks",
    image: neetLogo,
    category: "exam",
    comingSoon: true,
    internalLink: "/neet-app",
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
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Exam Essentials Ecosystem</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Growing Family of{" "}
            <span className="gradient-text">Educational Apps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Dedicated applications designed to simplify complex subjects with visual learning,
            clinical tests, and comprehensive exam preparation.
          </p>
        </div>

        {/* Parent App Showcase */}
        {parentApp && (
          <div className="mb-16">
            <div className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden border border-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                    Flagship Platform
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold">{parentApp.name}</h3>
                  <p className="text-muted-foreground max-w-xl">
                    The central hub for all high-yield handwritten medical notes, study material,
                    and foundation for our specialized app ecosystem.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.prateek.orthoexam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow px-6 py-3 rounded-xl font-medium text-sm inline-flex items-center gap-2"
                  >
                    <span>View on Play Store</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Apps Grid */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Medical & Clinical Apps
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {medicalApps.map((app) => {
              const CardContent = (
                <div className="glass-card p-4 rounded-2xl text-center flex flex-col items-center group relative overflow-hidden h-full">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* App Icon */}
                  <div className="relative w-16 h-16 mb-3 rounded-2xl overflow-hidden bg-muted/50 p-1 group-hover:scale-105 transition-transform duration-300">
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-primary">
                        {app.name.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* App Name */}
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{app.name}</h4>

                  {/* App Description */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{app.description}</p>

                  {/* Status / Link Button */}
                  <div className="mt-auto pt-2 w-full">
                    {app.comingSoon ? (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground block text-center">
                        Coming Soon
                      </span>
                    ) : app.internalLink ? (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary block text-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Learn More
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary block text-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Get App
                      </span>
                    )}
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={app.name}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {app.internalLink ? (
                    <Link to={app.internalLink} className="block h-full cursor-pointer">
                      {CardContent}
                    </Link>
                  ) : app.link ? (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full cursor-pointer"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div className="h-full">{CardContent}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Competitive Exam Apps Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Competitive Exam Apps
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {examApps.map((app) => {
              const CardContent = (
                <div className="glass-card p-4 rounded-2xl text-center flex flex-col items-center group relative overflow-hidden h-full">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* App Icon */}
                  <div className="relative w-16 h-16 mb-3 rounded-2xl overflow-hidden bg-muted/50 p-1 group-hover:scale-105 transition-transform duration-300">
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center font-bold text-accent">
                        {app.name.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* App Name */}
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{app.name}</h4>

                  {/* App Description */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{app.description}</p>

                  {/* Status / Link Button */}
                  <div className="mt-auto pt-2 w-full">
                    {app.comingSoon ? (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground block text-center">
                        Coming Soon
                      </span>
                    ) : app.internalLink ? (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold block text-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                        Launch Web App
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent block text-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        Get App
                      </span>
                    )}
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={app.name}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {app.internalLink ? (
                    <Link to={app.internalLink} className="block h-full cursor-pointer">
                      {CardContent}
                    </Link>
                  ) : app.link ? (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full cursor-pointer"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div className="h-full">{CardContent}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
