import React from "react";
import { Link } from "react-router-dom";
import { useNeetStudy } from "../context/NeetStudyContext";
import {
  Flame,
  ArrowLeft,
  Settings,
  Sparkles
} from "lucide-react";

interface NeetNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProModal: () => void;
}

export const NeetNavbar: React.FC<NeetNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProModal
}) => {
  const { profile, daysToExam, readinessScore, resetPlan } = useNeetStudy();

  const navItems = [
    { id: "mission", label: "Today" },
    { id: "study-room", label: "NCERT Study Room" },
    { id: "cbt-mock", label: "NTA 720M Mock" },
    { id: "analytics", label: "Weakness Matrix" },
    { id: "roadmap", label: "Syllabus Plan" }
  ];

  const displayName = profile.studentName.trim() || "Aspirant";

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 text-slate-900 transition-all shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
      {/* Top clean utility strip */}
      <div className="border-b border-slate-100 py-1.5 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exam Essentials</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700">
              NEET {profile.targetExamYear} • {daysToExam} Days Remaining
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{profile.streakDays} Day Streak</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span>Readiness:</span>
              <span className="font-semibold text-slate-900">{readinessScore}%</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{profile.category} Quota Active</span>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Reset your onboarding settings and customize your plan again?")) {
                  resetPlan();
                }
              }}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
              title="Re-calibrate Plan"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        {/* Personalized Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-md shadow-slate-900/10">
            NEET
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-none">
              Hi, {displayName} 👋
            </h1>
            <span className="text-[11px] text-slate-500 font-normal">
              {profile.state} • Target {profile.targetScore}+ in NEET {profile.targetExamYear}
            </span>
          </div>
        </div>

        {/* Minimal Glass-Segmented Control */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
