import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Shield, Layers, Stethoscope, GraduationCap, Play } from "lucide-react";
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
  badge?: string;
}

const apps: AppCard[] = [
  {
    name: "Exam Essentials",
    description: "Premium handwritten notes & digital companion ecosystem",
    category: "parent",
  },
  // Medical Apps
  {
    name: "MedOrtho",
    description: "Orthopedic tests, clinical exams & notes",
    image: medorthoLogo,
    category: "medical",
    link: "https://play.google.com/store/apps/details?id=com.prateek.orthoexam",
    internalLink: "/medortho",
    badge: "Live on Play Store",
  },
  {
    name: "MedCardio",
    description: "Cardiology education & 12-lead ECG mastery",
    image: medcardioLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medcardio",
  },
  {
    name: "MedNeuro",
    description: "Neurology clinical skills & neuro-anatomy",
    image: medneuroLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medneuro",
  },
  {
    name: "MedPhysio",
    description: "Physiotherapy kinematics & rehabilitation",
    image: medphysioLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medphysio",
  },
  {
    name: "MedRadio",
    description: "Radiology interpretation, X-Ray & MRI guides",
    image: medradioLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medradio",
  },
  {
    name: "MedPharma",
    description: "High-yield pharmacology classifications & MOA",
    image: medpharmaLogo,
    category: "medical",
    comingSoon: true,
    internalLink: "/medpharma",
  },
  // Exam Apps
  {
    name: "NEET Essentials",
    description: "NCERT Cockpit, 720M CBT Mocks & 40Y PYQs",
    image: neetLogo,
    category: "exam",
    comingSoon: true,
    internalLink: "/neet-app",
    badge: "Preview Locked",
  },
  {
    name: "JEE Essentials",
    description: "PCM advanced problem solver & short notes",
    image: jeeLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "CAT Essentials",
    description: "MBA entrance quantitative & verbal aptitude",
    image: catLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "UPSC Essentials",
    description: "Civil services prelims & GS mindmaps",
    image: upscLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "SSC Essentials",
    description: "Tier I & II speed drills and general studies",
    image: sscLogo,
    category: "exam",
    comingSoon: true,
  },
];

const EcosystemSection = () => {
  const parentApp = apps.find((app) => app.category === "parent");
  const medicalApps = apps.filter((app) => app.category === "medical");
  const examApps = apps.filter((app) => app.category === "exam");

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Background subtle mesh glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-500/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header with Apple Typography */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-secondary/80 border border-black/[0.06] dark:border-white/[0.08] mb-4">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Integrated Suite
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-5"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
            }}
          >
            The Ecosystem.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A cohesive universe of specialized clinical and competitive exam apps
            designed to replace fragmented coaching portals.
          </p>
        </div>

        {/* Flagship Hero Card (Apple Bionic Card Style) */}
        {parentApp && (
          <div className="max-w-5xl mx-auto mb-20">
            <div className="relative rounded-[2rem] p-8 md:p-12 overflow-hidden bg-card/80 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
              {/* Glass subtle light reflection */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20">
                    <Shield className="w-3 h-3" /> Flagship Foundation
                  </div>
                  <h3
                    className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                    }}
                  >
                    Exam Essentials Central
                  </h3>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    The core publishing network delivering verified topper handwritten
                    notes, medical anatomy chart posters, and digital cockpit tools for
                    serious aspirants across India.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-sm"
                  >
                    <span>Browse All Notes</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.prateek.orthoexam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-black/[0.06] dark:border-white/[0.08]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Get MedOrtho</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category 1: Medical & Clinical Apps */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  Medical & Clinical Applications
                </h3>
                <p className="text-xs text-muted-foreground">
                  Practical diagnosis and clinical reference tools for doctors and MBBS students
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {medicalApps.map((app) => {
              const CardContent = (
                <div className="h-full p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-primary/30 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col items-center text-center transition-all duration-300 group">
                  {/* App Icon Tile */}
                  <div className="w-16 h-16 rounded-2xl p-1 bg-secondary/80 border border-black/[0.05] dark:border-white/[0.08] mb-3 group-hover:scale-105 transition-transform duration-300 shadow-sm overflow-hidden flex items-center justify-center">
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="font-bold text-lg text-primary">{app.name.slice(0, 2)}</span>
                    )}
                  </div>

                  <h4 className="font-semibold text-sm text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {app.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-snug mb-4 line-clamp-2">
                    {app.description}
                  </p>

                  <div className="mt-auto w-full pt-1">
                    {app.comingSoon ? (
                      <span className="block w-full py-1 text-[10px] font-semibold text-muted-foreground/80 bg-secondary/60 rounded-full border border-black/[0.03] dark:border-white/[0.05]">
                        Coming Soon
                      </span>
                    ) : app.internalLink ? (
                      <span className="flex items-center justify-center gap-1 w-full py-1 text-[10px] font-semibold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground rounded-full transition-colors">
                        Learn More <ArrowUpRight className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 w-full py-1 text-[10px] font-semibold text-foreground bg-secondary group-hover:bg-primary group-hover:text-primary-foreground rounded-full transition-colors">
                        Install App <ArrowUpRight className="w-2.5 h-2.5" />
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
                  className="h-full"
                >
                  {app.internalLink ? (
                    <Link to={app.internalLink} className="block h-full">
                      {CardContent}
                    </Link>
                  ) : app.link ? (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
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

        {/* Category 2: Competitive Exam Portals */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  Competitive Entrance & Exam Apps
                </h3>
                <p className="text-xs text-muted-foreground">
                  NTA syllabus trackers, question banks & timed CBT mock engines
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {examApps.map((app) => {
              const CardContent = (
                <div className="h-full p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-primary/30 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col items-center text-center transition-all duration-300 group">
                  {/* App Icon Tile */}
                  <div className="w-16 h-16 rounded-2xl p-1 bg-secondary/80 border border-black/[0.05] dark:border-white/[0.08] mb-3 group-hover:scale-105 transition-transform duration-300 shadow-sm overflow-hidden flex items-center justify-center">
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="font-bold text-lg text-primary">{app.name.slice(0, 2)}</span>
                    )}
                  </div>

                  <h4 className="font-semibold text-sm text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {app.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-snug mb-4 line-clamp-2">
                    {app.description}
                  </p>

                  <div className="mt-auto w-full pt-1">
                    {app.name === "NEET Essentials" ? (
                      <span className="flex items-center justify-center gap-1 w-full py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-200/50 dark:border-indigo-800/40">
                        Owner Preview 🔒
                      </span>
                    ) : app.comingSoon ? (
                      <span className="block w-full py-1 text-[10px] font-semibold text-muted-foreground/80 bg-secondary/60 rounded-full border border-black/[0.03] dark:border-white/[0.05]">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 w-full py-1 text-[10px] font-semibold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground rounded-full transition-colors">
                        Launch Web App <ArrowUpRight className="w-2.5 h-2.5" />
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
                  className="h-full"
                >
                  {app.internalLink ? (
                    <Link to={app.internalLink} className="block h-full">
                      {CardContent}
                    </Link>
                  ) : app.link ? (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
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
