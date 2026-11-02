import React, { useEffect, useRef, useState } from "react";

export type MorphShape = "brain" | "heart" | "lungs" | "dna";

interface AstraMorphHeroProps {
  className?: string;
}

/**
 * Generate normalized coordinate point clouds in range [-1, 1]
 */
const generatePoints = (shape: MorphShape, count: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];

  if (shape === "heart") {
    // 2D Cardioid / Heart formula:
    // x = 16 * sin^3(t)
    // y = -(13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t))
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.96 + 0.04;
      const x = (16 * Math.pow(Math.sin(t), 3)) / 17;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17;
      points.push({ x: x * r * 0.95, y: y * r * 0.95 });
    }
  } else if (shape === "brain") {
    // 2-Hemisphere Cerebrum with cortical sulci/gyri curves + brainstem
    for (let i = 0; i < count; i++) {
      if (i < count * 0.15) {
        // Brain stem / cerebellum base
        const x = (Math.random() - 0.5) * 0.28;
        const y = 0.45 + Math.random() * 0.35;
        points.push({ x, y });
      } else {
        const isLeft = i % 2 === 0;
        const side = isLeft ? -1 : 1;
        const angle = Math.random() * Math.PI * 1.8 - 0.9;
        const rInner = Math.sqrt(Math.random());
        // Gyri convolutions
        const ripple = 0.68 + 0.12 * Math.sin(angle * 7) + 0.06 * Math.cos(angle * 13);
        const x = side * (0.1 + Math.abs(Math.cos(angle)) * ripple * 0.85 * rInner);
        const y = Math.sin(angle) * ripple * 0.82 * rInner - 0.12;
        points.push({ x, y });
      }
    }
  } else if (shape === "lungs") {
    // Trachea branch + Left & Right Bronchial Lung Lobes
    for (let i = 0; i < count; i++) {
      if (i < count * 0.14) {
        // Trachea tube
        const x = (Math.random() - 0.5) * 0.08;
        const y = -0.85 + Math.random() * 0.45;
        points.push({ x, y });
      } else {
        // Bilateral lung lobes
        const isLeft = i % 2 === 0;
        const side = isLeft ? -1 : 1;
        const u = Math.random() * Math.PI * 2;
        const rInner = Math.sqrt(Math.random());
        const rawX = Math.cos(u) * 0.38 * rInner;
        const rawY = Math.sin(u) * 0.58 * rInner;
        const x = side * (0.4 + Math.abs(rawX) * 0.88);
        const y = rawY + 0.04 + rawX * side * 0.22;
        points.push({ x, y });
      }
    }
  } else if (shape === "dna") {
    // Double Helix Spiral
    for (let i = 0; i < count; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const progress = i / count;
      const t = progress * Math.PI * 5;
      const y = (progress * 2 - 1) * 0.82;
      const x = Math.sin(t) * 0.48 * strand;

      if (Math.random() < 0.22) {
        // Base pair bridging dots
        const rung = Math.random() * 2 - 1;
        points.push({ x: Math.sin(t) * 0.48 * rung, y });
      } else {
        points.push({ x: x + (Math.random() - 0.5) * 0.06, y });
      }
    }
  }

  return points;
};

export const AstraMorphHero: React.FC<AstraMorphHeroProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentShape, setCurrentShape] = useState<MorphShape>("brain");

  const PARTICLE_COUNT = 900;
  const shapesCycle: MorphShape[] = ["brain", "heart", "lungs", "dna"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      radius: 140 * window.devicePixelRatio,
    };

    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      baseSize: number;
      colorAlpha: number;
      phase: number;
    }

    const shapeTargets: Record<MorphShape, { x: number; y: number }[]> = {
      brain: generatePoints("brain", PARTICLE_COUNT),
      heart: generatePoints("heart", PARTICLE_COUNT),
      lungs: generatePoints("lungs", PARTICLE_COUNT),
      dna: generatePoints("dna", PARTICLE_COUNT),
    };

    let activeShape: MorphShape = "brain";

    const getPixelTarget = (normX: number, normY: number) => {
      // Fit in the upper-middle background behind the hero
      const isMobile = width < 768 * (window.devicePixelRatio || 1);
      const scale = isMobile ? Math.min(width, height) * 0.46 : Math.min(width, height) * 0.38;
      const centerX = width * 0.5;
      const centerY = height * 0.46;
      return {
        x: centerX + normX * scale,
        y: centerY + normY * scale,
      };
    };

    const particles: Particle[] = [];
    const dpr = window.devicePixelRatio || 1;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const target = getPixelTarget(shapeTargets.brain[i].x, shapeTargets.brain[i].y);
      particles.push({
        x: target.x + (Math.random() - 0.5) * 500 * dpr,
        y: target.y + (Math.random() - 0.5) * 500 * dpr,
        targetX: target.x,
        targetY: target.y,
        vx: 0,
        vy: 0,
        baseSize: (1.3 + Math.random() * 1.6) * dpr,
        colorAlpha: 0.4 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const setMorphTarget = (shape: MorphShape) => {
      activeShape = shape;
      setCurrentShape(shape);
      const targets = shapeTargets[shape];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const pt = getPixelTarget(targets[i].x, targets[i].y);
        particles[i].targetX = pt.x;
        particles[i].targetY = pt.y;
      }
    };

    // Auto morph every 5.5 seconds
    let cycleIndex = 0;
    const morphTimer = setInterval(() => {
      cycleIndex = (cycleIndex + 1) % shapesCycle.length;
      setMorphTarget(shapesCycle[cycleIndex]);
    }, 5500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      mouse.radius = 140 * window.devicePixelRatio;

      const targets = shapeTargets[activeShape];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const pt = getPixelTarget(targets[i].x, targets[i].y);
        particles[i].targetX = pt.x;
        particles[i].targetY = pt.y;
      }
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentDpr = window.devicePixelRatio || 1;
      mouse.targetX = (e.clientX - rect.left) * currentDpr;
      mouse.targetY = (e.clientY - rect.top) * currentDpr;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Expose manual switch listener
    const onManualChange = (e: Event) => {
      const customEvent = e as CustomEvent<MorphShape>;
      if (customEvent.detail) {
        cycleIndex = shapesCycle.indexOf(customEvent.detail);
        setMorphTarget(customEvent.detail);
      }
    };
    window.addEventListener("astra-morph-switch", onManualChange);

    let time = 0;

    const render = () => {
      time += 0.024;

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const currentDpr = window.devicePixelRatio || 1;
      const mouseRadius = mouse.radius;

      // Organic organ colors
      // Brain: Electric Violet/Indigo; Heart: Ruby Crimson; Lungs: Cyan/Sky; DNA: Emerald/Jade
      let baseRgb = "99, 102, 241"; // Indigo
      let glowRgb = "168, 85, 247"; // Violet
      if (activeShape === "heart") {
        baseRgb = "239, 68, 68"; // Ruby Red
        glowRgb = "251, 113, 133";
      } else if (activeShape === "lungs") {
        baseRgb = "14, 165, 233"; // Sky Cyan
        glowRgb = "56, 189, 248";
      } else if (activeShape === "dna") {
        baseRgb = "16, 185, 129"; // Emerald
        glowRgb = "52, 211, 153";
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Organic Astra wave breathing oscillation
        const waveX = Math.sin(time * 1.3 + p.phase) * (2.2 * currentDpr);
        const waveY = Math.cos(time * 1.2 + p.phase) * (2.2 * currentDpr);

        const currentTargetX = p.targetX + waveX;
        const currentTargetY = p.targetY + waveY;

        // 2. Cursor repulsion physics (Interactive scatter)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * 45 * currentDpr;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force * 0.38;
          p.vy -= Math.sin(angle) * force * 0.38;
        }

        // 3. Elastic Spring towards morph target
        const spring = 0.052;
        const friction = 0.83;
        p.vx += (currentTargetX - p.x) * spring;
        p.vy += (currentTargetY - p.y) * spring;
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // 4. Cursor proximity glow
        const proximity = Math.max(0, 1 - dist / mouseRadius);
        const radius = p.baseSize * (1 + proximity * 1.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

        if (proximity > 0.05) {
          ctx.fillStyle = `rgba(${glowRgb}, ${Math.min(1, p.colorAlpha + proximity * 0.5)})`;
          ctx.shadowColor = `rgba(${glowRgb}, 0.8)`;
          ctx.shadowBlur = 10 * proximity * currentDpr;
        } else {
          ctx.fillStyle = `rgba(${baseRgb}, ${p.colorAlpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(morphTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("astra-morph-switch", onManualChange);
    };
  }, []);

  const triggerShape = (shape: MorphShape) => {
    setCurrentShape(shape);
    const event = new CustomEvent("astra-morph-switch", { detail: shape });
    window.dispatchEvent(event);
  };

  const labels: Record<MorphShape, string> = {
    brain: "🧠 Brain",
    heart: "❤️ Heart",
    lungs: "🫁 Lungs",
    dna: "🧬 DNA Helix",
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />

      {/* Interactive Shape Pill Switcher */}
      <div className="absolute top-28 sm:top-24 right-4 sm:right-8 pointer-events-auto z-20 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full backdrop-blur-xl bg-white/75 dark:bg-black/60 border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
        <span className="hidden md:inline-block text-[11px] font-semibold text-muted-foreground px-2.5 uppercase tracking-wider">
          Astra Morph:
        </span>
        {shapesCycle.map((shape) => {
          const isActive = currentShape === shape;
          return (
            <button
              key={shape}
              type="button"
              onClick={() => triggerShape(shape)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-foreground text-background shadow-xs scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {labels[shape]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AstraMorphHero;
