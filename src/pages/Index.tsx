import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhySection from "@/components/WhySection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Exam Essentials",
    "url": "https://examessentials.in",
    "logo": "https://examessentials.in/favicon.png",
    "description": "Premium handwritten notes for Class 11 & 12 students covering Physics, Chemistry, Maths, and Biology.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9460970342",
      "contactType": "customer service",
      "email": "examessentials.info@gmail.com"
    },
    "sameAs": [
      "https://wa.me/919460970342"
    ]
  };

  return (
    <>
      <SEOHead
        title="Exam Essentials | Premium Handwritten Notes for Class 11 & 12"
        description="Get premium handwritten notes for Class 11 & 12 students. Exam-focused, beautifully organized notes for Physics, Chemistry, Maths, and Biology. Made by toppers, for toppers."
        canonical="/"
        keywords="handwritten notes, class 11 notes, class 12 notes, CBSE notes, board exam notes, physics notes, chemistry notes, maths notes, biology notes, study materials, exam preparation"
        structuredData={structuredData}
      />

      <Navbar />
      <main>
        <HeroSection />
        <WhySection />
        <ProductsSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
