import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { Lock, ArrowLeft, ShieldAlert, KeyRound } from "lucide-react";
import { NeetStudyProvider, useNeetStudy } from "../context/NeetStudyContext";
import { NeetNavbar } from "../components/NeetNavbar";
import { NeetDailyMissionHub } from "../components/NeetDailyMissionHub";
import { NeetStudyRoom } from "../components/NeetStudyRoom";
import { NeetCbtMockEngine } from "../components/NeetCbtMockEngine";
import { NeetTestAnalytics } from "../components/NeetTestAnalytics";
import { NeetRoadmapTimeline } from "../components/NeetRoadmapTimeline";
import { NeetProModal } from "../components/NeetProModal";
import { NeetOnboardingWizard } from "../components/NeetOnboardingWizard";

const ADMIN_ACCESS_KEY_STORAGE = "neet_admin_override_key";
const ADMIN_SECRET = "examneet@2026"; // Dedicated passcode for owner unlock

const NeetAppContent = () => {
  const { profile } = useNeetStudy();
  const { isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("mission");
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  // Allow admin via Supabase or via secret owner passcode
  const [adminPasscode, setAdminPasscode] = useState<string>("");
  const [hasPasscodeAccess, setHasPasscodeAccess] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_ACCESS_KEY_STORAGE) === ADMIN_SECRET;
  });
  const [passcodeError, setPasscodeError] = useState<string>("");

  const handleUnlockWithPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode.trim().toLowerCase() === ADMIN_SECRET.toLowerCase()) {
      localStorage.setItem(ADMIN_ACCESS_KEY_STORAGE, ADMIN_SECRET);
      setHasPasscodeAccess(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid admin access key. Only authorized creators can access.");
    }
  };

  const handleStartLesson = (topicId: string) => {
    setActiveTab("study-room");
  };

  const handleStartMock = () => {
    setActiveTab("cbt-mock");
  };

  const handleFinishMock = () => {
    setActiveTab("analytics");
  };

  const isOwnerAuthorized = isAdmin || hasPasscodeAccess;

  // 🔒 RESTRICT ACCESS: If not authorized owner, show Early Access / Under Development Locked Screen
  if (!isLoading && !isOwnerAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500 selection:text-black font-body">
        <SEOHead
          title="Under Active Development | NEET Essentials"
          description="NEET Essentials is currently in private preview mode."
          canonical="https://examessentials.in/neet-app"
        />

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-700/60 p-8 sm:p-10 shadow-2xl space-y-6 text-center animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
              Private Creator Preview
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              NEET Essentials is Locked
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This platform is currently undergoing curated 40-year PYQ & NCERT content integration. Public launch coming soon.
            </p>
          </div>

          {/* Admin Unlock Form */}
          <form onSubmit={handleUnlockWithPasscode} className="space-y-3 pt-2 text-left">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Owner / Admin Passcode:</span>
            </label>
            <input
              type="password"
              placeholder="Enter passcode to unlock"
              value={adminPasscode}
              onChange={(e) => {
                setAdminPasscode(e.target.value);
                if (passcodeError) setPasscodeError("");
              }}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            {passcodeError && (
              <p className="text-[11px] text-red-400 font-medium">
                {passcodeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Unlock Creator Cockpit
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Exam Essentials Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If student is not yet onboarded, display the personalized onboarding wizard
  if (!profile.isOnboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F8FB] via-[#F1F5F9] to-[#E9EFF6] text-slate-900 flex flex-col font-body selection:bg-emerald-600 selection:text-white">
        <SEOHead
          title="Curate Your NEET Journey | NEET Essentials"
          description="Personalized digital coaching system for NEET aspirants with curated NCERT lessons and NTA CBT mock testing."
          canonical="https://examessentials.in/neet-app"
        />
        <NeetOnboardingWizard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8FB] via-[#F1F5F9] to-[#E9EFF6] text-slate-900 flex flex-col font-body selection:bg-emerald-600 selection:text-white">
      <SEOHead
        title="NEET Essentials | Personal NCERT Digital Coaching & 720M CBT Mocks"
        description="Master NEET with personalized daily missions, curated NCERT YouTube video lessons, synchronized formulas, and real NTA 720-mark CBT mock exams."
        canonical="https://examessentials.in/neet-app"
      />

      {/* Top Navbar */}
      <NeetNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:py-10">
        {activeTab === "mission" && (
          <NeetDailyMissionHub
            onStartLesson={handleStartLesson}
            onStartMock={handleStartMock}
          />
        )}

        {activeTab === "study-room" && (
          <NeetStudyRoom onOpenPractice={handleStartMock} />
        )}

        {activeTab === "cbt-mock" && (
          <NeetCbtMockEngine onFinishMock={handleFinishMock} />
        )}

        {activeTab === "analytics" && (
          <NeetTestAnalytics
            onRetakeMock={handleStartMock}
            onOpenTopicStudy={handleStartLesson}
          />
        )}

        {activeTab === "roadmap" && (
          <NeetRoadmapTimeline onOpenTopic={handleStartLesson} />
        )}
      </main>

      {/* Pro Membership Modal */}
      <NeetProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
    </div>
  );
};

export default function NeetAppPage() {
  return (
    <NeetStudyProvider>
      <NeetAppContent />
    </NeetStudyProvider>
  );
}
