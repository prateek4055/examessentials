export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  featured?: boolean;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "low-back-pain-orthopedic-guide",
    title: "Conquering Low Back Pain: A Comprehensive Orthopedic Guide",
    excerpt: "Struggling with lower back ache or sciatica? Discover the evidence-based causes, symptoms, and the most effective low back pain treatments in our comprehensive orthopedic guide.",
    category: "MedOrtho",
    date: "2026-03-27",
    readTime: "6 min read",
    author: "Exam Essentials Team",
    image: "/low-back-pain-cover.png",
    featured: true,
    content: `
## Conquering Low Back Pain: A Comprehensive Orthopedic Guide

Low back pain is one of the most common medical complaints worldwide, affecting up to 80% of adults at some point in their lives. Whether it presents as a dull, constant ache or a sudden, sharp pain that makes movement nearly impossible, acute and chronic low back pain can severely impact your quality of life.

Understanding the complex mechanics of the lumbar spine is the first step toward effective relief and long-term recovery. Here is what you need to know from an orthopedic perspective.

---

## Understanding the Causes of Low Back Pain

The lumbar spine is a complex structure of interconnected bones, joints, nerves, ligaments, and muscles all working together to provide support, strength, and flexibility. A disruption in any of these components can lead to significant pain.

### Mechanical Issues and Soft Tissue Injuries
The vast majority of lower back aches stem from mechanical issues:
- **Muscle Strains and Ligament Sprains**: Often caused by improper lifting, sudden movements, or poor biomechanics.
- **Herniated Discs**: Also known as slipped or ruptured discs, this occurs when the soft inner core of a spinal disc pushes through its tough outer layer, irritating nearby nerves and causing **sciatica**.

### Degenerative Conditions
As we age, the spine naturally undergoes wear and tear:
- **Osteoarthritis**: The breakdown of cartilage in the facet joints of the spine.
- **Spinal Stenosis**: A narrowing of the spinal canal that puts pressure on the spinal cord and exiting nerves.
- **Degenerative Disc Disease**: The gradual loss of hydration and cushioning in the intervertebral discs.

---

## Recognizing the Symptoms: When to Seek Care

Most episodes of acute low back pain resolve within a few weeks with self-care. However, it is crucial to recognize the "Red Flags".

> [!IMPORTANT]
> **Clinical Red Flags for Low Back Pain**
> Seek emergency medical care if your back pain is accompanied by:
> - New onset of bowel or bladder incontinence (loss of control).
> - Progressive weakness, numbness, or tingling in your legs (**saddle anesthesia**).
> - Unexplained weight loss, fever, or chills.
> - Pain following a high-impact trauma (car accident or severe fall).

---

## Evidence-Based Diagnosis and Treatment

A comprehensive orthopedic evaluation begins with a detailed medical history and a physical examination to assess your range of motion and nerve function.

### Diagnostic Imaging
While not always necessary for acute strains, imaging is vital for chronic pain. **X-rays** reveal bone alignment, while an **MRI** provides detailed views of soft tissues like discs and nerves.

### Nonsurgical Treatment Options
- **Physical Therapy**: Targeted exercises to stabilize the lumbar spine.
- **Medications**: NSAIDs and muscle relaxants for acute inflammation.
- **Epidural Steroid Injections**: Targeted anti-inflammatory relief for severe sciatica.

> [!TIP]
> **The Power of Active Recovery**
> Contrary to outdated advice, prolonged bed rest can actually worsen low back pain. Once initial acute pain subsides, aim for gentle, low-impact movements like walking or swimming to promote blood flow and healing.

---

## Preventing Future Flare-ups
Proactive spinal care is your best defense. Focus on maintaining a neutral spine while sitting, use proper lifting techniques (bending at the hips and knees, not the waist), and manage a healthy weight to reduce mechanical stress on your lower back.
`
  }
];

export const categories = ["All", "MedOrtho", "MedNeuro", "MedCardio", "MedPhysio", "MedRadio", "MedPharma"];

export const CategoryColors: Record<string, string> = {
  "MedOrtho": "#4DA6FF", // Blue
  "MedNeuro": "#A855F7", // Purple
  "MedCardio": "#BE185D", // Pink
  "MedPhysio": "#84CC16", // Green
  "MedRadio": "#2DD4BF", // Teal
  "MedPharma": "#7C3AED", // Violet
  "default": "#4DA6FF"
};

export const getCategoryColor = (category: string): string => {
  return CategoryColors[category] || CategoryColors["default"];
};
