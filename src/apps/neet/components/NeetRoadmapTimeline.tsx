import React, { useState } from "react";
import { useNeetStudy } from "../context/NeetStudyContext";
import { NEET_TOPICS, NEET_SUBJECTS, NeetSubjectId } from "../data/neetCurriculumData";
import {
  ArrowRight,
  CheckCircle2
} from "lucide-react";

interface NeetRoadmapTimelineProps {
  onOpenTopic: (topicId: string) => void;
}

export const NeetRoadmapTimeline: React.FC<NeetRoadmapTimelineProps> = ({ onOpenTopic }) => {
  const { profile, daysToExam, setActiveTopic } = useNeetStudy();
  const [selectedSubject, setSelectedSubject] = useState<NeetSubjectId | "all">("all");

  const filteredTopics = selectedSubject === "all"
    ? NEET_TOPICS
    : NEET_TOPICS.filter((t) => t.subjectId === selectedSubject);

  const handleSelectTopic = (topic: (typeof NEET_TOPICS)[0]) => {
    setActiveTopic(topic);
    onOpenTopic(topic.id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Syllabus Architecture • {daysToExam} Days to NEET {profile.targetExamYear}
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Class 11 & Class 12 NCERT Units
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Curated breakdown across 24 units. Every chapter is mapped to official NCERT lines, formula sheets, and past 10-year NEET PYQs.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedSubject === "all"
                ? "bg-slate-900 text-white shadow-sm font-semibold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Subjects (24 Units)
          </button>

          {(["biology", "physics", "chemistry"] as NeetSubjectId[]).map((sId) => {
            const sub = NEET_SUBJECTS[sId];
            const isSel = selectedSubject === sId;
            return (
              <button
                key={sId}
                onClick={() => setSelectedSubject(sId)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSel
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => {
          const isDone = profile.completedTopicIds.includes(topic.id);

          return (
            <div
              key={topic.id}
              onClick={() => handleSelectTopic(topic)}
              className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
                isDone
                  ? "bg-slate-50 border-slate-200 opacity-60"
                  : "bg-white border-slate-200/80 hover:border-slate-300 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Class {topic.classLevel} • {topic.subjectId.toUpperCase()}</span>
                  <span className="font-medium text-slate-700">{topic.difficulty}</span>
                </div>
                <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                  {topic.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {topic.unitName}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>{topic.pyqCount} PYQs</span>
                <span className="font-medium text-emerald-700 flex items-center gap-1">
                  <span>{isDone ? "Review" : "Study"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
