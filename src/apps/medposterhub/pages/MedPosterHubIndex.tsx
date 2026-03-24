import { useState } from "react";
import { posters, Poster } from "../data/posters";
import { CartProvider } from "../context/CartContext";
import { MedPosterHeader } from "../components/MedPosterHeader";
import { HeroSection } from "../components/HeroSection";
import { ProductGrid } from "../components/ProductGrid";
import { CategoryCard } from "../components/CategoryCard";
import { FeaturesSection } from "../components/FeaturesSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { CartDrawer } from "../components/CartDrawer";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { MedFooter } from "../components/MedFooter";
import { BuyerPersonas } from "../components/BuyerPersonas";

import { StickyCartBar } from "../components/StickyCartBar";
import SEOHead from "@/components/SEOHead";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MedPosterHubContent = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Derive categories
  const categories = ["All", ...Array.from(new Set(posters.map((p) => p.category))).sort()];

  const filteredPosters = posters.filter((poster) => {
    const matchesCategory = selectedCategory === "All" || poster.category === selectedCategory;
    const matchesSearch = poster.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poster.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Build structured data from actual poster products
  const posterStructuredData = [
    // 1. CollectionPage with product offers
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "MedPosterHub – Premium Medical Posters",
      "description": "Shop 20+ premium medical anatomy posters for clinics, hospitals, and medical students. High-resolution, medically accurate charts covering Anatomy, Orthopedics, and Neurology.",
      "url": "https://examessentials.in/medposterhub",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": posters.length,
        "itemListElement": posters.map((poster, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "Product",
            "name": poster.title,
            "description": poster.description,
            "image": `https://examessentials.in${poster.image}`,
            "sku": `MEDPOSTER-${poster.id}`,
            "brand": {
              "@type": "Brand",
              "name": "MedPosterHub by Exam Essentials"
            },
            "category": `Medical Posters > ${poster.category}`,
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": poster.price.small,
              "highPrice": poster.price.large,
              "offerCount": 3,
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "MedPosterHub"
              }
            },
            ...(poster.rating ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": poster.rating.toString(),
                "reviewCount": (poster.reviewCount || 50).toString(),
                "bestRating": "5",
                "worstRating": "1"
              }
            } : {})
          }
        }))
      }
    },
    // 2. BreadcrumbList
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://examessentials.in/" },
        { "@type": "ListItem", "position": 2, "name": "MedPosterHub", "item": "https://examessentials.in/medposterhub" }
      ]
    },
    // 3. FAQPage for rich snippets
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What sizes are the medical posters available in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All MedPosterHub posters are available in three standard sizes: A3 (₹299), A2 (₹399), and A1 (₹499). Each is printed on premium 250gsm matte paper with UV-resistant inks for long-lasting display."
          }
        },
        {
          "@type": "Question",
          "name": "Are MedPosterHub posters suitable for clinics and hospitals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our posters are specifically designed for medical professionals. They are used in physiotherapy clinics, ortho OPDs, neuro rehab centres, gyms, and medical colleges across India. Each poster is medically accurate and professionally illustrated."
          }
        },
        {
          "@type": "Question",
          "name": "What categories of medical posters do you offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer posters across three main categories: Anatomy (Muscular System, Skeletal System, Nervous System, Circulatory, Digestive, Endocrine, Respiratory, Lymphatic, Reproductive Systems), Neurology (Cranial Nerves, Dermatomes, Brain Anatomy), and Orthopedics (Joint Ligaments, Spine Disorders, Shoulder/Knee/Hip Anatomy & Injuries)."
          }
        },
        {
          "@type": "Question",
          "name": "How do I order medical posters in bulk?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For bulk orders of 10+ posters, contact us on WhatsApp at +91 94609 70342 for special pricing and combo discounts. We offer custom packages for clinics setting up new practices."
          }
        },
        {
          "@type": "Question",
          "name": "What is the print quality of MedPosterHub posters?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All posters are printed on premium 250gsm matte paper using UV-resistant inks. This ensures vibrant colours that last for years without fading, even in well-lit clinic environments."
          }
        }
      ]
    },
    // 4. Organization
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MedPosterHub by Exam Essentials",
      "url": "https://examessentials.in/medposterhub",
      "parentOrganization": {
        "@type": "Organization",
        "name": "Exam Essentials",
        "url": "https://examessentials.in"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-94609-70342",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <SEOHead
        title="MedPosterHub – Buy Medical Anatomy Posters Online | Clinic & Hospital Charts India"
        description="Shop 20+ premium medical anatomy posters for hospitals, clinics & students. High-resolution Anatomy, Orthopedics & Neurology charts on 250gsm matte paper. Sizes A3, A2, A1 starting ₹299. Trusted by 100+ clinics across India."
        canonical="/medposterhub"
        keywords="medical posters, anatomy posters for clinic, buy medical charts online India, anatomy chart A1 A2 A3, ortho clinic posters, neuro anatomy poster, muscular system poster, skeletal system chart, physiotherapy clinic posters, hospital wall charts, medical education posters, dermatomes poster, spine anatomy chart, knee anatomy poster, shoulder anatomy poster, medical posters for students, clinic decoration, OPD posters India, MedPosterHub"
        structuredData={posterStructuredData}
        ogType="website"
      />

      <MedPosterHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CartDrawer />
      <StickyCartBar />

      <main className="pt-20">
        <HeroSection />

        <BuyerPersonas />

        {/* Sticky Category Filter */}
        <section id="products" className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm transition-all">
          <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 min-w-max justify-start md:justify-center px-2 py-1">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat}
                  label={cat}
                  isActive={selectedCategory === cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    window.scrollTo({ top: document.getElementById('product-grid')?.offsetTop! - 180, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section id="product-grid" className="py-16 bg-[#F8FAFC] min-h-[600px]">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {selectedCategory === "All" ? "Bestselling Collection" : `${selectedCategory} Collection`}
                </h2>
                <p className="text-slate-500 mt-2 font-medium">
                  Showing {filteredPosters.length} premium designs
                </p>
              </div>
            </div>

            <ProductGrid
              products={filteredPosters}
              onViewDetails={setSelectedPoster}
            />
          </div>
        </section>

        {/* Order Process / CTA */}
        <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Upgrade Your Clinic?</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join 100+ innovative clinics using our posters to educate patients and improve outcomes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                size="lg"
                className="rounded-full bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 text-lg shadow-xl shadow-slate-900/50 hover:scale-105 transition-transform font-bold"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                className="rounded-full bg-blue-600 text-white hover:bg-blue-700 h-14 px-10 text-lg font-medium shadow-lg shadow-blue-900/50"
                onClick={() => window.open("https://wa.me/919460970342", "_blank")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </section>

        <TestimonialsSection />



        <FeaturesSection />

      </main>

      <MedFooter />

      <ProductDetailModal
        poster={selectedPoster}
        isOpen={!!selectedPoster}
        onClose={() => setSelectedPoster(null)}
      />

      {/* Floating WhatsApp fixed bottom right - REMOVED per user request
      <div className="fixed bottom-24 md:bottom-8 right-6 z-40">
        <button
          onClick={() => window.open("https://wa.me/919460970342", "_blank")}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group ring-4 ring-white/30"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold pl-0 group-hover:pl-2">Chat with us</span>
        </button>
      </div> */
      }
    </div>
  );
};

const MedPosterHubIndex = () => {
  return (
    <CartProvider>
      <MedPosterHubContent />
    </CartProvider>
  )
}

export default MedPosterHubIndex;
