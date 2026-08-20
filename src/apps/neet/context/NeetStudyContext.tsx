import React, { createContext, useContext, useState, useEffect } from "react";
import { NEET_TOPICS, NeetTopic, NeetSubjectId } from "../data/neetCurriculumData";
import { NEET_SAMPLE_MOCK_QUESTIONS, NeetQuestion } from "../data/neetQuestionBank";

export type NeetCategory = "GEN" | "OBC" | "EWS" | "SC" | "ST";

export interface DailyTask {
  id: string;
  type: "learn" | "practice" | "test" | "revision";
  subjectId: NeetSubjectId;
  topicId: string;
  title: string;
  durationMinutes: number;
  isCompleted: boolean;
  notesSummary?: string;
  pyqCount?: number;
}

export interface UserStudyProfile {
  studentName: string;
  isIndian: boolean;
  state: string;
  category: NeetCategory;
  targetExamYear: number; // 2026, 2027, 2028, 2029, 2030
  targetDate: string; // e.g. "2026-05-03"
  targetScore: number; // e.g. 660
  estimatedGmcCutoff: number; // calculated based on category
  dailyHours: number; // custom number up to 24
  currentLevel: "Class 11 Aspirant" | "Class 12 Regular" | "Dropper / Target 680+";
  weakSubjects: NeetSubjectId[];
  authMethod: "google" | "whatsapp" | "guest";
  authIdentifier: string; // email or whatsapp number
  isOnboarded: boolean;
  streakDays: number;
  proTrialExpiresAt: string; // ISO string
  isPro: boolean;
  completedTopicIds: string[];
  bookmarkedQuestionIds: string[];
}

export interface MockTestResult {
  id: string;
  date: string;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  subjectBreakdown: {
    biology: { score: number; max: number; correct: number; wrong: number };
    physics: { score: number; max: number; correct: number; wrong: number };
    chemistry: { score: number; max: number; correct: number; wrong: number };
  };
  weakTopicIds: string[];
}

interface NeetStudyContextType {
  profile: UserStudyProfile;
  updateProfile: (updates: Partial<UserStudyProfile>) => void;
  dailyTasks: DailyTask[];
  generateCustomPlan: (customProfile: Partial<UserStudyProfile>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  activeTopic: NeetTopic;
  setActiveTopic: (topic: NeetTopic) => void;
  mockResults: MockTestResult[];
  saveMockResult: (result: MockTestResult) => void;
  proDaysRemaining: number;
  isProActive: boolean;
  daysToExam: number;
  readinessScore: number;
  resetPlan: () => void;
}

export const CATEGORY_GMC_CUTOFFS: Record<NeetCategory, { safeScore: number; aiqRankEst: string; label: string }> = {
  GEN: { safeScore: 660, aiqRankEst: "Top 15,000 AIQ", label: "General / Unreserved" },
  EWS: { safeScore: 650, aiqRankEst: "Top 18,000 AIQ", label: "Economically Weaker Section" },
  OBC: { safeScore: 652, aiqRankEst: "Top 17,500 AIQ", label: "Other Backward Class" },
  SC: { safeScore: 560, aiqRankEst: "Top 85,000 AIQ", label: "Scheduled Caste" },
  ST: { safeScore: 530, aiqRankEst: "Top 1,20,000 AIQ", label: "Scheduled Tribe" }
};

export const NEET_EXAM_DATES: Record<number, string> = {
  2026: "2026-05-03",
  2027: "2027-05-02",
  2028: "2028-05-07",
  2029: "2029-05-06",
  2030: "2030-05-05"
};

const STORAGE_KEY = "neet_study_profile_v5_nmc";
const MOCKS_STORAGE_KEY = "neet_mock_results_v5_nmc";

const defaultProfile: UserStudyProfile = {
  studentName: "",
  isIndian: true,
  state: "Delhi NCR",
  category: "GEN",
  targetExamYear: 2026,
  targetDate: "2026-05-03",
  targetScore: 660,
  estimatedGmcCutoff: 660,
  dailyHours: 6,
  currentLevel: "Class 12 Regular",
  weakSubjects: ["physics"],
  authMethod: "guest",
  authIdentifier: "",
  isOnboarded: false,
  streakDays: 1,
  proTrialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  isPro: true,
  completedTopicIds: [],
  bookmarkedQuestionIds: []
};

const NeetStudyContext = createContext<NeetStudyContextType | undefined>(undefined);

export const NeetStudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserStudyProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultProfile;
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const savedTasks = localStorage.getItem("neet_daily_tasks_v5_nmc");
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {}
    }
    return [
      {
        id: "task-1",
        type: "learn",
        subjectId: "biology",
        topicId: "bio-unit-1",
        title: "Diversity in Living World: Monera, Protista & Plant Kingdom",
        durationMinutes: 45,
        isCompleted: false,
        notesSummary: "Algae pigments, Mannitol storage & Bryophytes life-cycle."
      },
      {
        id: "task-2",
        type: "practice",
        subjectId: "biology",
        topicId: "bio-unit-1",
        title: "Daily Drill: 25 NCERT Line-by-Line PYQs",
        durationMinutes: 25,
        isCompleted: false,
        pyqCount: 25
      },
      {
        id: "task-3",
        type: "learn",
        subjectId: "physics",
        topicId: "phy-unit-15-16",
        title: "Physics Focus: Refraction & Lens Maker's Formula",
        durationMinutes: 50,
        isCompleted: false,
        notesSummary: "Sign conventions, power of lens combination, liquid immersion factor."
      },
      {
        id: "task-4",
        type: "learn",
        subjectId: "chemistry",
        topicId: "chem-physical-1-3",
        title: "Chemistry: VSEPR Molecular Shapes & Hybridization",
        durationMinutes: 40,
        isCompleted: false,
        notesSummary: "XeF4 square planar, SF4 see-saw, ClF3 T-shaped."
      }
    ];
  });

  const [activeTopic, setActiveTopic] = useState<NeetTopic>(
    NEET_TOPICS.find((t) => t.id === "bio-unit-1") || NEET_TOPICS[0]
  );

  const [mockResults, setMockResults] = useState<MockTestResult[]>(() => {
    const saved = localStorage.getItem(MOCKS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("neet_daily_tasks_v5_nmc", JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem(MOCKS_STORAGE_KEY, JSON.stringify(mockResults));
  }, [mockResults]);

  const updateProfile = (updates: Partial<UserStudyProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const generateCustomPlan = (customProfile: Partial<UserStudyProfile>) => {
    const hours = customProfile.dailyHours || profile.dailyHours || 6;
    const weak = customProfile.weakSubjects || profile.weakSubjects || ["physics"];

    const newTasks: DailyTask[] = [
      {
        id: `custom-task-1`,
        type: "learn",
        subjectId: "biology",
        topicId: "bio-unit-1",
        title: "Diversity in Living World: NCERT Extract",
        durationMinutes: Math.round(hours * 15),
        isCompleted: false,
        notesSummary: "Algae pigments, Mannitol storage & Bryophytes life-cycle."
      },
      {
        id: `custom-task-2`,
        type: "practice",
        subjectId: "biology",
        topicId: "bio-unit-1",
        title: "Daily Drill: 25 NCERT PYQs",
        durationMinutes: 25,
        isCompleted: false,
        pyqCount: 25
      },
      {
        id: `custom-task-3`,
        type: "learn",
        subjectId: "physics",
        topicId: "phy-unit-15-16",
        title: weak.includes("physics") ? "High-Priority Physics: Lens Maker & Refraction" : "Physics: Ray Optics Foundation",
        durationMinutes: Math.round(hours * 18),
        isCompleted: false,
        notesSummary: "Lens Maker equation, sign convention, liquid immersion factor."
      },
      {
        id: `custom-task-4`,
        type: "learn",
        subjectId: "chemistry",
        topicId: "chem-physical-1-3",
        title: "Chemistry: VSEPR Molecular Shapes",
        durationMinutes: Math.round(hours * 12),
        isCompleted: false,
        notesSummary: "XeF4, SF4, ClF3 lone pair placements."
      }
    ];

    setDailyTasks(newTasks);
    updateProfile({ ...customProfile, isOnboarded: true });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const saveMockResult = (result: MockTestResult) => {
    setMockResults((prev) => [result, ...prev]);
  };

  const resetPlan = () => {
    setProfile({ ...defaultProfile, isOnboarded: false });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("neet_daily_tasks_v5_nmc");
  };

  const targetDateStr = NEET_EXAM_DATES[profile.targetExamYear] || profile.targetDate || "2026-05-03";
  const targetDateObj = new Date(targetDateStr);
  const today = new Date();
  const diffTime = targetDateObj.getTime() - today.getTime();
  const daysToExam = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const expiryDate = new Date(profile.proTrialExpiresAt);
  const proDiffTime = expiryDate.getTime() - today.getTime();
  const proDaysRemaining = Math.max(0, Math.ceil(proDiffTime / (1000 * 60 * 60 * 24)));
  const isProActive = profile.isPro || proDaysRemaining > 0;

  const completedCount = profile.completedTopicIds.length;
  const totalTopics = NEET_TOPICS.length;
  const taskCompletionRate =
    dailyTasks.filter((t) => t.isCompleted).length / Math.max(1, dailyTasks.length);
  const readinessScore = Math.min(
    98,
    Math.round((completedCount / totalTopics) * 60 + taskCompletionRate * 25 + 10)
  );

  return (
    <NeetStudyContext.Provider
      value={{
        profile,
        updateProfile,
        dailyTasks,
        generateCustomPlan,
        toggleTaskCompletion,
        activeTopic,
        setActiveTopic,
        mockResults,
        saveMockResult,
        proDaysRemaining,
        isProActive,
        daysToExam,
        readinessScore,
        resetPlan
      }}
    >
      {children}
    </NeetStudyContext.Provider>
  );
};

export const useNeetStudy = () => {
  const context = useContext(NeetStudyContext);
  if (!context) {
    throw new Error("useNeetStudy must be used within a NeetStudyProvider");
  }
  return context;
};
