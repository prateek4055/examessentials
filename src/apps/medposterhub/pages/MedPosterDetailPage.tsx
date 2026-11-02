import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Poster, posters, PosterMaterial, calculateVariantPrice, MEDPOSTER_AMAZON_URL } from "../data/posters";
import { useCart } from "../context/CartContext";
import { MedPosterHeader } from "../components/MedPosterHeader";
import { MedFooter } from "../components/MedFooter";
import { CartDrawer } from "../components/CartDrawer";
import { StickyCartBar } from "../components/StickyCartBar";
import { PosterFlipViewer } from "../components/PosterFlipViewer";
import { ProductReviews } from "../components/ProductReviews";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  MessageCircle,
  Package,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  ShoppingBag as AmazonIcon,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = "https://examessentials.in";

const MedPosterDetailContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<"A3" | "A2" | "A1">("A2");
  const [selectedMaterial, setSelectedMaterial] = useState<PosterMaterial>("matte");
  const [quantity, setQuantity] = useState(1);

  const poster = posters.find((p) => p.slug === slug);

  if (!poster) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <SEOHead
          title="Poster Not Found | MedPosterHub"
          description="The poster you're looking for doesn't exist."
          noIndex={true}
        />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Poster Not Found</h1>
          <Button asChild variant="outline">
            <Link to="/medposterhub">Browse All Posters</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getPrice = (size: string, material: PosterMaterial = selectedMaterial) => {
    return calculateVariantPrice(poster.price, material, size);
  };

  const getUnitPrice = (size: string, material: PosterMaterial = selectedMaterial) => {
    return getPrice(size, material);
  };

  const handleWhatsAppOrder = () => {
    const unitPrice = getUnitPrice(selectedSize, selectedMaterial);
    const message = encodeURIComponent(
      `Hi! I want to order this poster:\n\n` +
        `📋 Product: ${poster.title}\n` +
        `🎨 Material: ${selectedMaterial.toUpperCase()}\n` +
        `📐 Size: ${selectedSize}\n` +
        `📦 Quantity: ${quantity}\n` +
        `💰 Total: ₹${unitPrice * quantity}\n\n` +
        `Please share payment details and delivery options.`
    );
    window.open(`https://wa.me/919460970342?text=${message}`, "_blank");
  };

  const handleAmazonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = poster.amazonUrl || MEDPOSTER_AMAZON_URL;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // Suggested combos
  const suggestedPosters = posters
    .filter((p) =>
      poster.comboSuggestions.some((suggestion) =>
        p.title.toLowerCase().includes(suggestion.toLowerCase().split(" ")[0])
      )
    )
    .filter((p) => p.id !== poster.id)
    .slice(0, 3);

  // Build SEO structured data
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: poster.title,
      description: poster.description,
      image: `${BASE_URL}${poster.image}`,
      sku: `MEDPOSTER-${poster.id}`,
      brand: {
        "@type": "Brand",
        name: "MedPosterHub by Exam Essentials",
      },
      category: `Medical Posters > ${poster.category}`,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: poster.price.small,
        highPrice: poster.price.large,
        offerCount: 3,
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "MedPosterHub by Exam Essentials",
        },
      },
      ...(poster.rating
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: poster.rating.toString(),
              reviewCount: (poster.reviewCount || 50).toString(),
              bestRating: "5",
              worstRating: "1",
            },
          }
        : {}),
    },
    {
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
          name: "MedPosterHub",
          item: `${BASE_URL}/medposterhub`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: poster.title,
          item: `${BASE_URL}/medposterhub/${poster.slug}`,
        },
      ],
    },
  ];

  const titleKeywords = poster.title.toLowerCase().replace(/[–—]/g, "").replace(/\s+/g, " ");
  const seoKeywords = `${titleKeywords}, ${poster.category.toLowerCase()} poster, buy ${titleKeywords} poster, ${poster.category.toLowerCase()} chart for clinic, medical poster ${poster.category.toLowerCase()}, anatomy poster India, clinic wall chart, medical education poster, ${poster.title} A1 A2 A3`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <SEOHead
        title={poster.seoTitle || `${poster.title} – Buy ${poster.category} Poster Online | MedPosterHub`}
        description={poster.seoDescription || `${poster.description} Available in A3 (₹699), A2 (₹899), Framed & Acrylic editions. Premium 300 GSM archival print. Worldwide shipping available. Order now from MedPosterHub.`}
        canonical={`/medposterhub/${poster.slug}`}
        keywords={seoKeywords}
        ogImage={`${BASE_URL}${poster.image}`}
        ogType="product"
        structuredData={structuredData}
        productPrice={poster.price.small}
      />

      <MedPosterHeader searchQuery="" setSearchQuery={() => {}} />
      <CartDrawer />
      <StickyCartBar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/medposterhub" className="hover:text-slate-900 transition-colors">MedPosterHub</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium truncate">{poster.title}</span>
          </nav>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Poster Preview Viewer */}
            <PosterFlipViewer
              frontPoster={poster}
            />

            {/* Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                  {poster.category}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {poster.title}
              </h1>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {poster.description}
              </p>

              {/* Quality */}
              <div className="rounded-xl bg-slate-50 p-4 mb-6 border border-slate-100">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Print Quality</h3>
                    <p className="text-sm text-slate-600">
                      {selectedMaterial === "framed"
                        ? "Premium 300 GSM archival print mounted inside a high-durability gallery frame."
                        : selectedMaterial === "acrylic"
                        ? "Direct high-resolution UV printing on luxury 3mm crystal-clear acrylic glass with metallic wall studs."
                        : "Premium heavyweight 300 GSM archival matte paper with rich, UV-resistant inks."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Material Format Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Select Material Format
                  </h3>
                  <span className="text-xs font-bold text-blue-600 capitalize">
                    {selectedMaterial === "matte" && "300 GSM Heavyweight Matte"}
                    {selectedMaterial === "framed" && "Wood Gallery Frame"}
                    {selectedMaterial === "acrylic" && "Ultra HD Acrylic Glass"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "matte" as const, label: "300 GSM Poster", note: "Roll in tube" },
                    { key: "framed" as const, label: "Gallery Framed", note: "Ready to hang" },
                    { key: "acrylic" as const, label: "Ultra Acrylic", note: "Luxury glass glow" },
                  ].map((mat) => (
                    <button
                      key={mat.key}
                      type="button"
                      onClick={() => setSelectedMaterial(mat.key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedMaterial === mat.key
                          ? "border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">{mat.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{mat.note}</div>
                      <div className="text-xs font-bold text-blue-700 mt-1">
                        ₹{getPrice(selectedSize, mat.key)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Select Size
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "A3" as const, label: "A3", dimension: "11.7\" × 16.5\"" },
                    { 
                      key: "A2" as const, 
                      label: selectedMaterial === "acrylic" ? "16\" × 24\"" : "A2", 
                      dimension: selectedMaterial === "acrylic" ? "Acrylic Wall Size" : "18\" × 24\"" 
                    },
                  ].map((sizeItem) => (
                    <button
                      key={sizeItem.key}
                      onClick={() => setSelectedSize(sizeItem.key)}
                      className={`py-3 px-4 rounded-xl border-2 text-left transition-all ${
                        selectedSize === sizeItem.key
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="text-sm font-bold">{sizeItem.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{sizeItem.dimension}</div>
                      <div className="text-xs font-bold text-blue-700 mt-1">
                        ₹{getUnitPrice(sizeItem.key, selectedMaterial)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Quantity
                </h3>
                <div className="flex items-center border border-slate-200 rounded-xl p-1 w-32 bg-white">
                  <button
                    className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="flex-1 text-center font-bold text-slate-900">{quantity}</span>
                  <button
                    className="p-2 hover:bg-slate-100 rounded-lg"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="flex flex-col gap-1 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      ₹{getUnitPrice(selectedSize, selectedMaterial) * quantity}
                    </span>
                    <span className="text-sm text-slate-400 capitalize">
                      ({selectedMaterial} • {selectedSize})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 h-13 text-base sm:text-lg font-bold"
                    onClick={() => {
                      addToCart(poster, selectedSize, quantity, selectedMaterial);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 rounded-xl border-blue-600 text-blue-700 hover:bg-blue-50 h-13 text-base sm:text-lg font-bold"
                    onClick={() => {
                      addToCart(poster, selectedSize, quantity, selectedMaterial);
                      navigate("/medposterhub/checkout");
                    }}
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Amazon Trust Banner & Quick Link */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded text-xs">
                      Amazon
                    </span>
                    <span>Available on Amazon India</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAmazonClick}
                    className="h-8 text-xs font-bold border-slate-300 text-slate-800 bg-white hover:bg-slate-100 flex items-center gap-1"
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>

                {/* Trust & Policies */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Custom Printed to Order</span>
                      <span className="block text-[11px] text-slate-500">Non-returnable archival print</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Prepaid Only on Website</span>
                      <span className="block text-[11px] text-slate-500">Instant UPI, Card & Netbanking</span>
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <Clock className="w-5 h-5 text-slate-600 flex-shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        Dispatch: {selectedMaterial === "acrylic" ? "4-5 Business Days" : "2-3 Business Days"}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        Estimated Delivery: 3-5 days across India in reinforced PVC cylinder
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Reviews */}
          <ProductReviews />

          {/* Related Posters */}
          {suggestedPosters.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center gap-2 mb-8">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Complete Your Collection</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedPosters.map((suggested) => (
                  <Link
                    key={suggested.id}
                    to={`/medposterhub/${suggested.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] bg-slate-50 p-2 overflow-hidden flex items-center justify-center">
                      <img
                        src={suggested.image}
                        alt={`${suggested.title} – Medical Poster`}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {suggested.category}
                      </Badge>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {suggested.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        From ₹{suggested.price.small}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <MedFooter />
    </div>
  );
};

const MedPosterDetailPage = () => {
  return (
    <MedPosterDetailContent />
  );
};

export default MedPosterDetailPage;
