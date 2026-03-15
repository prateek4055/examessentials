import medorthoLogo from "@/assets/apps/medortho.png";
import medcardioLogo from "@/assets/apps/medcardio.png";
import medneuroLogo from "@/assets/apps/medneuro.png";
import medphysioLogo from "@/assets/apps/medphysio.png";
import medradioLogo from "@/assets/apps/medradio.png";
import medpharmaLogo from "@/assets/apps/medpharma.png";

export interface MedAppFeature {
  icon: string; // lucide icon name
  title: string;
  description: string;
}

export interface MedAppFAQ {
  question: string;
  answer: string;
}

export interface MedAppTheme {
  primary: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  gradientFrom: string;
  gradientVia?: string;
  gradientTo: string;
  heroBg: string; // CSS gradient for hero
  cardBg: string; // subtle card background
  badgeBg: string;
  badgeText: string;
}

export interface MedAppData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  logo: string;
  theme: MedAppTheme;
  features: MedAppFeature[];
  targetAudience: string[];
  highlights: string[];
  published: boolean;
  playStoreLink?: string;
  appStoreLink?: string;
  faqs: MedAppFAQ[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImageUrl?: string;
  };
}

export const medicalApps: MedAppData[] = [
  {
    id: "medortho",
    slug: "medortho",
    name: "MedOrtho",
    tagline: "Master Orthopedic Special Tests & Clinical Skills",
    description: "Your complete companion for orthopedic examination — special tests, surgical instruments, clinical notes & more.",
    longDescription: "MedOrtho is the most comprehensive orthopedic education app designed for physiotherapy students, medical interns, and orthopedic residents. Master every special test with step-by-step instructions, HD illustrations, and clinical pearls. From Thompson's test to Lachman's test — never forget a procedure again.",
    logo: medorthoLogo,
    theme: {
      primary: "#1B3A5C",
      primaryLight: "#2A5A8C",
      accent: "#4AADE4",
      accentLight: "#7CC4ED",
      gradientFrom: "#1B3A5C",
      gradientVia: "#1E4D7B",
      gradientTo: "#4AADE4",
      heroBg: "linear-gradient(135deg, #0F2439 0%, #1B3A5C 30%, #1E4D7B 60%, #2980B9 100%)",
      cardBg: "rgba(74, 173, 228, 0.08)",
      badgeBg: "#4AADE4",
      badgeText: "#FFFFFF",
    },
    features: [
      { icon: "Search", title: "Special Tests Library", description: "200+ orthopedic special tests with step-by-step procedures and clinical significance" },
      { icon: "Bone", title: "Surgical Instruments", description: "Complete guide to orthopedic surgical instruments with HD images and usage notes" },
      { icon: "BookOpen", title: "Clinical Notes", description: "Concise, exam-focused notes covering fractures, dislocations, and soft tissue injuries" },
      { icon: "GraduationCap", title: "Exam Preparation", description: "MCQs and viva questions aligned with university exam patterns" },
    ],
    targetAudience: ["Physiotherapy Students", "Medical Interns", "Orthopedic Residents", "Sports Medicine Professionals"],
    highlights: ["200+ Special Tests", "HD Illustrations", "Offline Access", "Regular Updates"],
    published: true,
    playStoreLink: "https://play.google.com/store/apps/details?id=com.prateek.orthoexam",
    faqs: [
      { question: "What is MedOrtho?", answer: "MedOrtho is a comprehensive orthopedic education app that helps physiotherapy and medical students master 200+ special tests, surgical instruments, and clinical notes with step-by-step instructions and HD illustrations." },
      { question: "Is MedOrtho free to download?", answer: "Yes, MedOrtho is free to download on Google Play Store. Some premium content may require a subscription for full access." },
      { question: "Who is MedOrtho designed for?", answer: "MedOrtho is designed for physiotherapy students (BPT/MPT), medical interns, orthopedic residents, and sports medicine professionals who need a quick-reference guide for clinical examinations." },
      { question: "Can I use MedOrtho offline?", answer: "Yes! MedOrtho supports offline access so you can study special tests, view instruments, and read clinical notes without an internet connection — perfect for clinical rotations." },
    ],
    seo: {
      title: "MedOrtho – Orthopedic Special Tests & Clinical Education App",
      description: "Master 200+ orthopedic special tests, surgical instruments & clinical notes. The #1 orthopedic education app for physiotherapy & medical students in India.",
      keywords: "orthopedic special tests app, physiotherapy app, orthopedic exam preparation, special tests orthopedics, medical education app, bone and joint tests, clinical orthopedics, Lachman test, McMurray test, orthopedic viva questions, BPT exam app",
    },
  },
  {
    id: "medcardio",
    slug: "medcardio",
    name: "MedCardio",
    tagline: "Cardiology Education & ECG Interpretation Made Simple",
    description: "Learn cardiology concepts, master ECG interpretation, and understand cardiac pathologies with interactive visuals.",
    longDescription: "MedCardio brings cardiology education to your fingertips. From basic cardiac anatomy to advanced ECG interpretation, arrhythmia recognition, and heart sound auscultation — everything you need to excel in cardiology exams. Interactive visuals, clinical case studies, and exam-oriented content make learning engaging and effective.",
    logo: medcardioLogo,
    theme: {
      primary: "#BE185D",
      primaryLight: "#DB2777",
      accent: "#F9A8D4",
      accentLight: "#FBD8E8",
      gradientFrom: "#831843",
      gradientVia: "#BE185D",
      gradientTo: "#F472B6",
      heroBg: "linear-gradient(135deg, #4A0D2B 0%, #831843 30%, #BE185D 60%, #F472B6 100%)",
      cardBg: "rgba(190, 24, 93, 0.08)",
      badgeBg: "#F472B6",
      badgeText: "#4A0D2B",
    },
    features: [
      { icon: "Heart", title: "ECG Mastery", description: "Learn to read and interpret ECGs with interactive tracing guides and clinical correlations" },
      { icon: "Activity", title: "Heart Sounds", description: "Audio-visual guide to normal and abnormal heart sounds with phonocardiograms" },
      { icon: "BookOpen", title: "Cardiac Pathology", description: "Comprehensive notes on valvular diseases, cardiomyopathies, and congenital defects" },
      { icon: "Stethoscope", title: "Clinical Cases", description: "Real-world case studies with differential diagnosis and management plans" },
    ],
    targetAudience: ["Medical Students", "Cardiology Residents", "Nursing Students", "Emergency Medicine Professionals"],
    highlights: ["ECG Library", "Heart Sounds Audio", "Clinical Cases", "Exam Questions"],
    published: false,
    faqs: [
      { question: "What is MedCardio?", answer: "MedCardio is an upcoming cardiology education app that teaches ECG interpretation, heart sounds auscultation, and cardiac pathology through interactive visuals and clinical case studies." },
      { question: "When will MedCardio be available?", answer: "MedCardio is currently under development and will be launched soon. Follow us on WhatsApp or Instagram to be notified when it launches." },
      { question: "Will MedCardio help with ECG interpretation?", answer: "Absolutely! MedCardio features an interactive ECG library with tracing guides, arrhythmia recognition tools, and clinical correlations to help you master ECG reading." },
      { question: "Is MedCardio suitable for MBBS students?", answer: "Yes, MedCardio is designed for MBBS students, cardiology residents, nursing students, and emergency medicine professionals who want to strengthen their cardiology knowledge." },
    ],
    seo: {
      title: "MedCardio – Cardiology Education & ECG Interpretation App",
      description: "Master ECG interpretation, heart sounds & cardiac pathology. The ultimate cardiology learning app for medical students, coming soon from Exam Essentials.",
      keywords: "cardiology app, ECG interpretation, heart sounds app, cardiac education, medical student cardiology, ECG learning, heart disease study, arrhythmia app, cardiac auscultation, MBBS cardiology",
    },
  },
  {
    id: "medneuro",
    slug: "medneuro",
    name: "MedNeuro",
    tagline: "Neuroscience & Neurological Examination Simplified",
    description: "Explore neuroanatomy, master neurological examinations, and understand neurological conditions with clarity.",
    longDescription: "MedNeuro is your gateway to neurological sciences. From cranial nerve examination to reflex testing, from stroke localization to neuropharmacology — every concept is broken down into easy-to-understand visual guides. Perfect for neurology rotations, exams, and clinical practice.",
    logo: medneuroLogo,
    theme: {
      primary: "#6B21A8",
      primaryLight: "#7E3ABF",
      accent: "#A855F7",
      accentLight: "#C084FC",
      gradientFrom: "#3B0764",
      gradientVia: "#6B21A8",
      gradientTo: "#A855F7",
      heroBg: "linear-gradient(135deg, #1E0438 0%, #3B0764 30%, #6B21A8 60%, #A855F7 100%)",
      cardBg: "rgba(107, 33, 168, 0.08)",
      badgeBg: "#A855F7",
      badgeText: "#FFFFFF",
    },
    features: [
      { icon: "Brain", title: "Neuroanatomy Atlas", description: "Interactive brain anatomy with labeled structures, pathways, and clinical correlations" },
      { icon: "Eye", title: "Cranial Nerves", description: "Complete guide to all 12 cranial nerves — examination techniques, lesions, and testing" },
      { icon: "Zap", title: "Reflex Testing", description: "Step-by-step guide to superficial and deep tendon reflex examination and grading" },
      { icon: "FileText", title: "Case-Based Learning", description: "Neurological case scenarios with localization exercises and diagnosis practice" },
    ],
    targetAudience: ["Medical Students", "Neurology Residents", "Physiotherapy Students", "Occupational Therapists"],
    highlights: ["Interactive Atlas", "Cranial Nerve Guide", "Reflex Grading", "Case Studies"],
    published: false,
    faqs: [
      { question: "What is MedNeuro?", answer: "MedNeuro is an upcoming neuroscience education app that covers neuroanatomy, cranial nerve examination, reflex testing, and neurological case studies with interactive visual guides." },
      { question: "When will MedNeuro launch?", answer: "MedNeuro is in active development and will launch soon. Stay tuned by following Exam Essentials on social media for launch updates." },
      { question: "Does MedNeuro cover cranial nerve examination?", answer: "Yes! MedNeuro includes a complete guide to all 12 cranial nerves with examination techniques, common lesion patterns, and bedside testing methods." },
      { question: "Who can benefit from MedNeuro?", answer: "MedNeuro is built for medical students, neurology residents, physiotherapy students, and occupational therapists who need a reliable reference for neurological examination." },
    ],
    seo: {
      title: "MedNeuro – Neuroscience & Neurological Examination App",
      description: "Master neuroanatomy, cranial nerve exams & neurological conditions. The comprehensive neuro education app for medical students, coming soon.",
      keywords: "neurology app, neuroanatomy, cranial nerve examination, neurological tests, brain anatomy app, neuro education, medical student neurology, reflex testing app, stroke localization, neuro exam",
    },
  },
  {
    id: "medphysio",
    slug: "medphysio",
    name: "MedPhysio",
    tagline: "Physiotherapy Techniques & Rehabilitation Excellence",
    description: "Master physiotherapy techniques, exercise prescriptions, and rehabilitation protocols with evidence-based content.",
    longDescription: "MedPhysio is the ultimate physiotherapy companion app. From manual therapy techniques to therapeutic exercises, from electrotherapy modalities to rehabilitation protocols — everything is organized for quick clinical reference and exam preparation. Evidence-based content with video demonstrations.",
    logo: medphysioLogo,
    theme: {
      primary: "#166534",
      primaryLight: "#15803D",
      accent: "#84CC16",
      accentLight: "#A3E635",
      gradientFrom: "#052E16",
      gradientVia: "#166534",
      gradientTo: "#84CC16",
      heroBg: "linear-gradient(135deg, #022C0A 0%, #052E16 30%, #166534 60%, #4ADE80 100%)",
      cardBg: "rgba(22, 101, 52, 0.08)",
      badgeBg: "#84CC16",
      badgeText: "#052E16",
    },
    features: [
      { icon: "Dumbbell", title: "Exercise Library", description: "500+ therapeutic exercises with proper form, sets, reps, and progression guidelines" },
      { icon: "Hand", title: "Manual Therapy", description: "Techniques for joint mobilization, soft tissue manipulation, and myofascial release" },
      { icon: "Waves", title: "Electrotherapy", description: "Complete guide to IFT, TENS, ultrasound, SWD, and other electrotherapy modalities" },
      { icon: "ClipboardList", title: "Rehab Protocols", description: "Evidence-based rehabilitation protocols for common musculoskeletal conditions" },
    ],
    targetAudience: ["Physiotherapy Students", "BPT Interns", "Sports Physiotherapists", "Rehabilitation Specialists"],
    highlights: ["500+ Exercises", "Technique Videos", "Rehab Protocols", "Clinical Tools"],
    published: false,
    faqs: [
      { question: "What is MedPhysio?", answer: "MedPhysio is an upcoming physiotherapy education app featuring 500+ therapeutic exercises, manual therapy techniques, electrotherapy guides, and evidence-based rehabilitation protocols." },
      { question: "Is MedPhysio useful for BPT students?", answer: "Absolutely! MedPhysio is specifically designed for BPT students, interns, sports physiotherapists, and rehabilitation specialists with content aligned to university curricula." },
      { question: "Does MedPhysio include electrotherapy content?", answer: "Yes, MedPhysio covers IFT, TENS, ultrasound therapy, shortwave diathermy (SWD), and other electrotherapy modalities with dosage guidelines and clinical indications." },
      { question: "When will MedPhysio be available?", answer: "MedPhysio is under development and will be released soon. Follow us on WhatsApp to get notified as soon as it launches." },
    ],
    seo: {
      title: "MedPhysio – Physiotherapy Techniques & Rehabilitation App",
      description: "Master physiotherapy exercises, manual therapy & rehab protocols. The #1 physiotherapy education app for BPT students, coming soon.",
      keywords: "physiotherapy app, BPT study app, exercise prescription, manual therapy techniques, rehabilitation protocols, physiotherapy education, electrotherapy guide, TENS app, therapeutic exercises, sports physiotherapy",
    },
  },
  {
    id: "medradio",
    slug: "medradio",
    name: "MedRadio",
    tagline: "Radiology Learning & Medical Imaging Interpretation",
    description: "Learn to read X-rays, CT scans, and MRIs with structured approach and clinical correlations.",
    longDescription: "MedRadio transforms radiology learning with a systematic approach to medical imaging. Learn to identify normal anatomy on various imaging modalities, spot common pathologies, and write radiological reports. From basic X-ray interpretation to advanced CT/MRI analysis — become confident in radiology.",
    logo: medradioLogo,
    theme: {
      primary: "#134E4A",
      primaryLight: "#115E59",
      accent: "#2DD4BF",
      accentLight: "#5EEAD4",
      gradientFrom: "#042F2E",
      gradientVia: "#134E4A",
      gradientTo: "#2DD4BF",
      heroBg: "linear-gradient(135deg, #021B1A 0%, #042F2E 30%, #134E4A 60%, #14B8A6 100%)",
      cardBg: "rgba(19, 78, 74, 0.08)",
      badgeBg: "#2DD4BF",
      badgeText: "#042F2E",
    },
    features: [
      { icon: "Scan", title: "X-ray Reading", description: "Systematic approach to reading chest, skeletal, and abdominal X-rays with annotated examples" },
      { icon: "Layers", title: "CT & MRI Guide", description: "Learn cross-sectional anatomy and common pathology findings on CT and MRI scans" },
      { icon: "FileImage", title: "Image Library", description: "Curated collection of radiological images with diagnosis and discussion" },
      { icon: "PenTool", title: "Report Writing", description: "Templates and guidelines for writing structured radiological reports" },
    ],
    targetAudience: ["Radiology Residents", "Medical Students", "Emergency Medicine", "Orthopedic Surgeons"],
    highlights: ["Annotated Images", "Systematic Approach", "Report Templates", "Quiz Mode"],
    published: false,
    faqs: [
      { question: "What is MedRadio?", answer: "MedRadio is an upcoming radiology education app that teaches systematic X-ray, CT, and MRI interpretation with annotated images, report templates, and a quiz mode for practice." },
      { question: "Does MedRadio cover X-ray interpretation?", answer: "Yes! MedRadio includes a systematic approach to reading chest X-rays, skeletal X-rays, and abdominal X-rays with annotated examples and normal vs abnormal comparisons." },
      { question: "Can MedRadio help with CT and MRI reading?", answer: "Absolutely. MedRadio covers cross-sectional anatomy and common pathology findings on both CT and MRI, helping you build confidence in interpreting advanced imaging." },
      { question: "When will MedRadio launch?", answer: "MedRadio is currently in development. Follow Exam Essentials on social media or WhatsApp to be the first to know about the launch." },
    ],
    seo: {
      title: "MedRadio – Radiology Learning & Medical Imaging App",
      description: "Learn X-ray, CT & MRI interpretation with annotated images. The comprehensive radiology education app for medical students, coming soon.",
      keywords: "radiology app, X-ray interpretation, CT scan learning, MRI reading, medical imaging app, radiology education, diagnostic imaging, chest X-ray app, radiology quiz, MBBS radiology",
    },
  },
  {
    id: "medpharma",
    slug: "medpharma",
    name: "MedPharma",
    tagline: "Pharmacology Made Easy — Drugs, Mechanisms & Clinical Use",
    description: "Simplify pharmacology with organized drug classifications, mechanisms of action, and clinical applications.",
    longDescription: "MedPharma takes the complexity out of pharmacology. Every drug class is organized with clear mechanisms of action, indications, contraindications, side effects, and drug interactions. Visual mnemonics, comparison tables, and exam-focused MCQs make pharmacology your strongest subject.",
    logo: medpharmaLogo,
    theme: {
      primary: "#7C3AED",
      primaryLight: "#8B5CF6",
      accent: "#F59E0B",
      accentLight: "#FBBF24",
      gradientFrom: "#4C1D95",
      gradientVia: "#7C3AED",
      gradientTo: "#F59E0B",
      heroBg: "linear-gradient(135deg, #2E1065 0%, #4C1D95 30%, #7C3AED 50%, #A855F7 70%, #F59E0B 100%)",
      cardBg: "rgba(124, 58, 237, 0.08)",
      badgeBg: "#F59E0B",
      badgeText: "#2E1065",
    },
    features: [
      { icon: "Pill", title: "Drug Database", description: "Comprehensive database of drugs organized by class with dosages and interactions" },
      { icon: "GitBranch", title: "Mechanism Maps", description: "Visual flowcharts showing drug mechanisms of action at receptor and molecular level" },
      { icon: "Table", title: "Comparison Tables", description: "Side-by-side drug comparisons for quick revision and exam preparation" },
      { icon: "Lightbulb", title: "Visual Mnemonics", description: "Memory aids and mnemonics for remembering drug names, side effects, and classes" },
    ],
    targetAudience: ["Medical Students", "Pharmacy Students", "Nursing Students", "NEET PG Aspirants"],
    highlights: ["Drug Database", "Visual Mnemonics", "Comparison Tables", "MCQ Bank"],
    published: false,
    faqs: [
      { question: "What is MedPharma?", answer: "MedPharma is an upcoming pharmacology app that simplifies drug learning with organized classifications, visual mechanism maps, comparison tables, and mnemonics for easy memorization." },
      { question: "Does MedPharma include drug mnemonics?", answer: "Yes! MedPharma features visual mnemonics and memory aids for drug names, side effects, drug interactions, and pharmacological classifications — making revision quick and effective." },
      { question: "Is MedPharma useful for NEET PG preparation?", answer: "Absolutely. MedPharma includes exam-focused MCQs and drug comparison tables aligned with NEET PG, USMLE, and university exam patterns." },
      { question: "When will MedPharma be released?", answer: "MedPharma is under active development and will be launched soon. Follow us on WhatsApp or Instagram to get early access." },
    ],
    seo: {
      title: "MedPharma – Pharmacology Education & Drug Reference App",
      description: "Master pharmacology with organized drug data, visual mnemonics & mechanism maps. The easy pharmacology app for medical & pharmacy students, coming soon.",
      keywords: "pharmacology app, drug reference app, pharmacology mnemonics, drug mechanism of action, medical pharmacology, pharmacy student app, drug classification, NEET PG pharmacology, drug interactions, pharmacology MCQ",
    },
  },
];

export const getAppBySlug = (slug: string): MedAppData | undefined =>
  medicalApps.find((app) => app.slug === slug);

export const getOtherApps = (currentSlug: string): MedAppData[] =>
  medicalApps.filter((app) => app.slug !== currentSlug);
