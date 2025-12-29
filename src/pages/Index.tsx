import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhySection from "@/components/WhySection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Exam Essentials | Premium Handwritten Notes for Class 11 & 12</title>
        <meta
          name="description"
          content="Get premium handwritten notes for Class 11 & 12 students. Exam-focused, beautifully organized notes for Physics, Chemistry, Maths, and Biology."
        />
        <meta
          name="keywords"
          content="handwritten notes, class 11 notes, class 12 notes, CBSE notes, board exam notes, physics notes, chemistry notes"
        />
      </Helmet>

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
