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
