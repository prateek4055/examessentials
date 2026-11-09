import { motion } from "framer-motion";
import { ArrowUpRight, Stethoscope, GraduationCap, Play, Layers } from "lucide-react";
import { Link } from "react-router-dom";

// Import app logos
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
  image: string;
  category: "medical" | "exam";
  comingSoon?: boolean;
  link?: string;
  internalLink?: string;
  badge?: string;
}

const medicalApps: AppCard[] = [
  {
    name: "MedOrtho",
    description: "Complete orthopedic physical examination reference with 292 special tests, diagnostic sensitivity/specificity data, and video demonstrations.",
    image: medorthoLogo,
    category: "medical",
    link: "https://play.google.com/store/apps/details?id=com.prateek.orthoexam",
    internalLink: "/medortho",
    badge: "Live on Play Store & Web",
  },
  {
    name: "MedCardio",
    description: "Cardiology clinical examination, 12-lead ECG interpretation, and high-yield cardiac pathology notes.",
    image: medcardioLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedNeuro",
    description: "Neurological clinical examination, cranial nerve assessment, dermatomes, and neuroanatomy.",
    image: medneuroLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedPhysio",
    description: "Physiotherapy joint kinematics, muscle testing, manual therapy protocols, and rehabilitation guides.",
    image: medphysioLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedRadio",
    description: "Diagnostic radiology interpretation, systematic X-Ray reading, CT anatomy, and MRI guides.",
    image: medradioLogo,
    category: "medical",
    comingSoon: true,
  },
  {
    name: "MedPharma",
    description: "High-yield pharmacology drug classifications, mechanisms of action, and adverse effects.",
    image: medpharmaLogo,
    category: "medical",
    comingSoon: true,
  },
];

const examApps: AppCard[] = [
  {
    name: "JEE Essentials",
    description: "PCM advanced formulas, high-yield problem solver shortcuts, and topper mindmaps for JEE Main & Advanced.",
    image: jeeLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "CAT Essentials",
    description: "Quantitative aptitude tricks, data interpretation drills, and verbal reasoning frameworks.",
    image: catLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "UPSC Essentials",
    description: "Civil services prelims & mains structured GS mindmaps, current affairs summaries, and revision guides.",
    image: upscLogo,
    category: "exam",
    comingSoon: true,
  },
  {
    name: "SSC Essentials",
    description: "Tier I & II speed drills, general studies question banks, and rapid formula charts.",
    image: sscLogo,
    category: "exam",
    comingSoon: true,
  },
];

export const EcosystemSection = () => {
  const flagshipApp = medicalApps[0]; // MedOrtho

  return (
    <section id="ecosystem" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-secondary/80 border border-black/[0.06] dark:border-white/[0.08] mb-4">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Software Ecosystem
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Dedicated Learning Apps.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Specialized clinical references and competitive exam companions engineered to replace bulky textbooks.
          </p>
        </div>

        {/* ─── FLAGSHIP SPOTLIGHT: MEDORTHO ─── */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-zinc-950 border border-blue-200/60 dark:border-blue-900/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="flex items-start sm:items-center gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-white dark:bg-zinc-800 shadow-md border border-black/[0.06] overflow-hidden shrink-0">
                  <img
                    src={flagshipApp.image}
                    alt={flagshipApp.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ● Live on Android &amp; Web
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      292 Special Tests
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {flagshipApp.name} — Orthopedic Clinical Reference
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                    {flagshipApp.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full md:w-auto">
                <Link
                  to={flagshipApp.internalLink!}
                  className="flex-1 md:flex-none text-center px-5 py-3 rounded-full text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
                >
                  Open Free Web Wiki
                </Link>
                <a
                  href={flagshipApp.link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 border border-black/[0.08] dark:border-white/[0.1] text-foreground hover:bg-secondary/60 transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-500" />
                  <span>Google Play</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* ─── MEDICAL APPS SUITE ─── */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6 pb-2.5 border-b border-border/60">
            <Stethoscope className="w-4 h-4 text-primary" />
            <h3 className="text-base font-bold text-foreground tracking-tight uppercase tracking-wider text-xs">
              Medical &amp; Clinical Sciences Suite
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {medicalApps.slice(1).map((app) => (
              <div
                key={app.name}
                className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-12 h-12 rounded-xl p-1 bg-secondary/80 border border-black/[0.05] dark:border-white/[0.08] overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-black/[0.04]">
                      In Development
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-foreground tracking-tight mb-1">
                    {app.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── COMPETITIVE EXAMS SUITE ─── */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6 pb-2.5 border-b border-border/60">
            <GraduationCap className="w-4 h-4 text-primary" />
            <h3 className="text-base font-bold text-foreground tracking-tight uppercase tracking-wider text-xs">
              Competitive Entrance Exam Suite
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {examApps.map((app) => (
              <div
                key={app.name}
                className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-11 h-11 rounded-xl p-1 bg-secondary/80 border border-black/[0.05] dark:border-white/[0.08] overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-black/[0.04]">
                      Coming Soon
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground tracking-tight mb-1">
                    {app.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default EcosystemSection;
