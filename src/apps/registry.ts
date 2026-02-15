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
  // Future apps — uncomment when ready
  // {
  //   id: "medortho",
  //   name: "MedOrtho",
  //   description: "Orthopedic education and clinical tools",
  //   basePath: "/medortho",
  //   active: false,
  // },
  // {
  //   id: "mednotes",
  //   name: "MedNotes",
  //   description: "Medical study notes and revision material",
  //   basePath: "/mednotes",
  //   active: false,
  // },
];
