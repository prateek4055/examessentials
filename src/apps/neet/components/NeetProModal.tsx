import React from "react";
import { useNeetStudy } from "../context/NeetStudyContext";
import {
  Check,
  X,
  Sparkles
} from "lucide-react";

interface NeetProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NeetProModal: React.FC<NeetProModalProps> = ({ isOpen, onClose }) => {
  const { proDaysRemaining, isProActive } = useNeetStudy();

  if (!isOpen) return null;

  const proFeatures = [
    "Full NTA Pattern 720-Mark CBT Mock Exams with instant analysis",
    "AI Adaptive Planning: Real-time rebalancing when you miss targets",
    "NCERT Line-by-Line PYQ Drills (2015-2024 with detailed step solutions)",
    "Post-Test Negative Mark Drain Analysis & Weakness Heatmap",
    "Unlimited Spaced Repetition Formula Cards & NCERT Summaries",
    "100% Ad-Free, Distraction-Free Focused Study Experience"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-2xl space-y-6 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Pro Membership
          </span>
          <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">
            NEET Essentials Pass
          </h3>
          <p className="text-xs text-slate-500">
            Structured personal coaching system for serious 650+ aspirants
          </p>
        </div>

        {isProActive && (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>7-Day Free Pro Pass Active</span>
              </span>
              <p className="text-[11px] text-slate-600">
                Full access to all NTA mocks and diagnostic tools.
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg font-bold text-emerald-800">
                {proDaysRemaining} Days
              </div>
              <span className="text-[10px] text-slate-400">Remaining</span>
            </div>
          </div>
        )}

        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-semibold text-slate-900">
            Included in Pro:
          </span>
          <div className="space-y-2">
            {proFeatures.map((feat, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-center">
            <span className="text-[11px] text-slate-500 font-medium">Monthly Pass</span>
            <div className="font-mono text-xl font-bold text-slate-900">₹149<span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <p className="text-[10px] text-slate-400">Cancel anytime</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1 text-center relative overflow-hidden">
            <span className="text-[11px] text-emerald-400 font-medium">NEET 2026 Season Pass</span>
            <div className="font-mono text-xl font-bold text-white">₹799<span className="text-xs text-slate-400 font-normal">/yr</span></div>
            <p className="text-[10px] text-slate-300">Till NEET Exam Day</p>
          </div>
        </div>

        <button
          onClick={() => {
            alert("Checkout integration with Razorpay.");
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
        >
          Activate Full Season Pass for ₹799
        </button>
      </div>
    </div>
  );
};
