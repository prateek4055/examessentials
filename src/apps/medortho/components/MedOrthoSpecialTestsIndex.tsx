import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Stethoscope, Heart, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAppBySlug } from "../../medical/data/medicalAppsData";

interface TestItem {
  id: string;
  category: string;
  subCategory?: string;
  title: string;
  evidence?: string;
  usedFor?: string;
  howTo?: string;
  result?: string;
  accuracy?: string;
  image1?: string;
  youtube?: string;
}

interface MedOrthoSpecialTestsIndexProps {
  initialCategory?: string; // "All", "Shoulder", "Knee", etc.
  isCategoryLocked?: boolean;
}

const CATEGORIES_MAPPING: Record<string, string> = {
  "shoulder": "Shoulder",
  "knee": "Knee",
  "hip": "Hip",
  "spine": "Spine",
  "elbow": "Elbow",
  "wrist-hand": "Wrist & Hand",
  "wrist": "Wrist & Hand",
  "ankle-foot": "Ankle & Foot",
  "ankle": "Ankle & Foot",
  "neurological": "Neurological",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Shoulder": "Master clinical shoulder examinations including tests for rotator cuff tears, subacromial impingement syndrome, labral tears (SLAP), and shoulder instability.",
  "Knee": "Explore diagnostic tests for anterior cruciate ligament (ACL) tears, posterior cruciate ligament (PCL) injuries, meniscal tears, and patellofemoral pain syndrome.",
  "Spine": "Learn physical assessments for cervical radiculopathy, lumbar disc herniation, sciatica, and sacroiliac joint dysfunction.",
  "Hip": "Access diagnostic guidelines for hip labral tears, femoroacetabular impingement (FAI), and osteoarthritis.",
  "Elbow": "Study tests for lateral epicondylitis (tennis elbow), medial epicondylitis (golfer's elbow), and ulnar collateral ligament instability.",
  "Wrist & Hand": "Learn clinical examinations for carpal tunnel syndrome, De Quervain's tenosynovitis, and TFCC lesions.",
  "Ankle & Foot": "Access tests for Achilles tendon rupture, ankle sprains/instability, and plantar fasciitis.",
  "Neurological": "Review neurological and nerve entrapment signs including thoracic outlet syndrome (TOS), tarsal tunnel, and peripheral nerve tests.",
  "All": "Browse all orthopedic special tests. Search by joint region, test name, or pathology.",
};

const MedOrthoSpecialTestsIndex: React.FC<MedOrthoSpecialTestsIndexProps> = ({
  initialCategory = "All",
  isCategoryLocked = false,
}) => {
  const app = getAppBySlug("medortho");
  const [tests, setTests] = useState<TestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  // Sync with initialCategory prop
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

  // Load tests from json database
  useEffect(() => {
    setLoading(true);
    fetch("/medortho/tests/tests_data.json")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load tests");
      })
      .then((data) => {
        setTests(data);
      })
      .catch((err) => console.error("Error loading tests_data.json:", err))
      .finally(() => setLoading(false));
  }, []);

  // Normalise category strings
  const getNormalizedCategory = (cat: string) => {
    return CATEGORIES_MAPPING[cat.toLowerCase()] || cat;
  };

  // Category counts computation helper
  const getCategoryCount = (catName: string) => {
    if (!tests || tests.length === 0) return 0;
    const cat = catName.toLowerCase();
    if (cat === "all") return tests.length;
    if (cat === "neurological") {
      return tests.filter(
        (t) =>
          (t.subCategory && t.subCategory.toLowerCase().includes("neuro")) ||
          (t.category && t.category.toLowerCase().includes("neuro"))
      ).length;
    }
    const targetCat = CATEGORIES_MAPPING[cat] || cat;
    return tests.filter((t) => t.category.toLowerCase() === targetCat.toLowerCase()).length;
  };

  // Filter tests based on category and search query
  const getFilteredTests = () => {
    let list = tests;

    // 1. Category Filter
    const cat = selectedCategory.toLowerCase();
    if (cat !== "all") {
      if (cat === "neurological") {
        list = list.filter(
          (t) =>
            (t.subCategory && t.subCategory.toLowerCase().includes("neuro")) ||
            (t.category && t.category.toLowerCase().includes("neuro"))
        );
      } else {
        const targetCat = CATEGORIES_MAPPING[cat] || cat;
        list = list.filter((t) => t.category.toLowerCase() === targetCat.toLowerCase());
      }
    }

    // 2. Search Query Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          (t.title || "").toLowerCase().includes(q) ||
          (t.category || "").toLowerCase().includes(q) ||
          (t.subCategory || "").toLowerCase().includes(q) ||
          (t.usedFor || "").toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filteredTests = getFilteredTests();
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);

  // Paginated tests
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Categories list for filtering chips
  const categoryFilters = [
    "All",
    "Shoulder",
    "Knee",
    "Spine",
    "Hip",
    "Elbow",
    "Wrist & Hand",
    "Ankle & Foot",
    "Neurological",
  ];

  const currentCategoryDesc = CATEGORY_DESCRIPTIONS[selectedCategory] || CATEGORY_DESCRIPTIONS["All"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: app?.theme.primary, borderBottomColor: app?.theme.primary }}></div>
        <p className="mt-4 text-gray-500 font-medium">Loading clinical directory...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Directory Header */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white leading-tight">
          {selectedCategory === "All" ? "Orthopedic Special Tests" : `${selectedCategory} Examination`}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-3xl leading-relaxed">
          {currentCategoryDesc}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-6 mb-10">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search special tests by name or pathology..."
            className="pl-10 h-11 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Pills (Hide if locked to specific category) */}
        {!isCategoryLocked && (
          <div className="flex flex-wrap gap-2 pb-2">
            {categoryFilters.map((cat) => {
              const count = getCategoryCount(cat);
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    isSelected
                      ? "shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-800"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${app?.theme.accent}15`,
                          color: app?.theme.primary,
                          borderColor: `${app?.theme.accent}40`,
                        }
                      : {}
                  }
                >
                  {cat} <span className="ml-1 opacity-60 font-medium">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Grid */}
      {paginatedTests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedTests.map((t) => {
              const testSlug = (t.title || "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

              // Get image filename
              const filename = t.image1 ? t.image1.split("/").pop() : "";
              const imgUrl = t.image1 ? `/medortho/tests/images/${filename}` : null;

              return (
                <Link
                  key={t.id}
                  to={`/medortho/tests/${testSlug}`}
                  className="group flex flex-col h-full bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/20 transition-all duration-300"
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-44 bg-slate-50 dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to illustration card
                          (e.target as HTMLImageElement).style.display = "none";
                          const fallbackNode = e.currentTarget.parentNode?.querySelector(".fallback-graphic");
                          if (fallbackNode) (fallbackNode as HTMLElement).style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback Clinical Graphic Illustration */}
                    <div
                      className={`fallback-graphic absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-zinc-900 dark:to-zinc-950 flex flex-col items-center justify-center p-6 ${
                        imgUrl ? "hidden" : "flex"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${app?.theme.accent}15`, color: app?.theme.primary }}>
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider opacity-85" style={{ color: app?.theme.primary }}>
                        {t.category} Assessment
                      </span>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-gray-300 shadow-sm">
                        {t.subCategory || t.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {t.title}
                    </h3>
                    <p
                      className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{ __html: t.usedFor || "" }}
                    />
                    
                    {/* Diagnostic Quick Tag */}
                    {t.accuracy && (t.accuracy.toLowerCase().includes("sens") || t.accuracy.toLowerCase().includes("spec")) && (
                      <div className="mt-auto pt-3 border-t border-gray-50 dark:border-zinc-900/50 flex items-center justify-between text-[11px] font-semibold text-gray-400">
                        <span>Accuracy Data Available</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-55/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                          Evidence
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pb-16">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-gray-500 hover:bg-slate-50 dark:hover:bg-zinc-900 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Show sliding window of pages
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                        currentPage === pageNum
                          ? "text-white"
                          : "border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                      }`}
                      style={
                        currentPage === pageNum
                          ? {
                              backgroundColor: app?.theme.primary,
                              boxShadow: `0 4px 12px ${app?.theme.primary}25`,
                            }
                          : {}
                      }
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === 2 ||
                  pageNum === totalPages - 1
                ) {
                  return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                }
                return null;
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-gray-500 hover:bg-slate-50 dark:hover:bg-zinc-900 disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-slate-50/50 dark:bg-zinc-900/10 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
          <Stethoscope className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tests match search criteria</h4>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Try correcting the spelling or clearing filters to see all clinical tests.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-6 px-5 py-2 text-white text-xs font-bold rounded-full transition-all hover:opacity-90"
            style={{ backgroundColor: app?.theme.primary }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MedOrthoSpecialTestsIndex;
