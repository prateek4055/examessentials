import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  noIndex?: boolean;
  structuredData?: object;
  keywords?: string;
  productPrice?: number;
  productAvailability?: string;
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
}: SEOHeadProps) => {
  const baseUrl = "https://examessentials.in";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : undefined;
  const fullTitle = title.includes("Exam Essentials") ? title : `${title} | Exam Essentials`;
  
  // Default keywords for all pages
  const defaultKeywords = "handwritten notes, class 11 notes, class 12 notes, CBSE notes, board exam notes, physics notes, chemistry notes, maths notes, biology notes, NEET preparation, JEE preparation, study material India";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      
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
      <meta property="og:description" content={description} />
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
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
