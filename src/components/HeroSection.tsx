import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Import 3D doodle images
import lungsDoodle from "@/assets/doodles/lungs.png";
import heartDoodle from "@/assets/doodles/heart.png";
import brainDoodle from "@/assets/doodles/brain.png";
import prismDoodle from "@/assets/doodles/prism.png";
import atomDoodle from "@/assets/doodles/atom.png";
import dnaDoodle from "@/assets/doodles/dna.png";
import geometryDoodle from "@/assets/doodles/geometry.png";
import moleculeDoodle from "@/assets/doodles/molecule.png";

// 3D doodle elements for floating background
const doodleElements = [
  // Left side doodles - Biology & Chemistry
  { image: lungsDoodle, x: "2%", y: "18%", rotate: -8, delay: 0, size: 120 },
  { image: atomDoodle, x: "6%", y: "42%", rotate: 12, delay: 0.4, size: 100 },
  { image: dnaDoodle, x: "3%", y: "68%", rotate: -5, delay: 0.8, size: 110 },
  { image: geometryDoodle, x: "12%", y: "85%", rotate: 10, delay: 1.2, size: 90 },
  
  // Right side doodles - Physics & Math
  { image: heartDoodle, x: "84%", y: "12%", rotate: 10, delay: 0.2, size: 115 },
  { image: moleculeDoodle, x: "88%", y: "38%", rotate: -12, delay: 0.6, size: 95 },
  { image: brainDoodle, x: "85%", y: "62%", rotate: 8, delay: 1.0, size: 110 },
  { image: prismDoodle, x: "80%", y: "82%", rotate: -8, delay: 1.4, size: 85 },
  
  // Additional floating elements for depth
  { image: prismDoodle, x: "18%", y: "28%", rotate: 15, delay: 0.3, size: 70 },
  { image: atomDoodle, x: "75%", y: "25%", rotate: -10, delay: 0.7, size: 75 },
  { image: geometryDoodle, x: "15%", y: "55%", rotate: -6, delay: 1.1, size: 65 },
  { image: dnaDoodle, x: "78%", y: "75%", rotate: 12, delay: 0.9, size: 80 },
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
              opacity: [0.35, 0.65, 0.35],
              scale: [0.95, 1.08, 0.95],
              y: [0, -25, 0],
              rotateX: [0, 10, 0],
              rotateY: [-8, 8, -8],
              rotateZ: [doodle.rotate - 4, doodle.rotate + 4, doodle.rotate - 4],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              delay: doodle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute select-none"
            style={{
              left: doodle.x,
              top: doodle.y,
              width: doodle.size,
              height: doodle.size,
              transform: `rotate(${doodle.rotate}deg)`,
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 12px 35px rgba(139, 92, 246, 0.35)) drop-shadow(0 6px 15px rgba(0, 0, 0, 0.25))",
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
        
        {/* Glow orbs for ambiance */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-purple/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-blue/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-gradient-purple/5 to-gradient-blue/5 rounded-full blur-3xl" />
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
