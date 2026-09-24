import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  noIndex?: boolean;
  structuredData?: object | object[];
  keywords?: string;
  productPrice?: number;
  productAvailability?: string;
  skipDefaultKeywords?: boolean;
  /** Pass true for MedOrtho/medical pages to disable India geo lock */
  isInternational?: boolean;
  /** ISO date string for article published/modified time */
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  /** Article section/category for og:article */
  articleSection?: string;
  /** Explicit og:image dimensions if known */
  ogImageWidth?: string;
  ogImageHeight?: string;
}

const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = "https://examessentials.in/og-image.png",
  ogType = "website",
  noIndex = false,
  structuredData,
  keywords,
  productPrice,
  productAvailability = "InStock",
  skipDefaultKeywords = false,
  isInternational = false,
  articlePublishedTime,
  articleModifiedTime,
  articleSection,
  ogImageWidth = "1200",
  ogImageHeight = "630",
}: SEOHeadProps) => {
  const baseUrl = "https://examessentials.in";

  // Clean canonical URL - remove query parameters for cleaner indexing
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const cleanCanonical = (canonical || currentPath).split("?")[0];
  const normalizedCanonical =
    cleanCanonical.length > 1 && cleanCanonical.endsWith("/")
      ? cleanCanonical.slice(0, -1)
      : cleanCanonical;

  let fullCanonical = "";
  if (normalizedCanonical) {
    if (
      normalizedCanonical.startsWith("http://") ||
      normalizedCanonical.startsWith("https://")
    ) {
      fullCanonical = normalizedCanonical;
    } else {
      const prefixedPath = normalizedCanonical.startsWith("/")
        ? normalizedCanonical
        : `/${normalizedCanonical}`;
      fullCanonical = `${baseUrl}${prefixedPath === "/" ? "" : prefixedPath}`;
    }
  }

  // Build title: append suffix only if not already present, keep under 60 chars
  const suffix = " | Exam Essentials";
  const titleWithSuffix = title.includes("Exam Essentials") ? title : `${title}${suffix}`;
  // Only truncate if adding suffix pushed it over 65 chars; prefer full title for context
  const fullTitle = titleWithSuffix.length > 65 ? title : titleWithSuffix;

  // Description: ensure under 160 chars
  const truncatedDescription =
    description.length > 160 ? description.slice(0, 157) + "..." : description;

  // Keywords: medical pages skip generic India-study keywords
  const defaultKeywords =
    "handwritten notes, class 11 notes, class 12 notes, CBSE notes, board exam notes, physics notes, chemistry notes, maths notes, biology notes, NEET preparation, JEE preparation, study material India";
  let finalKeywords: string;
  if (skipDefaultKeywords) {
    finalKeywords = keywords || "";
  } else {
    finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  }

  // OG locale: international pages use en_US, India-specific use en_IN
  const ogLocale = isInternational ? "en_US" : "en_IN";

  // Normalize structured data to array
  const structuredDataArray = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {/* ── Primary Meta Tags ───────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={truncatedDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}

      {/* ── Language & Geo ──────────────────────────────────────── */}
      <meta name="language" content="en" />
      <meta httpEquiv="content-language" content="en" />
      {/* Only apply India geo lock for non-international pages */}
      {!isInternational && <meta name="geo.region" content="IN" />}
      {!isInternational && <meta name="geo.placename" content="India" />}

      {/* ── Robots ──────────────────────────────────────────────── */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* ── Canonical URL ───────────────────────────────────────── */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* ── hreflang: international medical pages ───────────────── */}
      {isInternational && fullCanonical && (
        <>
          <link rel="alternate" hrefLang="en" href={fullCanonical} />
          <link rel="alternate" hrefLang="x-default" href={fullCanonical} />
        </>
      )}

      {/* ── Open Graph ──────────────────────────────────────────── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={ogImageWidth} />
      <meta property="og:image:height" content={ogImageHeight} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="Exam Essentials" />
      <meta property="og:locale" content={ogLocale} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}

      {/* ── Article-specific OG tags ────────────────────────────── */}
      {ogType === "article" && (
        <>
          {articlePublishedTime && (
            <meta property="article:published_time" content={articlePublishedTime} />
          )}
          {articleModifiedTime && (
            <meta property="article:modified_time" content={articleModifiedTime} />
          )}
          {articleSection && (
            <meta property="article:section" content={articleSection} />
          )}
          <meta property="article:author" content="https://examessentials.in/about" />
        </>
      )}

      {/* ── Product-specific OG tags ────────────────────────────── */}
      {ogType === "product" && productPrice && (
        <>
          <meta property="product:price:amount" content={String(productPrice)} />
          <meta property="product:price:currency" content="INR" />
          <meta property="product:availability" content={productAvailability} />
        </>
      )}

      {/* ── Twitter Card ────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ExamEssentials" />
      <meta name="twitter:creator" content="@ExamEssentials" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      {fullCanonical && <meta name="twitter:url" content={fullCanonical} />}

      {/* ── Structured Data — supports multiple schemas ──────────── */}
      {structuredDataArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
