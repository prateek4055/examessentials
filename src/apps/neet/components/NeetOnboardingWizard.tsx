import React, { useState } from "react";
import {
  useNeetStudy,
  NeetCategory,
  CATEGORY_GMC_CUTOFFS,
  NEET_EXAM_DATES
} from "../context/NeetStudyContext";
import { NeetSubjectId } from "../data/neetCurriculumData";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  ShieldCheck,
  Check
} from "lucide-react";

const INDIAN_STATES = [
  "Delhi NCR",
  "Maharashtra",
  "Uttar Pradesh",
  "Rajasthan",
  "Bihar",
  "Tamil Nadu",
  "Karnataka",
  "Madhya Pradesh",
  "Gujarat",
  "West Bengal",
  "Kerala",
  "Andhra Pradesh",
  "Telangana",
  "Punjab",
  "Haryana",
  "Odisha",
  "Assam",
  "Jharkhand",
  "Chhattisgarh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Other State / UT"
];

export const NeetOnboardingWizard: React.FC = () => {
  const { generateCustomPlan } = useNeetStudy();

  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Step 1: Student Demographics & Target Exam Year
  const [name, setName] = useState<string>("");
  const [isIndian, setIsIndian] = useState<boolean>(true);
  const [state, setState] = useState<string>("Delhi NCR");
  const [category, setCategory] = useState<NeetCategory>("GEN");
  const [targetYear, setTargetYear] = useState<number>(2026);

  // Step 2: Level & Target Score Estimation
  const [level, setLevel] = useState<"Class 11 Aspirant" | "Class 12 Regular" | "Dropper / Target 680+">("Class 12 Regular");
  const [targetScore, setTargetScore] = useState<number>(680);

  // Step 3: Hours (up to 24) & Weak Subject Prioritization
  const [hours, setHours] = useState<number>(6);
  const [customHoursInput, setCustomHoursInput] = useState<string>("6");
  const [isCustomHours, setIsCustomHours] = useState<boolean>(false);
  const [weakSubjects, setWeakSubjects] = useState<NeetSubjectId[]>(["physics"]);

  // Step 4: Auth Choice (Google or WhatsApp)
  const [authMethod, setAuthMethod] = useState<"whatsapp" | "google">("whatsapp");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [googleEmail, setGoogleEmail] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const gmcEst = CATEGORY_GMC_CUTOFFS[category];

  // Validation handlers
  const handleStep1Next = () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name to proceed.");
      return;
    }
    if (name.trim().length < 2) {
      setErrorMessage("Please enter a valid student name (at least 2 characters).");
      return;
    }
    setErrorMessage("");
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!level) {
      setErrorMessage("Please select your current preparation stage.");
      return;
    }
    setErrorMessage("");
    setStep(3);
  };

  const handleStep3Next = () => {
    if (hours < 1 || hours > 24) {
      setErrorMessage("Please enter valid daily study hours between 1 and 24.");
      return;
    }
    if (weakSubjects.length === 0) {
      setErrorMessage("Please select at least one focus subject.");
      return;
    }
    setErrorMessage("");
    setStep(4);
  };

  const handleHoursSelect = (h: number) => {
    setIsCustomHours(false);
    setHours(h);
    setCustomHoursInput(h.toString());
    setErrorMessage("");
  };

  const handleCustomHoursChange = (val: string) => {
    setCustomHoursInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 24) {
      setHours(num);
      setErrorMessage("");
    } else {
      setErrorMessage("Daily study hours must be between 1 and 24.");
    }
  };

  const toggleWeak = (sub: NeetSubjectId) => {
    if (weakSubjects.includes(sub)) {
      if (weakSubjects.length === 1) {
        setErrorMessage("Please keep at least one focus subject selected.");
        return;
      }
      setWeakSubjects(weakSubjects.filter((s) => s !== sub));
    } else {
      setWeakSubjects([...weakSubjects, sub]);
    }
    setErrorMessage("");
  };

  const handleFinish = () => {
    if (authMethod === "whatsapp") {
      const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        setErrorMessage("Please enter a valid 10-digit WhatsApp phone number.");
        return;
      }
    } else if (authMethod === "google") {
      if (!googleEmail.trim() || !googleEmail.includes("@") || !googleEmail.includes(".")) {
        setErrorMessage("Please enter a valid Google email address.");
        return;
      }
    }

    setErrorMessage("");
    setIsAuthenticating(true);

    setTimeout(() => {
      generateCustomPlan({
        studentName: name.trim(),
        isIndian,
        state,
        category,
        targetExamYear: targetYear,
        targetDate: NEET_EXAM_DATES[targetYear] || "2026-05-03",
        targetScore: targetScore,
        estimatedGmcCutoff: gmcEst.safeScore,
        dailyHours: hours,
        currentLevel: level,
        weakSubjects,
        authMethod,
        authIdentifier: authMethod === "whatsapp" ? whatsappNumber : googleEmail
      });
      setIsAuthenticating(false);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      {/* Glassmorphic & Clay-morphic Card Container */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] p-8 sm:p-12 text-slate-900 transition-all">
        {/* Stepper Header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm"
                  : "bg-slate-200/60"
              }`}
            />
          ))}
        </div>

        {/* Error Alert Box if any */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50/80 border border-red-200/80 text-xs text-red-700 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Student Demographics & Target Exam Year */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                Step 1 of 4 • Student Demographics
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                Let's curate your personal NEET journey.
              </h2>
              <p className="text-sm text-slate-500">
                Please complete all fields to calibrate your target roadmap.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Name (Required) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                  <span>Student Full Name *</span>
                  <span className="text-[10px] text-slate-400">Required</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prateek Goyal"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                />
              </div>

              {/* Nationality & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Nationality</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsIndian(true)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        isIndian
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      🇮🇳 Indian
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsIndian(false)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        !isIndian
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      🌍 NRI / OCI
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Home State (85% State Quota)</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white/90 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Category (Reservation Quota)</label>
                <div className="grid grid-cols-5 gap-2">
                  {(["GEN", "OBC", "EWS", "SC", "ST"] as NeetCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        category === cat
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5 NEET Exam Target Years */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-slate-700">Target NEET Exam (Choose your year)</label>
                <div className="grid grid-cols-5 gap-2">
                  {[2026, 2027, 2028, 2029, 2030].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setTargetYear(yr)}
                      className={`py-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        targetYear === yr
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{yr}</div>
                      <div className={`text-[10px] ${targetYear === yr ? "text-slate-300" : "text-slate-400"}`}>
                        {yr === 2026 ? "May '26" : yr === 2027 ? "May '27" : `${yr}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStep1Next}
              disabled={!name.trim()}
              className="w-full mt-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>Continue to Target Calibration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Current Stage & Personalized GMC Cutoff Estimation */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                Step 2 of 4 • Target Calibration
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                Estimated Government College Cutoff
              </h2>
              <p className="text-sm text-slate-500">
                Estimated for <span className="font-semibold text-slate-800">{name} ({category})</span> for NEET {targetYear}.
              </p>
            </div>

            {/* Personalized Cutoff Callout Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(16,185,129,0.05)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Safe GMC Admission Benchmark
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                  {gmcEst.aiqRankEst}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-emerald-900">
                  {gmcEst.safeScore}+
                </span>
                <span className="text-xs text-emerald-700 font-medium">/ 720 Marks Required</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                For {category} candidates, achieving <span className="font-semibold">{gmcEst.safeScore}+</span> gives high probability of securing a Government Medical College (MBBS) seat.
              </p>
            </div>

            {/* Preparation Stage (Required) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Where are you currently at? *</label>
              <div className="space-y-2.5">
                {[
                  { id: "Class 11 Aspirant", desc: "Starting foundation with Class 11 NCERT" },
                  { id: "Class 12 Regular", desc: "Balancing board exams alongside NEET prep" },
                  { id: "Dropper / Target 680+", desc: "Full-time repeater aiming for top AIIMS / GMC" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setLevel(item.id as any);
                      setErrorMessage("");
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      level === item.id
                        ? "border-emerald-600 bg-emerald-50/50 text-slate-900"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">{item.id}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                    {level === item.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Score Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Your Target Score</span>
                <span className="font-mono font-bold text-emerald-700">{targetScore} / 720 Marks</span>
              </div>
              <input
                type="range"
                min={500}
                max={720}
                step={5}
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>500 (Qualifying)</span>
                <span>{gmcEst.safeScore} ({category} Safe GMC)</span>
                <span>710+ (AIIMS New Delhi)</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleStep2Next}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Daily Study Hours (custom up to 24) & Clean Subject Names */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                Step 3 of 4 • Capacity & Focus
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                Daily Study Hours & Focus Subject
              </h2>
              <p className="text-sm text-slate-500">
                Specify your hours so we don't schedule beyond your real study capacity.
              </p>
            </div>

            {/* Hours selection with Custom Option */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-700">
                How many hours can you study per day? * (Preset or custom 1–24)
              </label>

              <div className="grid grid-cols-4 gap-2.5">
                {[4, 6, 8, 10].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHoursSelect(h)}
                    className={`py-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      hours === h && !isCustomHours
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-lg font-bold font-mono">{h}h</div>
                    <div className={`text-[10px] ${hours === h && !isCustomHours ? "text-slate-300" : "text-slate-400"}`}>
                      hours/day
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Number Input */}
              <div className="pt-1">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 border border-slate-200">
                  <label className="text-xs font-medium text-slate-700 whitespace-nowrap">
                    Custom Daily Hours (1–24):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={customHoursInput}
                    onChange={(e) => {
                      setIsCustomHours(true);
                      handleCustomHoursChange(e.target.value);
                    }}
                    className="w-24 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-500">hours/day</span>
                </div>
              </div>
            </div>

            {/* Subjects - Clean Subject Names Only */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-700">
                Which subject requires priority focus? * (Select at least one)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "physics", name: "Physics" },
                  { id: "chemistry", name: "Chemistry" },
                  { id: "biology", name: "Biology" }
                ].map((item) => {
                  const isSel = weakSubjects.includes(item.id as NeetSubjectId);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleWeak(item.id as NeetSubjectId)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSel
                          ? "border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-sm"
                          : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-sm">{item.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleStep3Next}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Auth & Verification (Google or WhatsApp) */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                Final Step • Save Your Progress
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                Sign in to save your NEET roadmap
              </h2>
              <p className="text-sm text-slate-500">
                Connect your account to sync your daily streak and mock test reports across all devices.
              </p>
            </div>

            {/* Auth Method Switcher */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("whatsapp");
                  setErrorMessage("");
                }}
                className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMethod === "whatsapp"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Number</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod("google");
                  setErrorMessage("");
                }}
                className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMethod === "google"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mail className="w-4 h-4 text-sky-600" />
                <span>Google Account</span>
              </button>
            </div>

            {/* WhatsApp Input */}
            {authMethod === "whatsapp" && (
              <div className="space-y-3 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 animate-fadeIn">
                <label className="text-xs font-medium text-emerald-950 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Enter 10-Digit WhatsApp Mobile Number *</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-3 rounded-2xl bg-white border border-emerald-200 text-xs font-bold text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={whatsappNumber}
                    onChange={(e) => {
                      setWhatsappNumber(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white border border-emerald-200 text-sm font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                  />
                </div>
                <p className="text-[11px] text-emerald-800/80">
                  We'll sync your daily NEET checklist and mock test scores directly with your profile.
                </p>
              </div>
            )}

            {/* Google Input */}
            {authMethod === "google" && (
              <div className="space-y-3 p-5 rounded-2xl bg-sky-50/60 border border-sky-200/80 animate-fadeIn">
                <label className="text-xs font-medium text-sky-950 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-700" />
                  <span>Enter Google Email Address *</span>
                </label>
                <input
                  type="email"
                  placeholder="student@gmail.com"
                  value={googleEmail}
                  onChange={(e) => {
                    setGoogleEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
                />
                <p className="text-[11px] text-sky-800/80">
                  One-click sign-in to access your curated NCERT Study Room on any tablet or mobile.
                </p>
              </div>
            )}

            {/* Summary details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Aspirant: <span className="font-semibold text-slate-900">{name}</span></span>
                <span>Target: <span className="font-semibold text-slate-900">NEET {targetYear}</span></span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Category: <span className="font-semibold text-slate-900">{category} ({gmcEst.safeScore}+ GMC)</span></span>
                <span>Study Pace: <span className="font-semibold text-slate-900">{hours}h/day</span></span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                className="py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handleFinish}
                disabled={isAuthenticating}
                className="flex-1 py-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {isAuthenticating ? (
                  <span>Syncing Your Roadmap...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Launch My Curated Cockpit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
