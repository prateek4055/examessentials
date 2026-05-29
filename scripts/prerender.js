import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const testsDataPath = path.resolve(process.cwd(), 'public/medortho/tests/tests_data.json');

const DOMAIN = 'https://examessentials.in';

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
    },
    {
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
    }
  ];
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

  // 1. Pre-render MedOrtho Landing Page (/medortho)
  const medOrthoLandingOptions = {
    title: 'MedOrtho — Orthopedic Special Tests & Clinical Learning App | Exam Essentials',
    description: 'Master 700+ orthopedic special tests, surgical instruments, and clinical MCQs. The ultimate study and revision app for MBBS, BPT, NEET PG & FMGE students.',
    keywords: 'orthopedic learning app, orthopedic special tests app, MBBS orthopedic app, physiotherapy orthopedic app, orthopedic MCQs, surgical instruments app, orthopedic examination app',
    canonical: `${DOMAIN}/medortho`,
    ogImage: `${DOMAIN}/og-image.png`,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        "name": "MedOrtho",
        "description": "Master 700+ orthopedic special tests, surgical instruments, and clinical MCQs.",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      }
    ],
    bodyContent: `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="text-center py-12 md:py-20 border-b border-gray-100 mb-12">
          <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">MedOrtho</h1>
          <p class="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed mb-6">
            The Ultimate Orthopedic Learning Platform for Medical & Physiotherapy Students
          </p>
          <div class="flex justify-center gap-4">
            <a href="/medortho/special-tests" class="px-6 py-3 bg-blue-900 text-white rounded-full font-bold shadow-md hover:bg-blue-800 transition-colors">Open Special Tests Directory</a>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 class="text-2xl font-bold mb-6 text-gray-900">Key Features</h2>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <span class="text-green-600 font-bold text-lg">&check;</span>
                <div>
                  <strong class="text-gray-900">Special Tests Database</strong>
                  <p class="text-gray-500 text-sm leading-relaxed">700+ orthopedic special tests with step-by-step procedures, positive findings, and clinical significance.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-green-600 font-bold text-lg">&check;</span>
                <div>
                  <strong class="text-gray-900">Surgical Instruments Library</strong>
                  <p class="text-gray-500 text-sm leading-relaxed">700+ orthopedic and general surgery instruments with visual recognition support.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-green-600 font-bold text-lg">&check;</span>
                <div>
                  <strong class="text-gray-900">MCQs & Quiz System</strong>
                  <p class="text-gray-500 text-sm leading-relaxed">Topic-wise MCQs with clinical reasoning-based explanations for MBBS, BPT, NEET PG, FMGE, and USMLE.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-green-600 font-bold text-lg">&check;</span>
                <div>
                  <strong class="text-gray-900">Image-Based Notes</strong>
                  <p class="text-gray-500 text-sm leading-relaxed">Fast revision notes covering fractures, dislocations, anatomy, and ligament injuries.</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="text-2xl font-bold mb-6 text-gray-900">Target Audience</h2>
            <div class="flex flex-wrap gap-2 mb-8">
              <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">MBBS Students</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">BPT & Physiotherapy Students</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">Medical Interns</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">Orthopedic Residents</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">NEET PG & FMGE Aspirants</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">USMLE Students</span>
            </div>

            <h2 class="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            <div class="space-y-4">
              <div>
                <h4 class="font-bold text-gray-800">What is MedOrtho?</h4>
                <p class="text-gray-500 text-sm mt-1 leading-relaxed">MedOrtho is an advanced orthopedic learning app built for medical and physiotherapy students that combines 700+ special tests, 700+ surgical instruments, MCQs, and image-based notes.</p>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Does the app cover both tests and instruments?</h4>
                <p class="text-gray-500 text-sm mt-1 leading-relaxed">Yes! MedOrtho includes one of the largest collections on Android: 700+ orthopedic special tests and 700+ surgical instruments with high-resolution visual guides.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  };
  writePage('medortho', generatePageHtml(templateHtml, medOrthoLandingOptions));
  console.log('✅ Pre-rendered /medortho');

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
  console.log('🎉 Static pre-rendering completed successfully!');
}

runPrerender().catch(err => {
  console.error('❌ Static pre-rendering failed:', err);
  process.exit(1);
});
