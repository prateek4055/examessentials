import type { MedAppData } from "./medicalAppsData";

const BASE_URL = "https://examessentials.in";

/**
 * Generates a comprehensive array of structured data schemas for each medical app page.
 * Includes: BreadcrumbList, SoftwareApplication/MobileApplication, and FAQPage.
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
      priceCurrency: "INR",
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

  // 4. WebPage
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
    inLanguage: "en-IN",
  });

  return schemas;
}

function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&deg;/g, "°")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

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
  },
  slug: string
): object[] {
  const url = `${BASE_URL}/${appSlug}/tests/${slug}`;
  const title = `${article.title} - ${article.category}`;
  
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${BASE_URL}/`,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": appSlug === "medortho" ? "MedOrtho" : appSlug,
          "item": `${BASE_URL}/${appSlug}`,
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
      "lastReviewed": article.lastUpdated === "Today" ? new Date().toISOString().split("T")[0] : article.lastUpdated,
      "aspect": [
        "Indications",
        "Clinical examination procedure",
        "Result interpretation",
        "Diagnostic accuracy"
      ],
      "isPartOf": {
        "@type": "WebSite",
        "name": "Exam Essentials",
        "url": BASE_URL,
      },
      "inLanguage": "en-IN",
    },
  ];

  // 3. MedicalPhysicalExam schema for Orthopedic Special Tests
  if (appSlug === "medortho") {
    const cleanUsedFor = stripHtml(article.usedFor);
    const cleanHowTo = stripHtml(article.howTo);
    const cleanResult = stripHtml(article.result);
    const cleanAccuracy = stripHtml(article.accuracy);

    schemas.push({
      "@context": "https://schema.org",
      "@type": "MedicalPhysicalExam",
      "name": article.title,
      "description": article.description || cleanUsedFor || `Details and clinical guide for the ${article.title} test.`,
      "bodyLocation": article.category,
      "purpose": cleanUsedFor,
      "howPerformed": cleanHowTo,
      "significance": cleanResult,
      "usedToDiagnose": {
        "@type": "MedicalCondition",
        "name": cleanUsedFor.length > 100 ? cleanUsedFor.substring(0, 97) + "..." : cleanUsedFor
      }
    });

    // 4. Dynamic FAQPage schema compiled from the actual test fields
    const faqs: { question: string; answer: string }[] = [];
    
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

    if (article.faqs && article.faqs.length > 0) {
      faqs.push(...article.faqs);
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
  } else if (article.faqs && article.faqs.length > 0) {
    // Fallback standard FAQPage for other apps
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.faqs.map((faq) => ({
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

