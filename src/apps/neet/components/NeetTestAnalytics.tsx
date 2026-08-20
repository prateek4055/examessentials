import React from "react";
import { useNeetStudy } from "../context/NeetStudyContext";
import { NEET_SUBJECTS, NEET_TOPICS } from "../data/neetCurriculumData";
import {
  RotateCcw,
  Zap,
  ArrowRight
} from "lucide-react";

interface NeetTestAnalyticsProps {
  onRetakeMock: () => void;
  onOpenTopicStudy: (topicId: string) => void;
}

export const NeetTestAnalytics: React.FC<NeetTestAnalyticsProps> = ({
  onRetakeMock,
  onOpenTopicStudy
}) => {
  const { mockResults, profile, setActiveTopic } = useNeetStudy();

  const latest = mockResults[0] || {
    id: "demo",
    date: "Latest Attempt",
    totalScore: 592,
    maxScore: 720,
    correctCount: 154,
    incorrectCount: 24,
    unattemptedCount: 2,
    accuracy: 86.5,
    subjectBreakdown: {
      biology: { score: 325, max: 360, correct: 83, wrong: 7 },
      physics: { score: 122, max: 180, correct: 33, wrong: 10 },
      chemistry: { score: 145, max: 180, correct: 38, wrong: 7 }
    },
    weakTopicIds: ["phy-rotational-motion", "chem-thermo-equilibrium", "phy-ray-wave-optics"]
  };

  const negativeMarksLost = latest.incorrectCount * 1;

  const handleFixTopic = (topicId: string) => {
    const topic = NEET_TOPICS.find((t) => t.id === topicId);
    if (topic) {
      setActiveTopic(topic);
      onOpenTopicStudy(topic.id);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Clean Report Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Mock Exam Diagnostic Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mt-1">
              Score: {latest.totalScore} <span className="text-slate-400 text-lg font-normal">/ 720</span>
            </h2>
          </div>

          <button
            onClick={onRetakeMock}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Mock</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500">Percentile Range</span>
            <div className="text-xl font-bold font-mono text-slate-900">Top 2.8%</div>
            <span className="text-[11px] text-emerald-700 font-medium">GMC Qualifying</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500">Overall Accuracy</span>
            <div className="text-xl font-bold font-mono text-slate-900">{latest.accuracy}%</div>
            <span className="text-[11px] text-slate-500">{latest.correctCount} Correct / {latest.incorrectCount} Wrong</span>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 space-y-1">
            <span className="text-xs text-red-700">Negative Penalty</span>
            <div className="text-xl font-bold font-mono text-red-700">-{negativeMarksLost} Marks</div>
            <span className="text-[11px] text-red-600">On {latest.incorrectCount} Silly Mistakes</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500">Target Score</span>
            <div className="text-xl font-bold font-mono text-slate-900">{profile.targetScore} / 720</div>
            <span className="text-[11px] text-slate-500">Gap: {Math.max(0, profile.targetScore - latest.totalScore)} marks</span>
          </div>
        </div>
      </div>

      {/* Weak Topics */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          Targeted Chapter Remediation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latest.weakTopicIds.map((topicId) => {
            const topic = NEET_TOPICS.find((t) => t.id === topicId) || NEET_TOPICS[0];
            return (
              <div
                key={topicId}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {topic.subjectId} • {topic.difficulty}
                  </span>
                  <h4 className="font-semibold text-sm text-slate-900">{topic.name}</h4>
                  <p className="text-xs text-slate-500">{topic.ncertChapter}</p>
                </div>

                <button
                  onClick={() => handleFixTopic(topic.id)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fix in Study Room</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
