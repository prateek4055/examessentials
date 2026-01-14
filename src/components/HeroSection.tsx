import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Import 3D doodle images
import lungsDoodle from "@/assets/doodles/lungs.png";
import heartDoodle from "@/assets/doodles/heart.png";
import brainDoodle from "@/assets/doodles/brain.png";
import prismDoodle from "@/assets/doodles/prism.png";

// 3D doodle elements for floating background - with mobile responsive sizes
const doodleElements = [
  // Left side doodles (desktop: larger, mobile: smaller and repositioned)
  { image: lungsDoodle, x: "2%", y: "15%", rotate: -8, delay: 0, desktopSize: 120, mobileSize: 50 },
  { image: prismDoodle, x: "5%", y: "60%", rotate: 12, delay: 0.4, desktopSize: 90, mobileSize: 40 },
  { image: brainDoodle, x: "3%", y: "80%", rotate: -5, delay: 0.8, desktopSize: 100, mobileSize: 45 },
  
  // Right side doodles
  { image: heartDoodle, x: "88%", y: "12%", rotate: 10, delay: 0.2, desktopSize: 110, mobileSize: 48 },
  { image: brainDoodle, x: "90%", y: "50%", rotate: -12, delay: 0.6, desktopSize: 95, mobileSize: 42 },
  { image: lungsDoodle, x: "85%", y: "82%", rotate: 8, delay: 1.0, desktopSize: 105, mobileSize: 46 },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />
      
      {/* Floating 3D Doodles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }}>
        {doodleElements.map((doodle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5, rotateX: -20 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [0.95, 1.05, 0.95],
              y: [0, -15, 0],
              rotateX: [0, 8, 0],
              rotateY: [-5, 5, -5],
              rotateZ: [doodle.rotate - 3, doodle.rotate + 3, doodle.rotate - 3],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              delay: doodle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute select-none hidden sm:block"
            style={{
              left: doodle.x,
              top: doodle.y,
              width: doodle.desktopSize,
              height: doodle.desktopSize,
              transform: `rotate(${doodle.rotate}deg)`,
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))",
            }}
          >
            <img 
              src={doodle.image} 
              alt="" 
              className="w-full h-full object-contain"
              style={{
                filter: "brightness(1.1) saturate(1.2)",
              }}
            />
          </motion.div>
        ))}
        
        {/* Mobile doodles - smaller and repositioned */}
        {doodleElements.slice(0, 4).map((doodle, index) => (
          <motion.div
            key={`mobile-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.25, 0.45, 0.25],
              scale: [0.95, 1.05, 0.95],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: doodle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute select-none block sm:hidden"
            style={{
              left: index < 2 ? "3%" : "85%",
              top: index % 2 === 0 ? "20%" : "70%",
              width: doodle.mobileSize,
              height: doodle.mobileSize,
              transform: `rotate(${doodle.rotate}deg)`,
              filter: "drop-shadow(0 6px 20px rgba(139, 92, 246, 0.25))",
            }}
          >
            <img 
              src={doodle.image} 
              alt="" 
              className="w-full h-full object-contain"
              style={{
                filter: "brightness(1.1) saturate(1.2)",
              }}
            />
          </motion.div>
        ))}
        
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-gradient-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-gradient-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Exam Essentials
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            A premium ecosystem of exam and medical education apps
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" variant="gradient" className="min-w-[180px]">
              <a href="#ecosystem">Explore Ecosystem</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-w-[180px]">
              <Link to="/products">Browse Notes</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
