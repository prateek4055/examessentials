import React from "react";
import { useNeetStudy, CATEGORY_GMC_CUTOFFS } from "../context/NeetStudyContext";
import { NEET_SUBJECTS, NEET_TOPICS } from "../data/neetCurriculumData";
import {
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
  Target,
  Calendar
} from "lucide-react";

interface DailyMissionHubProps {
  onStartLesson: (topicId: string) => void;
  onStartMock: () => void;
}

export const NeetDailyMissionHub: React.FC<DailyMissionHubProps> = ({
  onStartLesson,
  onStartMock
}) => {
  const {
    profile,
    dailyTasks,
    toggleTaskCompletion,
    daysToExam,
    readinessScore,
    setActiveTopic
  } = useNeetStudy();

  const completedCount = dailyTasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / Math.max(1, dailyTasks.length)) * 100);

  const gmcEst = CATEGORY_GMC_CUTOFFS[profile.category] || CATEGORY_GMC_CUTOFFS["GEN"];

  const getSubjectColor = (subjectId: string) => {
    switch (subjectId) {
      case "biology":
        return { tag: "text-emerald-800 bg-emerald-50/80 border-emerald-200/80" };
      case "physics":
        return { tag: "text-sky-800 bg-sky-50/80 border-sky-200/80" };
      case "chemistry":
        return { tag: "text-amber-800 bg-amber-50/80 border-amber-200/80" };
      default:
        return { tag: "text-slate-800 bg-slate-50/80 border-slate-200/80" };
    }
  };

  const handleTaskAction = (task: (typeof dailyTasks)[0]) => {
    const topic = NEET_TOPICS.find((t) => t.id === task?.topicId) || NEET_TOPICS[0];
    if (topic) {
      setActiveTopic(topic);
      onStartLesson(topic.id);
    }
  };

  const firstName = profile?.studentName ? profile.studentName.split(" ")[0] : "Aspirant";

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Apple + Glass-Claymorph Hero Cockpit */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/80 p-8 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personalized for {firstName} • {profile?.state || "India"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Hi, {firstName} — Ready for Today's NEET Mission?
            </h2>
          </div>

          {/* Target Countdown Chip */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">NEET {profile?.targetExamYear || 2026}</div>
              <div className="text-sm font-bold font-mono text-emerald-300">{daysToExam} Days Remaining</div>
            </div>
          </div>
        </div>

        {/* Personalized Benchmark & Capacity Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">Daily Study Allocation</span>
            <div className="text-lg font-bold text-slate-900 font-mono">{profile?.dailyHours || 6} Hours / Day</div>
            <p className="text-[11px] text-slate-400">Paced for {profile?.currentLevel || "Class 12 Regular"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-0.5">
            <span className="text-xs text-emerald-800 font-medium">Target {profile?.category || "GEN"} Score</span>
            <div className="text-lg font-bold text-emerald-950 font-mono">{profile?.targetScore || 660} / 720</div>
            <p className="text-[11px] text-emerald-700">Safe GMC: {gmcEst?.safeScore || 660}+</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-0.5">
            <span className="text-xs text-slate-500 font-medium">Priority Focus Subject</span>
            <div className="text-lg font-bold text-slate-900 uppercase font-mono">
              {profile?.weakSubjects?.join(", ") || "All 3"}
            </div>
            <p className="text-[11px] text-slate-400">High daily task weight</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          {dailyTasks[0] && (
            <button
              onClick={() => handleTaskAction(dailyTasks[0])}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch First Session ({dailyTasks[0]?.durationMinutes || 45}m)</span>
            </button>
          )}

          <button
            onClick={onStartMock}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            Take NTA 720M Practice Drill
          </button>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Today's Task Completion</span>
            <span className="font-semibold text-slate-900">{completedCount} of {dailyTasks.length} tasks completed</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold tracking-tight text-slate-900">
            Today's Curated Action Flow
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total ~{dailyTasks.reduce((acc, t) => acc + t.durationMinutes, 0)} mins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyTasks.map((task) => {
            const colors = getSubjectColor(task.subjectId);
            return (
              <div
                key={task.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-5 backdrop-blur-xl ${
                  task.isCompleted
                    ? "bg-slate-50/60 border-slate-200/50 opacity-60"
                    : "bg-white/90 border-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-semibold border ${colors.tag}`}
                    >
                      {task.subjectId.toUpperCase()} • {task.type.toUpperCase()}
                    </span>

                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors p-1 cursor-pointer"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                  </div>

                  <h4
                    className={`font-semibold text-sm leading-snug ${
                      task.isCompleted ? "text-slate-400 line-through" : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.notesSummary && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {task.notesSummary}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.durationMinutes} mins</span>
                    {task.pyqCount && <span>• {task.pyqCount} PYQs</span>}
                  </div>

                  <button
                    onClick={() => handleTaskAction(task)}
                    className="font-medium text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{task.isCompleted ? "Review" : "Open Session"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Units Clean Card Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">
          Curriculum Mastered
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.values(NEET_SUBJECTS).map((sub) => {
            const topicsForSub = NEET_TOPICS.filter((t) => t.subjectId === sub.id);
            const completedInSub = topicsForSub.filter((t) =>
              (profile?.completedTopicIds || []).includes(t.id)
            ).length;
            const pct = Math.round((completedInSub / Math.max(1, topicsForSub.length)) * 100);

            return (
              <div
                key={sub.id}
                className="p-5 rounded-3xl bg-white/90 border border-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-slate-900">{sub.name}</h4>
                  <span className="text-xs font-semibold text-slate-700">{pct}%</span>
                </div>

                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{completedInSub} of {topicsForSub.length} units</span>
                  <span>{sub.totalMarks} Marks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
