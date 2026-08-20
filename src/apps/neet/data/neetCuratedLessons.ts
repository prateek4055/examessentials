export interface CuratedTopicContent {
  topicId: string;
  title: string;
  youtubeVideoId: string; // The single best curated lecture
  durationMinutes: number;
  ncertHighlights: string[];
  keyFormulas: string[];
  highYieldTips: string[];
  mindmapSummary: string;
}

export const NEET_CURATED_TOPICS: Record<string, CuratedTopicContent> = {
  "bio-unit-1": {
    topicId: "bio-unit-1",
    title: "Diversity in Living World: Complete NCERT Masterclass",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 48,
    ncertHighlights: [
      "Chlorophyceae store food as starch enclosed in pyrenoids located in chloroplasts.",
      "Phaeophyceae have photosynthetic pigments Chlorophyll a, c, carotenoids, and xanthophylls (Fucoxanthin).",
      "Rhodophyceae lack flagellated stages completely in their entire lifecycle.",
      "Bryophytes are called Amphibians of the Plant Kingdom because they depend on water for sexual reproduction.",
      "Heterospory in Pteridophytes (Selaginella & Salvinia) is the precursor to the seed habit."
    ],
    keyFormulas: [
      "Haplontic Lifecycle: Dominant Gametophyte (e.g., Volvox, Spirogyra, Chlamydomonas)",
      "Diplontic Lifecycle: Dominant Sporophyte (e.g., Fucus, Gymnosperms, Angiosperms)",
      "Haplo-diplontic Lifecycle: Ectocarpus, Polysiphonia, Kelps, Bryophytes, Pteridophytes"
    ],
    highYieldTips: [
      "Direct NEET question: Which red algae is eaten as food? -> Porphyra.",
      "Agar is obtained from Gelidium and Gracilaria (commercial hydrocolloid).",
      "Sphagnum (Peat moss) holds water and provides peat used as packing material for trans-shipment."
    ],
    mindmapSummary: "Five kingdom classification, Monera, Protista, Fungi, Plant & Animal Kingdoms mapped to NCERT."
  },
  "bio-unit-2": {
    topicId: "bio-unit-2",
    title: "Structural Organisation: Plant Families & Frog Anatomy",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 45,
    ncertHighlights: [
      "Family Malvaceae, Cruciferae, Leguminosae, Compositae & Gramineae floral formulas.",
      "Frog digestive, circulatory, respiratory, nervous and reproductive systems."
    ],
    keyFormulas: [
      "Floral Formula parsing shortcuts",
      "Aestivation types: Valvate, Twisted, Imbricate, Vexillary"
    ],
    highYieldTips: [
      "Vexillary aestivation is characteristic of Fabaceae/Leguminosae."
    ],
    mindmapSummary: "Morphology, Anatomy & Organ systems of Flowering Plants and Frog."
  },
  "bio-unit-3": {
    topicId: "bio-unit-3",
    title: "Cell Structure, Biomolecules & Cell Division",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 45,
    ncertHighlights: [
      "Endomembrane system includes: ER, Golgi complex, Lysosomes, and Vacuoles.",
      "Mitochondria, Chloroplasts, and Peroxisomes are NOT part of the endomembrane system.",
      "Ribosomes are non-membrane bound organelles found in both prokaryotes (70S) and eukaryotes (80S)."
    ],
    keyFormulas: [
      "Prokaryotic Ribosome: 70S (50S + 30S subunits)",
      "Eukaryotic Ribosome: 80S (60S + 40S subunits)",
      "Fluid Mosaic Model (1972): Singer & Nicolson"
    ],
    highYieldTips: [
      "Inner mitochondrial membrane forms infoldings called Cristae to increase surface area for ATP synthesis."
    ],
    mindmapSummary: "Cell theory, organelle biology, enzymes kinetics & stages of Mitosis and Meiosis."
  },
  "bio-unit-4": {
    topicId: "bio-unit-4",
    title: "Plant Physiology: Photosynthesis, Respiration & Plant Hormones",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 52,
    ncertHighlights: [
      "PS II absorbs light at 680 nm (P680); PS I absorbs light at 700 nm (P700).",
      "Kranz anatomy in C4 plants (bundle sheath cells possess agranal chloroplasts).",
      "Glycolysis yields net 2 ATP and 2 NADH molecules per glucose molecule."
    ],
    keyFormulas: [
      "Net ATP from 1 Glucose (Aerobic): 36 or 38 ATP",
      "RQ (Carbohydrates) = 1.0, RQ (Fats) = 0.7, RQ (Proteins) = 0.9"
    ],
    highYieldTips: [
      "RuBisCO is the most abundant enzyme in the world, showing both carboxylase and oxygenase activity."
    ],
    mindmapSummary: "Light & Dark reactions, C3/C4 pathways, TCA cycle, ETS & Plant Hormones."
  },
  "bio-unit-5": {
    topicId: "bio-unit-5",
    title: "Human Physiology: Systems & Coordination Masterclass",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 60,
    ncertHighlights: [
      "Tidal Volume: 500 mL, Vital Capacity: 4000-4600 mL.",
      "Cardiac Output = Stroke Volume (70 mL) x Heart Rate (72 bpm) = ~5 Litres/min.",
      "Juxtaglomerular apparatus releases Renin in response to fall in GFR."
    ],
    keyFormulas: [
      "Cardiac Output = SV x HR",
      "GFR = 125 mL/min (180 Litres/day)"
    ],
    highYieldTips: [
      "Sliding filament theory: Calcium binds to Troponin-C to unmask active sites on Actin for Myosin heads."
    ],
    mindmapSummary: "Breathing, Circulation, Excretion, Locomotion, Neural Control & Hormones."
  },
  "bio-unit-7": {
    topicId: "bio-unit-7",
    title: "Genetics and Evolution: Molecular Basis & Inheritance",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 58,
    ncertHighlights: [
      "DNA replication is semi-conservative (proved by Meselson and Stahl using 15N).",
      "Lac operon: Repressor protein binds to Operator gene in absence of inducer (lactose).",
      "Hardy-Weinberg equilibrium equation: p^2 + 2pq + q^2 = 1."
    ],
    keyFormulas: [
      "Hardy Weinberg: p + q = 1, p^2 + 2pq + q^2 = 1",
      "Recombination frequency = (Total recombinants / Total progeny) x 100"
    ],
    highYieldTips: [
      "AUG has dual functions: codes for Methionine and acts as initiator codon."
    ],
    mindmapSummary: "Mendelian genetics, DNA/RNA structure, transcription, translation & evolutionary principles."
  },
  "phy-unit-15-16": {
    topicId: "phy-unit-15-16",
    title: "Optics (Ray & Wave) and Electromagnetic Waves",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 50,
    ncertHighlights: [
      "Refractive index μ = c/v. Frequency remains constant during refraction.",
      "Total Internal Reflection occurs when ray travels from denser to rarer medium and angle of incidence > critical angle.",
      "Power of lens combination: P = P1 + P2 - d * P1 * P2."
    ],
    keyFormulas: [
      "Lens Maker's Formula: 1/f = (μ - 1)(1/R1 - 1/R2)",
      "Lens Formula: 1/f = 1/v - 1/u",
      "Single spherical surface: μ2/v - μ1/u = (μ2 - μ1)/R"
    ],
    highYieldTips: [
      "If a lens of μ = 1.5 is immersed in water (μ = 1.33), its focal length quadruples (f_water = 4 * f_air)."
    ],
    mindmapSummary: "Refraction, Snell's Law, TIR, Thin Lenses, Optical Instruments (Microscope & Telescope)."
  },
  "chem-physical-1-3": {
    topicId: "chem-physical-1-3",
    title: "Chemical Bonding, Atomic Structure & Mole Concept",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationMinutes: 46,
    ncertHighlights: [
      "Bond order = 1/2 (Nb - Na). If BO = 0, molecule does not exist (e.g. He2).",
      "Species with unpaired electrons in MO are Paramagnetic (e.g. O2, B2).",
      "Repulsion order: Lone Pair-Lone Pair > Lone Pair-Bond Pair > Bond Pair-Bond Pair."
    ],
    keyFormulas: [
      "Steric Number Z = 1/2 [V + M - C + A]",
      "Z=4 -> sp3 (Tetrahedral), Z=5 -> sp3d (Trigonal Bipyramidal), Z=6 -> sp3d2 (Octahedral)"
    ],
    highYieldTips: [
      "XeF4 has sp3d2 with 2 lone pairs -> Square Planar.",
      "SF4 has 1 lone pair -> See-Saw."
    ],
    mindmapSummary: "Lewis -> VSEPR -> Hybridization -> Molecular Orbital Theory."
  }
};
