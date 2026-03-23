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
}: SEOHeadProps) => {
  const baseUrl = "https://examessentials.in";
  
  // Clean canonical URL - remove query parameters for cleaner indexing
  // Default to current pathname if no canonical is provided
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const cleanCanonical = (canonical || currentPath).split('?')[0];
  const fullCanonical = `${baseUrl}${cleanCanonical === '/' ? '' : cleanCanonical}`;
  
  // Ensure title is under 60 chars for optimal SEO
  const baseTitleWithSuffix = title.includes("Exam Essentials") ? title : `${title} | Exam Essentials`;
  const fullTitle = baseTitleWithSuffix.length > 60 ? title : baseTitleWithSuffix;
  
  // Ensure description is under 160 chars
  const truncatedDescription = description.length > 160 ? description.slice(0, 157) + "..." : description;
  
  // Default keywords for all pages (skip for medical app pages that have their own domain-specific keywords)
  const defaultKeywords = "handwritten notes, class 11 notes, class 12 notes, CBSE notes, board exam notes, physics notes, chemistry notes, maths notes, biology notes, NEET preparation, JEE preparation, study material India";
  let finalKeywords: string;
  if (skipDefaultKeywords) {
    finalKeywords = keywords || "";
  } else {
    finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  }

  // Normalize structured data to array for multi-schema support
  const structuredDataArray = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={truncatedDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="Exam Essentials" />
      <meta property="og:locale" content="en_IN" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      
      {/* Product specific OG tags */}
      {ogType === "product" && productPrice && (
        <>
          <meta property="product:price:amount" content={String(productPrice)} />
          <meta property="product:price:currency" content="INR" />
          <meta property="product:availability" content={productAvailability} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ExamEssentials" />
      <meta name="twitter:creator" content="@ExamEssentials" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data — supports multiple schemas */}
      {structuredDataArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;

