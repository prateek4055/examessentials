import React, { useEffect, useRef } from "react";

interface InteractiveDotGridProps {
  className?: string;
  dotColor?: string;
  activeColor?: string;
  spacing?: number;
  radius?: number;
}

/**
 * Interactive Particle / Astra Dot Matrix
 * High-performance 60fps canvas simulation with gentle spring physics,
 * cursor gravity/repulsion, ambient wave oscillations, and glowing aura.
 */
export const InteractiveDotGrid: React.FC<InteractiveDotGridProps> = ({
  className = "",
  dotColor = "rgba(148, 163, 184, 0.22)",
  activeColor = "rgba(99, 102, 241, 0.85)",
  spacing = 28,
  radius = 1.3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 140 * window.devicePixelRatio,
    };

    interface Dot {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      phase: number;
    }

    let dots: Dot[] = [];

    const initDots = () => {
      dots = [];
      const dpr = window.devicePixelRatio || 1;
      const actualSpacing = spacing * dpr;
      const cols = Math.ceil(width / actualSpacing) + 1;
      const rows = Math.ceil(height / actualSpacing) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const bx = c * actualSpacing;
          const by = r * actualSpacing;
          dots.push({
            baseX: bx,
            baseY: by,
            x: bx,
            y: by,
            vx: 0,
            vy: 0,
            size: radius * dpr,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    initDots();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      mouse.radius = 140 * window.devicePixelRatio;
      initDots();
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
      time += 0.02;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const mouseRadius = mouse.radius;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Organic ambient breathing motion (Astra wave)
        const waveX = Math.sin(time * 0.8 + dot.phase) * (1.2 * dpr);
        const waveY = Math.cos(time * 0.9 + dot.phase) * (1.2 * dpr);

        const targetBaseX = dot.baseX + waveX;
        const targetBaseY = dot.baseY + waveY;

        // Interaction with cursor
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          // Push away slightly, then spring back
          const force = (1 - dist / mouseRadius) * 26 * dpr;
          const angle = Math.atan2(dy, dx);
          dot.vx -= Math.cos(angle) * force * 0.3;
          dot.vy -= Math.sin(angle) * force * 0.3;
        }

        // Spring return to base
        const spring = 0.08;
        const friction = 0.82;
        dot.vx += (targetBaseX - dot.x) * spring;
        dot.vy += (targetBaseY - dot.y) * spring;
        dot.vx *= friction;
        dot.vy *= friction;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Draw dot
        const proximity = Math.max(0, 1 - dist / mouseRadius);
        const currentSize = dot.size * (1 + proximity * 1.6);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, currentSize, 0, Math.PI * 2);

        if (proximity > 0.05) {
          // Glow effect near cursor
          ctx.fillStyle = activeColor;
          ctx.shadowColor = "rgba(99, 102, 241, 0.4)";
          ctx.shadowBlur = 8 * proximity * dpr;
        } else {
          ctx.fillStyle = dotColor;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dotColor, activeColor, spacing, radius]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: "block" }}
    />
  );
};

export default InteractiveDotGrid;
