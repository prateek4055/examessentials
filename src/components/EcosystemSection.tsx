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
    <section className="py-24 bg-background relative overflow-hidden" style={{ perspective: "1200px" }}>
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

        {/* Parent App - Center Card with enhanced 3D */}
        {parentApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            viewport={{ once: true }}
            className="flex justify-center mb-16"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
              className="ecosystem-card-parent relative"
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
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gradient-purple/20 to-gradient-blue/20 mb-4">
                <Sparkles className="w-12 h-12 text-foreground" />
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
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
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
                          className="w-20 h-20 object-contain relative z-10 drop-shadow-2xl"
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
                          className="w-20 h-20 object-contain relative z-10 drop-shadow-2xl"
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
