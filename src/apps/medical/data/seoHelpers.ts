import type { MedAppData } from "./medicalAppsData";

const BASE_URL = "https://examessentials.in";

/**
 * Strips HTML tags and decodes common HTML entities from a string.
 */
function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&deg;/g, "°")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/**
 * Generates a comprehensive array of structured data schemas for each medical app page.
 * Includes: BreadcrumbList, SoftwareApplication/MobileApplication, FAQPage, WebPage.
 */
export function buildAppStructuredData(app: MedAppData): object[] {
  const schemas: object[] = [];

  // 1. BreadcrumbList
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Medical Apps",
        item: `${BASE_URL}/#ecosystem`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: app.name,
        item: `${BASE_URL}/${app.slug}`,
      },
    ],
  });

  // 2. SoftwareApplication / MobileApplication
  const appSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": app.published ? "MobileApplication" : "SoftwareApplication",
    name: app.name,
    description: app.seo.description,
    applicationCategory: "HealthApplication",
    operatingSystem: app.published ? "Android" : "Android, iOS",
    author: {
      "@type": "Organization",
      name: "Exam Essentials",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Exam Essentials",
      url: BASE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: app.published
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
    featureList: app.features.map((f) => f.title).join(", "),
    audience: {
      "@type": "Audience",
      audienceType: app.targetAudience.join(", "),
    },
  };

  if (app.published && app.playStoreLink) {
    appSchema.installUrl = app.playStoreLink;
    appSchema.downloadUrl = app.playStoreLink;
  }

  if (app.seo.ogImageUrl) {
    appSchema.image = app.seo.ogImageUrl;
    appSchema.screenshot = app.seo.ogImageUrl;
  }

  schemas.push(appSchema);

  // 3. FAQPage
  if (app.faqs && app.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: app.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  // 4. MedicalWebPage (for MedOrtho specifically)
  if (app.slug === "medortho") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: app.seo.title,
      description: app.seo.description,
      url: `${BASE_URL}/${app.slug}`,
      specialty: {
        "@type": "MedicalSpecialty",
        name: "Orthopedic Surgery",
      },
      medicalAudience: [
        { "@type": "MedicalAudience", audienceType: "Physiotherapist" },
        { "@type": "MedicalAudience", audienceType: "Medical Student" },
        { "@type": "MedicalAudience", audienceType: "Orthopedic Surgeon" },
        { "@type": "MedicalAudience", audienceType: "MBBS Student" },
      ],
      publisher: {
        "@type": "Organization",
        name: "Exam Essentials",
        url: BASE_URL,
      },
      isAccessibleForFree: true,
      inLanguage: "en",
      dateModified: new Date().toISOString().split("T")[0],
      isPartOf: {
        "@type": "WebSite",
        name: "Exam Essentials",
        url: BASE_URL,
      },
    });
  } else {
    // Generic WebPage for other apps
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: app.seo.title,
      description: app.seo.description,
      url: `${BASE_URL}/${app.slug}`,
      isPartOf: {
        "@type": "WebSite",
        name: "Exam Essentials",
        url: BASE_URL,
      },
      about: {
        "@type": "Thing",
        name: app.name,
        description: app.tagline,
      },
      inLanguage: "en",
    });
  }

  return schemas;
}

/**
 * Builds all structured data schemas for an individual MedOrtho special test article page.
 * Generates: BreadcrumbList, MedicalWebPage, MedicalPhysicalExam, FAQPage, HowTo, ImageObject
 */
export function buildWikiArticleStructuredData(
  appSlug: string,
  article: {
    title: string;
    description?: string;
    lastUpdated: string;
    category: string;
    faqs?: { question: string; answer: string }[];
    evidence?: string;
    subCategory?: string;
    accuracy?: string;
    usedFor?: string;
    howTo?: string;
    result?: string;
    image?: string;
  },
  slug: string
): object[] {
  const url = `${BASE_URL}/${appSlug}/tests/${slug}`;
  const today = new Date().toISOString().split("T")[0];
  const lastReviewed =
    article.lastUpdated === "Today" || !article.lastUpdated ? today : article.lastUpdated;

  const cleanUsedFor = stripHtml(article.usedFor);
  const cleanHowTo = stripHtml(article.howTo);
  const cleanResult = stripHtml(article.result);
  const cleanAccuracy = stripHtml(article.accuracy);
  const cleanDescription =
    article.description ||
    `Learn how to perform the ${article.title} orthopedic special test — indications, step-by-step procedure, positive findings, and diagnostic accuracy.`;

  const schemas: object[] = [];

  // ── 1. BreadcrumbList ─────────────────────────────────────────
  const breadcrumbs: object[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "MedOrtho",
      item: `${BASE_URL}/${appSlug}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Special Tests",
      item: `${BASE_URL}/${appSlug}/special-tests`,
    },
  ];

  if (article.category) {
    const catSlug = article.category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
    breadcrumbs.push({
      "@type": "ListItem",
      position: 4,
      name: article.category,
      item: `${BASE_URL}/${appSlug}/${catSlug}`,
    });
    breadcrumbs.push({
      "@type": "ListItem",
      position: 5,
      name: article.title,
      item: url,
    });
  } else {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 4,
      name: article.title,
      item: url,
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  });

  // ── 2. MedicalWebPage ─────────────────────────────────────────
  const medWebPage: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${article.title} — Orthopedic Special Test`,
    description: cleanDescription,
    url,
    lastReviewed,
    dateModified: today,
    specialty: {
      "@type": "MedicalSpecialty",
      name: "Orthopedic Surgery",
    },
    medicalAudience: [
      { "@type": "MedicalAudience", audienceType: "Physiotherapist" },
      { "@type": "MedicalAudience", audienceType: "Medical Student" },
      { "@type": "MedicalAudience", audienceType: "Orthopedic Surgeon" },
      { "@type": "MedicalAudience", audienceType: "Sports Medicine Physician" },
    ],
    publisher: {
      "@type": "Organization",
      name: "Exam Essentials",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Exam Essentials",
      url: BASE_URL,
    },
    isAccessibleForFree: true,
    inLanguage: "en",
    about: {
      "@type": "MedicalTest",
      name: article.title,
      bodyLocation: article.category,
      usedToDiagnose:
        cleanUsedFor.length > 0
          ? {
              "@type": "MedicalCondition",
              name:
                cleanUsedFor.length > 120
                  ? cleanUsedFor.substring(0, 117) + "..."
                  : cleanUsedFor,
            }
          : undefined,
    },
  };

  // Add ImageObject if article has an image
  if (article.image) {
    medWebPage.image = {
      "@type": "ImageObject",
      url: article.image,
      description: `${article.title} orthopedic special test demonstration`,
      name: `${article.title} - Clinical Test Image`,
    };
    medWebPage.thumbnailUrl = article.image;
  }

  schemas.push(medWebPage);

  // ── 3. MedicalPhysicalExam ────────────────────────────────────
  if (appSlug === "medortho") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "MedicalPhysicalExam",
      name: article.title,
      description: cleanDescription,
      bodyLocation: article.category,
      purpose: cleanUsedFor || undefined,
      howPerformed: cleanHowTo || undefined,
      significance: cleanResult || undefined,
      ...(cleanUsedFor && {
        usedToDiagnose: {
          "@type": "MedicalCondition",
          name:
            cleanUsedFor.length > 100
              ? cleanUsedFor.substring(0, 97) + "..."
              : cleanUsedFor,
        },
      }),
    });

    // ── 4. HowTo schema — gives Google "steps" rich result ────────
    if (cleanHowTo && cleanHowTo.trim().length > 20) {
      // Split how-to text into numbered steps if possible, else treat as single step block
      const rawSteps = cleanHowTo
        .split(/\d+\.\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10);

      const howToSteps =
        rawSteps.length > 1
          ? rawSteps.map((stepText, idx) => ({
              "@type": "HowToStep",
              position: idx + 1,
              name: `Step ${idx + 1}`,
              text: stepText,
            }))
          : [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Procedure",
                text: cleanHowTo,
              },
            ];

      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to Perform the ${article.title}`,
        description: `Step-by-step guide to performing the ${article.title} orthopedic special test used in ${article.category} examination.`,
        step: howToSteps,
        ...(article.image && {
          image: {
            "@type": "ImageObject",
            url: article.image,
          },
        }),
        supply: [
          { "@type": "HowToSupply", name: "Examination table" },
          { "@type": "HowToSupply", name: "Goniometer (if applicable)" },
        ],
        tool: [{ "@type": "HowToTool", name: "Clinical knowledge of anatomy" }],
        totalTime: "PT2M",
      });
    }

    // ── 5. FAQPage — dynamic from test fields ─────────────────────
    const faqs: { question: string; answer: string }[] = [];

    if (cleanUsedFor) {
      faqs.push({
        question: `What is the ${article.title} used for?`,
        answer: cleanUsedFor,
      });
    }
    if (cleanHowTo) {
      faqs.push({
        question: `How do you perform the ${article.title}?`,
        answer: cleanHowTo,
      });
    }
    if (cleanResult) {
      faqs.push({
        question: `What is a positive result for the ${article.title}?`,
        answer: cleanResult,
      });
    }
    if (cleanAccuracy && cleanAccuracy.trim() !== "") {
      faqs.push({
        question: `What is the diagnostic accuracy of the ${article.title}?`,
        answer: cleanAccuracy,
      });
    }
    // Append any manually defined FAQs
    if (article.faqs && article.faqs.length > 0) {
      faqs.push(...article.faqs);
    }

    if (faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }
  } else if (article.faqs && article.faqs.length > 0) {
    // Fallback standard FAQPage for other medical apps
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

/**
 * Builds ItemList structured data for MedOrtho category/index pages.
 * Helps Google understand the list structure and index each test individually.
 */
export function buildCategoryItemListSchema(
  appSlug: string,
  categoryName: string,
  tests: { title: string; slug: string; description?: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryName} Orthopedic Special Tests`,
    description: `Complete list of orthopedic special tests for ${categoryName} examination and clinical assessment.`,
    url: `${BASE_URL}/${appSlug}/${categoryName.toLowerCase().replace(/\s+&?\s*/g, "-")}`,
    numberOfItems: tests.length,
    itemListElement: tests.slice(0, 50).map((test, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: test.title,
      url: `${BASE_URL}/${appSlug}/tests/${test.slug}`,
      ...(test.description && { description: test.description }),
    })),
  };
}
