import { NeetSubjectId } from "./neetCurriculumData";

export interface NeetQuestion {
  id: string;
  subjectId: NeetSubjectId;
  section: "A" | "B";
  topicId: string;
  year?: string;
  questionText: string;
  options: string[];
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
  ncertReference?: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const NEET_SAMPLE_MOCK_QUESTIONS: NeetQuestion[] = [
  // ── BIOLOGY (BOTANY & ZOOLOGY) ──────────────────────
  {
    id: "q-bio-1",
    subjectId: "biology",
    section: "A",
    topicId: "bio-unit-1",
    year: "NEET 2023",
    questionText: "Which of the following algae contains Fucoxanthin and Mannitol as stored food material?",
    options: [
      "Volvox and Chlamydomonas",
      "Ectocarpus and Dictyota",
      "Polysiphonia and Porphyra",
      "Ulothrix and Spirogyra"
    ],
    correctIndex: 1,
    explanation: "Ectocarpus and Dictyota belong to Phaeophyceae (Brown Algae). They possess Chlorophyll a, c, and Fucoxanthin, storing complex carbohydrates like laminarin or mannitol.",
    ncertReference: "NCERT Class 11, Chapter 3: Plant Kingdom, Page 32",
    difficulty: "Medium"
  },
  {
    id: "q-bio-2",
    subjectId: "biology",
    section: "A",
    topicId: "bio-unit-1",
    year: "NEET 2022",
    questionText: "Which one of the following statements cannot be attributed to Bryophytes?",
    options: [
      "The plant body is thalloid and attached to substratum by rhizoids",
      "They possess vascular tissues (Xylem & Phloem) for rapid conduction",
      "The main plant body of the bryophyte is haploid and produces gametes",
      "They play a crucial ecological role in plant succession on bare rocks"
    ],
    correctIndex: 1,
    explanation: "Bryophytes lack specialized vascular tissues (xylem and phloem). The first terrestrial plants to possess true vascular tissues were Pteridophytes.",
    ncertReference: "NCERT Class 11, Chapter 3, Page 35",
    difficulty: "Easy"
  },
  {
    id: "q-bio-3",
    subjectId: "biology",
    section: "A",
    topicId: "bio-unit-3",
    year: "NEET 2024",
    questionText: "Which of the following cell organelles is NOT considered a part of the endomembrane system?",
    options: [
      "Endoplasmic Reticulum",
      "Golgi apparatus",
      "Peroxisome",
      "Lysosome"
    ],
    correctIndex: 2,
    explanation: "The endomembrane system includes ER, Golgi complex, Lysosomes, and Vacuoles. Since functions of Mitochondria, Chloroplasts, and Peroxisomes are not coordinated with these, they are not part of it.",
    ncertReference: "NCERT Class 11, Chapter 8: Cell The Unit of Life, Page 133",
    difficulty: "Easy"
  },
  {
    id: "q-bio-4",
    subjectId: "biology",
    section: "B",
    topicId: "bio-unit-7",
    year: "NEET 2023",
    questionText: "In a dihybrid cross, what proportion of F2 progeny will have homozygous genotypes for both genes (e.g. AABB, AAbb, aaBB, aabb)?",
    options: [
      "1/16",
      "2/16",
      "4/16",
      "9/16"
    ],
    correctIndex: 2,
    explanation: "In Mendel's dihybrid F2 generation (16 total boxes): AABB (1), AAbb (1), aaBB (1), aabb (1) -> Total 4 out of 16 (4/16 or 1/4).",
    ncertReference: "NCERT Class 12, Chapter 5: Principles of Inheritance, Page 79",
    difficulty: "Hard"
  },
  {
    id: "q-bio-5",
    subjectId: "biology",
    section: "A",
    topicId: "bio-unit-7",
    year: "NEET 2024",
    questionText: "The unambiguous and universal nature of the genetic code signifies that:",
    options: [
      "One codon codes for only one amino acid, and codes for the same amino acid from bacteria to human",
      "Some amino acids are coded by more than one codon",
      "The codon is read in mRNA in a contiguous fashion",
      "AUG has dual functions as initiator and coding for Valine"
    ],
    correctIndex: 0,
    explanation: "Unambiguous means one codon specifies only one amino acid. Universal means the code is nearly identical in all living organisms.",
    ncertReference: "NCERT Class 12, Chapter 6: Molecular Basis of Inheritance, Page 112",
    difficulty: "Medium"
  },

  // ── PHYSICS ──────────────────────────────────────────
  {
    id: "q-phy-1",
    subjectId: "physics",
    section: "A",
    topicId: "phy-unit-15-16",
    year: "NEET 2023",
    questionText: "A convex lens of focal length 20 cm in air is immersed in water (μ = 4/3). If the refractive index of the lens glass is 1.5, its focal length in water will be:",
    options: [
      "20 cm",
      "40 cm",
      "80 cm",
      "10 cm"
    ],
    correctIndex: 2,
    explanation: "Using Lens Maker's Formula: f_w / f_a = (μ_g - 1) / (μ_g/μ_w - 1) = (1.5 - 1) / (1.5 / (4/3) - 1) = 0.5 / (9/8 - 1) = 0.5 / (1/8) = 4. Hence f_w = 4 * 20 = 80 cm.",
    ncertReference: "NCERT Class 12, Chapter 9: Ray Optics, Page 326",
    difficulty: "Medium"
  },
  {
    id: "q-phy-2",
    subjectId: "physics",
    section: "A",
    topicId: "phy-unit-11-12",
    year: "NEET 2024",
    questionText: "In a potentiometer experiment, the balancing length with a cell is 560 cm. When an external resistance of 10 Ω is connected in parallel to the cell, the balancing length changes to 400 cm. The internal resistance of the cell is:",
    options: [
      "2.0 Ω",
      "4.0 Ω",
      "2.5 Ω",
      "3.0 Ω"
    ],
    correctIndex: 1,
    explanation: "Internal resistance r = R * (L1 - L2) / L2 = 10 * (560 - 400) / 400 = 10 * (160 / 400) = 4.0 Ω.",
    ncertReference: "NCERT Class 12, Chapter 3: Current Electricity, Page 122",
    difficulty: "Medium"
  },
  {
    id: "q-phy-3",
    subjectId: "physics",
    section: "B",
    topicId: "phy-unit-17-19",
    year: "NEET 2022",
    questionText: "The de Broglie wavelength of an electron accelerated through a potential difference of V volts is approximately given by:",
    options: [
      "12.27 / √V Å",
      "1.227 / √V nm",
      "0.286 / √V Å",
      "Both (1) and (2)"
    ],
    correctIndex: 3,
    explanation: "λ = 12.27 / √V Å = 1.227 / √V nm. Both expressions are identical and standard NCERT results.",
    ncertReference: "NCERT Class 12, Chapter 11: Dual Nature of Radiation, Page 401",
    difficulty: "Easy"
  },

  // ── CHEMISTRY ────────────────────────────────────────
  {
    id: "q-chem-1",
    subjectId: "chemistry",
    section: "A",
    topicId: "chem-physical-1-3",
    year: "NEET 2023",
    questionText: "Which of the following pairs of species have identical bond order and are both paramagnetic?",
    options: [
      "O2 and B2",
      "N2 and CO",
      "NO and O2+",
      "C2 and N2"
    ],
    correctIndex: 0,
    explanation: "Both O2 and B2 have bond orders of 2 and 1 respectively with unpaired electrons in molecular orbitals, making both paramagnetic.",
    ncertReference: "NCERT Class 11, Chapter 4: Chemical Bonding, Page 129",
    difficulty: "Medium"
  },
  {
    id: "q-chem-2",
    subjectId: "chemistry",
    section: "A",
    topicId: "chem-organic-16-19",
    year: "NEET 2024",
    questionText: "Anisole on cleavage with concentrated HI at high temperature gives:",
    options: [
      "Phenol and Methyl Iodide",
      "Iodobenzene and Methanol",
      "Phenol and Methanol",
      "Benzene and Methyl Iodide"
    ],
    correctIndex: 0,
    explanation: "Due to resonance, the C(sp2)-O bond in anisole has partial double bond character and is stronger than the alkyl C(sp3)-O bond. The I- attacks the smaller methyl carbocation, producing Phenol and CH3I.",
    ncertReference: "NCERT Class 12, Chapter 11: Alcohols, Phenols and Ethers, Page 346",
    difficulty: "Medium"
  }
];
