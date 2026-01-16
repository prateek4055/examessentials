import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef, useState, createContext, useContext } from "react";

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

// Context for hover/click state
interface RootInteractionContextType {
  hoveredAppIndex: number | null;
  hoveredAppType: "medical" | "exam" | null;
  selectedAppIndex: number | null;
  selectedAppType: "medical" | "exam" | null;
  setHoveredApp: (index: number | null, type: "medical" | "exam" | null) => void;
  setSelectedApp: (index: number | null, type: "medical" | "exam" | null) => void;
}

const RootInteractionContext = createContext<RootInteractionContextType>({
  hoveredAppIndex: null,
  hoveredAppType: null,
  selectedAppIndex: null,
  selectedAppType: null,
  setHoveredApp: () => {},
  setSelectedApp: () => {},
});

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

// Energy Particle Component - flows along paths
const EnergyParticle = ({ 
  pathId, 
  delay = 0, 
  duration = 3, 
  color = "medical" 
}: { 
  pathId: string; 
  delay?: number; 
  duration?: number; 
  color?: "medical" | "exam";
}) => {
  const fillColor = color === "medical" 
    ? "hsl(270, 80%, 75%)" 
    : "hsl(30, 90%, 65%)";
  const glowColor = color === "medical"
    ? "hsl(250, 100%, 70%)"
    : "hsl(25, 100%, 60%)";

  return (
    <motion.circle
      r="6"
      fill={fillColor}
      filter={`drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 15px ${glowColor})`}
      initial={{ offsetDistance: "0%" }}
      animate={{ offsetDistance: "100%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        offsetPath: `path('${pathId}')`,
        offsetRotate: "0deg",
      }}
    />
  );
};

// Connection Node Component - animated pulse at connection points
const ConnectionNode = ({ 
  x, 
  y, 
  delay = 0, 
  color = "medical" 
}: { 
  x: number; 
  y: number; 
  delay?: number; 
  color?: "medical" | "exam";
}) => {
  const gradientId = color === "medical" ? "nodeFillMedical" : "nodeFillExam";
  const glowId = color === "medical" ? "nodeGlowMedical" : "nodeGlowExam";
  
  return (
    <motion.g>
      {/* Outer glow ring */}
      <motion.circle
        cx={x}
        cy={y}
        r="14"
        fill="none"
        stroke={`url(#${glowId})`}
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [1, 1.6, 1], 
          opacity: [0.7, 0.2, 0.7] 
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay 
        }}
      />
      {/* Inner solid node */}
      <motion.circle
        cx={x}
        cy={y}
        r="7"
        fill={`url(#${gradientId})`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
      />
    </motion.g>
  );
};

// Tree Root SVG Component
const TreeRoots = ({ scrollProgress }: { scrollProgress: any }) => {
  const { hoveredAppIndex, hoveredAppType, selectedAppIndex, selectedAppType } = useContext(RootInteractionContext);
  
  // Staggered path animations for organic growth effect
  const pathLength1 = useTransform(scrollProgress, [0.1, 0.4], [0, 1]);
  const pathLength2 = useTransform(scrollProgress, [0.12, 0.42], [0, 1]);
  const pathLength3 = useTransform(scrollProgress, [0.14, 0.44], [0, 1]);
  const pathLength4 = useTransform(scrollProgress, [0.16, 0.46], [0, 1]);
  const pathLength5 = useTransform(scrollProgress, [0.18, 0.48], [0, 1]);
  const pathLength6 = useTransform(scrollProgress, [0.2, 0.5], [0, 1]);
  
  // Exam apps - slightly later
  const pathLength7 = useTransform(scrollProgress, [0.22, 0.52], [0, 1]);
  const pathLength8 = useTransform(scrollProgress, [0.24, 0.54], [0, 1]);
  const pathLength9 = useTransform(scrollProgress, [0.26, 0.56], [0, 1]);
  const pathLength10 = useTransform(scrollProgress, [0.28, 0.58], [0, 1]);
  const pathLength11 = useTransform(scrollProgress, [0.3, 0.6], [0, 1]);

  // Node visibility based on scroll
  const nodeOpacity = useTransform(scrollProgress, [0.35, 0.5], [0, 1]);

  // Medical app end positions (6 columns grid) - viewBox 1200 width
  const medicalEndX = [100, 300, 500, 700, 900, 1100];
  const medicalEndY = 380;
  
  // Exam app end positions (5 columns grid)
  const examEndX = [120, 360, 600, 840, 1080];
  const examEndY = 680;

  const medicalPaths = [
    { pathLength: pathLength1, endX: medicalEndX[0] },
    { pathLength: pathLength2, endX: medicalEndX[1] },
    { pathLength: pathLength3, endX: medicalEndX[2] },
    { pathLength: pathLength4, endX: medicalEndX[3] },
    { pathLength: pathLength5, endX: medicalEndX[4] },
    { pathLength: pathLength6, endX: medicalEndX[5] },
  ];

  const examPaths = [
    { pathLength: pathLength7, endX: examEndX[0] },
    { pathLength: pathLength8, endX: examEndX[1] },
    { pathLength: pathLength9, endX: examEndX[2] },
    { pathLength: pathLength10, endX: examEndX[3] },
    { pathLength: pathLength11, endX: examEndX[4] },
  ];

  // Generate path strings for particles
  const getMedicalPath = (endX: number) => {
    const controlX = 600 + (endX - 600) * 0.3;
    const controlY = 120 + Math.abs(endX - 600) * 0.15;
    const control2X = endX;
    const control2Y = 250;
    return `M600 80 C${controlX} ${controlY}, ${control2X} ${control2Y}, ${endX} ${medicalEndY}`;
  };

  const getExamPath = (endX: number) => {
    const controlX = 600 + (endX - 600) * 0.2;
    const controlY = 200;
    const control2X = 600 + (endX - 600) * 0.6;
    const control2Y = 450;
    return `M600 80 C${controlX} ${controlY}, ${control2X} ${control2Y}, ${endX} ${examEndY}`;
  };

  // Check if a path should be highlighted
  const isPathHighlighted = (index: number, type: "medical" | "exam") => {
    if (selectedAppIndex !== null && selectedAppType === type && selectedAppIndex === index) {
      return "selected";
    }
    if (hoveredAppIndex !== null && hoveredAppType === type && hoveredAppIndex === index) {
      return "hovered";
    }
    return null;
  };

  // Get stroke width based on highlight state
  const getStrokeWidth = (index: number, type: "medical" | "exam") => {
    const state = isPathHighlighted(index, type);
    if (state === "selected") return 10;
    if (state === "hovered") return 8;
    return 5;
  };

  // Get opacity based on highlight state
  const getPathOpacity = (index: number, type: "medical" | "exam") => {
    const anySelected = selectedAppIndex !== null;
    const anyHovered = hoveredAppIndex !== null;
    const state = isPathHighlighted(index, type);
    
    if (state === "selected" || state === "hovered") return 1;
    if (anySelected || anyHovered) return 0.3;
    return 1;
  };

  return (
    <>
      {/* Desktop/Tablet SVG */}
      <svg
        className="absolute left-1/2 top-[320px] -translate-x-1/2 w-full max-w-6xl pointer-events-none z-0 hidden md:block"
        style={{ height: "750px" }}
        viewBox="0 0 1200 750"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          {/* Medical gradient - Purple/Blue */}
          <linearGradient id="medicalGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(280, 80%, 70%)" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(260, 85%, 65%)" stopOpacity="0.9" />
            <stop offset="70%" stopColor="hsl(240, 90%, 60%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(220, 85%, 55%)" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Medical gradient highlighted */}
          <linearGradient id="medicalGradientHighlight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(280, 100%, 80%)" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(260, 100%, 75%)" stopOpacity="1" />
            <stop offset="70%" stopColor="hsl(240, 100%, 70%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(220, 100%, 65%)" stopOpacity="1" />
          </linearGradient>
          
          {/* Exam gradient - Orange/Gold */}
          <linearGradient id="examGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(35, 95%, 65%)" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(25, 90%, 60%)" stopOpacity="0.9" />
            <stop offset="70%" stopColor="hsl(15, 85%, 55%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(350, 80%, 55%)" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Exam gradient highlighted */}
          <linearGradient id="examGradientHighlight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(35, 100%, 75%)" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(25, 100%, 70%)" stopOpacity="1" />
            <stop offset="70%" stopColor="hsl(15, 100%, 65%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(350, 100%, 65%)" stopOpacity="1" />
          </linearGradient>

          {/* Central trunk gradient */}
          <linearGradient id="trunkGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(270, 70%, 70%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(30, 80%, 60%)" stopOpacity="0.8" />
          </linearGradient>
          
          {/* Medical node gradients */}
          <radialGradient id="nodeFillMedical" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(280, 90%, 80%)" />
            <stop offset="100%" stopColor="hsl(260, 80%, 60%)" />
          </radialGradient>
          <radialGradient id="nodeGlowMedical" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(270, 90%, 75%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(240, 100%, 65%)" stopOpacity="0" />
          </radialGradient>
          
          {/* Medical node highlighted */}
          <radialGradient id="nodeFillMedicalHighlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(280, 100%, 90%)" />
            <stop offset="100%" stopColor="hsl(260, 100%, 75%)" />
          </radialGradient>
          
          {/* Exam node gradients */}
          <radialGradient id="nodeFillExam" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(40, 95%, 70%)" />
            <stop offset="100%" stopColor="hsl(25, 90%, 55%)" />
          </radialGradient>
          <radialGradient id="nodeGlowExam" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(35, 95%, 65%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(15, 90%, 55%)" stopOpacity="0" />
          </radialGradient>
          
          {/* Exam node highlighted */}
          <radialGradient id="nodeFillExamHighlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(40, 100%, 85%)" />
            <stop offset="100%" stopColor="hsl(25, 100%, 70%)" />
          </radialGradient>
          
          {/* Enhanced glow filters */}
          <filter id="medicalGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Strong glow for highlighted paths */}
          <filter id="highlightGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="15" result="blur2" />
            <feGaussianBlur stdDeviation="25" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="examGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central trunk from logo */}
        <motion.path
          d="M600 0 L600 80"
          stroke="url(#trunkGradient)"
          strokeWidth="10"
          fill="none"
          filter="url(#medicalGlow)"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        
        {/* Medical Apps Branch Lines (Purple/Blue) */}
        {medicalPaths.map((path, index) => {
          const highlightState = isPathHighlighted(index, "medical");
          return (
            <motion.path
              key={`medical-${index}`}
              d={getMedicalPath(path.endX)}
              stroke={highlightState ? "url(#medicalGradientHighlight)" : "url(#medicalGradient)"}
              strokeWidth={getStrokeWidth(index, "medical")}
              fill="none"
              filter={highlightState ? "url(#highlightGlow)" : "url(#medicalGlow)"}
              style={{ pathLength: path.pathLength }}
              strokeLinecap="round"
              animate={{
                opacity: getPathOpacity(index, "medical"),
                strokeWidth: getStrokeWidth(index, "medical"),
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
        
        {/* Exam Apps Branch Lines (Orange/Gold) */}
        {examPaths.map((path, index) => {
          const highlightState = isPathHighlighted(index, "exam");
          return (
            <motion.path
              key={`exam-${index}`}
              d={getExamPath(path.endX)}
              stroke={highlightState ? "url(#examGradientHighlight)" : "url(#examGradient)"}
              strokeWidth={getStrokeWidth(index, "exam")}
              fill="none"
              filter={highlightState ? "url(#highlightGlow)" : "url(#examGlow)"}
              style={{ pathLength: path.pathLength }}
              strokeLinecap="round"
              animate={{
                opacity: getPathOpacity(index, "exam"),
                strokeWidth: getStrokeWidth(index, "exam"),
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* Energy particles for medical paths */}
        <g filter="url(#particleGlow)">
          {medicalPaths.map((path, index) => (
            <g key={`particles-medical-${index}`}>
              {[0, 1, 2].map((particleIndex) => (
                <motion.circle
                  key={`particle-med-${index}-${particleIndex}`}
                  r="5"
                  fill="hsl(270, 90%, 80%)"
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{ 
                    offsetDistance: "100%",
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    delay: index * 0.2 + particleIndex * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    offsetPath: `path('${getMedicalPath(path.endX)}')`,
                    offsetRotate: "0deg",
                  }}
                />
              ))}
            </g>
          ))}
        </g>

        {/* Energy particles for exam paths */}
        <g filter="url(#particleGlow)">
          {examPaths.map((path, index) => (
            <g key={`particles-exam-${index}`}>
              {[0, 1, 2].map((particleIndex) => (
                <motion.circle
                  key={`particle-exam-${index}-${particleIndex}`}
                  r="5"
                  fill="hsl(35, 95%, 70%)"
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{ 
                    offsetDistance: "100%",
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: 0.5 + index * 0.25 + particleIndex * 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    offsetPath: `path('${getExamPath(path.endX)}')`,
                    offsetRotate: "0deg",
                  }}
                />
              ))}
            </g>
          ))}
        </g>
        
        {/* Connection nodes at medical app endpoints */}
        <motion.g style={{ opacity: nodeOpacity }}>
          {medicalEndX.map((x, i) => {
            const highlightState = isPathHighlighted(i, "medical");
            return (
              <motion.g key={`med-node-${i}`}>
                {/* Outer glow ring */}
                <motion.circle
                  cx={x}
                  cy={medicalEndY}
                  r={highlightState ? 18 : 14}
                  fill="none"
                  stroke={`url(#nodeGlowMedical)`}
                  strokeWidth={highlightState ? 3 : 2}
                  animate={{ 
                    scale: [1, 1.6, 1], 
                    opacity: highlightState ? [0.9, 0.4, 0.9] : [0.7, 0.2, 0.7],
                    r: highlightState ? 18 : 14,
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.1 
                  }}
                />
                {/* Inner solid node */}
                <motion.circle
                  cx={x}
                  cy={medicalEndY}
                  r={highlightState ? 10 : 7}
                  fill={highlightState ? `url(#nodeFillMedicalHighlight)` : `url(#nodeFillMedical)`}
                  animate={{
                    r: highlightState ? 10 : 7,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.g>
            );
          })}
          {/* Connection nodes at exam app endpoints */}
          {examEndX.map((x, i) => {
            const highlightState = isPathHighlighted(i, "exam");
            return (
              <motion.g key={`exam-node-${i}`}>
                {/* Outer glow ring */}
                <motion.circle
                  cx={x}
                  cy={examEndY}
                  r={highlightState ? 18 : 14}
                  fill="none"
                  stroke={`url(#nodeGlowExam)`}
                  strokeWidth={highlightState ? 3 : 2}
                  animate={{ 
                    scale: [1, 1.6, 1], 
                    opacity: highlightState ? [0.9, 0.4, 0.9] : [0.7, 0.2, 0.7],
                    r: highlightState ? 18 : 14,
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.6 + i * 0.1 
                  }}
                />
                {/* Inner solid node */}
                <motion.circle
                  cx={x}
                  cy={examEndY}
                  r={highlightState ? 10 : 7}
                  fill={highlightState ? `url(#nodeFillExamHighlight)` : `url(#nodeFillExam)`}
                  animate={{
                    r: highlightState ? 10 : 7,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.g>
            );
          })}
        </motion.g>
      </svg>

      {/* Mobile SVG - Simplified vertical design with different colors */}
      <svg
        className="absolute left-1/2 top-[280px] -translate-x-1/2 w-full pointer-events-none z-0 md:hidden"
        style={{ height: "1100px" }}
        viewBox="0 0 400 1100"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          {/* Medical gradient mobile */}
          <linearGradient id="medicalGradientMobile" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(280, 80%, 70%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(240, 85%, 60%)" stopOpacity="0.7" />
          </linearGradient>
          
          {/* Exam gradient mobile */}
          <linearGradient id="examGradientMobile" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(35, 95%, 65%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(15, 85%, 55%)" stopOpacity="0.7" />
          </linearGradient>

          {/* Trunk gradient mobile */}
          <linearGradient id="trunkGradientMobile" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="hsl(270, 70%, 70%)" stopOpacity="1" />
            <stop offset="50%" stopColor="hsl(300, 60%, 60%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(30, 80%, 60%)" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="nodeFillMedicalMobile" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(280, 90%, 80%)" />
            <stop offset="100%" stopColor="hsl(260, 80%, 60%)" />
          </radialGradient>
          
          <radialGradient id="nodeFillExamMobile" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(40, 95%, 70%)" />
            <stop offset="100%" stopColor="hsl(25, 90%, 55%)" />
          </radialGradient>

          <filter id="mobileGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central vertical trunk */}
        <motion.path
          d="M200 0 L200 1050"
          stroke="url(#trunkGradientMobile)"
          strokeWidth="6"
          fill="none"
          filter="url(#mobileGlow)"
          strokeLinecap="round"
          style={{ pathLength: useTransform(scrollProgress, [0.1, 0.6], [0, 1]) }}
        />
        
        {/* Medical branch lines (left - purple) - first 3 rows */}
        {[120, 280, 440].map((y, i) => (
          <motion.path
            key={`left-med-${i}`}
            d={`M200 ${y} Q140 ${y} 60 ${y + 40}`}
            stroke="url(#medicalGradientMobile)"
            strokeWidth="4"
            fill="none"
            filter="url(#mobileGlow)"
            strokeLinecap="round"
            style={{ pathLength: useTransform(scrollProgress, [0.12 + i * 0.06, 0.35 + i * 0.06], [0, 1]) }}
          />
        ))}
        
        {/* Medical branch lines (right - purple) - first 3 rows */}
        {[200, 360, 520].map((y, i) => (
          <motion.path
            key={`right-med-${i}`}
            d={`M200 ${y} Q260 ${y} 340 ${y + 40}`}
            stroke="url(#medicalGradientMobile)"
            strokeWidth="4"
            fill="none"
            filter="url(#mobileGlow)"
            strokeLinecap="round"
            style={{ pathLength: useTransform(scrollProgress, [0.15 + i * 0.06, 0.38 + i * 0.06], [0, 1]) }}
          />
        ))}

        {/* Exam branch lines (left - orange) - bottom rows */}
        {[620, 780, 940].map((y, i) => (
          <motion.path
            key={`left-exam-${i}`}
            d={`M200 ${y} Q140 ${y} 60 ${y + 40}`}
            stroke="url(#examGradientMobile)"
            strokeWidth="4"
            fill="none"
            filter="url(#mobileGlow)"
            strokeLinecap="round"
            style={{ pathLength: useTransform(scrollProgress, [0.3 + i * 0.06, 0.53 + i * 0.06], [0, 1]) }}
          />
        ))}
        
        {/* Exam branch lines (right - orange) - bottom rows */}
        {[700, 860].map((y, i) => (
          <motion.path
            key={`right-exam-${i}`}
            d={`M200 ${y} Q260 ${y} 340 ${y + 40}`}
            stroke="url(#examGradientMobile)"
            strokeWidth="4"
            fill="none"
            filter="url(#mobileGlow)"
            strokeLinecap="round"
            style={{ pathLength: useTransform(scrollProgress, [0.35 + i * 0.06, 0.58 + i * 0.06], [0, 1]) }}
          />
        ))}

        {/* Mobile energy particles - Medical */}
        {[120, 280, 440].map((y, i) => (
          <motion.circle
            key={`mobile-particle-left-${i}`}
            r="4"
            fill="hsl(270, 90%, 80%)"
            filter="url(#mobileGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              offsetPath: `path('M200 ${y} Q140 ${y} 60 ${y + 40}')`,
              offsetRotate: "0deg",
            }}
          />
        ))}
        
        {[200, 360, 520].map((y, i) => (
          <motion.circle
            key={`mobile-particle-right-${i}`}
            r="4"
            fill="hsl(270, 90%, 80%)"
            filter="url(#mobileGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 0.3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              offsetPath: `path('M200 ${y} Q260 ${y} 340 ${y + 40}')`,
              offsetRotate: "0deg",
            }}
          />
        ))}

        {/* Mobile energy particles - Exam */}
        {[620, 780, 940].map((y, i) => (
          <motion.circle
            key={`mobile-particle-exam-left-${i}`}
            r="4"
            fill="hsl(35, 95%, 70%)"
            filter="url(#mobileGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, delay: 1 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              offsetPath: `path('M200 ${y} Q140 ${y} 60 ${y + 40}')`,
              offsetRotate: "0deg",
            }}
          />
        ))}
        
        {[700, 860].map((y, i) => (
          <motion.circle
            key={`mobile-particle-exam-right-${i}`}
            r="4"
            fill="hsl(35, 95%, 70%)"
            filter="url(#mobileGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, delay: 1.3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              offsetPath: `path('M200 ${y} Q260 ${y} 340 ${y + 40}')`,
              offsetRotate: "0deg",
            }}
          />
        ))}

        {/* Mobile connection nodes */}
        <motion.g style={{ opacity: nodeOpacity }}>
          {/* Medical nodes - purple */}
          {[120, 280, 440].map((y, i) => (
            <motion.circle
              key={`left-node-med-${i}`}
              cx={60}
              cy={y + 40}
              r="6"
              fill="url(#nodeFillMedicalMobile)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            />
          ))}
          {[200, 360, 520].map((y, i) => (
            <motion.circle
              key={`right-node-med-${i}`}
              cx={340}
              cy={y + 40}
              r="6"
              fill="url(#nodeFillMedicalMobile)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
          {/* Exam nodes - orange */}
          {[620, 780, 940].map((y, i) => (
            <motion.circle
              key={`left-node-exam-${i}`}
              cx={60}
              cy={y + 40}
              r="6"
              fill="url(#nodeFillExamMobile)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            />
          ))}
          {[700, 860].map((y, i) => (
            <motion.circle
              key={`right-node-exam-${i}`}
              cx={340}
              cy={y + 40}
              r="6"
              fill="url(#nodeFillExamMobile)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            />
          ))}
        </motion.g>
      </svg>
    </>
  );
};

const EcosystemSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // State for hover and click interactions
  const [hoveredAppIndex, setHoveredAppIndex] = useState<number | null>(null);
  const [hoveredAppType, setHoveredAppType] = useState<"medical" | "exam" | null>(null);
  const [selectedAppIndex, setSelectedAppIndex] = useState<number | null>(null);
  const [selectedAppType, setSelectedAppType] = useState<"medical" | "exam" | null>(null);

  const setHoveredApp = (index: number | null, type: "medical" | "exam" | null) => {
    setHoveredAppIndex(index);
    setHoveredAppType(type);
  };

  const setSelectedApp = (index: number | null, type: "medical" | "exam" | null) => {
    // Toggle off if clicking the same app
    if (selectedAppIndex === index && selectedAppType === type) {
      setSelectedAppIndex(null);
      setSelectedAppType(null);
    } else {
      setSelectedAppIndex(index);
      setSelectedAppType(type);
    }
  };

  const parentApp = apps.find((app) => app.category === "parent");
  const medicalApps = apps.filter((app) => app.category === "medical");
  const examApps = apps.filter((app) => app.category === "exam");

  return (
    <RootInteractionContext.Provider value={{
      hoveredAppIndex,
      hoveredAppType,
      selectedAppIndex,
      selectedAppType,
      setHoveredApp,
      setSelectedApp,
    }}>
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
                onHoverStart={() => setHoveredApp(index, "medical")}
                onHoverEnd={() => setHoveredApp(null, null)}
                onClick={() => setSelectedApp(index, "medical")}
                viewport={{ once: true, margin: "-50px" }}
                style={{ transformStyle: "preserve-3d", cursor: "pointer" }}
              >
                <div className={`ecosystem-card group relative overflow-hidden transition-all duration-300 ${
                  selectedAppIndex === index && selectedAppType === "medical" 
                    ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-background" 
                    : ""
                }`}>
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
                onHoverStart={() => setHoveredApp(index, "exam")}
                onHoverEnd={() => setHoveredApp(null, null)}
                onClick={() => setSelectedApp(index, "exam")}
                viewport={{ once: true, margin: "-50px" }}
                style={{ transformStyle: "preserve-3d", cursor: "pointer" }}
              >
                <div className={`ecosystem-card group relative overflow-hidden transition-all duration-300 ${
                  selectedAppIndex === index && selectedAppType === "exam" 
                    ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-background" 
                    : ""
                }`}>
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
    </RootInteractionContext.Provider>
  );
};

export default EcosystemSection;
