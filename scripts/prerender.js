import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const testsDataPath = path.resolve(process.cwd(), 'public/medortho/tests/tests_data.json');

const DOMAIN = 'https://examessentials.in';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

const PROXIED_URL = "https://examessentials.in/supabase-api";
const isLocal = !process.env.VERCEL_ENV; // Vercel environment checks this
const baseUrlToUse = isLocal ? PROXIED_URL : SUPABASE_URL;

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(baseUrlToUse, SUPABASE_ANON_KEY, {
    global: {
      fetch: (...args) => fetch(...args)
    }
  });
}

// Helper to escape HTML characters for safe insertion into tags/attributes
function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Helper to strip HTML tags for clean description text
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&deg;/g, '°')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Helper to replace meta tags in the template index.html
function generatePageHtml(templateHtml, options) {
  const { title, description, keywords, canonical, ogImage, schemas, bodyContent } = options;
  let content = templateHtml;
  
  // Remove existing canonical tag if it exists (e.g. from index.html template)
  content = content.replace(/<link\s+[^>]*?rel=["']canonical["'][^>]*?\/?>/gi, '');
  
  // Replace Title
  content = content.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  
  // Replace Meta Title
  content = content.replace(/<meta\s+[^>]*?name=["']title["'][^>]*?\/?>/i, `<meta name="title" content="${escapeHtml(title)}" />`);
  content = content.replace(/<meta\s+[^>]*?property=["']og:title["'][^>]*?\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  content = content.replace(/<meta\s+[^>]*?name=["']twitter:title["'][^>]*?\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  
  // Replace Meta Description
  content = content.replace(/<meta\s+[^>]*?name=["']description["'][^>]*?\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  content = content.replace(/<meta\s+[^>]*?property=["']og:description["'][^>]*?\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  content = content.replace(/<meta\s+[^>]*?name=["']twitter:description["'][^>]*?\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  
  // Replace Meta Keywords
  content = content.replace(/<meta\s+[^>]*?name=["']keywords["'][^>]*?\/?>/i, `<meta name="keywords" content="${escapeHtml(keywords)}" />`);
  
  // Replace Meta URL
  content = content.replace(/<meta\s+[^>]*?property=["']og:url["'][^>]*?\/?>/i, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  
  // Replace Meta Image
  content = content.replace(/<meta\s+[^>]*?property=["']og:image["'][^>]*?\/?>/i, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
  content = content.replace(/<meta\s+[^>]*?name=["']twitter:image["'][^>]*?\/?>/i, `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`);
  
  // Insert Canonical & Schema Script before </head>
  let headAdditions = `  <link rel="canonical" href="${escapeHtml(canonical)}" />\n`;
  if (schemas && schemas.length > 0) {
    schemas.forEach(schema => {
      headAdditions += `  <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>\n`;
    });
  }
  content = content.replace(/<\/head>/i, `${headAdditions}</head>`);
  
  // Replace Root Div Content
  content = content.replace(/(<div\s+id=["']root["'][^>]*>)([\s\S]*?)(<\/div>)/i, `$1\n${bodyContent}\n$3`);
  
  return content;
}

// Ensure the directory exists
function writePage(routePath, htmlContent) {
  const dirPath = path.join(distDir, routePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent);
}
// Generate MedicalPhysicalExam and Breadcrumb schemas
function buildWikiArticleStructuredData(appSlug, article, slug) {
  const url = `${DOMAIN}/${appSlug}/tests/${slug}`;
  const title = `${article.title} - ${article.category}`;
  
  const cleanUsedFor = stripHtml(article.usedFor);
  const cleanHowTo = stripHtml(article.howTo);
  const cleanResult = stripHtml(article.result);
  const cleanAccuracy = stripHtml(article.accuracy);

  const imageFilename = article.image1 ? article.image1.split('/').pop() : null;
  const imageUrl = imageFilename 
    ? `${DOMAIN}/medortho/tests/images/${imageFilename}` 
    : `${DOMAIN}/og-image.png`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${DOMAIN}/`,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": appSlug === "medortho" ? "MedOrtho" : appSlug,
          "item": `${DOMAIN}/${appSlug}`,
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": url,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": title,
      "description": article.description || `Learn how to perform the ${article.title} orthopedic special test including indications, test procedure, positive results, and diagnostic accuracy.`,
      "url": url,
      "lastReviewed": new Date().toISOString().split("T")[0],
      "image": imageUrl,
      "aspect": [
        "Indications",
        "Clinical examination procedure",
        "Result interpretation",
        "Diagnostic accuracy"
      ],
      "isPartOf": {
        "@type": "WebSite",
        "name": "Exam Essentials",
        "url": DOMAIN,
      },
      "inLanguage": "en-IN",
    }
  ];

  if (appSlug === "medortho") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "MedicalPhysicalExam",
      "name": article.title,
      "description": article.description || cleanUsedFor || `Details and clinical guide for the ${article.title} test.`,
      "bodyLocation": article.category,
      "purpose": cleanUsedFor,
      "howPerformed": cleanHowTo,
      "significance": cleanResult,
      "image": imageUrl,
      "usedToDiagnose": {
        "@type": "MedicalCondition",
        "name": cleanUsedFor.length > 100 ? cleanUsedFor.substring(0, 97) + "..." : cleanUsedFor
      }
    });

    // Compile FAQs
    const faqs = [];
    if (article.usedFor) {
      faqs.push({
        question: `What is the ${article.title} used for?`,
        answer: cleanUsedFor
      });
    }
    if (article.howTo) {
      faqs.push({
        question: `How do you perform the ${article.title}?`,
        answer: cleanHowTo
      });
    }
    if (article.result) {
      faqs.push({
        question: `What is a positive result for the ${article.title}?`,
        answer: cleanResult
      });
    }
    if (cleanAccuracy && cleanAccuracy.trim() !== "") {
      faqs.push({
        question: `What is the diagnostic accuracy of the ${article.title}?`,
        answer: cleanAccuracy
      });
    }

    if (faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      });
    }
  }

  return schemas;
}

async function runPrerender() {
  console.log('🔄 Starting static pre-rendering (SSG)...');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ Error: dist/index.html not found! Run "npm run build" first.');
    process.exit(1);
  }

  if (!fs.existsSync(testsDataPath)) {
    console.error('❌ Error: tests_data.json not found!');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const testsList = JSON.parse(fs.readFileSync(testsDataPath, 'utf8'));

  console.log(`✅ Loaded template HTML and ${testsList.length} special tests.`);

  let dbBlogPosts = [];
  let dbArticles = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true);
      if (error) {
        console.warn('⚠️ Could not fetch blog posts from Supabase for pre-rendering:', error.message);
      } else {
        dbBlogPosts = data || [];
      }
    } catch (e) {
      console.warn('⚠️ Could not fetch blog posts for pre-rendering:', e.message);
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true);
      if (error) {
        console.warn('⚠️ Could not fetch wiki articles from Supabase for pre-rendering:', error.message);
      } else {
        dbArticles = data || [];
      }
    } catch (e) {
      console.warn('⚠️ Could not fetch wiki articles for pre-rendering:', e.message);
    }
  }
  console.log(`✅ Loaded ${dbBlogPosts.length} blog posts from DB for pre-rendering.`);
  console.log(`✅ Loaded ${dbArticles.length} wiki articles from DB for pre-rendering.`);

  // Define all medical apps to pre-render their landing pages
  const appsList = [
    {
      id: "medortho",
      slug: "medortho",
      name: "MedOrtho",
      tagline: "The Ultimate Orthopedic Learning Platform for Medical & Physiotherapy Students",
      description: "Learn orthopedic special tests, surgical instruments, MCQs, image-based notes, and clinical concepts — all in one fast, modern, student-friendly app.",
      longDescription: "MedOrtho is an advanced orthopedic learning app built for medical and physiotherapy students. It combines orthopedic special tests, surgical instruments, MCQs, image-based notes, and clinical revision tools into one clean and student-friendly platform.",
      features: [
        { icon: "Search", title: "Special Tests Database", description: "700+ orthopedic special tests with step-by-step procedures, positive findings, and clinical significance" },
        { icon: "Bone", title: "Surgical Instruments Library", description: "700+ orthopedic and general surgery instruments with visual recognition support" },
        { icon: "GraduationCap", title: "MCQs & Quiz System", description: "Topic-wise MCQs with clinical reasoning-based explanations for MBBS, BPT, NEET PG, FMGE, and USMLE" },
        { icon: "BookOpen", title: "Image-Based Notes", description: "Fast revision notes covering fractures, dislocations, anatomy, and ligament injuries" },
      ],
      targetAudience: ["MBBS Students", "BPT & Physiotherapy Students", "Medical Interns", "Orthopedic Residents", "NEET PG & FMGE Aspirants", "USMLE Students"],
      faqs: [
        { question: "What is MedOrtho?", answer: "MedOrtho is an advanced orthopedic learning app built for medical and physiotherapy students that combines 700+ special tests, 700+ surgical instruments, MCQs, and image-based notes." },
        { question: "Does the app cover both tests and instruments?", answer: "Yes! MedOrtho includes one of the largest collections on Android: 700+ orthopedic special tests and 700+ surgical instruments with high-resolution visual guides." }
      ],
      seo: {
        title: "MedOrtho — Orthopedic Special Tests & Clinical Learning App | Exam Essentials",
        description: "Master 700+ orthopedic special tests, surgical instruments, and clinical MCQs. The ultimate study and revision app for MBBS, BPT, NEET PG & FMGE students.",
        keywords: "orthopedic learning app, orthopedic special tests app, MBBS orthopedic app, physiotherapy orthopedic app, orthopedic MCQs, surgical instruments app, orthopedic examination app"
      }
    },
    {
      id: "medcardio",
      slug: "medcardio",
      name: "MedCardio",
      tagline: "Cardiology Education & ECG Interpretation Made Simple",
      description: "Learn cardiology concepts, master ECG interpretation, and understand cardiac pathologies with interactive visuals.",
      longDescription: "MedCardio brings cardiology education to your fingertips. From basic cardiac anatomy to advanced ECG interpretation, arrhythmia recognition, and heart sound auscultation — everything you need to excel in cardiology exams.",
      features: [
        { icon: "Heart", title: "ECG Mastery", description: "Learn to read and interpret ECGs with interactive tracing guides and clinical correlations" },
        { icon: "Activity", title: "Heart Sounds", description: "Audio-visual guide to normal and abnormal heart sounds with phonocardiograms" },
        { icon: "BookOpen", title: "Cardiac Pathology", description: "Comprehensive notes on valvular diseases, cardiomyopathies, and congenital defects" },
        { icon: "Stethoscope", title: "Clinical Cases", description: "Real-world case studies with differential diagnosis and management plans" }
      ],
      targetAudience: ["Medical Students", "Cardiology Residents", "Nursing Students", "Emergency Medicine Professionals"],
      faqs: [
        { question: "What is MedCardio?", answer: "MedCardio is an upcoming cardiology education app that teaches ECG interpretation, heart sounds auscultation, and cardiac pathology through interactive visuals and clinical case studies." },
        { question: "Will MedCardio help with ECG interpretation?", answer: "Absolutely! MedCardio features an interactive ECG library with tracing guides, arrhythmia recognition tools, and clinical correlations to help you master ECG reading." }
      ],
      seo: {
        title: "MedCardio – Cardiology Education & ECG Interpretation App | Exam Essentials",
        description: "Master ECG interpretation, heart sounds & cardiac pathology. The ultimate cardiology learning app for medical students, coming soon from Exam Essentials.",
        keywords: "cardiology app, ECG interpretation, heart sounds app, cardiac education, medical student cardiology"
      }
    },
    {
      id: "medneuro",
      slug: "medneuro",
      name: "MedNeuro",
      tagline: "Neuroscience & Neurological Examination Simplified",
      description: "Explore neuroanatomy, master neurological examinations, and understand neurological conditions with clarity.",
      longDescription: "MedNeuro is your gateway to neurological sciences. From cranial nerve examination to reflex testing, from stroke localization to neuropharmacology — every concept is broken down into easy-to-understand visual guides.",
      features: [
        { icon: "Brain", title: "Neuroanatomy Atlas", description: "Interactive brain anatomy with labeled structures, pathways, and clinical correlations" },
        { icon: "Eye", title: "Cranial Nerves", description: "Complete guide to all 12 cranial nerves — examination techniques, lesions, and testing" },
        { icon: "Zap", title: "Reflex Testing", description: "Step-by-step guide to superficial and deep tendon reflex examination and grading" },
        { icon: "FileText", title: "Case-Based Learning", description: "Neurological case scenarios with localization exercises and diagnosis practice" }
      ],
      targetAudience: ["Medical Students", "Neurology Residents", "Physiotherapy Students", "Occupational Therapists"],
      faqs: [
        { question: "What is MedNeuro?", answer: "MedNeuro is an upcoming neuroscience education app that covers neuroanatomy, cranial nerve examination, reflex testing, and neurological case studies with interactive visual guides." },
        { question: "Does MedNeuro cover cranial nerve examination?", answer: "Yes! MedNeuro includes a complete guide to all 12 cranial nerves with examination techniques, common lesion patterns, and bedside testing methods." }
      ],
      seo: {
        title: "MedNeuro — Neurology Anatomy Poster | Brain, Nerves, CNS Chart PDF | Exam Essentials",
        description: "Crystal-clear neurology poster covering CNS, PNS, brain anatomy, cranial nerves & dermatomes. Perfect for MBBS, NEET & medical students. Digital download — instant PDF delivery worldwide.",
        keywords: "neurology app, neuroanatomy, cranial nerve examination, neurological tests, brain anatomy app, neuro education, medical student neurology"
      }
    },
    {
      id: "medphysio",
      slug: "medphysio",
      name: "MedPhysio",
      tagline: "Physiotherapy Techniques & Rehabilitation Excellence",
      description: "Master physiotherapy techniques, exercise prescriptions, and rehabilitation protocols with evidence-based content.",
      longDescription: "MedPhysio is the ultimate physiotherapy companion app. From manual therapy techniques to therapeutic exercises, from electrotherapy modalities to rehabilitation protocols — everything is organized for quick clinical reference and exam preparation.",
      features: [
        { icon: "Dumbbell", title: "Exercise Library", description: "500+ therapeutic exercises with proper form, sets, reps, and progression guidelines" },
        { icon: "Hand", title: "Manual Therapy", description: "Techniques for joint mobilization, soft tissue manipulation, and myofascial release" },
        { icon: "Waves", title: "Electrotherapy", description: "Complete guide to IFT, TENS, ultrasound, SWD, and other electrotherapy modalities" },
        { icon: "ClipboardList", title: "Rehab Protocols", description: "Evidence-based rehabilitation protocols for common musculoskeletal conditions" }
      ],
      targetAudience: ["Physiotherapy Students", "BPT Interns", "Sports Physiotherapists", "Rehabilitation Specialists"],
      faqs: [
        { question: "What is MedPhysio?", answer: "MedPhysio is an upcoming physiotherapy education app featuring 500+ therapeutic exercises, manual therapy techniques, electrotherapy guides, and evidence-based rehabilitation protocols." },
        { question: "Is MedPhysio useful for BPT students?", answer: "Absolutely! MedPhysio is specifically designed for BPT students, interns, sports physiotherapists, and rehabilitation specialists with content aligned to university curricula." }
      ],
      seo: {
        title: "MedPhysio – Physiotherapy Techniques & Rehabilitation App | Exam Essentials",
        description: "Master physiotherapy exercises, manual therapy & rehab protocols. The #1 physiotherapy education app for BPT students, coming soon.",
        keywords: "physiotherapy app, BPT study app, exercise prescription, manual therapy techniques, rehabilitation protocols"
      }
    },
    {
      id: "medradio",
      slug: "medradio",
      name: "MedRadio",
      tagline: "Radiology Learning & Medical Imaging Interpretation",
      description: "Learn to read X-rays, CT scans, and MRIs with structured approach and clinical correlations.",
      longDescription: "MedRadio transforms radiology learning with a systematic approach to medical imaging. Learn to identify normal anatomy on various imaging modalities, spot common pathologies, and write radiological reports.",
      features: [
        { icon: "Scan", title: "X-ray Reading", description: "Systematic approach to reading chest, skeletal, and abdominal X-rays with annotated examples" },
        { icon: "Layers", title: "CT & MRI Guide", description: "Learn cross-sectional anatomy and common pathology findings on CT and MRI scans" },
        { icon: "FileImage", title: "Image Library", description: "Curated collection of radiological images with diagnosis and discussion" },
        { icon: "PenTool", title: "Report Writing", description: "Templates and guidelines for writing structured radiological reports" }
      ],
      targetAudience: ["Radiology Residents", "Medical Students", "Emergency Medicine", "Orthopedic Surgeons"],
      faqs: [
        { question: "What is MedRadio?", answer: "MedRadio is an upcoming radiology education app that teaches systematic X-ray, CT, and MRI interpretation with annotated images, report templates, and a quiz mode for practice." },
        { question: "Does MedRadio cover X-ray interpretation?", answer: "Yes! MedRadio includes a systematic approach to reading chest X-rays, skeletal X-rays, and abdominal X-rays with annotated examples." }
      ],
      seo: {
        title: "MedRadio – Radiology Learning & Medical Imaging App | Exam Essentials",
        description: "Learn X-ray, CT & MRI interpretation with annotated images. The comprehensive radiology education app for medical students, coming soon.",
        keywords: "radiology app, X-ray interpretation, CT scan learning, MRI reading, medical imaging app"
      }
    },
    {
      id: "medpharma",
      slug: "medpharma",
      name: "MedPharma",
      tagline: "Pharmacology Made Easy — Drugs, Mechanisms & Clinical Use",
      description: "Simplify pharmacology with organized drug classifications, mechanisms of action, and clinical applications.",
      longDescription: "MedPharma takes the complexity out of pharmacology. Every drug class is organized with clear mechanisms of action, indications, contraindications, side effects, and drug interactions.",
      features: [
        { icon: "Pill", title: "Drug Database", description: "Comprehensive database of drugs organized by class with dosages and interactions" },
        { icon: "GitBranch", title: "Mechanism Maps", description: "Visual flowcharts showing drug mechanisms of action at receptor and molecular level" },
        { icon: "Table", title: "Comparison Tables", description: "Side-by-side drug comparisons for quick revision and exam preparation" },
        { icon: "Lightbulb", title: "Visual Mnemonics", description: "Memory aids and mnemonics for remembering drug names, side effects, and classes" }
      ],
      targetAudience: ["Medical Students", "Pharmacy Students", "Nursing Students", "NEET PG Aspirants"],
      faqs: [
        { question: "What is MedPharma?", answer: "MedPharma is an upcoming pharmacology app that simplifies drug learning with organized classifications, visual mechanism maps, comparison tables, and mnemonics for easy memorization." },
        { question: "Does MedPharma include drug mnemonics?", answer: "Yes! MedPharma features visual mnemonics and memory aids for drug names, side effects, drug interactions, and pharmacological classifications." }
      ],
      seo: {
        title: "MedPharma – Pharmacology Education & Drug Reference App | Exam Essentials",
        description: "Master pharmacology with organized drug data, visual mnemonics & mechanism maps. The easy pharmacology app for medical & pharmacy students, coming soon.",
        keywords: "pharmacology app, drug reference app, pharmacology mnemonics, drug mechanism of action"
      }
    }
  ];

  function buildAppLandingHtml(app) {
    const featuresHtml = app.features.map(f => `
      <li class="flex items-start gap-3">
        <span class="text-green-600 font-bold text-lg">&check;</span>
        <div>
          <strong class="text-gray-900">${escapeHtml(f.title)}</strong>
          <p class="text-gray-500 text-sm leading-relaxed">${escapeHtml(f.description)}</p>
        </div>
      </li>
    `).join('\n');

    const audienceHtml = app.targetAudience.map(a => `
      <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">${escapeHtml(a)}</span>
    `).join('\n');

    const faqsHtml = app.faqs.map(faq => `
      <div>
        <h4 class="font-bold text-gray-800">${escapeHtml(faq.question)}</h4>
        <p class="text-gray-500 text-sm mt-1 leading-relaxed">${escapeHtml(faq.answer)}</p>
      </div>
    `).join('\n');

    return `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="text-center py-12 md:py-20 border-b border-gray-100 mb-12">
          <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">${escapeHtml(app.name)}</h1>
          <p class="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed mb-6">
            ${escapeHtml(app.tagline)}
          </p>
          ${app.slug === 'medortho' ? `
          <div class="flex justify-center gap-4">
            <a href="/medortho/special-tests" class="px-6 py-3 bg-blue-900 text-white rounded-full font-bold shadow-md hover:bg-blue-800 transition-colors">Open Special Tests Directory</a>
          </div>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 class="text-2xl font-bold mb-6 text-gray-900">Key Features</h2>
            <ul class="space-y-4">
              ${featuresHtml}
            </ul>
          </div>

          <div>
            <h2 class="text-2xl font-bold mb-6 text-gray-900">Target Audience</h2>
            <div class="flex flex-wrap gap-2 mb-8">
              ${audienceHtml}
            </div>

            <h2 class="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            <div class="space-y-4">
              ${faqsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Loop through all apps to pre-render their landing pages
  appsList.forEach(app => {
    const pageOptions = {
      title: app.seo.title,
      description: app.seo.description,
      keywords: app.seo.keywords,
      canonical: `${DOMAIN}/${app.slug}`,
      ogImage: `${DOMAIN}/og-image.png`,
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          "name": app.name,
          "description": app.description,
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Android",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        }
      ],
      bodyContent: buildAppLandingHtml(app)
    };
    writePage(app.slug, generatePageHtml(templateHtml, pageOptions));
    console.log(`✅ Pre-rendered /${app.slug}`);
  });

  // 2. Pre-render Special Tests Directory Page (/medortho/special-tests)
  const allTestsContent = testsList.map(t => {
    if (!t.title) return '';
    const cleanSlug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `
      <div class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-slate-50/50">
        <div>
          <h3 class="font-bold text-gray-900">
            <a href="/medortho/tests/${cleanSlug}" class="hover:underline">${t.title}</a>
          </h3>
          <span class="text-xs text-gray-400 font-semibold">${t.category || 'Special Tests'}</span>
        </div>
        <a href="/medortho/tests/${cleanSlug}" class="text-blue-600 text-sm font-semibold hover:underline">Read &rarr;</a>
      </div>
    `;
  }).join('\n');

  const specialTestsDirectoryOptions = {
    title: 'Orthopedic Special Tests Directory | MedOrtho',
    description: 'Browse and search all 700+ orthopedic physical examination special tests, clinical diagnostics, sensitivity, specificity, and procedures.',
    keywords: 'orthopedic special tests, physical examination tests, clinical tests, orthopedic wiki',
    canonical: `${DOMAIN}/medortho/special-tests`,
    ogImage: `${DOMAIN}/og-image.png`,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Orthopedic Special Tests Directory | MedOrtho",
        "description": "Browse and search all 700+ orthopedic physical examination special tests, clinical diagnostics, sensitivity, specificity, and procedures."
      }
    ],
    bodyContent: `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <nav class="text-sm text-gray-500 mb-6">
          <a href="/medortho" class="hover:underline">MedOrtho</a> &gt; 
          <span class="text-gray-900">Special Tests</span>
        </nav>
        
        <div class="mb-12">
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 leading-tight">
            Orthopedic Special Tests Directory
          </h1>
          <p class="text-gray-500 text-lg max-w-3xl leading-relaxed">
            Browse and search all 700+ orthopedic physical examination special tests, clinical diagnostics, sensitivity, specificity, and procedures.
          </p>
        </div>

        <div class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-gray-900">Browse by Joint Region</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/medortho/shoulder" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Shoulder <span>&rarr;</span></a>
            <a href="/medortho/knee" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Knee <span>&rarr;</span></a>
            <a href="/medortho/hip" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Hip <span>&rarr;</span></a>
            <a href="/medortho/spine" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Spine <span>&rarr;</span></a>
            <a href="/medortho/elbow" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Elbow <span>&rarr;</span></a>
            <a href="/medortho/wrist-hand" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Wrist & Hand <span>&rarr;</span></a>
            <a href="/medortho/ankle-foot" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Ankle & Foot <span>&rarr;</span></a>
            <a href="/medortho/neurological" class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-gray-800">Neurological <span>&rarr;</span></a>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold mb-6 text-gray-900">All Orthopedic Special Tests</h2>
          <div class="space-y-4">
            ${allTestsContent}
          </div>
        </div>
      </div>
    `
  };
  writePage('medortho/special-tests', generatePageHtml(templateHtml, specialTestsDirectoryOptions));
  console.log('✅ Pre-rendered /medortho/special-tests');

  // 3. Pre-render Category pages (shoulder, knee, etc.)
  const categories = [
    { raw: "shoulder", dbName: "Shoulder", formatted: "Shoulder" },
    { raw: "knee", dbName: "Knee", formatted: "Knee" },
    { raw: "hip", dbName: "Hip", formatted: "Hip" },
    { raw: "spine", dbName: "Spine", formatted: "Spine" },
    { raw: "elbow", dbName: "Elbow", formatted: "Elbow" },
    { raw: "wrist-hand", dbName: "Wrist & Hand", formatted: "Wrist & Hand" },
    { raw: "wrist", dbName: "Wrist & Hand", formatted: "Wrist & Hand" },
    { raw: "ankle-foot", dbName: "Ankle & Foot", formatted: "Ankle & Foot" },
    { raw: "ankle", dbName: "Ankle & Foot", formatted: "Ankle & Foot" },
    { raw: "neurological", dbName: "Neurological", formatted: "Neurological" }
  ];

  categories.forEach(cat => {
    const testsInCategory = testsList.filter(t => t.category === cat.dbName);

    const listHtml = testsInCategory.map(t => {
      if (!t.title) return '';
      const cleanSlug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const cleanDesc = t.usedFor ? stripHtml(t.usedFor).substring(0, 140).trim() + "..." : `Learn how to perform the ${t.title} orthopedic special test.`;
      return `
        <div class="border border-gray-100 rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
          <h3 class="font-bold text-xl mb-2 text-gray-900">
            <a href="/medortho/tests/${cleanSlug}" class="hover:underline text-blue-600">${t.title}</a>
          </h3>
          <p class="text-gray-500 text-sm mb-4 leading-relaxed">${cleanDesc}</p>
          <a href="/medortho/tests/${cleanSlug}" class="text-blue-600 text-sm font-semibold hover:underline">Read Guide &rarr;</a>
        </div>
      `;
    }).join('\n');

    const categoryOptions = {
      title: `${cat.formatted} Special Tests & Clinical Examination | MedOrtho`,
      description: `Master diagnostic physical examination special tests for ${cat.formatted}. Sensitivity, specificity, and step-by-step performance guidelines.`,
      keywords: `${cat.formatted} special tests, ${cat.formatted} exam, orthopedic tests, ${cat.formatted} assessment`,
      canonical: `${DOMAIN}/medortho/${cat.raw}`,
      ogImage: `${DOMAIN}/og-image.png`,
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `${cat.formatted} Special Tests & Clinical Examination | MedOrtho`,
          "description": `Master diagnostic physical examination special tests for ${cat.formatted}. Sensitivity, specificity, and step-by-step performance guidelines.`
        }
      ],
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-8">
          <nav class="text-sm text-gray-500 mb-6">
            <a href="/medortho" class="hover:underline">MedOrtho</a> &gt; 
            <a href="/medortho/special-tests" class="hover:underline">Special Tests</a> &gt; 
            <span class="text-gray-900">${cat.formatted}</span>
          </nav>
          
          <div class="mb-10">
            <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 leading-tight">
              ${cat.formatted} Special Tests & Clinical Examination
            </h1>
            <p class="text-gray-500 text-lg max-w-3xl leading-relaxed">
              Master diagnostic physical examination special tests for ${cat.formatted}. Sensitivity, specificity, and step-by-step performance guidelines.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${listHtml || '<p class="col-span-2 text-gray-500">No tests available in this category yet.</p>'}
          </div>
        </div>
      `
    };

    writePage(`medortho/${cat.raw}`, generatePageHtml(templateHtml, categoryOptions));
    console.log(`  - Pre-rendered /medortho/${cat.raw}`);
  });

  // 4. Pre-render every individual special test page (/medortho/tests/[slug])
  testsList.forEach(t => {
    if (!t.title) return;

    const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanUsedFor = stripHtml(t.usedFor);
    const cleanDesc = cleanUsedFor 
      ? cleanUsedFor.substring(0, 155).trim() + "..."
      : `Learn how to perform the ${t.title} orthopedic special test including indications, procedure, and accuracy.`;

    const imageFilename = t.image1 ? t.image1.split('/').pop() : null;
    const ogImage = imageFilename 
      ? `${DOMAIN}/medortho/tests/images/${imageFilename}` 
      : `${DOMAIN}/og-image.png`;

    const schemas = buildWikiArticleStructuredData('medortho', t, slug);

    // Find related tests in the same category
    const related = testsList
      .filter(rt => rt.category === t.category && rt.id !== t.id && rt.title)
      .slice(0, 4);

    let relatedHtml = '';
    if (related.length > 0) {
      const relatedCards = related.map(rt => {
        const rtSlug = rt.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const rtFilename = rt.image1 ? rt.image1.split('/').pop() : null;
        const rtImgUrl = rtFilename ? `/medortho/tests/images/${rtFilename}` : 'https://examessentials.in/og-image.png';
        return `
          <a href="/medortho/tests/${rtSlug}" class="group flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div class="relative h-28 bg-slate-50 overflow-hidden flex items-center justify-center">
              <img src="${rtImgUrl}" alt="${escapeHtml(rt.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-4 flex-grow flex flex-col">
              <span class="text-[10px] font-bold uppercase tracking-wider mb-1.5 block text-blue-500">
                ${escapeHtml(rt.category)} Examination
              </span>
              <h4 class="font-bold text-sm text-gray-800 line-clamp-2 leading-snug">
                ${escapeHtml(rt.title)}
              </h4>
            </div>
          </a>
        `;
      }).join('\n');

      relatedHtml = `
        <div class="mt-20 pt-10 border-t border-gray-100">
          <h2 class="text-2xl font-bold mb-8 text-slate-800 font-sans flex items-center gap-2">
            Further Clinical Exploration
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            ${relatedCards}
          </div>
        </div>
      `;
    }

    const bodyContent = `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <nav class="text-sm text-gray-500 mb-6">
          <a href="/medortho" class="hover:underline">MedOrtho</a> &gt; 
          <a href="/medortho/special-tests" class="hover:underline">Special Tests</a> &gt; 
          <span class="text-gray-900">${t.title}</span>
        </nav>
        
        <article class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <header class="mb-8">
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">${t.category}</span>
              ${t.subCategory ? `<span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">${t.subCategory}</span>` : ''}
              <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full capitalize">Evidence: ${t.evidence || 'suggestive'}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${t.title} Special Test</h1>
            <p class="text-gray-500 text-sm">Orthopedic Physical Examination & Clinical Assessment Guide</p>
          </header>

          ${imageFilename ? `
          <div class="mb-8 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex justify-center">
            <img src="/medortho/tests/images/${imageFilename}" alt="${t.title} Orthopedic Special Test" class="max-h-[400px] object-contain" />
          </div>
          ` : ''}

          <div class="prose max-w-none">
            ${t.usedFor ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">What is it used for?</h2>
              <div class="text-gray-600 leading-relaxed">${t.usedFor}</div>
            </section>
            ` : ''}

            ${t.howTo ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">How to Perform</h2>
              <div class="text-gray-600 leading-relaxed">${t.howTo}</div>
            </section>
            ` : ''}

            ${t.result ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Interpretation of Results</h2>
              <div class="text-gray-600 leading-relaxed">${t.result}</div>
            </section>
            ` : ''}

            ${t.accuracy && t.accuracy.trim() !== "" ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Diagnostic Accuracy</h2>
              <div class="text-gray-600 leading-relaxed">${t.accuracy}</div>
            </section>
            ` : ''}

            ${t.extra && t.extra.trim() !== "" ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Clinical Tips & Notes</h2>
              <div class="text-gray-600 leading-relaxed">${t.extra}</div>
            </section>
            ` : ''}

            ${t.references ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">References</h2>
              <div class="text-gray-500 text-sm leading-relaxed">${t.references}</div>
            </section>
            ` : ''}
          </div>
        </article>
        ${relatedHtml}
      </div>
    `

    const testPageOptions = {
      title: `${t.title} – ${t.category} Special Test | MedOrtho`,
      description: cleanDesc,
      keywords: `${t.title}, ${t.category} test, orthopedic special test, medortho wiki, ${t.subCategory || ''}`,
      canonical: `${DOMAIN}/medortho/tests/${slug}`,
      ogImage: ogImage,
      schemas: schemas,
      bodyContent: bodyContent
    };

    writePage(`medortho/tests/${slug}`, generatePageHtml(templateHtml, testPageOptions));
  });

  console.log(`✅ Pre-rendered ${testsList.length} individual special tests.`);

  // 4b. Pre-render every individual database-driven wiki article page (/[app_id]/tests/[slug])
  if (dbArticles.length > 0) {
    dbArticles.forEach(art => {
      if (!art.slug || !art.app_id || !art.title) return;

      const cleanContent = stripHtml(art.content || '');
      const cleanDesc = art.content 
        ? cleanContent.substring(0, 155).trim() + "..."
        : `Learn about ${art.title} in the ${art.app_id === 'medortho' ? 'MedOrtho' : art.app_id} Wiki.`;

      const schemas = buildWikiArticleStructuredData(art.app_id, {
        title: art.title,
        description: cleanDesc,
        lastUpdated: art.updated_at ? new Date(art.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: art.category || 'Special Tests',
        evidence: art.evidence,
        subCategory: art.subCategory,
        accuracy: art.accuracy,
        usedFor: art.usedFor,
        howTo: art.howTo,
        result: art.result
      }, art.slug);

      const bodyContent = `
        <div class="max-w-4xl mx-auto px-4 py-8">
          <nav class="text-sm text-gray-500 mb-6">
            <a href="/${art.app_id}" class="hover:underline">${art.app_id === 'medortho' ? 'MedOrtho' : art.app_id}</a> &gt; 
            <a href="/${art.app_id}/special-tests" class="hover:underline">Special Tests</a> &gt; 
            <span class="text-gray-900">${art.title}</span>
          </nav>
          
          <article class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <header class="mb-8">
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">${art.category || 'Special Tests'}</span>
                ${art.subCategory ? `<span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">${art.subCategory}</span>` : ''}
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${art.title}</h1>
              <p class="text-gray-500 text-sm">Clinical Reference & Assessment Guide</p>
            </header>

            <div class="prose max-w-none">
              ${art.content ? `<div class="text-gray-600 leading-relaxed">${art.content}</div>` : ''}
            </div>
          </article>
        </div>
      `;

      const pageOptions = {
        title: `${art.title} | ${art.app_id === 'medortho' ? 'MedOrtho' : art.app_id}`,
        description: cleanDesc,
        keywords: `${art.title}, ${art.category || 'test'}, ${art.app_id} wiki`,
        canonical: `${DOMAIN}/${art.app_id}/tests/${art.slug}`,
        ogImage: `${DOMAIN}/og-image.png`,
        schemas: schemas,
        bodyContent: bodyContent
      };

      writePage(`${art.app_id}/tests/${art.slug}`, generatePageHtml(templateHtml, pageOptions));
    });
    console.log(`✅ Pre-rendered ${dbArticles.length} database-driven wiki articles.`);
  }

  // 5. Pre-render Blog index and individual blog posts
  if (dbBlogPosts.length > 0) {
    const blogListContent = dbBlogPosts.map(post => {
      const postDate = post.created_at?.split("T")[0] || new Date().toISOString().split("T")[0];
      return `
        <article class="flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div class="aspect-[16/9] overflow-hidden rounded-xl bg-slate-800 mb-6">
            <img src="${post.image_url || 'https://images.unsplash.com/photo-1559757175-9e351c9a1301?w=800&q=80'}" alt="${escapeHtml(post.title)}" class="w-full h-full object-cover" />
          </div>
          <div class="flex items-center gap-4 text-xs text-slate-400 mb-3">
            <span>${postDate}</span>
            <span>${escapeHtml(post.read_time || '5 min read')}</span>
          </div>
          <h3 class="font-bold text-2xl text-white mb-3">
            <a href="/blog/${post.slug}" class="hover:underline text-blue-400">${escapeHtml(post.title)}</a>
          </h3>
          <p class="text-slate-300 text-sm leading-relaxed mb-6">${escapeHtml(post.excerpt || '')}</p>
          <a href="/blog/${post.slug}" class="text-blue-400 text-sm font-semibold hover:underline">Read Article &rarr;</a>
        </article>
      `;
    }).join('\n');

    const blogDirectoryOptions = {
      title: 'Medical Resources & Articles Blog | Exam Essentials',
      description: 'Premium educational articles for medical students and professionals. Read about orthopedic tests, neurology exams, and more.',
      keywords: 'medical blog, orthopedic test, neurology exam, medical students',
      canonical: `${DOMAIN}/blog`,
      ogImage: `${DOMAIN}/og-image.png`,
      bodyContent: `
        <div class="max-w-6xl mx-auto px-4 py-16 text-left">
          <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-6">Latest Articles</h1>
          <p class="text-lg text-slate-300 mb-12 max-w-3xl leading-relaxed">
            Demystifying complex medical concepts. Discover simplified clinical explanations, premium study guides, and actionable techniques for students.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${blogListContent}
          </div>
        </div>
      `
    };
    writePage('blog', generatePageHtml(templateHtml, blogDirectoryOptions));
    console.log('✅ Pre-rendered /blog');

    dbBlogPosts.forEach(post => {
      const postDate = post.created_at?.split("T")[0] || new Date().toISOString().split("T")[0];
      const postContentHtml = post.content
        .split('\n')
        .map(line => {
          if (line.startsWith('## ')) return `<h2 class="text-2xl font-bold text-white mt-8 mb-4">${escapeHtml(line.slice(3))}</h2>`;
          if (line.startsWith('### ')) return `<h3 class="text-xl font-bold text-white mt-6 mb-3">${escapeHtml(line.slice(4))}</h3>`;
          if (line.trim() === '---') return '<hr class="border-slate-800 my-8"/>';
          if (line.trim().startsWith('> [!IMPORTANT]')) return `<div class="p-4 border-l-4 border-red-500 bg-slate-800/50 text-white rounded-r-xl my-6"><strong>Important:</strong>`;
          if (line.trim().startsWith('> ')) return `<blockquote class="border-l-4 border-blue-400 bg-slate-800/50 p-4 pl-6 rounded-r-xl text-slate-300 my-6 italic">${escapeHtml(line.trim().slice(2))}</blockquote>`;
          
          let processed = escapeHtml(line);
          processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
          processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 hover:underline">$1</a>');
          
          if (processed.trim().startsWith('- ')) return `<li class="text-slate-300 my-2">${processed.trim().slice(2)}</li>`;
          if (/^\d+\.\s/.test(processed.trim())) return `<li class="text-slate-300 my-2">${processed.trim().replace(/^\d+\.\s/, '')}</li>`;
          if (processed.trim() === '') return '<br/>';
          return `<p class="text-slate-300 text-lg leading-relaxed mb-6">${processed}</p>`;
        })
        .join('\n');

      const blogPostOptions = {
        title: `${post.title} | Exam Essentials`,
        description: post.excerpt || '',
        keywords: `${post.category?.toLowerCase() || 'medical'}, exam essentials, ${post.title.toLowerCase().split(' ').join(', ')}`,
        canonical: `${DOMAIN}/blog/${post.slug}`,
        ogImage: post.image_url || `${DOMAIN}/og-image.png`,
        bodyContent: `
          <article class="max-w-4xl mx-auto px-4 py-16 text-left">
            <header class="mb-12">
              <span class="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 mb-6">${escapeHtml(post.category || 'Blog')}</span>
              <h1 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">${escapeHtml(post.title)}</h1>
              <div class="flex flex-wrap gap-6 text-sm text-slate-400 pb-6 border-b border-slate-800">
                <span>Author: ${escapeHtml(post.author || 'Exam Essentials')}</span>
                <span>Date: ${postDate}</span>
                <span>Read Time: ${escapeHtml(post.read_time || '5 min read')}</span>
              </div>
            </header>
            <div class="prose prose-invert max-w-none">
              ${postContentHtml}
            </div>
          </article>
        `
      };
      writePage(`blog/${post.slug}`, generatePageHtml(templateHtml, blogPostOptions));
    });
    console.log(`✅ Pre-rendered ${dbBlogPosts.length} individual blog posts.`);
  }

  // 6. Pre-render Static Pages
  const extraStaticPages = [
    {
      route: 'medposterhub',
      title: "MedPosterHub – Buy Medical Anatomy Posters Online | Clinic & Hospital Charts India",
      description: "Shop 20+ premium medical anatomy posters for hospitals, clinics & students. High-resolution Anatomy, Orthopedics & Neurology charts on 250gsm matte paper. Sizes A3, A2, A1 starting ₹299. Trusted by 100+ clinics across India.",
      keywords: "medical posters, anatomy posters for clinic, buy medical charts online India, anatomy chart A1 A2 A3, ortho clinic posters, neuro anatomy poster, muscular system poster, skeletal system chart, physiotherapy clinic posters, hospital wall charts, medical education posters, dermatomes poster, spine anatomy chart, knee anatomy poster, shoulder anatomy poster, medical posters for students, clinic decoration, OPD posters India, MedPosterHub",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">MedPosterHub</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Shop premium medical anatomy posters for clinics, hospitals, and students. High-resolution, medically accurate charts covering Anatomy, Orthopedics, and Neurology.
          </p>
        </div>
      `
    },
    {
      route: 'about',
      title: "About Us - India's #1 Handwritten Notes Provider | Exam Essentials",
      description: "Exam Essentials creates premium handwritten notes that simplify complex topics for Class 11 & 12 students. Trusted by thousands for CBSE Boards, NEET & JEE preparation.",
      keywords: "about exam essentials, handwritten notes company India, best study materials, CBSE notes provider, NEET notes, JEE notes, topper notes",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">About Exam Essentials</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Exam Essentials creates premium handwritten notes that simplify complex topics for Class 11 & 12 students. Trusted by thousands of students for CBSE Board exams, NEET, and JEE preparation.
          </p>
        </div>
      `
    },
    {
      route: 'contact',
      title: "Contact Us - Exam Essentials | Customer Support",
      description: "Contact Exam Essentials for questions about handwritten notes for Class 11 & 12. WhatsApp: +91 9460970342. Email: examessentials.info@gmail.com. We're here to help!",
      keywords: "contact exam essentials, customer support study notes, buy handwritten notes, CBSE notes enquiry, notes help India",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Contact Us</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Have questions about our study materials or custom orders? Reach out to us via WhatsApp at +91 9460970342 or email us at examessentials.info@gmail.com. We're here to help!
          </p>
        </div>
      `
    },
    {
      route: 'class-11-notes',
      title: "Class 11 Handwritten Notes — Physics, Chemistry, Maths, Biology | By Toppers",
      description: "India's #1 topper-handwritten notes for Class 11 Science. CBSE-aligned Physics, Chemistry, Maths & Biology notes. Exam-focused, easy to revise. Order now.",
      keywords: "class 11 handwritten notes, class 11 notes, class 11 physics notes, class 11 chemistry notes, class 11 maths notes, class 11 biology notes, CBSE class 11 notes, handwritten notes class 11, topper notes class 11, NEET class 11, JEE class 11 notes, class 11th handwritten notes",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Class 11 Handwritten Notes</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Premium handwritten notes for CBSE Class 11 science students. Complete Physics, Chemistry, Maths & Biology notes by toppers to help build a strong foundation for Board exams, NEET & JEE.
          </p>
        </div>
      `
    },
    {
      route: 'class-12-notes',
      title: "Class 12 Notes - Physics, Chemistry, Maths, Biology | Handwritten Notes PDF",
      description: "Buy premium Class 12 handwritten notes for Physics, Chemistry, Maths & Biology. CBSE board exam focused content by 95%+ scorers. Essential for NEET & JEE 2025. Instant PDF delivery.",
      keywords: "class 12 notes, class 12 physics notes, class 12 chemistry notes, class 12 maths notes, class 12 biology notes, CBSE class 12 notes, handwritten notes class 12, topper notes class 12, NEET notes, JEE notes, board exam notes",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Class 12 Handwritten Notes</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Buy premium topper-handwritten Class 12 notes for Physics, Chemistry, Maths & Biology. Highly optimized for CBSE Board exams and competitive entrances like NEET & JEE.
          </p>
        </div>
      `
    },
    {
      route: 'neet-notes',
      title: "NEET Notes 2025 - Biology, Physics, Chemistry | Best Handwritten Notes PDF",
      description: "Buy premium NEET handwritten notes for Biology, Physics & Chemistry. Complete NCERT-based content for Class 11 & 12. Created by NEET qualifiers. Score 600+ with our study material. Instant PDF.",
      keywords: "NEET notes, NEET biology notes, NEET physics notes, NEET chemistry notes, NEET preparation, NEET study material, NEET 2025 notes, handwritten notes NEET, NCERT notes NEET, best NEET notes, NEET topper notes",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">NEET Handwritten Notes</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Buy premium NEET handwritten notes for Biology, Physics & Chemistry. Complete NCERT-based content covering Class 11 & 12 syllabus, written by top NEET scorers.
          </p>
        </div>
      `
    },
    // Anatomy
    {
      route: 'medortho/anatomy/bones',
      title: "Osteology (Bones) Study Guides & Clinical Notes | MedOrtho",
      description: "Detailed anatomical notes on human skeletal structure, bony landmarks, ossification, and blood supply for orthopedic reference.",
      keywords: "orthopedic anatomy, bones, human skeleton, osteology study guide",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Osteology (Bones) Study Guides</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Detailed anatomical notes on human skeletal structure, bony landmarks, ossification, and blood supply for orthopedic reference.
          </p>
        </div>
      `
    },
    {
      route: 'medortho/anatomy/joints',
      title: "Arthrology (Joints) Study Guides & Clinical Notes | MedOrtho",
      description: "Comprehensive clinical guides covering joint types, biomechanics, range of motion limits, and articular structures.",
      keywords: "orthopedic anatomy, joints, arthrology study guide, joint biomechanics",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Arthrology (Joints) Study Guides</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Comprehensive clinical guides covering joint types, biomechanics, range of motion limits, and articular structures.
          </p>
        </div>
      `
    },
    {
      route: 'medortho/anatomy/muscles',
      title: "Myology (Muscles) Clinical Notes & Study Guide | MedOrtho",
      description: "Explanations of muscle groups, origins, insertions, nerve innervations, and testing procedures for orthopedic evaluation.",
      keywords: "orthopedic anatomy, muscles, myology guide, muscle testing",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Myology (Muscles) Clinical Notes</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Explanations of muscle groups, origins, insertions, nerve innervations, and testing procedures for orthopedic evaluation.
          </p>
        </div>
      `
    },
    {
      route: 'medortho/anatomy/ligaments',
      title: "Syndesmology (Ligaments) Reference & Guides | MedOrtho",
      description: "In-depth clinical reviews of ligamentous structures, attachments, biomechanical functions, and stability parameters.",
      keywords: "orthopedic anatomy, ligaments, syndesmology guide, ligament stability",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Syndesmology (Ligaments) Reference</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            In-depth clinical reviews of ligamentous structures, attachments, biomechanical functions, and stability parameters.
          </p>
        </div>
      `
    },
    // Pathologies
    {
      route: 'medortho/pathologies/fractures',
      title: "Fractures & Dislocations Guide & Clinical Notes | MedOrtho",
      description: "Classification, mechanism of injury, clinical features, and management guidelines for orthopedic fractures and joint dislocations.",
      keywords: "orthopedic pathology, fractures, joint dislocation guide",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Fractures & Dislocations Guide</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Classification, mechanism of injury, clinical features, and management guidelines for orthopedic fractures and joint dislocations.
          </p>
        </div>
      `
    },
    {
      route: 'medortho/pathologies/inflammation',
      title: "Inflammatory Joint Conditions & Guides | MedOrtho",
      description: "Clinical insights on osteomyelitis, septic arthritis, rheumatoid arthritis, bursitis, and tendinitis.",
      keywords: "orthopedic pathology, inflammation, arthritis, tendinitis, bursitis",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Inflammatory Joint Conditions</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Clinical insights on osteomyelitis, septic arthritis, rheumatoid arthritis, bursitis, and tendinitis.
          </p>
        </div>
      `
    },
    {
      route: 'medortho/pathologies/chronic-conditions',
      title: "Chronic Orthopedic Pathologies & Guides | MedOrtho",
      description: "Diagnostic and treatment strategies for chronic conditions like osteoarthritis, osteoporosis, avascular necrosis (AVN), and spinal stenosis.",
      keywords: "orthopedic pathology, chronic conditions, osteoarthritis, osteoporosis, AVN",
      bodyContent: `
        <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
          <h1 class="text-4xl font-extrabold mb-6">Chronic Orthopedic Pathologies</h1>
          <p class="text-lg text-slate-300 leading-relaxed mb-6">
            Diagnostic and treatment strategies for chronic conditions like osteoarthritis, osteoporosis, avascular necrosis (AVN), and spinal stenosis.
          </p>
        </div>
      `
    }
  ];

  extraStaticPages.forEach(page => {
    const pageOptions = {
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      canonical: `${DOMAIN}/${page.route}`,
      ogImage: `${DOMAIN}/og-image.png`,
      bodyContent: page.bodyContent
    };
    writePage(page.route, generatePageHtml(templateHtml, pageOptions));
  });
  console.log(`✅ Pre-rendered ${extraStaticPages.length} extra static and sub-sections pages.`);

  // 7. Pre-render MedPosterHub detail pages
  try {
    const postersDataPath = path.resolve(process.cwd(), 'src/apps/medposterhub/data/posters.ts');
    if (fs.existsSync(postersDataPath)) {
      const postersContent = fs.readFileSync(postersDataPath, 'utf8');
      const blocks = postersContent.split(/\{\s*id:\s*/).slice(1);
      let posterCount = 0;
      
      blocks.forEach(block => {
        const getVal = (key) => {
          const regex = new RegExp(key + ':\\s*["\']([^\'"]+)["\']');
          const matchResult = block.match(regex);
          return matchResult ? matchResult[1] : null;
        };
        
        const slug = getVal('slug');
        const title = getVal('title');
        const description = getVal('description') || `High-quality medical poster for clinics, classrooms, and study.`;
        const category = getVal('category') || 'Medical';
        const seoTitle = getVal('seoTitle');
        const seoDescription = getVal('seoDescription');
        
        if (slug && title) {
          posterCount++;
          const pageOptions = {
            title: seoTitle || `${title} Poster | MedPosterHub`,
            description: seoDescription || description,
            keywords: `${title.toLowerCase()}, medical poster, anatomy chart, ${category.toLowerCase()}`,
            canonical: `${DOMAIN}/medposterhub/${slug}`,
            ogImage: `${DOMAIN}/og-image.png`,
            bodyContent: `
              <div class="max-w-4xl mx-auto px-4 py-16 text-left text-white">
                <nav class="text-sm text-slate-400 mb-6">
                  <a href="/medposterhub" class="hover:underline">MedPosterHub</a> &gt; 
                  <span class="text-white">${escapeHtml(title)}</span>
                </nav>
                <h1 class="text-4xl font-extrabold mb-6">${escapeHtml(title)}</h1>
                <p class="text-lg text-slate-300 leading-relaxed mb-6">
                  ${escapeHtml(description)}
                </p>
              </div>
            `
          };
          writePage(`medposterhub/${slug}`, generatePageHtml(templateHtml, pageOptions));
        }
      });
      console.log(`✅ Pre-rendered ${posterCount} MedPosterHub detail pages.`);
    }
  } catch (e) {
    console.warn('⚠️ Could not pre-render MedPosterHub detail pages:', e.message);
  }

  // 8. Pre-render the Home page / and overwrite dist/index.html
  console.log('🔄 Pre-rendering homepage (index.html)...');
  try {
    const rootDivMatch = templateHtml.match(/<div\s+id=["']root["'][^>]*>([\s\S]*?)<\/div>/i);
    const rootDivContent = rootDivMatch ? rootDivMatch[1] : '';

    const homePageOptions = {
      title: "Exam Essentials — Topper Handwritten Notes for Class 11, 12, NEET & JEE",
      description: "Buy India's best topper-handwritten notes for CBSE Class 11 & 12, NEET and JEE. Physics, Chemistry, Maths & Biology. Also: medical anatomy posters for MBBS students. Order now.",
      keywords: "exam essentials, board exam essentials, best handwritten notes India, topper notes class 11, topper notes class 12, CBSE board exam notes, NEET notes PDF, JEE notes PDF, physics handwritten notes, chemistry handwritten notes, biology handwritten notes, maths handwritten notes, study material for boards, medical posters",
      canonical: `${DOMAIN}/`,
      ogImage: `${DOMAIN}/og-image.png`,
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Exam Essentials",
          "alternateName": "ExamEssentials",
          "url": DOMAIN,
          "logo": `${DOMAIN}/logo.png`,
          "image": `${DOMAIN}/og-image.png`,
          "description": "India's #1 premium handwritten notes for Class 11 & 12 students. Exam-focused study materials for CBSE Boards, NEET & JEE preparation.",
          "foundingDate": "2024",
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9460970342",
            "contactType": "customer service",
            "email": "examessentials.info@gmail.com",
            "availableLanguage": ["English", "Hindi"]
          },
          "sameAs": [
            "https://wa.me/919460970342"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Exam Essentials",
          "alternateName": "ExamEssentials Notes",
          "url": DOMAIN,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${DOMAIN}/products?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }
      ],
      bodyContent: rootDivContent
    };

    const preRenderedHomeHtml = generatePageHtml(templateHtml, homePageOptions);
    fs.writeFileSync(indexHtmlPath, preRenderedHomeHtml);
    console.log('✅ Overwrote dist/index.html with pre-rendered homepage.');
  } catch (homeErr) {
    console.warn('⚠️ Could not pre-render homepage:', homeErr.message);
  }

  console.log('🎉 Static pre-rendering completed successfully!');
}

runPrerender().catch(err => {
  console.error('❌ Static pre-rendering failed:', err);
  process.exit(1);
});
