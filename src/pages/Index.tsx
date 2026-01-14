import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EcosystemSection from "@/components/EcosystemSection";
import WhySection from "@/components/WhySection";
import ProductsSection from "@/components/ProductsSection";
import FAQSection, { faqStructuredData } from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Comprehensive structured data for homepage
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Exam Essentials",
      "alternateName": "ExamEssentials",
      "url": "https://examessentials.in",
      "logo": "https://examessentials.in/logo.png",
      "image": "https://examessentials.in/og-image.png",
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
      "url": "https://examessentials.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://examessentials.in/products?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Exam Essentials",
      "url": "https://examessentials.in",
      "description": "Premium educational resources and handwritten notes for Indian students",
      "educationalCredentialAwarded": "Study Materials",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Handwritten Notes",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Class 11 Notes",
            "itemListElement": ["Physics Notes", "Chemistry Notes", "Maths Notes", "Biology Notes"]
          },
          {
            "@type": "OfferCatalog",
            "name": "Class 12 Notes",
            "itemListElement": ["Physics Notes", "Chemistry Notes", "Maths Notes", "Biology Notes"]
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://examessentials.in/"
        }
      ]
    }
  ];

  // Combine all structured data including FAQ
  const allStructuredData = [...structuredData, faqStructuredData];

  return (
    <>
      <SEOHead
        title="Exam Essentials | Premium Handwritten Notes for Class 11 & 12 | CBSE, NEET, JEE"
        description="India's #1 handwritten notes for Class 11 & 12 students. Exam-focused Physics, Chemistry, Maths & Biology notes by toppers. Perfect for CBSE Boards, NEET & JEE preparation. Download premium study materials now!"
        canonical="/"
        keywords="best handwritten notes India, topper notes class 11, topper notes class 12, CBSE board exam notes, NEET notes PDF, JEE notes PDF, physics handwritten notes, chemistry handwritten notes, biology handwritten notes, maths handwritten notes, study material for boards"
        structuredData={allStructuredData}
      />

      <Navbar />
      <main>
        <HeroSection />
        <section id="ecosystem">
          <EcosystemSection />
        </section>
        <WhySection />
        <ProductsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
