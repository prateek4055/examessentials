import React, { useEffect, useRef, useState } from "react";

export type MorphShape = "brain" | "heart" | "lungs";

interface Point3D {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
  size: number;
  brightness: number;
  section?: string;
}

/**
 * High-fidelity 3D point generator based on the reference neural image:
 * - Serpentine, furrowed cortical sulci ridges
 * - Dense concentric ribbed cerebellum rings
 * - Cylindrical brain stem/pons
 * - Bioluminescent rainbow chromatic spectrum (Orange -> Magenta -> Cyan -> Emerald)
 * - Constellation network nodes with star highlights
 */
const generate3DBrainPoints = (count: number): Point3D[] => {
  const points: Point3D[] = [];

  // 1. CORTICAL GYRI & SULCI (Cerebral Cortex - ~65% of particles)
  // Folded ridges following curvilinear flow lines with depth Z
  const cortexCount = Math.floor(count * 0.65);
  const sulciStreams = 28; // Distinct neural furrow streams

  for (let s = 0; s < sulciStreams; s++) {
    const streamProgress = s / sulciStreams;
    // Sagittal angle across the cerebral dome
    const phi = streamProgress * Math.PI * 0.95 + 0.1; 
    const ptsInStream = Math.floor(cortexCount / sulciStreams);

    for (let i = 0; i < ptsInStream; i++) {
      const t = (i / ptsInStream) * Math.PI - Math.PI / 2; // -PI/2 to PI/2

      // Cortical fold oscillations (sulcal waves)
      const foldWave = Math.sin(t * 7 + s * 1.8) * 0.08 + Math.cos(t * 13) * 0.04;
      const baseR = 0.88 + foldWave;

      // 3D Ellipsoid coordinates
      const radX = 1.08; // Anterior-posterior elongation
      const radY = 0.82; // Height
      const radZ = 0.72; // Lateral depth (bilateral thickness)

      const x = Math.sin(phi) * Math.cos(t) * radX * baseR - 0.05;
      const y = -Math.cos(phi) * radY * baseR - 0.12;
      const z = Math.sin(phi) * Math.sin(t) * radZ * (Math.random() * 0.35 + 0.65);

      // Chromatic mapping across anterior-posterior axis (like reference image):
      // Frontal (x < -0.3): Warm Orange/Gold (#FF7A00, #FF0055)
      // Parietal/Superior (top): Electric Magenta/Violet (#E024C3, #8B5CF6)
      // Occipital (x > 0.3): Vivid Cyan / Sky Blue (#00D2FF)
      // Temporal/Lower: Emerald/Spring Green (#10B981)
      let r = 255, g = 255, b = 255;
      const normX = (x + 1.1) / 2.2; // 0 (front) to 1 (back)

      if (normX < 0.28) {
        // Warm Orange / Red (Frontal pole)
        r = 255;
        g = Math.floor(70 + normX * 350);
        b = 30;
      } else if (normX < 0.55) {
        // Magenta / Orchid / Purple (Parietal cortex)
        const p = (normX - 0.28) / 0.27;
        r = Math.floor(255 - p * 60);
        g = Math.floor(40 + p * 80);
        b = Math.floor(180 + p * 75);
      } else if (normX < 0.82) {
        // Electric Blue / Cyan (Occipital lobe)
        const p = (normX - 0.55) / 0.27;
        r = Math.floor(190 - p * 180);
        g = Math.floor(120 + p * 90);
        b = 255;
      } else {
        // Emerald Green / Teal (Posterior edge)
        const p = (normX - 0.82) / 0.18;
        r = Math.floor(10 + p * 20);
        g = Math.floor(210 + p * 35);
        b = Math.floor(200 - p * 100);
      }

      // Star nodes: 8% of dots are brighter, larger constellation junction pins
      const isStarNode = Math.random() < 0.08;

      points.push({
        x,
        y,
        z,
        r,
        g,
        b,
        size: isStarNode ? 2.4 : 1.1 + Math.random() * 0.9,
        brightness: isStarNode ? 1.0 : 0.45 + Math.random() * 0.4,
        section: "cortex",
      });
    }
  }

  // 2. CEREBELLUM (Tight concentric horizontal ribbed latitudinal rings - ~22% of particles)
  // Perfectly mirrors the dense parallel striated pattern in the reference image
  const cerebellumCount = Math.floor(count * 0.22);
  const ringCount = 18;
  const ptsPerRing = Math.floor(cerebellumCount / ringCount);

  for (let rIdx = 0; rIdx < ringCount; rIdx++) {
    const ringProgress = rIdx / ringCount; // 0 (top of cerebellum) to 1 (bottom)
    const ringY = 0.22 + ringProgress * 0.38; // Below posterior cerebrum
    const ringRadius = Math.sin(ringProgress * Math.PI) * 0.38;

    for (let i = 0; i < ptsPerRing; i++) {
      const angle = (i / ptsPerRing) * Math.PI * 2;
      const x = 0.38 + Math.cos(angle) * ringRadius * 0.88;
      const y = ringY;
      const z = Math.sin(angle) * ringRadius * 0.65;

      // Color: Deep Indigo / Violet transitioning to electric Royal Blue and Crimson at base
      const r = Math.floor(140 + (1 - ringProgress) * 90);
      const g = Math.floor(40 + ringProgress * 80);
      const b = Math.floor(230 + ringProgress * 25);

      const isNode = Math.random() < 0.06;
      points.push({
        x,
        y,
        z,
        r,
        g,
        b,
        size: isNode ? 2.0 : 0.95 + Math.random() * 0.6,
        brightness: isNode ? 0.95 : 0.5 + Math.random() * 0.3,
        section: "cerebellum",
      });
    }
  }

  // 3. BRAIN STEM & PONS (Vertical tubular column - ~13% of particles)
  const stemCount = count - points.length;
  for (let i = 0; i < stemCount; i++) {
    const progress = i / stemCount;
    const y = 0.28 + progress * 0.55; // Extending downwards
    const radius = (0.11 - progress * 0.04) * (0.8 + Math.random() * 0.4);
    const angle = Math.random() * Math.PI * 2;

    const x = 0.12 - progress * 0.06 + Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Cyan / Teal bioluminescence (#00F5D4)
    const r = Math.floor(0 + progress * 30);
    const g = Math.floor(220 - progress * 30);
    const b = Math.floor(220 + progress * 35);

    const isNode = Math.random() < 0.07;
    points.push({
      x,
      y,
      z,
      r,
      g,
      b,
      size: isNode ? 2.2 : 1.1 + Math.random() * 0.8,
      brightness: isNode ? 1.0 : 0.6,
      section: "stem",
    });
  }

  return points;
};

/**
 * 3D Bioluminescent Heart with ventricles, aorta & coronary vessels
 */
const generate3DHeartPoints = (count: number): Point3D[] => {
  const points: Point3D[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const rSpread = Math.sqrt(Math.random()) * 0.9 + 0.1;
    const zDepth = (Math.random() - 0.5) * 0.65;

    // 3D Cardioid formulation
    const x = ((16 * Math.pow(Math.sin(t), 3)) / 17) * rSpread * 0.85;
    const y =
      (-(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      ) /
        17) *
      rSpread *
      0.85;
    const z = zDepth * Math.cos(t * 0.5);

    // Heart colors: Glowing Crimson (#FF1A53) to Warm Amber & Violet apex
    const normY = (y + 0.8) / 1.6;
    const r = 255;
    const g = Math.floor(20 + normY * 120);
    const b = Math.floor(60 + normY * 180);

    const isStar = Math.random() < 0.07;
    points.push({
      x,
      y,
      z,
      r,
      g,
      b,
      size: isStar ? 2.2 : 1.1 + Math.random() * 0.8,
      brightness: isStar ? 1.0 : 0.5 + Math.random() * 0.4,
    });
  }
  return points;
};

/**
 * 3D Bilateral Lungs & Bronchial Tree with depth
 */
const generate3DLungsPoints = (count: number): Point3D[] => {
  const points: Point3D[] = [];
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0, r = 0, g = 0, b = 0;

    if (i < count * 0.15) {
      // Trachea / Bronchi
      const t = i / (count * 0.15);
      y = -0.75 + t * 0.42;
      const angle = Math.random() * Math.PI * 2;
      const rad = 0.05 * Math.random();
      x = Math.cos(angle) * rad;
      z = Math.sin(angle) * rad;
      r = 200; g = 240; b = 255;
    } else {
      const isLeft = i % 2 === 0;
      const side = isLeft ? -1 : 1;
      const u = Math.random() * Math.PI * 2;
      const rInner = Math.sqrt(Math.random());
      const rawX = Math.cos(u) * 0.35 * rInner;
      const rawY = Math.sin(u) * 0.55 * rInner;
      x = side * (0.38 + Math.abs(rawX) * 0.85);
      y = rawY + 0.02 + rawX * side * 0.2;
      z = (Math.random() - 0.5) * 0.55;

      // Cyan to Emerald lung tissue
      r = Math.floor(20 + Math.random() * 50);
      g = Math.floor(180 + Math.random() * 70);
      b = Math.floor(230 + Math.random() * 25);
    }

    const isStar = Math.random() < 0.07;
    points.push({
      x,
      y,
      z,
      r,
      g,
      b,
      size: isStar ? 2.2 : 1.1 + Math.random() * 0.8,
      brightness: isStar ? 1.0 : 0.5 + Math.random() * 0.4,
    });
  }
  return points;
};

export const Astra3DNeuralCanvas: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentShape, setCurrentShape] = useState<MorphShape>("brain");

  const PARTICLE_COUNT = 1450; // Dense high-yield particle cloud
  const shapesCycle: MorphShape[] = ["brain", "heart", "lungs"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    // Precalculate 3D target coordinates for each shape
    const shapeSets: Record<MorphShape, Point3D[]> = {
      brain: generate3DBrainPoints(PARTICLE_COUNT),
      heart: generate3DHeartPoints(PARTICLE_COUNT),
      lungs: generate3DLungsPoints(PARTICLE_COUNT),
    };

    interface ParticleState {
      // Current 3D position
      x: number;
      y: number;
      z: number;
      // Morph target 3D position
      targetX: number;
      targetY: number;
      targetZ: number;
      // Physics velocity
      vx: number;
      vy: number;
      vz: number;
      // Colors & appearance
      r: number;
      g: number;
      b: number;
      targetR: number;
      targetG: number;
      targetB: number;
      size: number;
      brightness: number;
      phase: number;
    }

    const particles: ParticleState[] = [];
    const initialTargets = shapeSets.brain;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const tgt = initialTargets[i];
      particles.push({
        x: tgt.x + (Math.random() - 0.5) * 1.5,
        y: tgt.y + (Math.random() - 0.5) * 1.5,
        z: tgt.z + (Math.random() - 0.5) * 1.5,
        targetX: tgt.x,
        targetY: tgt.y,
        targetZ: tgt.z,
        vx: 0,
        vy: 0,
        vz: 0,
        r: tgt.r,
        g: tgt.g,
        b: tgt.b,
        targetR: tgt.r,
        targetG: tgt.g,
        targetB: tgt.b,
        size: tgt.size,
        brightness: tgt.brightness,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 3D Camera & Rotation physics
    const camera = {
      rotX: 0.1, // Slight pitch tilt
      rotY: -0.2, // Slight profile turn (like the reference brain)
      targetRotX: 0.1,
      targetRotY: -0.2,
      fov: 480, // Perspective strength
    };

    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      isHovered: false,
    };

    const setMorph = (shape: MorphShape) => {
      setCurrentShape(shape);
      const targets = shapeSets[shape];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const tgt = targets[i];
        particles[i].targetX = tgt.x;
        particles[i].targetY = tgt.y;
        particles[i].targetZ = tgt.z;
        particles[i].targetR = tgt.r;
        particles[i].targetG = tgt.g;
        particles[i].targetB = tgt.b;
      }
    };

    // Auto morph cycle every 6.5 seconds
    let cycleIdx = 0;
    const morphInterval = setInterval(() => {
      cycleIdx = (cycleIdx + 1) % shapesCycle.length;
      setMorph(shapesCycle[cycleIdx]);
    }, 6500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouse.targetX = (e.clientX - rect.left) * dpr;
      mouse.targetY = (e.clientY - rect.top) * dpr;
      mouse.isHovered = true;

      // Parallax 3D pitch/yaw following cursor
      const normMouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const normMouseY = (e.clientY - rect.top) / rect.height - 0.5;
      camera.targetRotY = normMouseX * 0.85 - 0.2;
      camera.targetRotX = -normMouseY * 0.5 + 0.1;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
      mouse.isHovered = false;
      camera.targetRotX = 0.1;
      camera.targetRotY = -0.2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const onManualTrigger = (e: Event) => {
      const customEvt = e as CustomEvent<MorphShape>;
      if (customEvt.detail) {
        cycleIdx = shapesCycle.indexOf(customEvt.detail);
        setMorph(customEvt.detail);
      }
    };
    window.addEventListener("astra-3d-morph-switch", onManualTrigger);

    let time = 0;

    const render = () => {
      time += 0.022;

      // Smooth camera interpolation
      camera.rotX += (camera.targetRotX - camera.rotX) * 0.06;
      camera.rotY += (camera.targetRotY - camera.rotY) * 0.06;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const isMobile = width < 768 * dpr;
      const renderScale = isMobile ? Math.min(width, height) * 0.38 : Math.min(width, height) * 0.35;
      const centerX = width * 0.5;
      const centerY = height * 0.44;

      // Trigonometry for 3D Euler rotation
      const cosX = Math.cos(camera.rotX);
      const sinX = Math.sin(camera.rotX);
      const cosY = Math.cos(camera.rotY);
      const sinY = Math.sin(camera.rotY);

      // Mouse repulsion radius in screen pixels
      const mouseRepelRadius = 140 * dpr;

      // Array for depth sorting so front particles occlude back particles
      interface RenderableDot {
        screenX: number;
        screenY: number;
        depthZ: number;
        size: number;
        r: number;
        g: number;
        b: number;
        alpha: number;
        isGlow: boolean;
      }

      const renderList: RenderableDot[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Organic Astra micro-wave oscillations (sulcal breathing)
        const waveX = Math.sin(time * 1.4 + p.phase) * 0.018;
        const waveY = Math.cos(time * 1.2 + p.phase) * 0.018;
        const waveZ = Math.sin(time * 1.1 + p.phase * 0.5) * 0.018;

        const curTgtX = p.targetX + waveX;
        const curTgtY = p.targetY + waveY;
        const curTgtZ = p.targetZ + waveZ;

        // 2. Spring physics towards morph shape target in 3D
        const spring = 0.052;
        const friction = 0.82;
        p.vx += (curTgtX - p.x) * spring;
        p.vy += (curTgtY - p.y) * spring;
        p.vz += (curTgtZ - p.z) * spring;
        p.vx *= friction;
        p.vy *= friction;
        p.vz *= friction;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Color interpolation
        p.r += (p.targetR - p.r) * 0.05;
        p.g += (p.targetG - p.g) * 0.05;
        p.b += (p.targetB - p.b) * 0.05;

        // 3. 3D Rotation Transformation around Center
        // Rotate around Y axis (Yaw)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X axis (Pitch)
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // 4. Perspective Projection
        const distance = 2.4; // Camera distance
        const perspective = camera.fov / (camera.fov + (z2 + distance) * 120);

        let screenX = centerX + x1 * renderScale * perspective;
        let screenY = centerY + y2 * renderScale * perspective;

        // 5. Cursor Interactive Repulsion
        const dx = mouse.x - screenX;
        const dy = mouse.y - screenY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let isGlow = false;
        if (dist < mouseRepelRadius && dist > 0) {
          const force = (1 - dist / mouseRepelRadius) * 35 * dpr;
          const angle = Math.atan2(dy, dx);
          // Scatter particles away in screen plane
          screenX -= Math.cos(angle) * force;
          screenY -= Math.sin(angle) * force;
          // Apply velocity push back into 3D simulation
          p.vx -= Math.cos(angle) * 0.012;
          p.vy -= Math.sin(angle) * 0.012;
          isGlow = true;
        }

        // Depth cueing & brightness
        const depthAlpha = Math.max(0.2, Math.min(1.0, (z2 + 0.8) / 1.6));
        const finalSize = p.size * perspective * dpr * (isGlow ? 1.4 : 1.0);

        renderList.push({
          screenX,
          screenY,
          depthZ: z2,
          size: finalSize,
          r: Math.round(p.r),
          g: Math.round(p.g),
          b: Math.round(p.b),
          alpha: p.brightness * depthAlpha,
          isGlow,
        });
      }

      // Sort by depth (back to front) so 3D occlusion looks clean
      renderList.sort((a, b) => a.depthZ - b.depthZ);

      // Draw all 3D particles
      for (let i = 0; i < renderList.length; i++) {
        const pt = renderList[i];

        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, pt.size, 0, Math.PI * 2);

        if (pt.isGlow || pt.size > 2.2 * dpr) {
          // Bioluminescent star sparkle effect
          ctx.fillStyle = `rgba(${pt.r}, ${pt.g}, ${pt.b}, ${Math.min(1, pt.alpha + 0.25)})`;
          ctx.shadowColor = `rgba(${pt.r}, ${pt.g}, ${pt.b}, 0.85)`;
          ctx.shadowBlur = 8 * dpr;
        } else {
          ctx.fillStyle = `rgba(${pt.r}, ${pt.g}, ${pt.b}, ${pt.alpha})`;
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
      window.removeEventListener("astra-3d-morph-switch", onManualTrigger);
    };
  }, []);

  const triggerShape = (shape: MorphShape) => {
    setCurrentShape(shape);
    const event = new CustomEvent("astra-3d-morph-switch", { detail: shape });
    window.dispatchEvent(event);
  };

  const labels: Record<MorphShape, string> = {
    brain: "🧠 3D Neural Brain",
    heart: "❤️ Bioluminescent Heart",
    lungs: "🫁 Bronchial Lungs",
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />

      {/* Floating Interactive Switcher */}
      <div className="absolute top-28 sm:top-24 right-4 sm:right-8 pointer-events-auto z-20 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full backdrop-blur-xl bg-white/80 dark:bg-black/70 border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]">
        <span className="hidden md:inline-block text-[11px] font-semibold text-muted-foreground px-2.5 uppercase tracking-wider">
          3D Neural Morph:
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

export default Astra3DNeuralCanvas;
