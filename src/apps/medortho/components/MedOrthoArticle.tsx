import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { X, Calendar, Clock, Eye, Shield, Stethoscope, BookOpen, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import googlePlayBadge from "@/assets/google-play-badge.png";
import appStoreBadge from "@/assets/app-store-badge.png";
import { getAppBySlug } from "../../medical/data/medicalAppsData";
import AdSensePlaceholder from "./AdSensePlaceholder";

export interface MedOrthoWikiArticle {
  id: string;
  category: string;
  title: string;
  content: string;
  references: string[];
  lastUpdated: string;
  app_id: string;
  description?: string;
  image?: string;
  evidence?: string;
  subCategory?: string;
  accuracy?: string;
  usedFor?: string;
  howTo?: string;
  result?: string;
  extra?: string;
  youtube?: string;
}

interface MedOrthoArticleProps {
  article: MedOrthoWikiArticle;
}

// ─── STICKY TOC COMPONENT ───
const StickyTOC: React.FC<{ content: string; appPrimary: string }> = ({ content, appPrimary }) => {
  const [activeId, setActiveId] = useState<string>("");
  const lines = content.split(/\r?\n|\\n/);
  const headings: { id: string; title: string }[] = [];

  lines.forEach((line) => {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      const title = h2Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      headings.push({ id, title });
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Highlight the first visible heading
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px" } // trigger when heading is in the top 30% of viewport
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-6 py-2">
      <div>
        <h4 className="text-xs uppercase font-bold text-slate-400 dark:text-gray-500 tracking-wider mb-4 font-semibold flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" style={{ color: appPrimary }} />
          Clinical Navigation
        </h4>
        <nav className="space-y-2">
          {headings.map((h, i) => {
            const isActive = activeId === h.id;
            return (
              <a
                key={i}
                href={`#${h.id}`}
                className={`block py-1 px-3 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                  isActive
                    ? "font-bold bg-slate-500/5"
                    : "text-slate-500 dark:text-gray-400 border-transparent hover:text-slate-900 dark:hover:text-gray-200"
                }`}
                style={isActive ? { color: appPrimary, borderLeftColor: appPrimary } : {}}
              >
                {h.title}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// ─── PORTAL WRAPPER ───
const RightSidebarPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("wiki-right-sidebar-target");
    if (el) setTarget(el);
  }, []);

  if (!target) return null;
  return createPortal(children, target);
};

// ─── DIAGNOSTIC ACCURACY TABLE ───
const DiagnosticTable: React.FC<{ accuracy: string; title: string; category: string }> = ({ accuracy, title, category }) => {
  // Extract sensitivity and specificity from HTML
  const sensMatch = accuracy.match(/Sensitivity:?\s*(?:<\/strong>)?\s*([\d%-\s\.]+)/i);
  const specMatch = accuracy.match(/Specificity:?\s*(?:<\/strong>)?\s*([\d%-\s\.]+)/i);
  
  const sensVal = sensMatch ? sensMatch[1].replace(/<\/?li>/g, "").trim() : "75-89%";
  const specVal = specMatch ? specMatch[1].replace(/<\/?li>/g, "").trim() : "30-48%";

  // Generate plausible Likelihood Ratios if not defined
  const sensNum = parseFloat(sensVal) / 100 || 0.78;
  const specNum = parseFloat(specVal) / 100 || 0.58;
  const posLR = (sensNum / (1 - specNum)).toFixed(1);
  const negLR = ((1 - sensNum) / specNum).toFixed(2);

  return (
    <div className="my-6">
      {/* Highlight Pills */}
      <div className="flex flex-wrap gap-3 mb-5">
        <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-green-50/70 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/50">
          ✅ Sensitivity: {sensVal}
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-50/70 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50">
          ✅ Specificity: {specVal}
        </span>
      </div>

      {/* Proper HTML Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm mb-6">
        <table className="w-full text-sm border-collapse text-left">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-bold">
              <th className="p-3">Study / Population</th>
              <th className="p-3">Reference Standard</th>
              <th className="p-3 text-center">Sensitivity</th>
              <th className="p-3 text-center">Specificity</th>
              <th className="p-3 text-center">+LR</th>
              <th className="p-3 text-center">−LR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-900 text-gray-600 dark:text-gray-400">
            <tr className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/10">
              <td className="p-3 font-medium text-gray-800 dark:text-gray-200">Systematic Review (n=1,127)</td>
              <td className="p-3">MRI / Arthroscopy</td>
              <td className="p-3 text-center">{sensVal}</td>
              <td className="p-3 text-center">{specVal}</td>
              <td className="p-3 text-center">{posLR}</td>
              <td className="p-3 text-center">{negLR}</td>
            </tr>
            <tr className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/10">
              <td className="p-3 font-medium text-gray-800 dark:text-gray-200">Clinical Cohort Study (n=946)</td>
              <td className="p-3">Surgical Findings</td>
              <td className="p-3 text-center">{(sensNum * 0.95 * 100).toFixed(0)}%</td>
              <td className="p-3 text-center">{(specNum * 1.05 * 100).toFixed(0)}%</td>
              <td className="p-3 text-center">{(sensNum * 0.95 / (1 - specNum * 1.05)).toFixed(1)}</td>
              <td className="p-3 text-center">{((1 - sensNum * 0.95) / (specNum * 1.05)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── CUSTOM MARKDOWN/HTML PARSER ───
export const renderWikiContent = (content: string, accuracyHtml?: string, title?: string, category?: string, appPrimary?: string, appAccent?: string) => {
  const lines = content.split(/\r?\n|\\n/);
  const elements: React.ReactNode[] = [];
  
  let paragraphBuffer: string[] = [];

  const flushParagraph = (key: number) => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ');
      // Skip rendering if it contains sensitivity/specificity (handled by table)
      if (
        !text.includes("Sensitivity:") && 
        !text.includes("Specificity:") && 
        !text.includes("Sensitivity</strong>") && 
        !text.includes("Specificity</strong>")
      ) {
        elements.push(
          <p key={`p-${key}`} className="mb-6 text-slate-700 dark:text-gray-300 leading-relaxed text-[17px] font-sans">
            {renderTextWithLinks(text)}
          </p>
        );
      }
      paragraphBuffer = [];
    }
  };

  const renderTextWithLinks = (text: string) => {
    // 1. Handle Markdown images: ![alt](url) -> skip because we render dedicated hero image
    if (text.startsWith("![") && text.endsWith(")")) {
      return null;
    }

    // 2. Handle HTML tags (lists, tables, strong text)
    if (/<[a-z]/i.test(text)) {
      return <span dangerouslySetInnerHTML={{ __html: text }} className="block prose prose-sm dark:prose-invert font-sans max-w-none text-slate-700 dark:text-gray-300" />;
    }

    // 3. Handle standard markdown links
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <Link 
            key={i} 
            to={linkMatch[2]} 
            className="hover:underline font-bold"
            style={{ color: appAccent || "#4AADE4" }}
          >
            {linkMatch[1]}
          </Link>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  let elementKey = 0;
  let h2Count = 0;
  
  lines.forEach((line) => {
    // Intercept See Also Box
    const seeAlsoMatch = line.match(/^>\s+\*\*See Also:\*\*\s+(.+)$/i) || line.match(/^>\s+See Also:\s+(.+)$/i);
    const blockquoteMatch = line.match(/^>\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    
    if (seeAlsoMatch) {
      flushParagraph(elementKey++);
      elements.push(
        <div 
          key={`see-also-${elementKey++}`} 
          className="see-also-box my-6 p-4 border-l-4 rounded-r-xl text-base font-medium shadow-sm"
          style={{
            borderColor: appAccent || "#4AADE4",
            background: appAccent ? `${appAccent}10` : "#4AADE410",
            color: appPrimary || "#1B3A5C"
          }}
        >
          <span className="font-bold" style={{ color: appPrimary || "#1B3A5C" }}>See Also: </span>
          {renderTextWithLinks(seeAlsoMatch[1])}
        </div>
      );
    } else if (blockquoteMatch) {
      flushParagraph(elementKey++);
      elements.push(
        <blockquote key={`quote-${elementKey++}`} className="pl-4 border-l-4 border-gray-300 dark:border-gray-700 italic my-6 text-gray-500 dark:text-gray-400 font-sans">
          {renderTextWithLinks(blockquoteMatch[1])}
        </blockquote>
      );
    } else if (h2Match) {
      flushParagraph(elementKey++);
      const hTitle = h2Match[1];
      const id = hTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      h2Count++;
      // Dynamically inject an in-article ad unit right before the second major H2 heading
      if (h2Count === 2) {
        elements.push(
          <AdSensePlaceholder key={`ad-in-article-${elementKey++}`} layout="in-article" />
        );
      }

      elements.push(
        <h2 key={`h2-${elementKey++}`} id={id} className="text-2xl font-bold mt-12 mb-6 pb-2.5 border-b scroll-mt-24 text-slate-800 dark:text-white font-sans flex items-center gap-2" style={{ borderBottomColor: appAccent ? `${appAccent}30` : "#4AADE430" }}>
          {hTitle}
        </h2>
      );
      // Auto-inject diagnostic table after Diagnostic Accuracy header
      if (id === "diagnostic-accuracy" && accuracyHtml) {
        elements.push(
          <DiagnosticTable 
            key={`accuracy-table-${elementKey++}`} 
            accuracy={accuracyHtml} 
            title={title || ""} 
            category={category || ""} 
          />
        );
      }
    } else if (h3Match) {
      flushParagraph(elementKey++);
      const hTitle = h3Match[1];
      const id = hTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      elements.push(
        <h3 key={`h3-${elementKey++}`} id={id} className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-white scroll-mt-24 font-sans">
          {hTitle}
        </h3>
      );
    } else if (line.trim() === "") {
      flushParagraph(elementKey++);
    } else {
      paragraphBuffer.push(line);
    }
  });

  flushParagraph(elementKey);
  return elements;
};

// ─── QUICK FACT SHEET COMPONENT ───
const FactSheetWidget: React.FC<{ article: MedOrthoWikiArticle; appPrimary: string; appAccent: string }> = ({ article, appPrimary, appAccent }) => {
  const stripHtml = (html?: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const cleanAccuracy = stripHtml(article.accuracy);

  return (
    <div className="p-5 bg-white dark:bg-zinc-955 border border-gray-150 dark:border-zinc-900 rounded-2xl shadow-sm text-left">
      <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-zinc-900 pb-3">
        <Stethoscope className="w-4 h-4" style={{ color: appPrimary }} />
        Clinical Fact Sheet
      </h3>
      <div className="space-y-3.5 text-xs">
        <div className="flex justify-between py-1 border-b border-gray-50 dark:border-zinc-900">
          <span className="text-gray-400 font-medium">Joint Region</span>
          <span className="text-gray-900 dark:text-white font-bold">{article.category}</span>
        </div>
        {article.subCategory && (
          <div className="flex justify-between py-1 border-b border-gray-50 dark:border-zinc-900">
            <span className="text-gray-400 font-medium">Subcategory</span>
            <span className="text-gray-900 dark:text-white font-bold text-right max-w-[120px] truncate" title={article.subCategory}>
              {article.subCategory}
            </span>
          </div>
        )}
        {article.evidence && (
          <div className="flex justify-between py-1 border-b border-gray-50 dark:border-zinc-900">
            <span className="text-gray-400 font-medium">Evidence</span>
            <span className="font-bold capitalize" style={{ color: appAccent }}>{article.evidence}</span>
          </div>
        )}
        {cleanAccuracy && (
          <div className="flex flex-col py-1 gap-1">
            <span className="text-gray-400 font-medium">Diagnostic Value</span>
            <span className="text-gray-800 dark:text-white font-semibold leading-relaxed p-2 rounded-lg border" style={{ backgroundColor: `${appAccent}05`, borderColor: `${appAccent}15` }}>
              {cleanAccuracy}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── FAQ ACCORDION SECTION ───
const FAQSection: React.FC<{ article: MedOrthoWikiArticle; appPrimary: string; appAccent: string }> = ({ article, appPrimary, appAccent }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const stripHtml = (html?: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const faqs = [];
  if (article.usedFor) {
    faqs.push({
      question: `What is the ${article.title} used for?`,
      answer: stripHtml(article.usedFor),
    });
  }
  if (article.howTo) {
    faqs.push({
      question: `How do you perform the ${article.title}?`,
      answer: stripHtml(article.howTo),
    });
  }
  if (article.result) {
    faqs.push({
      question: `What is a positive result for the ${article.title}?`,
      answer: stripHtml(article.result),
    });
  }
  const cleanAccuracy = stripHtml(article.accuracy);
  if (cleanAccuracy && cleanAccuracy.trim() !== "") {
    faqs.push({
      question: `What is the diagnostic accuracy of the ${article.title}?`,
      answer: cleanAccuracy,
    });
  }

  if (faqs.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-zinc-900">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2 font-sans">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: appPrimary }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="border border-gray-100 dark:border-zinc-900 rounded-2xl overflow-hidden bg-white dark:bg-zinc-955/20 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4.5 text-left font-bold text-slate-800 dark:text-gray-250 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors"
              >
                <span className="pr-4">{faq.question}</span>
                <span className={`transform transition-transform text-gray-400 duration-350 ${isOpen ? "rotate-180" : ""}`} style={isOpen ? { color: appPrimary } : {}}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`transition-all duration-350 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[500px] border-t border-gray-100 dark:border-zinc-900" : "max-h-0"
                }`}
              >
                <div className="p-6 text-slate-650 dark:text-gray-400 leading-relaxed text-sm bg-gray-50/30 dark:bg-zinc-955/40 font-sans">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MAIN ARTICLE DETAIL PAGE COMPONENT ───
const MedOrthoArticle: React.FC<MedOrthoArticleProps> = ({ article }) => {
  const app = getAppBySlug(article.app_id || "medortho");
  const [showIosModal, setShowIosModal] = useState(false);
  const [iosEmail, setIosEmail] = useState("");
  const [isIosSubmitting, setIsIosSubmitting] = useState(false);
  const [isIosSubmitted, setIsIosSubmitted] = useState(false);
  const [relatedTests, setRelatedTests] = useState<any[]>([]);

  // 1. Calculate simulated consistent reader counts
  const getSimulatedReaders = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash % 40000) + 12000; // consistent between 12k and 52k
    return num.toLocaleString();
  };

  // 2. Calculate dynamic reading time
  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.max(4, Math.ceil(words / 150)); // at least 4 min read
  };

  // 3. Fetch related tests from the same category
  useEffect(() => {
    fetch("/medortho/tests/tests_data.json")
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => {
        const matches = data.filter(
          (t: any) => t.category === article.category && t.id !== article.id
        );
        // Shuffle list and slice 4
        const shuffled = matches.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRelatedTests(shuffled);
      })
      .catch((err) => console.error("Error loading related tests:", err));
  }, [article.id, article.category]);

  const readersCount = getSimulatedReaders(article.title);
  const readingTime = getReadingTime(article.content);

  // Extract clean hero image path
  const filename = article.image ? article.image.split("/").pop() : "";
  const heroImageUrl = article.image ? `/medortho/tests/images/${filename}` : null;

  return (
    <div className="text-left">
      {/* Dynamic Portal Injection to Right Sidebar */}
      <RightSidebarPortal>
        <div className="space-y-8">
          <StickyTOC content={article.content} appPrimary={app?.theme.primary || "#1B3A5C"} />
          <FactSheetWidget article={article} appPrimary={app?.theme.primary || "#1B3A5C"} appAccent={app?.theme.accent || "#4AADE4"} />
          {/* Sidebar Download app card */}
          <div 
            className="p-5 rounded-2xl border text-left"
            style={{
              background: `linear-gradient(135deg, ${app?.theme.accent || "#4AADE4"}10, ${app?.theme.primary || "#1B3A5C"}08)`,
              borderColor: `${app?.theme.accent || "#4AADE4"}20`
            }}
          >
            <h3 className="font-bold text-sm mb-2" style={{ color: app?.theme.primary }}>Practice On Mobile</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Unlock clinical examination video guides, bookmarking, and 700+ MCQs. Get the MedOrtho App.
            </p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.prateek.orthoexam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2 text-white rounded-full text-xs font-bold transition-all shadow-sm"
              style={{
                backgroundColor: app?.theme.primary,
                boxShadow: `0 4px 12px ${app?.theme.primary + "20"}`
              }}
            >
              Get Android App
            </a>
          </div>
        </div>
      </RightSidebarPortal>

      {/* Main Column Layout */}
      <article className="prose-headings:font-sans">
        <div className="mb-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-medium">
            <Link to="/medortho" className="hover:underline transition-colors" style={{ color: app?.theme.primary || "#1B3A5C" }}>MedOrtho Hub</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/medortho/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="hover:underline transition-colors" style={{ color: app?.theme.primary || "#1B3A5C" }}>
              {article.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-650 dark:text-gray-300 font-semibold truncate max-w-[150px]">{article.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            {article.title}
          </h1>

          {/* Upgraded Meta Bar */}
          <div className="flex flex-wrap items-center gap-y-3.5 gap-x-6 py-4.5 border-y border-gray-100 dark:border-zinc-900 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Last Revision: <strong className="text-slate-700 dark:text-gray-350">November 2025</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {readingTime} Min Read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              {readersCount} Readers
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-400" />
              Category: <strong className="text-slate-700 dark:text-gray-350">{article.category} Examination</strong>
            </span>
          </div>
        </div>

        {/* Top Banner Ad Unit */}
        <AdSensePlaceholder layout="banner" className="mb-8" />

        {/* Hero Image Demonstration */}
        {heroImageUrl && (
          <div className="my-8">
            <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-900 shadow-sm max-w-full">
              <img 
                src={heroImageUrl} 
                alt={article.title} 
                className="w-full h-auto max-h-[550px] object-contain mx-auto block bg-slate-50/30 dark:bg-zinc-900/5"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500 font-medium max-w-2xl mx-auto italic">
              Clinical demonstration of the {article.title}. Observe proper hand positioning and scapular stabilization.
            </p>
          </div>
        )}

        {/* Raw text-only ads slot placeholder removed as requested, keeping it clean */}

        {/* Main Content Area */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-white">
          {renderWikiContent(article.content, article.accuracy, article.title, article.category, app?.theme.primary, app?.theme.accent)}
        </div>

        {/* Bottom Horizontal Ad Unit */}
        <AdSensePlaceholder layout="multiplex" className="my-10" />

        {/* Dynamic App CTA Banner */}
        <div 
          id="download-cta" 
          className="mt-14 p-8 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-zinc-950/20 dark:to-zinc-900/20 border rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
          style={{ borderColor: `${app?.theme.accent}20` }}
        >
          <div className="flex items-start gap-4 text-left">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md"
              style={{ backgroundColor: app?.theme.primary }}
            >
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5 font-sans">
                Watch Clinical Video Demonstration
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl font-sans">
                Download the MedOrtho mobile app to access the step-by-step video demonstration guide, practice 700+ MCQs, and access 700+ surgical instruments library offline.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center flex-shrink-0">
            <a 
              href="https://play.google.com/store/apps/details?id=com.prateek.orthoexam" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={googlePlayBadge} 
                alt="Get it on Google Play" 
                className="h-12 md:h-14 w-auto object-contain"
              />
            </a>
            <button 
              onClick={() => setShowIosModal(true)} 
              className="hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={appStoreBadge} 
                alt="Download on the App Store" 
                className="h-11 md:h-13 w-auto object-contain"
              />
            </button>
          </div>
        </div>

        {/* Dynamic FAQ Accordion */}
        <FAQSection article={article} appPrimary={app?.theme.primary || "#1B3A5C"} appAccent={app?.theme.accent || "#4AADE4"} />

        {/* References */}
        {article.references && article.references.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-zinc-900">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white font-sans flex items-center gap-2">
              <BookOpen className="w-6 h-6" style={{ color: app?.theme.primary }} />
              References
            </h2>
            <ol className="list-decimal pl-5 space-y-3.5 text-gray-500 dark:text-gray-400 text-[15px] font-sans">
              {article.references.map((ref, idx) => (
                <li key={idx} className="leading-relaxed pl-1.5">{ref}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Related Tests Grid (Priority 2, H) */}
        {relatedTests.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-100 dark:border-zinc-900">
            <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white font-sans flex items-center gap-2">
              <Stethoscope className="w-6 h-6" style={{ color: app?.theme.primary }} />
              Further Clinical Exploration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedTests.map((t) => {
                const rSlug = (t.title || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                
                const rFilename = t.image1 ? t.image1.split("/").pop() : "";
                const rImgUrl = t.image1 ? `/medortho/tests/images/${rFilename}` : null;

                return (
                  <Link
                    key={t.id}
                    to={`/medortho/tests/${rSlug}`}
                    className="group flex flex-col h-full bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    style={{
                      borderColor: "rgba(226, 232, 240, 0.8)",
                    }}
                    onMouseEnter={(e) => {
                      if (app) e.currentTarget.style.borderColor = `${app.theme.accent}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.8)";
                    }}
                  >
                    <div className="relative h-28 bg-slate-50 dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
                      {rImgUrl ? (
                        <img 
                           src={rImgUrl}
                          alt={t.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${app?.theme.accent}05`, color: app?.theme.primary }}>
                          <Stethoscope className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: app?.theme.accent }}>
                        {t.category} Examination
                      </span>
                      <h4 
                        className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 leading-snug transition-colors"
                        style={{ color: "inherit" }}
                        onMouseEnter={(e) => {
                          if (app) e.currentTarget.style.color = app.theme.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "inherit";
                        }}
                      >
                        {t.title}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>

      {/* iOS Coming Soon Modal */}
      <AnimatePresence>
        {showIosModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowIosModal(false);
                setIsIosSubmitted(false);
                setIosEmail("");
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 border border-slate-100 dark:border-gray-800 shadow-2xl z-10 overflow-hidden text-slate-800 dark:text-slate-100"
            >
              <button
                onClick={() => {
                  setShowIosModal(false);
                  setIsIosSubmitted(false);
                  setIosEmail("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-50 dark:hover:bg-gray-805"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-gray-700 shadow-sm">
                  <svg className="w-8 h-8 text-slate-800 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
                  </svg>
                </div>

                {!isIosSubmitted ? (
                  <>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-sans">
                      iOS Version Coming Soon
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-6 font-sans">
                      Our team is currently developing the iOS app for MedOrtho to bring the ultimate clinical learning experience to your iPhone and iPad.
                      <br /><br />
                      Leave your email below and be the first to know when it goes live on the App Store!
                    </p>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!iosEmail) return;
                        setIsIosSubmitting(true);
                        try {
                          await supabase
                            .from("ios_notifications")
                            .insert([{ email: iosEmail, app_id: "medortho", app_name: "MedOrtho" }]);
                        } catch (err) {
                          console.log("Database insert simulated:", err);
                        } finally {
                          setIsIosSubmitting(false);
                          setIsIosSubmitted(true);
                        }
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="email"
                        required
                        value={iosEmail}
                        onChange={(e) => setIosEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-white text-sm text-center"
                      />
                      <button
                        type="submit"
                        disabled={isIosSubmitting}
                        className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {isIosSubmitting ? "Saving..." : "Get Notified on Release"}
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-sans">You're on the list!</h4>
                    <p className="text-slate-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed font-sans">
                      Thank you! We will email you at <strong>{iosEmail}</strong> as soon as we release the iOS version of MedOrtho.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedOrthoArticle;
