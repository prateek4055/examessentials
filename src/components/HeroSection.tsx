import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Science doodle elements for floating background
const doodleElements = [
  // Physics
  { symbol: "E = mc²", x: "5%", y: "15%", rotate: -15, delay: 0, scale: 1.2 },
  { symbol: "F = ma", x: "88%", y: "20%", rotate: 12, delay: 0.3, scale: 1 },
  { symbol: "λ = h/p", x: "12%", y: "75%", rotate: 8, delay: 0.6, scale: 1.1 },
  { symbol: "v = fλ", x: "82%", y: "70%", rotate: -10, delay: 0.9, scale: 0.9 },
  
  // Chemistry
  { symbol: "H₂O", x: "8%", y: "40%", rotate: 20, delay: 0.2, scale: 1.3 },
  { symbol: "CO₂", x: "92%", y: "45%", rotate: -18, delay: 0.5, scale: 1 },
  { symbol: "NaCl", x: "15%", y: "60%", rotate: 5, delay: 0.8, scale: 1.1 },
  { symbol: "CH₄", x: "85%", y: "85%", rotate: -8, delay: 1.1, scale: 0.95 },
  
  // Maths
  { symbol: "∫ dx", x: "3%", y: "30%", rotate: -12, delay: 0.4, scale: 1.15 },
  { symbol: "Σ", x: "95%", y: "35%", rotate: 15, delay: 0.7, scale: 1.4 },
  { symbol: "π r²", x: "10%", y: "85%", rotate: 10, delay: 1.0, scale: 1 },
  { symbol: "√x", x: "90%", y: "60%", rotate: -20, delay: 1.3, scale: 1.2 },
  { symbol: "∞", x: "6%", y: "55%", rotate: 0, delay: 0.1, scale: 1.5 },
  { symbol: "dy/dx", x: "94%", y: "15%", rotate: -5, delay: 1.4, scale: 1 },
  
  // Biology
  { symbol: "DNA", x: "18%", y: "25%", rotate: -8, delay: 0.35, scale: 1.1 },
  { symbol: "ATP", x: "80%", y: "30%", rotate: 12, delay: 0.65, scale: 1.05 },
  { symbol: "RNA", x: "20%", y: "70%", rotate: 18, delay: 0.95, scale: 0.9 },
  { symbol: "O₂", x: "78%", y: "80%", rotate: -15, delay: 1.25, scale: 1.15 },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />
      
      {/* Floating 3D Science Doodles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }}>
        {doodleElements.map((doodle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5, rotateX: -30 }}
            animate={{ 
              opacity: [0.15, 0.35, 0.15],
              scale: [doodle.scale * 0.95, doodle.scale * 1.05, doodle.scale * 0.95],
              y: [0, -15, 0],
              rotateX: [0, 10, 0],
              rotateZ: [doodle.rotate - 3, doodle.rotate + 3, doodle.rotate - 3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: doodle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute font-body font-bold select-none"
            style={{
              left: doodle.x,
              top: doodle.y,
              fontSize: `${1.2 * doodle.scale}rem`,
              color: "hsl(var(--muted-foreground))",
              textShadow: `
                0 0 20px hsl(var(--gradient-purple) / 0.3),
                0 0 40px hsl(var(--gradient-blue) / 0.2),
                0 4px 8px hsl(0 0% 0% / 0.5)
              `,
              transform: `rotate(${doodle.rotate}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {doodle.symbol}
          </motion.div>
        ))}
        
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-blue/10 rounded-full blur-3xl" />
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