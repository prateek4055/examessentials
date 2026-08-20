import React, { useState } from "react";
import { useNeetStudy } from "../context/NeetStudyContext";
import { NEET_TOPICS, NeetTopic } from "../data/neetCurriculumData";
import { NEET_CURATED_TOPICS, CuratedTopicContent } from "../data/neetCuratedLessons";
import {
  Youtube,
  BookOpen,
  Zap,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface NeetStudyRoomProps {
  onOpenPractice: () => void;
}

export const NeetStudyRoom: React.FC<NeetStudyRoomProps> = ({ onOpenPractice }) => {
  const { activeTopic: currentActive, setActiveTopic, profile, updateProfile } = useNeetStudy();
  const [selectedTab, setSelectedTab] = useState<"ncert" | "formulas" | "mindmap">("ncert");

  // Fallback safe guard
  const activeTopic = currentActive || NEET_TOPICS[0];

  const topicContent: CuratedTopicContent = NEET_CURATED_TOPICS[activeTopic?.id] || {
    topicId: activeTopic?.id || "bio-unit-1",
    title: `${activeTopic?.name || "Topic"}: Official NCERT Masterclass`,
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: (activeTopic?.estimatedHours || 2) * 30,
    ncertHighlights: [
      `Mastering foundational definitions in ${activeTopic?.ncertChapter || "NCERT"}.`,
      "Review high-yield previous year questions from 2019 to 2024.",
      "Pay attention to NCERT diagrams, tables, and exception boxes."
    ],
    keyFormulas: [
      "Standard Formula 1 for rapid calculation in NEET timed conditions",
      "Dimensional analysis check for fast elimination of wrong options"
    ],
    highYieldTips: [
      "Direct NCERT line matching question has appeared in 4 out of the last 5 NEET papers."
    ],
    mindmapSummary: `Core concepts of ${activeTopic?.name || "Topic"} mapped directly to NTA NEET UG pattern.`
  };

  const isCompleted = profile.completedTopicIds.includes(activeTopic.id);

  const toggleTopicCompletion = () => {
    if (isCompleted) {
      updateProfile({
        completedTopicIds: profile.completedTopicIds.filter((id) => id !== activeTopic.id)
      });
    } else {
      updateProfile({
        completedTopicIds: [...profile.completedTopicIds, activeTopic.id]
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{activeTopic.subjectId.toUpperCase()}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span>{activeTopic.unitName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-900">{activeTopic.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTopicCompletion}
            className={`px-3.5 py-2 rounded-2xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              isCompleted
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-600" : "text-slate-400"}`} />
            <span>{isCompleted ? "Completed" : "Mark Done"}</span>
          </button>

          <button
            onClick={onOpenPractice}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-black text-white font-medium text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Practice PYQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Split-Screen Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Gold-Standard Curated Video Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video shadow-lg border border-white/20">
            <iframe
              className="w-full h-full object-cover"
              src={`https://www.youtube-nocookie.com/embed/${topicContent.youtubeVideoId}?rel=0&modestbranding=1`}
              title={topicContent.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                ⭐ Gold-Standard Curated Lecture
              </span>
              <span className="font-mono">{topicContent.durationMinutes} mins</span>
            </div>
            <h3 className="font-semibold text-base text-slate-900 leading-snug">
              {topicContent.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We hand-pick the single most concise, high-yield NCERT lecture for this chapter. No hunting through playlists — simply learn, review notes, and solve PYQs.
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Notes Deck */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => setSelectedTab("ncert")}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedTab === "ncert" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              NCERT Highlights
            </button>
            <button
              onClick={() => setSelectedTab("formulas")}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedTab === "formulas" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Formulas & Tips
            </button>
            <button
              onClick={() => setSelectedTab("mindmap")}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedTab === "mindmap" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Synthesis
            </button>
          </div>

          {/* Notes Content Card */}
          <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)] space-y-4 min-h-[380px]">
            {selectedTab === "ncert" && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-semibold text-slate-900">
                  Key NCERT Facts ({activeTopic.ncertChapter})
                </span>
                <div className="space-y-2.5">
                  {topicContent.ncertHighlights.map((hl, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "formulas" && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-semibold text-slate-900">
                  Formulas & Shortcuts
                </span>
                <div className="space-y-2">
                  {topicContent.keyFormulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-800"
                    >
                      {f}
                    </div>
                  ))}
                  {topicContent.highYieldTips.map((tip, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900"
                    >
                      ⚠️ {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "mindmap" && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-semibold text-slate-900">
                  Chapter Mindmap
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {topicContent.mindmapSummary}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
