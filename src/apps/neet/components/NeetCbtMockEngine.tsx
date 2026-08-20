import React, { useState, useEffect } from "react";
import { useNeetStudy } from "../context/NeetStudyContext";
import { NEET_SAMPLE_MOCK_QUESTIONS } from "../data/neetQuestionBank";
import { NEET_SUBJECTS, NeetSubjectId } from "../data/neetCurriculumData";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw
} from "lucide-react";

interface NeetCbtMockEngineProps {
  onFinishMock: () => void;
}

type QuestionStatus = "not_visited" | "not_answered" | "answered" | "marked" | "answered_marked";

export const NeetCbtMockEngine: React.FC<NeetCbtMockEngineProps> = ({ onFinishMock }) => {
  const { saveMockResult } = useNeetStudy();

  const [activeSubject, setActiveSubject] = useState<NeetSubjectId>("biology");
  const [activeSection, setActiveSection] = useState<"A" | "B">("A");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(2700);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<string, QuestionStatus>>({});

  const currentQuestions = NEET_SAMPLE_MOCK_QUESTIONS.filter(
    (q) => q.subjectId === activeSubject && q.section === activeSection
  );

  const currentQ = currentQuestions[currentQuestionIndex] || NEET_SAMPLE_MOCK_QUESTIONS[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQ.id]: "answered"
    }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    const newAnswers = { ...userAnswers };
    delete newAnswers[currentQ.id];
    setUserAnswers(newAnswers);
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQ.id]: "not_answered"
    }));
  };

  const handleMarkForReview = () => {
    if (!currentQ) return;
    const isAnswered = userAnswers[currentQ.id] !== undefined;
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQ.id]: isAnswered ? "answered_marked" : "marked"
    }));
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (activeSection === "A") {
        setActiveSection("B");
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    let totalScore = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const breakdown: Record<NeetSubjectId, { score: number; max: number; correct: number; wrong: number }> = {
      biology: { score: 0, max: 360, correct: 0, wrong: 0 },
      physics: { score: 0, max: 180, correct: 0, wrong: 0 },
      chemistry: { score: 0, max: 180, correct: 0, wrong: 0 }
    };

    const weakTopics: string[] = [];

    NEET_SAMPLE_MOCK_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === undefined) {
        unattempted++;
      } else if (selected === q.correctIndex) {
        correct++;
        totalScore += 4;
        breakdown[q.subjectId].correct++;
        breakdown[q.subjectId].score += 4;
      } else {
        incorrect++;
        totalScore -= 1;
        breakdown[q.subjectId].wrong++;
        breakdown[q.subjectId].score -= 1;
        if (!weakTopics.includes(q.topicId)) {
          weakTopics.push(q.topicId);
        }
      }
    });

    const accuracy = correct + incorrect > 0 ? (correct / (correct + incorrect)) * 100 : 0;

    saveMockResult({
      id: `mock-${Date.now()}`,
      date: "Just now",
      totalScore,
      maxScore: 720,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      accuracy: Math.round(accuracy * 10) / 10,
      subjectBreakdown: breakdown,
      weakTopicIds: weakTopics
    });

    onFinishMock();
  };

  const getPaletteStyle = (status: QuestionStatus | undefined, isCurrent: boolean) => {
    let base = "border text-slate-700 bg-slate-50 border-slate-200";
    if (status === "answered") base = "bg-emerald-600 border-emerald-600 text-white";
    if (status === "not_answered") base = "bg-red-50 border-red-200 text-red-700";
    if (status === "marked" || status === "answered_marked") base = "bg-purple-50 border-purple-200 text-purple-700";

    return `${base} ${isCurrent ? "ring-2 ring-slate-900 ring-offset-1 font-bold" : ""}`;
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top Test Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            NTA Pattern Simulation
          </span>
          <h2 className="text-base font-semibold text-slate-900">
            NEET Full Syllabus Benchmark Test
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 font-mono text-sm font-semibold text-slate-900">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Submit your examination now?")) {
                handleSubmitTest();
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-medium text-xs shadow-sm cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Subject & Section Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-1">
          {(["biology", "physics", "chemistry"] as NeetSubjectId[]).map((sId) => {
            const sub = NEET_SUBJECTS[sId];
            const isActive = activeSubject === sId;
            return (
              <button
                key={sId}
                onClick={() => {
                  setActiveSubject(sId);
                  setCurrentQuestionIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => {
              setActiveSection("A");
              setCurrentQuestionIndex(0);
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeSection === "A" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500"
            }`}
          >
            Section A
          </button>
          <button
            onClick={() => {
              setActiveSection("B");
              setCurrentQuestionIndex(0);
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeSection === "B" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500"
            }`}
          >
            Section B
          </button>
        </div>
      </div>

      {/* Main CBT Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-7 space-y-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-semibold text-xs text-slate-500">
              Question {currentQuestionIndex + 1} of {currentQuestions.length}
            </span>
            <div className="flex gap-2 text-xs font-mono">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">+4 Marks</span>
              <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded font-medium">-1 Neg</span>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-900 leading-relaxed">
            {currentQ.questionText}
          </div>

          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;
              return (
                <label
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-50 border-slate-900 text-slate-900"
                      : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-mono font-medium ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-xs leading-relaxed">{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                onClick={handleMarkForReview}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
              >
                Mark Review
              </button>
              <button
                onClick={handleClearResponse}
                className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                Clear
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-30 text-xs font-medium"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-medium"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Palette (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Question Palette
          </span>

          <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto">
            {currentQuestions.map((q, idx) => {
              const status = questionStatus[q.id];
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-9 rounded-xl font-mono text-xs transition-all cursor-pointer ${getPaletteStyle(
                    status,
                    isCurrent
                  )}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
