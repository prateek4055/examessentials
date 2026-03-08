import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Import 3D doodle images
import lungsDoodle from "@/assets/doodles/lungs.png";
import heartDoodle from "@/assets/doodles/heart.png";
import brainDoodle from "@/assets/doodles/brain.png";
import prismDoodle from "@/assets/doodles/prism.png";

// Doodle elements — CSS-animated for compositor-thread performance
const doodleElements = [
  // Left side
  { image: lungsDoodle, x: "2%", y: "15%", rotate: -8, delay: "0s", desktopSize: 120, mobileSize: 50 },
  { image: prismDoodle, x: "5%", y: "60%", rotate: 12, delay: "-2s", desktopSize: 90, mobileSize: 40 },
  { image: brainDoodle, x: "3%", y: "80%", rotate: -5, delay: "-4s", desktopSize: 100, mobileSize: 45 },
  // Right side
  { image: heartDoodle, x: "88%", y: "12%", rotate: 10, delay: "-1s", desktopSize: 110, mobileSize: 48 },
  { image: brainDoodle, x: "90%", y: "50%", rotate: -12, delay: "-3s", desktopSize: 95, mobileSize: 42 },
  { image: lungsDoodle, x: "85%", y: "82%", rotate: 8, delay: "-5s", desktopSize: 105, mobileSize: 46 },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Soft gradient orbs for depth */}
      <div className="absolute inset-0 bg-background" />

      {/* Floating Doodles — CSS-only animation, no JS per-frame computation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {doodleElements.map((doodle, index) => (
          <div
            key={index}
            className="absolute select-none hidden sm:block doodle-float"
            style={{
              left: doodle.x,
              top: doodle.y,
              width: doodle.desktopSize,
              height: doodle.desktopSize,
              transform: `rotate(${doodle.rotate}deg)`,
              animationDelay: doodle.delay,
              opacity: 0.5,
              willChange: "transform",
            }}
          >
            <img
              src={doodle.image}
              alt=""
              className="w-full h-full object-contain"
              loading="lazy"
              style={{
                filter: "brightness(1.1) saturate(1.2)",
              }}
            />
          </div>
        ))}

        {/* Mobile doodles — only 2 for performance */}
        {doodleElements.slice(0, 2).map((doodle, index) => (
          <div
            key={`mobile-${index}`}
            className="absolute select-none block sm:hidden doodle-float"
            style={{
              left: index === 0 ? "3%" : "85%",
              top: index === 0 ? "20%" : "70%",
              width: doodle.mobileSize,
              height: doodle.mobileSize,
              transform: `rotate(${doodle.rotate}deg)`,
              animationDelay: doodle.delay,
              opacity: 0.4,
              willChange: "transform",
            }}
          >
            <img
              src={doodle.image}
              alt=""
              className="w-full h-full object-contain"
              loading="lazy"
              style={{
                filter: "brightness(1.1) saturate(1.2)",
              }}
            />
          </div>
        ))}

        {/* Soft glow orbs — static, no animation */}
        <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 rounded-full blur-3xl" style={{ background: 'hsl(260 65% 60% / 0.12)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 rounded-full blur-3xl" style={{ background: 'hsl(220 85% 58% / 0.1)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'hsl(340 75% 60% / 0.06)' }} />
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
