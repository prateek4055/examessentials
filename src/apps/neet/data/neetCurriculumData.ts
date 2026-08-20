export type NeetSubjectId = "biology" | "physics" | "chemistry";

export interface NeetTopic {
  id: string;
  name: string;
  classLevel: 11 | 12;
  subjectId: NeetSubjectId;
  unitNumber: number;
  unitName: string;
  weightagePercent: number;
  estimatedHours: number;
  pyqCount: number;
  ncertChapter: string;
  difficulty: "Easy" | "Medium" | "High Yield" | "Hard";
  officialSyllabusBullets: string[];
}

export interface NeetSubject {
  id: NeetSubjectId;
  name: string;
  shortName: string;
  totalMarks: number;
  totalQuestions: number;
  description: string;
}

export const NEET_SUBJECTS: Record<NeetSubjectId, NeetSubject> = {
  biology: {
    id: "biology",
    name: "Biology (Botany & Zoology)",
    shortName: "Biology",
    totalMarks: 360,
    totalQuestions: 100,
    description: "90 Questions (360 Marks) - Strictly NCERT Line by Line"
  },
  physics: {
    id: "physics",
    name: "Physics",
    shortName: "Physics",
    totalMarks: 180,
    totalQuestions: 50,
    description: "45 Questions (180 Marks) - Concepts, Formulas & Experimental Skills"
  },
  chemistry: {
    id: "chemistry",
    name: "Chemistry (Physical, Inorganic, Organic)",
    shortName: "Chemistry",
    totalMarks: 180,
    totalQuestions: 50,
    description: "45 Questions (180 Marks) - Reactions, Principles & Practical Skills"
  }
};

// ── 100% OFFICIAL NMC / NTA NEET UG SYLLABUS FROM NOTICE_20260108180635.PDF ──
export const NEET_TOPICS: NeetTopic[] = [
  // ==========================================
  // 🧬 BIOLOGY (10 OFFICIAL NMC UNITS)
  // ==========================================
  {
    id: "bio-unit-1",
    name: "Diversity in Living World",
    classLevel: 11,
    subjectId: "biology",
    unitNumber: 1,
    unitName: "UNIT 1: Diversity in Living World",
    weightagePercent: 10,
    estimatedHours: 8,
    pyqCount: 75,
    ncertChapter: "NCERT Class 11 - Ch 1 to 4",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "What is living?; Biodiversity; Taxonomy & Systematics; Binomial nomenclature",
      "Five kingdom classification: Monera, Protista, Fungi, Lichens, Viruses and Viroids",
      "Plant Kingdom: Algae, Bryophytes, Pteridophytes, Gymnosperms (salient features & examples)",
      "Animal Kingdom: Non-chordates up to phyla level, Chordates up to class level"
    ]
  },
  {
    id: "bio-unit-2",
    name: "Structural Organisation in Animals and Plants",
    classLevel: 11,
    subjectId: "biology",
    unitNumber: 2,
    unitName: "UNIT 2: Structural Organisation in Animals and Plants",
    weightagePercent: 8,
    estimatedHours: 7,
    pyqCount: 58,
    ncertChapter: "NCERT Class 11 - Ch 5 to 7",
    difficulty: "Medium",
    officialSyllabusBullets: [
      "Morphology and modifications of Root, Stem, Leaf, Inflorescence (cymose & racemose), Flower, Fruit, Seed",
      "Plant Families: Malvaceae, Cruciferae, Leguminosae, Compositae, Gramineae",
      "Animal tissues; Morphology, anatomy and functions of digestive, circulatory, respiratory, nervous, and reproductive systems of Frog"
    ]
  },
  {
    id: "bio-unit-3",
    name: "Cell Structure and Function",
    classLevel: 11,
    subjectId: "biology",
    unitNumber: 3,
    unitName: "UNIT 3: Cell Structure and Function",
    weightagePercent: 12,
    estimatedHours: 9,
    pyqCount: 92,
    ncertChapter: "NCERT Class 11 - Ch 8 to 10",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Cell theory and cell as basic unit of life; Structure of prokaryotic and eukaryotic cells",
      "Endomembrane system: ER, Golgi, Lysosomes, Vacuoles; Mitochondria, Plastids, Ribosomes, Cytoskeleton, Cilia/Flagella",
      "Chemical constituents of living cells: Biomolecules (Proteins, Carbohydrates, Lipids, Nucleic Acids, Enzymes)",
      "Cell division: Cell cycle, Mitosis, Meiosis and their significance"
    ]
  },
  {
    id: "bio-unit-4",
    name: "Plant Physiology",
    classLevel: 11,
    subjectId: "biology",
    unitNumber: 4,
    unitName: "UNIT 4: Plant Physiology",
    weightagePercent: 10,
    estimatedHours: 9,
    pyqCount: 78,
    ncertChapter: "NCERT Class 11 - Ch 13 to 15",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Photosynthesis: Pigments, Light reaction, Cyclic/non-cyclic photophosphorylation, Chemiosmotic hypothesis, C3 & C4 pathways, Photorespiration",
      "Respiration: Glycolysis, Fermentation, TCA cycle, ETS, Respiratory quotient",
      "Plant growth & development: Seed germination, Growth phases, Plant growth regulators (Auxin, Gibberellin, Cytokinin, Ethylene, ABA)"
    ]
  },
  {
    id: "bio-unit-5",
    name: "Human Physiology",
    classLevel: 11,
    subjectId: "biology",
    unitNumber: 5,
    unitName: "UNIT 5: Human Physiology",
    weightagePercent: 16,
    estimatedHours: 14,
    pyqCount: 135,
    ncertChapter: "NCERT Class 11 - Ch 17 to 22",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Breathing & Respiration: Mechanism, Gas exchange/transport, Respiratory volumes & disorders (Asthma, Emphysema)",
      "Body Fluids & Circulation: Blood groups, Clotting, Cardiac cycle, ECG, Double circulation",
      "Excretory Products & Elimination: Nephron, Urine formation, Regulation (Renin-Angiotensin, ANF), Disorders",
      "Locomotion & Movement: Muscle contraction mechanism, Skeletal system, Joints",
      "Neural Control & Chemical Coordination: Nerve impulse conduction, Endocrine glands & Hormones mechanism"
    ]
  },
  {
    id: "bio-unit-6",
    name: "Reproduction in Organisms, Plants & Humans",
    classLevel: 12,
    subjectId: "biology",
    unitNumber: 6,
    unitName: "UNIT 6: Reproduction",
    weightagePercent: 12,
    estimatedHours: 10,
    pyqCount: 88,
    ncertChapter: "NCERT Class 12 - Ch 2 to 4",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Sexual Reproduction in Flowering Plants: Pollination, Outbreeding devices, Double fertilization, Endosperm/Embryo, Apomixis, Polyembryony",
      "Human Reproduction: Male & Female reproductive systems, Gametogenesis (Spermatogenesis/Oogenesis), Menstrual cycle, Fertilization, Implantation, Lactation",
      "Reproductive Health: Birth control methods, Contraception, MTP, STDs, Assisted Reproductive Technologies (ART: IVF, ZIFT, GIFT)"
    ]
  },
  {
    id: "bio-unit-7",
    name: "Genetics and Evolution",
    classLevel: 12,
    subjectId: "biology",
    unitNumber: 7,
    unitName: "UNIT 7: Genetics and Evolution",
    weightagePercent: 18,
    estimatedHours: 15,
    pyqCount: 140,
    ncertChapter: "NCERT Class 12 - Ch 5 to 7",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Heredity & Variation: Mendelian inheritance, Deviations (Incomplete dominance, Co-dominance, Multiple alleles), Linkage, Sex determination, Genetic disorders",
      "Molecular Basis of Inheritance: DNA structure, Packaging, Replication, Transcription, Genetic code, Translation, Lac Operon, Human Genome Project",
      "Evolution: Origin of life, Biological evolution evidence, Darwin's contribution, Modern synthetic theory, Hardy-Weinberg principle, Adaptive radiation, Human evolution"
    ]
  },
  {
    id: "bio-unit-8",
    name: "Biology and Human Welfare",
    classLevel: 12,
    subjectId: "biology",
    unitNumber: 8,
    unitName: "UNIT 8: Biology and Human Welfare",
    weightagePercent: 8,
    estimatedHours: 6,
    pyqCount: 62,
    ncertChapter: "NCERT Class 12 - Ch 8 & 10",
    difficulty: "Easy",
    officialSyllabusBullets: [
      "Health & Disease: Pathogens & parasites causing Malaria, Filariasis, Typhoid, Pneumonia, Ringworm; Basic immunology, Vaccines, Cancer, HIV/AIDS, Drug abuse",
      "Microbes in Human Welfare: Household food processing, Industrial production, Sewage treatment, Biogas, Biocontrol agents, Biofertilizers"
    ]
  },
  {
    id: "bio-unit-9",
    name: "Biotechnology and Its Applications",
    classLevel: 12,
    subjectId: "biology",
    unitNumber: 9,
    unitName: "UNIT 9: Biotechnology and Its Applications",
    weightagePercent: 10,
    estimatedHours: 8,
    pyqCount: 78,
    ncertChapter: "NCERT Class 12 - Ch 11 & 12",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Principles & Processes: Recombinant DNA technology, Restriction enzymes, Cloning vectors, PCR, Bioreactors",
      "Applications in Health & Agriculture: Genetically modified organisms (Bt cotton), RNA interference, Human insulin, Gene therapy, Molecular diagnosis, Transgenic animals, Biopiracy"
    ]
  },
  {
    id: "bio-unit-10",
    name: "Ecology and Environment",
    classLevel: 12,
    subjectId: "biology",
    unitNumber: 10,
    unitName: "UNIT 10: Ecology and Environment",
    weightagePercent: 12,
    estimatedHours: 8,
    pyqCount: 84,
    ncertChapter: "NCERT Class 12 - Ch 13 to 15",
    difficulty: "Easy",
    officialSyllabusBullets: [
      "Organisms and Environment: Population attributes (growth, birth/death rates), Population interactions (Mutualism, Competition, Predation, Parasitism)",
      "Ecosystem: Structure & function, Productivity, Decomposition, Energy flow, Ecological pyramids",
      "Biodiversity and its Conservation: Concept, Patterns, Loss of biodiversity, In-situ and Ex-situ conservation, Hotspots, Sacred groves"
    ]
  },

  // ==========================================
  // ⚡ PHYSICS (20 OFFICIAL NMC UNITS)
  // ==========================================
  {
    id: "phy-unit-1-2",
    name: "Physics, Measurement & Kinematics",
    classLevel: 11,
    subjectId: "physics",
    unitNumber: 1,
    unitName: "UNIT 1 & 2: Measurement & Kinematics",
    weightagePercent: 8,
    estimatedHours: 8,
    pyqCount: 65,
    ncertChapter: "NCERT Class 11 - Ch 2, 3, 4",
    difficulty: "Medium",
    officialSyllabusBullets: [
      "SI units, fundamental/derived units, Dimensions of physical quantities, Dimensional analysis",
      "Frame of reference, Motion in a straight line, Position-time graphs, Relative velocity",
      "Vectors: Dot and Cross products; Motion in a plane, Projectile motion, Uniform circular motion"
    ]
  },
  {
    id: "phy-unit-3",
    name: "Laws of Motion",
    classLevel: 11,
    subjectId: "physics",
    unitNumber: 3,
    unitName: "UNIT 3: Laws of Motion",
    weightagePercent: 7,
    estimatedHours: 8,
    pyqCount: 56,
    ncertChapter: "NCERT Class 11 - Ch 5",
    difficulty: "Medium",
    officialSyllabusBullets: [
      "Intuitive concept of force, Inertia, Newton's first, second and third laws of motion",
      "Impulse, Momentum conservation, Equilibrium of concurrent forces",
      "Static and kinetic friction, Laws of friction, Rolling friction, Banking of roads"
    ]
  },
  {
    id: "phy-unit-4-5",
    name: "Work, Energy, Power & Rotational Motion",
    classLevel: 11,
    subjectId: "physics",
    unitNumber: 4,
    unitName: "UNIT 4 & 5: Work, Energy & Rotational Motion",
    weightagePercent: 11,
    estimatedHours: 12,
    pyqCount: 82,
    ncertChapter: "NCERT Class 11 - Ch 6, 7",
    difficulty: "Hard",
    officialSyllabusBullets: [
      "Work done by constant and variable forces; Kinetic energy, Work-energy theorem, Power",
      "Conservative forces, Potential energy of a spring, Elastic/Inelastic collisions in 1D and 2D",
      "Centre of mass of 2-particle system and rigid body; Torque, Angular momentum conservation",
      "Moment of Inertia, Radius of gyration, Parallel and Perpendicular axes theorems"
    ]
  },
  {
    id: "phy-unit-6",
    name: "Gravitation",
    classLevel: 11,
    subjectId: "physics",
    unitNumber: 6,
    unitName: "UNIT 6: Gravitation",
    weightagePercent: 6,
    estimatedHours: 6,
    pyqCount: 48,
    ncertChapter: "NCERT Class 11 - Ch 8",
    difficulty: "Easy",
    officialSyllabusBullets: [
      "Universal law of gravitation, Acceleration due to gravity 'g' and its variation with altitude and depth",
      "Kepler's laws of planetary motion, Gravitational potential energy and potential",
      "Escape velocity, Orbital velocity of a satellite, Geostationary satellites"
    ]
  },
  {
    id: "phy-unit-7",
    name: "Properties of Solids and Liquids (Fluids)",
    classLevel: 11,
    subjectId: "physics",
    unitNumber: 7,
    unitName: "UNIT 7: Properties of Bulk Matter",
    weightagePercent: 7,
    estimatedHours: 8,
    pyqCount: 54,
    ncertChapter: "NCERT Class 11 - Ch 9, 10",
    difficulty: "Medium",
    officialSyllabusBullets: [
      "Elastic behavior, Stress-strain relationship, Hooke's law, Young's, Bulk and Shear modulus",
      "Pressure due to fluid column, Pascal's law, Viscosity, Stokes' law, Terminal velocity",
      "Streamline and turbulent flow, Critical velocity, Bernoulli's theorem and applications",
      "Surface energy and surface tension, Angle of contact, Excess pressure, Capillary rise"
    ]
  },
  {
    id: "phy-unit-8-9",
    name: "Thermodynamics & Kinetic Theory of Gases",
    classLevel: 11,
    subjectId: "physics",
    unitNumber: 8,
    unitName: "UNIT 8 & 9: Thermodynamics & KTG",
    weightagePercent: 9,
    estimatedHours: 9,
    pyqCount: 68,
    ncertChapter: "NCERT Class 11 - Ch 11, 12, 13",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Thermal equilibrium, Zeroth, First and Second laws of thermodynamics, Isothermal & Adiabatic processes",
      "Reversible and irreversible processes, Heat engines and refrigerators",
      "Equation of state of perfect gas, Work done on compressing gas, Kinetic theory assumptions, RMS speed",
      "Degrees of freedom, Law of equipartition of energy, Specific heats of gases, Mean free path"
    ]
  },
  {
    id: "phy-unit-10",
    name: "Oscillations and Waves",
    classLevel: 11,
    subjectId: "physics",
    unitNumber: 10,
    unitName: "UNIT 10: Oscillations and Waves",
    weightagePercent: 7,
    estimatedHours: 7,
    pyqCount: 52,
    ncertChapter: "NCERT Class 11 - Ch 14, 15",
    difficulty: "Medium",
    officialSyllabusBullets: [
      "Periodic and Simple Harmonic Motion (SHM), Differential equation of SHM, Kinetic and Potential energy in SHM",
      "Spring oscillations, Simple pendulum time period, Free, forced and damped oscillations, Resonance",
      "Wave motion: Longitudinal and transverse waves, Speed of traveling wave, Principle of superposition",
      "Reflection of waves, Standing waves in strings and organ pipes, Fundamental mode and harmonics, Beats"
    ]
  },
  {
    id: "phy-unit-11-12",
    name: "Electrostatics & Current Electricity",
    classLevel: 12,
    subjectId: "physics",
    unitNumber: 11,
    unitName: "UNIT 11 & 12: Electrodynamics",
    weightagePercent: 14,
    estimatedHours: 14,
    pyqCount: 112,
    ncertChapter: "NCERT Class 12 - Ch 1, 2, 3",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Coulomb's law, Electric field, Field lines, Electric dipole, Torque on dipole, Gauss's theorem and applications",
      "Electric potential, Equipotential surfaces, Capacitors in series/parallel, Energy stored in capacitor, Dielectrics",
      "Electric current, Drift velocity, Ohm's law, Electrical resistance, V-I characteristics, Resistivity & Temperature",
      "Internal resistance of cell, Potential difference & EMF, Kirchhoff's laws and Wheatstone bridge"
    ]
  },
  {
    id: "phy-unit-13-14",
    name: "Magnetic Effects, Magnetism & EMI / AC",
    classLevel: 12,
    subjectId: "physics",
    unitNumber: 13,
    unitName: "UNIT 13 & 14: Magnetism, EMI & AC",
    weightagePercent: 12,
    estimatedHours: 12,
    pyqCount: 95,
    ncertChapter: "NCERT Class 12 - Ch 4, 5, 6, 7",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Biot-Savart law and Ampere's circuital law, Force on moving charge in magnetic field, Cyclotron",
      "Force between parallel current-carrying wires, Torque on current loop, Moving coil galvanometer",
      "Magnetic dipole moment of revolving electron, Dia-, Para-, and Ferro-magnetic substances, Earth's magnetism",
      "Faraday's laws of induction, Lenz's law, Eddy currents, Self and Mutual inductance",
      "Alternating currents, Peak and RMS value, Reactance and Impedance, LCR series circuit, Resonance, Power in AC, Transformer"
    ]
  },
  {
    id: "phy-unit-15-16",
    name: "Electromagnetic Waves & Optics (Ray + Wave)",
    classLevel: 12,
    subjectId: "physics",
    unitNumber: 15,
    unitName: "UNIT 15 & 16: Optics & EM Waves",
    weightagePercent: 14,
    estimatedHours: 13,
    pyqCount: 108,
    ncertChapter: "NCERT Class 12 - Ch 8, 9, 10",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "EM waves characteristics, Transverse nature, Electromagnetic spectrum (Radio to Gamma rays)",
      "Refraction at spherical surfaces, Lenses, Thin lens formula, Lensmaker's formula, Magnification, Power of lens",
      "Refraction through prism, Optical instruments: Microscopes and Astronomical telescopes",
      "Wave optics: Wavefront and Huygens' principle, Interference, Young's double slit experiment, Diffraction"
    ]
  },
  {
    id: "phy-unit-17-19",
    name: "Modern Physics & Semiconductor Devices",
    classLevel: 12,
    subjectId: "physics",
    unitNumber: 17,
    unitName: "UNIT 17-19: Modern Physics & Electronics",
    weightagePercent: 14,
    estimatedHours: 11,
    pyqCount: 105,
    ncertChapter: "NCERT Class 12 - Ch 11, 12, 13, 14",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Dual nature of radiation, Photoelectric effect, Hertz and Lenard's observations, Einstein's equation, de Broglie relation",
      "Alpha-particle scattering, Rutherford and Bohr model of atom, Hydrogen spectrum, Mass defect, Binding energy",
      "Energy bands in conductors, semiconductors and insulators; Intrinsic and Extrinsic semiconductors, p-n junction diode, I-V characteristics, Diode as rectifier, LEDs, Photodiodes, Solar cells, Zener diode"
    ]
  },
  {
    id: "phy-unit-20",
    name: "Experimental Skills & Practical Physics",
    classLevel: 12,
    subjectId: "physics",
    unitNumber: 20,
    unitName: "UNIT 20: Experimental Skills",
    weightagePercent: 6,
    estimatedHours: 5,
    pyqCount: 45,
    ncertChapter: "NCERT Practical Physics Manual",
    difficulty: "Medium",
    officialSyllabusBullets: [
      "Vernier calipers & Screw gauge: Least count and zero error measurements",
      "Simple Pendulum: Dissipation of energy, determination of 'g'",
      "Young's modulus measurement using Searles apparatus; Surface tension by capillary rise",
      "Speed of sound in air using resonance tube; Meter bridge and Potentiometer resistance measurements",
      "Focal length of convex lens & concave mirror using optical bench; Multimeter testing of diodes and transistors"
    ]
  },

  // ==========================================
  // 🧪 CHEMISTRY (20 OFFICIAL NMC UNITS)
  // ==========================================
  {
    id: "chem-physical-1-3",
    name: "Mole Concept, Atomic Structure & Chemical Bonding",
    classLevel: 11,
    subjectId: "chemistry",
    unitNumber: 1,
    unitName: "PHYSICAL: Units 1, 2 & 3",
    weightagePercent: 13,
    estimatedHours: 12,
    pyqCount: 102,
    ncertChapter: "NCERT Class 11 - Ch 1, 2, 4",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Mole concept, Molar mass, Percentage composition, Empirical and molecular formula, Stoichiometry calculations",
      "Bohr model, de Broglie relationship, Heisenberg uncertainty principle, Quantum numbers, Aufbau principle, Hund's rule",
      "Ionic and Covalent bonding, Dipole moment, VSEPR theory and shapes of simple molecules, Hybridization (sp, sp2, sp3, sp3d, sp3d2), Molecular orbital theory for homonuclear diatomic molecules, Hydrogen bonding"
    ]
  },
  {
    id: "chem-physical-4-6",
    name: "Chemical Thermodynamics, Solutions & Equilibrium",
    classLevel: 11,
    subjectId: "chemistry",
    unitNumber: 4,
    unitName: "PHYSICAL: Units 4, 5 & 6",
    weightagePercent: 15,
    estimatedHours: 14,
    pyqCount: 118,
    ncertChapter: "NCERT Class 11 - Ch 6, 7 & Class 12 - Ch 2",
    difficulty: "Hard",
    officialSyllabusBullets: [
      "First law of thermodynamics, Enthalpy, Hess's law, Entropy, Second law, Gibbs energy change and spontaneity",
      "Types of solutions, Raoult's law, Ideal and non-ideal solutions, Colligative properties, van't Hoff factor",
      "Law of chemical equilibrium, Equilibrium constant Kp and Kc, Le Chatelier's principle, Ionic equilibrium, pH, Buffer solutions, Solubility product"
    ]
  },
  {
    id: "chem-physical-7-8",
    name: "Redox Reactions, Electrochemistry & Chemical Kinetics",
    classLevel: 12,
    subjectId: "chemistry",
    unitNumber: 7,
    unitName: "PHYSICAL: Units 7 & 8",
    weightagePercent: 13,
    estimatedHours: 12,
    pyqCount: 98,
    ncertChapter: "NCERT Class 11 - Ch 8 & Class 12 - Ch 3, 4",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Concept of oxidation and reduction, Redox reactions, Oxidation number, Balancing redox equations",
      "Conductance in electrolytic solutions, Kohlrausch's law, Galvanic cells, Nernst equation, EMF, Standard electrode potentials",
      "Rate of a reaction, Factors affecting rate, Order and Molecularity, Rate law and Integrated rate equations for zero and first order reactions, Half-life, Arrhenius equation, Activation energy"
    ]
  },
  {
    id: "chem-inorganic-9-12",
    name: "Inorganic: Periodicity, p-Block, d & f-Block, Coordination Compounds",
    classLevel: 12,
    subjectId: "chemistry",
    unitNumber: 9,
    unitName: "INORGANIC: Units 9 to 12",
    weightagePercent: 18,
    estimatedHours: 16,
    pyqCount: 132,
    ncertChapter: "NCERT Class 11 - Ch 3 & Class 12 - Ch 8, 9",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Modern periodic law, Periodic trends: Atomic/Ionic radii, Ionization enthalpy, Electron gain enthalpy, Electronegativity",
      "p-Block elements (Group 13 to 18): Electronic configuration, General trends, Anomalous properties of first element",
      "d- and f-Block elements: Transition metals electronic configuration, Oxidation states, Color, Catalytic property, Magnetic properties, Interstitial compounds; Lanthanoid and Actinoid contraction",
      "Coordination compounds: Werner's theory, IUPAC nomenclature, Isomerism, Valence bond theory, Crystal field theory, Magnetic properties, Stability and Applications"
    ]
  },
  {
    id: "chem-organic-13-15",
    name: "Organic Chemistry Principles, GOC & Hydrocarbons",
    classLevel: 11,
    subjectId: "chemistry",
    unitNumber: 13,
    unitName: "ORGANIC: Units 13, 14 & 15",
    weightagePercent: 15,
    estimatedHours: 14,
    pyqCount: 110,
    ncertChapter: "NCERT Class 11 - Ch 12, 13",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Purification and qualitative/quantitative analysis of organic compounds, Empirical & Molecular formula calculation",
      "Tetravalency of carbon, Hybridization, Functional group classification, IUPAC nomenclature, Structural and stereoisomerism",
      "Homolytic and heterolytic fission, Carbocations, Carbanions, Free radicals stability, Electrophiles and Nucleophiles",
      "Electronic displacement: Inductive, Electromeric, Resonance, and Hyperconjugation effects",
      "Alkanes, Alkenes (Markownikoff & anti-Markownikoff addition, Ozonolysis), Alkynes (acidity), Aromatic hydrocarbons (Benzene electrophilic substitution: Nitration, Sulphonation, Friedel-Crafts)"
    ]
  },
  {
    id: "chem-organic-16-19",
    name: "Halogens, Oxygen (Alcohols, Carbonyls), Nitrogen & Biomolecules",
    classLevel: 12,
    subjectId: "chemistry",
    unitNumber: 16,
    unitName: "ORGANIC: Units 16 to 19",
    weightagePercent: 20,
    estimatedHours: 18,
    pyqCount: 145,
    ncertChapter: "NCERT Class 12 - Ch 10, 11, 12, 13, 14",
    difficulty: "High Yield",
    officialSyllabusBullets: [
      "Haloalkanes and Haloarenes: Nature of C-X bond, SN1 and SN2 mechanism, Optical rotation, Electrophilic substitution of haloarenes",
      "Alcohols, Phenols and Ethers: Preparation, Properties, Acidity of phenols, Reimer-Tiemann, Kolbe's reaction, Mechanism of dehydration of alcohols",
      "Aldehydes and Ketones: Nucleophilic addition, Aldol condensation, Cannizzaro reaction, Clemmensen & Wolff-Kishner reduction, Haloform test, Tollen's and Fehling's tests; Carboxylic acids acidity",
      "Amines: Primary, secondary, tertiary amines classification, Basic character, Carbylamine reaction, Diazonium salts preparation and synthetic applications",
      "Biomolecules: Carbohydrates (Glucose, Fructose, Disaccharides), Proteins (Amino acids, Peptide bond, Denaturation), Nucleic Acids (DNA & RNA structure), Vitamins classification"
    ]
  },
  {
    id: "chem-unit-20",
    name: "Practical Chemistry & Qualitative Analysis",
    classLevel: 12,
    subjectId: "chemistry",
    unitNumber: 20,
    unitName: "UNIT 20: Practical Chemistry",
    weightagePercent: 6,
    estimatedHours: 5,
    pyqCount: 42,
    ncertChapter: "NCERT Practical Chemistry Manual",
    difficulty: "Medium",
    officialSyllabusBullets: [
      "Titrimetric exercises: Acids, bases, Oxalic acid vs KMnO4, Mohr's salt vs KMnO4 titration",
      "Qualitative salt analysis of Cations: Pb2+, Cu2+, Al3+, Fe3+, Zn2+, Ni2+, Ca2+, Ba2+, Mg2+, NH4+",
      "Qualitative salt analysis of Anions: CO3(2-), S(2-), SO4(2-), NO3(-), NO2(-), Cl(-), Br(-), I(-)",
      "Chemical principles in Enthalpy of solution of CuSO4, Enthalpy of neutralization, Preparation of Lyophilic/Lyophobic sols"
    ]
  }
];
