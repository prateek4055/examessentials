// App Registry — central place to register all sub-apps in the platform
export interface AppInfo {
  id: string;
  name: string;
  description: string;
  basePath: string;
  icon?: string;
  active: boolean;
}

export const apps: AppInfo[] = [
  {
    id: "exam-essentials",
    name: "Exam Essentials",
    description: "India's Best Handwritten Notes for CBSE, NEET & JEE",
    basePath: "/",
    active: true,
  },
  {
    id: "medposterhub",
    name: "MedPostersHub",
    description: "Professional Medical & Clinical Posters for clinics, hospitals and teaching institutes",
    basePath: "/medposterhub",
    active: true,
  },
  // Medical Education Apps
  {
    id: "medortho",
    name: "MedOrtho",
    description: "Orthopedic special tests, surgical instruments & clinical education",
    basePath: "/medortho",
    active: true,
  },
  {
    id: "medcardio",
    name: "MedCardio",
    description: "Cardiology education & ECG interpretation",
    basePath: "/medcardio",
    active: false,
  },
  {
    id: "medneuro",
    name: "MedNeuro",
    description: "Neuroscience & neurological examination",
    basePath: "/medneuro",
    active: false,
  },
  {
    id: "medphysio",
    name: "MedPhysio",
    description: "Physiotherapy techniques & rehabilitation",
    basePath: "/medphysio",
    active: false,
  },
  {
    id: "medradio",
    name: "MedRadio",
    description: "Radiology learning & medical imaging",
    basePath: "/medradio",
    active: false,
  },
  {
    id: "medpharma",
    name: "MedPharma",
    description: "Pharmacology made easy — drugs, mechanisms & clinical use",
    basePath: "/medpharma",
    active: false,
  },
];
