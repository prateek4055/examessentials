import React, { useEffect, useRef, useState } from "react";

export type MorphShape = "brain" | "heart" | "lungs" | "dna";

interface AstraMorphCanvasProps {
  className?: string;
  onShapeChange?: (shape: MorphShape) => void;
}

/**
 * Generate normalized coordinate point clouds in range [-1, 1]
 */
const generateShapePoints = (shape: MorphShape, count: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];

  if (shape === "heart") {
    // 2D Cardioid / Heart formula:
    // x = 16 * sin^3(t)
    // y = -(13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t))
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      // Spread into the interior with random scaling
      const r = Math.sqrt(Math.random()) * 0.95 + 0.05;
      const x = (16 * Math.pow(Math.sin(t), 3)) / 17;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17;
      points.push({ x: x * r, y: y * r });
    }
  } else if (shape === "brain") {
    // Anatomical 2-hemisphere brain silhouette with gyri convolutions & cerebellum
    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      const side = isLeft ? -1 : 1;
      const t = (i / count) * Math.PI; // 0 to PI
      const rInner = Math.sqrt(Math.random());

      // Base hemisphere dome
      let angle = (Math.random() * Math.PI * 1.8) - 0.9; // top hemisphere
      let baseR = 0.65 + 0.15 * Math.sin(angle * 7) + 0.08 * Math.cos(angle * 13); // gyri ripples
      let x = side * (0.12 + Math.abs(Math.cos(angle)) * baseR * 0.75 * rInner);
      let y = (Math.sin(angle) * baseR * 0.85 * rInner) - 0.1;

      // Add cerebellum/stem points for realism
      if (Math.random() < 0.2) {
        x = (Math.random() - 0.5) * 0.35;
        y = 0.55 + Math.random() * 0.35;
      }
      points.push({ x, y });
    }
  } else if (shape === "lungs") {
    // Bilateral bronchial tree & lung lobes + trachea
    for (let i = 0; i < count; i++) {
      if (i < count * 0.12) {
        // Central Trachea
        const x = (Math.random() - 0.5) * 0.08;
        const y = -0.8 + Math.random() * 0.45;
        points.push({ x, y });
      } else {
        // Left & Right Lung Lobes
        const isLeft = i % 2 === 0;
        const side = isLeft ? -1 : 1;
        const u = Math.random() * Math.PI * 2;
        const rInner = Math.sqrt(Math.random());

        // Oval lung lobes flared outwards
        const rawX = (Math.cos(u) * 0.35) * rInner;
        const rawY = (Math.sin(u) * 0.55) * rInner;

        const x = side * (0.42 + Math.abs(rawX) * 0.85);
        const y = rawY + 0.05 + (rawX * side * 0.2); // anatomical tilt
        points.push({ x, y });
      }
    }
  } else if (shape === "dna") {
    // Intertwined Double Helix
    for (let i = 0; i < count; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const t = (i / count) * Math.PI * 6; // 3 full turns
      const y = ((i / count) * 2 - 1) * 0.85;
      const x = Math.sin(t) * 0.45 * strand;

      // Base pair rungs
      if (Math.random() < 0.25) {
        const rungProgress = Math.random() * 2 - 1;
        points.push({ x: Math.sin(t) * 0.45 * rungProgress, y });
      } else {
        points.push({ x: x + (Math.random() - 0.5) * 0.08, y });
      }
    }
  }

  return points;
};

export const AstraMorphCanvas: React.FC<AstraMorphCanvasProps> = ({
  className = "",
  onShapeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentShape, setCurrentShape] = useState<MorphShape>("brain");

  // Dot particle count
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
      radius: 130 * window.devicePixelRatio,
    };

    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      colorAlpha: number;
      phase: number;
    }

    let particles: Particle[] = [];

    // Precalculate target shapes
    const shapeTargets: Record<MorphShape, { x: number; y: number }[]> = {
      brain: generateShapePoints("brain", PARTICLE_COUNT),
      heart: generateShapePoints("heart", PARTICLE_COUNT),
      lungs: generateShapePoints("lungs", PARTICLE_COUNT),
      dna: generateShapePoints("dna", PARTICLE_COUNT),
    };

    let activeShape: MorphShape = "brain";

    const getPixelTarget = (normalizedX: number, normalizedY: number) => {
      // Fit shape nicely in center of canvas with responsive scale
      const scale = Math.min(width, height) * 0.38;
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      return {
        x: centerX + normalizedX * scale,
        y: centerY + normalizedY * scale,
      };
    };

    // Initialize particles randomly across the canvas
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const target = getPixelTarget(shapeTargets.brain[i].x, shapeTargets.brain[i].y);
      const dpr = window.devicePixelRatio || 1;
      particles.push({
        x: target.x + (Math.random() - 0.5) * 400 * dpr,
        y: target.y + (Math.random() - 0.5) * 400 * dpr,
        targetX: target.x,
        targetY: target.y,
        vx: 0,
        vy: 0,
        size: (1.2 + Math.random() * 1.4) * dpr,
        baseSize: (1.2 + Math.random() * 1.4) * dpr,
        colorAlpha: 0.35 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const setMorphTarget = (shape: MorphShape) => {
      activeShape = shape;
      setCurrentShape(shape);
      if (onShapeChange) onShapeChange(shape);

      const targets = shapeTargets[shape];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const pt = getPixelTarget(targets[i].x, targets[i].y);
        particles[i].targetX = pt.x;
        particles[i].targetY = pt.y;
      }
    };

    // Auto morph cycle every 5.5 seconds: Brain -> Heart -> Lungs -> DNA
    let cycleIndex = 0;
    const morphInterval = setInterval(() => {
      cycleIndex = (cycleIndex + 1) % shapesCycle.length;
      setMorphTarget(shapesCycle[cycleIndex]);
    }, 5500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      mouse.radius = 130 * window.devicePixelRatio;

      // Recalculate targets for current shape
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
      const dpr = window.devicePixelRatio || 1;
      mouse.targetX = (e.clientX - rect.left) * dpr;
      mouse.targetY = (e.clientY - rect.top) * dpr;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.025;

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const mouseRadius = mouse.radius;

      // Shape-based accent tones
      // Brain: Electric Violet/Cyan, Heart: Ruby Crimson, Lungs: Teal/Sky, DNA: Emerald/Indigo
      let primaryColor = "99, 102, 241"; // Indigo default
      let glowColor = "168, 85, 247"; // Purple default
      if (activeShape === "heart") {
        primaryColor = "244, 63, 94"; // Rose/Red
        glowColor = "251, 113, 133";
      } else if (activeShape === "lungs") {
        primaryColor = "14, 165, 233"; // Sky/Teal
        glowColor = "56, 189, 248";
      } else if (activeShape === "dna") {
        primaryColor = "16, 185, 129"; // Emerald
        glowColor = "52, 211, 153";
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Organic Astra wave breathing oscillation
        const waveX = Math.sin(time * 1.2 + p.phase) * (2.0 * dpr);
        const waveY = Math.cos(time * 1.1 + p.phase) * (2.0 * dpr);

        const currentTargetX = p.targetX + waveX;
        const currentTargetY = p.targetY + waveY;

        // 2. Cursor repulsion physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * 45 * dpr;
          const angle = Math.atan2(dy, dx);
          // Scatter away from cursor
          p.vx -= Math.cos(angle) * force * 0.4;
          p.vy -= Math.sin(angle) * force * 0.4;
        }

        // 3. Elastic Spring towards morph target
        const spring = 0.055;
        const friction = 0.84;
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
          ctx.fillStyle = `rgba(${glowColor}, ${Math.min(1, p.colorAlpha + proximity * 0.5)})`;
          ctx.shadowColor = `rgba(${glowColor}, 0.7)`;
          ctx.shadowBlur = 10 * proximity * dpr;
        } else {
          ctx.fillStyle = `rgba(${primaryColor}, ${p.colorAlpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(morphInterval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />

      {/* Floating shape indicator pill (Interactive selector) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto z-20 flex items-center gap-1.5 p-1 rounded-full backdrop-blur-xl bg-white/70 dark:bg-black/50 border border-black/[0.08] dark:border-white/[0.12] shadow-sm">
        {shapesCycle.map((shape) => {
          const isActive = currentShape === shape;
          const labels: Record<MorphShape, string> = {
            brain: "🧠 Brain",
            heart: "❤️ Heart",
            lungs: "🫁 Lungs",
            dna: "🧬 DNA Helix",
          };
          return (
            <button
              key={shape}
              onClick={() => {
                // Instantly morph when clicked
                const canvas = canvasRef.current;
                if (!canvas) return;
                const event = new CustomEvent("manual-shape-change", { detail: shape });
                window.dispatchEvent(event);
                setCurrentShape(shape);
              }}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
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

export default AstraMorphCanvas;
