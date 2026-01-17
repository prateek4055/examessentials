import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

// Import app logos
import examEssentialsLogo from "@/assets/exam-essentials-logo.png";
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
    comingSoon: true,
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

// Tree Root SVG Component
const TreeRoots = ({ scrollProgress }: { scrollProgress: any }) => {
  const pathLength1 = useTransform(scrollProgress, [0, 0.3], [0, 1]);
  const pathLength2 = useTransform(scrollProgress, [0.1, 0.4], [0, 1]);
  const pathLength3 = useTransform(scrollProgress, [0.15, 0.45], [0, 1]);
  const pathLength4 = useTransform(scrollProgress, [0.2, 0.5], [0, 1]);
  const pathLength5 = useTransform(scrollProgress, [0.25, 0.55], [0, 1]);
  const pathLength6 = useTransform(scrollProgress, [0.3, 0.6], [0, 1]);
  const pathLength7 = useTransform(scrollProgress, [0.05, 0.35], [0, 1]);
  const pathLength8 = useTransform(scrollProgress, [0.12, 0.42], [0, 1]);
  const pathLength9 = useTransform(scrollProgress, [0.18, 0.48], [0, 1]);
  const pathLength10 = useTransform(scrollProgress, [0.22, 0.52], [0, 1]);
  const pathLength11 = useTransform(scrollProgress, [0.28, 0.58], [0, 1]);

  return (
    <svg
      className="absolute left-1/2 top-[280px] -translate-x-1/2 w-full max-w-5xl h-[600px] pointer-events-none z-0"
      viewBox="0 0 1000 600"
      fill="none"
      preserveAspectRatio="xMidYMin meet"
    >
      <defs>
        <linearGradient id="rootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(270, 70%, 65%)" stopOpacity="0.8" />
          <stop offset="50%" stopColor="hsl(210, 100%, 65%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(145, 60%, 50%)" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Medical Apps Roots (Left side - 6 apps) */}
      {/* MedOrtho - far left */}
      <motion.path
        d="M500 50 Q500 100 350 150 Q200 200 80 350"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength1 }}
        strokeLinecap="round"
      />
      {/* MedCardio */}
      <motion.path
        d="M500 50 Q500 100 380 140 Q280 180 180 350"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength2 }}
        strokeLinecap="round"
      />
      {/* MedNeuro */}
      <motion.path
        d="M500 50 Q500 110 420 140 Q360 180 320 350"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength3 }}
        strokeLinecap="round"
      />
      {/* MedPhysio */}
      <motion.path
        d="M500 50 Q500 110 540 140 Q600 180 680 350"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength4 }}
        strokeLinecap="round"
      />
      {/* MedRadio */}
      <motion.path
        d="M500 50 Q500 100 600 140 Q700 180 820 350"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength5 }}
        strokeLinecap="round"
      />
      {/* MedPharma - far right */}
      <motion.path
        d="M500 50 Q500 100 620 150 Q780 200 920 350"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength6 }}
        strokeLinecap="round"
      />

      {/* Exam Apps Roots (Bottom - 5 apps) */}
      {/* NEET Essentials */}
      <motion.path
        d="M500 50 Q500 200 200 450 Q120 500 100 550"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength7 }}
        strokeLinecap="round"
      />
      {/* JEE Essentials */}
      <motion.path
        d="M500 50 Q500 220 350 450 Q300 500 300 550"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength8 }}
        strokeLinecap="round"
      />
      {/* CAT Essentials - center */}
      <motion.path
        d="M500 50 Q500 250 500 450 Q500 500 500 550"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength9 }}
        strokeLinecap="round"
      />
      {/* SSC Essentials */}
      <motion.path
        d="M500 50 Q500 220 650 450 Q700 500 700 550"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength10 }}
        strokeLinecap="round"
      />
      {/* UPSC Essentials */}
      <motion.path
        d="M500 50 Q500 200 800 450 Q880 500 900 550"
        stroke="url(#rootGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
        style={{ pathLength: pathLength11 }}
        strokeLinecap="round"
      />
    </svg>
  );
};

const EcosystemSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const parentApp = apps.find((app) => app.category === "parent");
  const medicalApps = apps.filter((app) => app.category === "medical");
  const examApps = apps.filter((app) => app.category === "exam");

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden" style={{ perspective: "1200px" }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gradient-purple) / 0.15) 0%, transparent 70%)",
            filter: "blur(60px)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [-20, 20, -20],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gradient-blue) / 0.15) 0%, transparent 70%)",
            filter: "blur(60px)"
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [20, -20, 20],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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

        {/* Parent App - Center Card with Logo */}
        {parentApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            viewport={{ once: true }}
            className="flex justify-center mb-16 relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
              className="ecosystem-card-parent relative z-10"
              animate={{
                y: [-10, 10, -10],
                rotateZ: [-1, 1, -1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: "0 25px 80px hsl(var(--gradient-purple) / 0.4), 0 0 100px hsl(var(--gradient-purple) / 0.2)"
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Animated glow ring */}
              <motion.div 
                className="absolute -inset-1 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--gradient-purple)), hsl(var(--gradient-blue)), hsl(var(--gradient-pink)))",
                  opacity: 0.3,
                  filter: "blur(20px)",
                  zIndex: -1
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Logo Image with glow */}
              <div className="relative mb-4">
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--gradient-purple) / 0.4) 0%, transparent 70%)",
                    filter: "blur(20px)"
                  }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.img 
                  src={examEssentialsLogo}
                  alt="Exam Essentials"
                  className="w-40 h-40 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-2xl"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {parentApp.name}
              </h3>
              <p className="font-body text-muted-foreground">
                {parentApp.description}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Tree Roots Animation */}
        <TreeRoots scrollProgress={scrollYProgress} />

        {/* Medical Apps */}
        <div className="mb-16 relative z-10">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8 text-center"
          >
            Medical Education Apps
          </motion.h3>
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            style={{ perspective: "1000px" }}
          >
            {medicalApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ 
                  opacity: 0, 
                  y: 60,
                  rotateX: -15,
                  scale: 0.9
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                  rotateY: 5,
                }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="ecosystem-card group relative overflow-hidden">
                  {/* 3D depth shadow */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(145deg, hsl(var(--gradient-purple) / 0.1), transparent)",
                      transform: "translateZ(-10px)"
                    }}
                  />
                  
                  {app.comingSoon && (
                    <motion.span 
                      className="coming-soon-badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      Coming Soon
                    </motion.span>
                  )}
                  
                  {/* App Logo with 3D effect */}
                  <motion.div 
                    className="mb-4 flex justify-center"
                    whileHover={{ scale: 1.1, rotateY: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {app.image ? (
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: "radial-gradient(circle, hsl(var(--gradient-purple) / 0.3) 0%, transparent 70%)",
                            filter: "blur(15px)"
                          }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [0.9, 1.1, 0.9]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <img 
                          src={app.image} 
                          alt={app.name}
                          className="w-24 h-24 min-w-[96px] min-h-[96px] object-cover rounded-xl relative z-10 drop-shadow-2xl"
                        />
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-brand-blue/20 to-gradient-purple/20">
                        <Sparkles className="w-8 h-8 text-brand-blue" />
                      </div>
                    )}
                  </motion.div>
                  
                  <h4 className="font-display text-base font-semibold text-foreground mb-1">
                    {app.name}
                  </h4>
                  <p className="font-body text-xs text-muted-foreground">
                    {app.description}
                  </p>
                  
                  {/* Hover glow effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--gradient-purple) / 0.05), hsl(var(--gradient-blue) / 0.05))",
                      opacity: 0
                    }}
                    whileHover={{ opacity: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Exam Apps */}
        <div className="relative z-10">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8 text-center"
          >
            Exam Preparation Apps
          </motion.h3>
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            style={{ perspective: "1000px" }}
          >
            {examApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ 
                  opacity: 0, 
                  y: 60,
                  rotateX: -15,
                  scale: 0.9
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                  rotateY: 5,
                }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="ecosystem-card group relative overflow-hidden">
                  {/* 3D depth shadow */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(145deg, hsl(var(--gradient-orange) / 0.1), transparent)",
                      transform: "translateZ(-10px)"
                    }}
                  />
                  
                  {app.comingSoon && (
                    <motion.span 
                      className="coming-soon-badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      Coming Soon
                    </motion.span>
                  )}
                  
                  {/* App Logo with 3D effect */}
                  <motion.div 
                    className="mb-4 flex justify-center"
                    whileHover={{ scale: 1.1, rotateY: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {app.image ? (
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: "radial-gradient(circle, hsl(var(--gradient-orange) / 0.3) 0%, transparent 70%)",
                            filter: "blur(15px)"
                          }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [0.9, 1.1, 0.9]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                        />
                        <img 
                          src={app.image} 
                          alt={app.name}
                          className="w-24 h-24 min-w-[96px] min-h-[96px] object-cover rounded-xl relative z-10 drop-shadow-2xl"
                        />
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-brand-orange/20 to-gradient-pink/20">
                        <Sparkles className="w-8 h-8 text-brand-orange" />
                      </div>
                    )}
                  </motion.div>
                  
                  <h4 className="font-display text-base font-semibold text-foreground mb-1">
                    {app.name}
                  </h4>
                  <p className="font-body text-xs text-muted-foreground">
                    {app.description}
                  </p>
                  
                  {/* Hover glow effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--gradient-orange) / 0.05), hsl(var(--gradient-pink) / 0.05))",
                      opacity: 0
                    }}
                    whileHover={{ opacity: 1 }}
                  />
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
