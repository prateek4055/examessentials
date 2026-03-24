import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Poster, posters } from "../data/posters";
import { CartProvider, useCart } from "../context/CartContext";
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
} from "lucide-react";

const BASE_URL = "https://examessentials.in";

const MedPosterDetailContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("A2");
  const [quantity, setQuantity] = useState(1);
  const [backPoster, setBackPoster] = useState<Poster | null>(null);

  const DOUBLE_SIDED_SURCHARGE = 200;

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

  const getPrice = (size: string) => {
    if (size === "A3") return poster.price.small;
    if (size === "A2") return poster.price.medium;
    if (size === "A1") return poster.price.large;
    return poster.price.medium;
  };

  const getUnitPrice = (size: string) => {
    const basePrice = getPrice(size);
    return backPoster ? basePrice + DOUBLE_SIDED_SURCHARGE : basePrice;
  };

  const handleWhatsAppOrder = () => {
    const unitPrice = getUnitPrice(selectedSize);
    const backLine = backPoster
      ? `🔄 Back Side: ${backPoster.title} (+₹${DOUBLE_SIDED_SURCHARGE} double-sided)\n`
      : "";
    const message = encodeURIComponent(
      `Hi! I want to order this poster:\n\n` +
        `📋 Product: ${poster.title}\n` +
        `📐 Size: ${selectedSize}\n` +
        backLine +
        `📦 Quantity: ${quantity}\n` +
        `💰 Total: ₹${unitPrice * quantity}\n\n` +
        `Please share payment details and delivery options.`
    );
    window.open(`https://wa.me/919460970342?text=${message}`, "_blank");
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
        title={`${poster.title} – Buy ${poster.category} Poster Online | MedPosterHub`}
        description={`${poster.description} Available in A3 (₹${poster.price.small}), A2 (₹${poster.price.medium}), A1 (₹${poster.price.large}). Premium 250gsm matte print. Order now from MedPosterHub.`}
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
            {/* 3D Flip Viewer */}
            <PosterFlipViewer
              frontPoster={poster}
              allPosters={posters}
              backPoster={backPoster}
              onBackPosterChange={setBackPoster}
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
                    <p className="text-sm text-slate-600">{poster.quality}</p>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Select Size
                </h3>
                <div className="flex gap-3">
                  {["A3", "A2", "A1"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div>{size}</div>
                      <div className="text-xs mt-1 font-normal">₹{backPoster ? getPrice(size) + DOUBLE_SIDED_SURCHARGE : getPrice(size)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Quantity
                </h3>
                <div className="flex items-center border border-slate-200 rounded-xl p-1 w-32">
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
                    <span className="text-4xl font-bold text-slate-900">
                      ₹{getUnitPrice(selectedSize) * quantity}
                    </span>
                    <span className="text-sm text-slate-400">Total</span>
                  </div>
                  {backPoster && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">₹{getPrice(selectedSize)} × {quantity}</span>
                      <span className="text-blue-600 font-semibold">+ ₹{DOUBLE_SIDED_SURCHARGE * quantity} double-sided</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 h-14 text-lg"
                    onClick={() => {
                      addToCart(poster, selectedSize, quantity, !!backPoster, backPoster?.title);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 rounded-xl border-green-600 text-green-700 hover:bg-green-50 h-14 text-lg"
                    onClick={handleWhatsAppOrder}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Order on WhatsApp
                  </Button>
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
                    <div className="aspect-[4/3] bg-slate-50 overflow-hidden">
                      <img
                        src={suggested.image}
                        alt={`${suggested.title} – Medical Poster`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
    <CartProvider>
      <MedPosterDetailContent />
    </CartProvider>
  );
};

export default MedPosterDetailPage;
