import React, { useState } from "react";
import { Link } from "react-router-dom";
import TableOfContents, { extractHeadings } from "./TableOfContents";
import AdSensePlaceholder from "./AdSensePlaceholder";
import googlePlayBadge from "@/assets/google-play-badge.png";
import appStoreBadge from "@/assets/app-store-badge.png";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
export interface MedOrthoWikiArticle {
  id: string;
  category: string;
  title: string;
  content: string;
  references: string[];
  lastUpdated: string;
}

interface MedOrthoArticleProps {
  article: MedOrthoWikiArticle;
}

export const renderWikiContent = (content: string) => {
  // A simple hacky markdown parser since we don't have react-markdown installed.
  // It handles headers (## and ###) and links [Text](url).
  // Also handles paragraphs.
  
  const lines = content.split(/\r?\n|\\n/);
  const elements: React.ReactNode[] = [];
  
  let paragraphBuffer: string[] = [];

  const flushParagraph = (key: number) => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ');
      elements.push(
        <p key={`p-${key}`} className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
          {renderTextWithLinks(text)}
        </p>
      );
      paragraphBuffer = [];
    }
  };

  const renderTextWithLinks = (text: string) => {
    // 1. Handle Markdown images: ![alt](url)
    if (text.startsWith("![") && text.endsWith(")")) {
      const match = text.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return (
          <div className="my-6 flex justify-center">
            <img 
              src={match[2]} 
              alt={match[1]} 
              className="rounded-2xl max-w-full max-h-[400px] object-contain shadow-md border border-gray-100 dark:border-gray-800" 
            />
          </div>
        );
      }
    }

    // 2. Handle HTML tags (lists, tables, strong text)
    if (/<[a-z]/i.test(text)) {
      return <span dangerouslySetInnerHTML={{ __html: text }} className="block text-gray-850 dark:text-gray-200" />;
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
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {linkMatch[1]}
          </Link>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  let elementKey = 0;
  
  lines.forEach((line) => {
    const h2Match = line.match(/^##\\s+(.+)$/);
    const h3Match = line.match(/^###\\s+(.+)$/);
    
    if (h2Match) {
      flushParagraph(elementKey++);
      const title = h2Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h2 key={`h2-${elementKey++}`} id={id} className="text-3xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 scroll-mt-24">
          {title}
        </h2>
      );
    } else if (h3Match) {
      flushParagraph(elementKey++);
      const title = h3Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h3 key={`h3-${elementKey++}`} id={id} className="text-xl font-bold mt-6 mb-3 scroll-mt-24">
          {title}
        </h3>
      );
    } else if (line.trim() === '') {
      flushParagraph(elementKey++);
    } else {
      paragraphBuffer.push(line);
    }
  });

  flushParagraph(elementKey);

  // Inject AdSense every 2 headings just as a simple demo
  const finalElements: React.ReactNode[] = [];
  let h2Count = 0;
  elements.forEach((el: any) => {
    finalElements.push(el);
    if (el.type === 'h2') {
      h2Count++;
      if (h2Count % 2 === 0) {
        finalElements.push(
          <AdSensePlaceholder key={`ad-${h2Count}`} layout="in-article" />
        );
      }
    }
  });

  return finalElements;
};

const FactSheet: React.FC<{ article: MedOrthoWikiArticle }> = ({ article }) => {
  const getEvidenceBadge = (level?: string) => {
    const lvl = (level || "").toLowerCase();
    if (lvl === "confirmed") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 border border-emerald-200/65 dark:border-emerald-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Confirmed Evidence
        </span>
      );
    } else if (lvl === "suggestive") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450 border border-amber-200/65 dark:border-amber-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          Suggestive Evidence
        </span>
      );
    } else if (lvl === "uncertain") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450 border border-rose-200/65 dark:border-rose-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
          Uncertain Evidence
        </span>
      );
    }
    return null;
  };

  const stripHtml = (html?: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const cleanAccuracy = stripHtml(article.accuracy);

  return (
    <div className="my-8 p-6 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm backdrop-blur-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Quick Clinical Fact Sheet
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div className="flex justify-between py-2 border-b border-gray-150/60 dark:border-gray-800/60">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Joint Region</span>
          <span className="text-gray-900 dark:text-white font-semibold">{article.category}</span>
        </div>
        {article.subCategory && (
          <div className="flex justify-between py-2 border-b border-gray-150/60 dark:border-gray-800/60">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Subcategory</span>
            <span className="text-gray-900 dark:text-white font-semibold text-right max-w-[200px] truncate" title={article.subCategory}>{article.subCategory}</span>
          </div>
        )}
        {article.evidence && (
          <div className="flex justify-between py-2 border-b border-gray-150/60 dark:border-gray-800/60">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Quality of Evidence</span>
            <span>{getEvidenceBadge(article.evidence)}</span>
          </div>
        )}
        {cleanAccuracy && (
          <div className="flex justify-between py-2 border-b border-gray-150/60 dark:border-gray-800/60">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Diagnostic Value</span>
            <span className="text-gray-900 dark:text-white font-semibold text-right max-w-[200px] truncate" title={cleanAccuracy}>
              {cleanAccuracy}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const YouTubePlayer: React.FC<{ embedUrl: string; title: string }> = ({ embedUrl, title }) => {
  return (
    <div className="my-10 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md bg-black">
      <div className="p-4 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.163c-.272-1.016-1.07-1.815-2.085-2.087C19.56 3.6 12 3.6 12 3.6s-7.56 0-9.413.476c-1.016.272-1.815 1.07-2.087 2.087C0 8.01 0 12 0 12s0 3.99.476 5.837c.272 1.016 1.07 1.815 2.087 2.087C4.44 20.4 12 20.4 12 20.4s7.56 0 9.413-.476c1.016-.272 1.815-1.07 2.087-2.087C24 15.99 24 12 24 12s0-3.99-.476-5.837z" />
            <path fill="white" d="M10 15l5.197-3L10 9v6z" />
          </svg>
          Clinical Demonstration Video
        </span>
        <span className="text-xs bg-red-50 text-red-650 dark:bg-red-950/40 dark:text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-200/50 dark:border-red-900/30">
          YouTube Guide
        </span>
      </div>
      <div className="relative pb-[56.25%] h-0">
        <iframe
          src={embedUrl}
          title={`${title} Clinical Video Demonstration`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

const FAQSection: React.FC<{ article: MedOrthoWikiArticle }> = ({ article }) => {
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
    <div className="mt-14 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50/30 dark:bg-gray-900/10 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-5 py-4 text-left font-bold text-gray-850 dark:text-gray-200 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-850/30 transition-colors"
              >
                <span className="pr-4">{faq.question}</span>
                <span className={`transform transition-transform text-gray-500 duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`transition-all duration-350 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[500px] border-t border-gray-150 dark:border-gray-800' : 'max-h-0'
                }`}
              >
                <div className="p-5 text-gray-700 dark:text-gray-300 leading-relaxed text-sm bg-white dark:bg-gray-900/40">
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

const MedOrthoArticle: React.FC<MedOrthoArticleProps> = ({ article }) => {
  const [showIosModal, setShowIosModal] = useState(false);
  const [iosEmail, setIosEmail] = useState("");
  const [isIosSubmitting, setIsIosSubmitting] = useState(false);
  const [isIosSubmitted, setIsIosSubmitted] = useState(false);

  return (
    <article className="font-serif lg:font-sans">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-6">
          <span>Category: <strong className="text-gray-700 dark:text-gray-300">{article.category}</strong></span>
          <span>•</span>
          <span>Last Updated: {article.lastUpdated}</span>
        </div>
      </div>

      <AdSensePlaceholder layout="banner" className="mb-8" />

      {article.app_id === "medortho" && <FactSheet article={article} />}

      <TableOfContents content={article.content} />

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {renderWikiContent(article.content)}
      </div>

      {/* Video player guide if present */}
      {article.youtube ? (
        <YouTubePlayer embedUrl={article.youtube} title={article.title} />
      ) : null}

      {/* App Promotion Banner with both App Store & Play Store badges */}
      {article.app_id === "medortho" && (
        <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Get MedOrtho Mobile App</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Access all 300+ special tests offline with clinical videos, step-by-step guides, and bookmarking features.</p>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center flex-shrink-0">
            <a 
              href="https://play.google.com/store/apps/details?id=com.examessentials.medortho" 
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
      )}

      {/* FAQ Accordion Section for GEO */}
      {article.app_id === "medortho" && <FAQSection article={article} />}

      {article.references && article.references.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4">References</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            {article.references.map((ref, idx) => (
              <li key={idx} className="leading-relaxed">{ref}</li>
            ))}
          </ol>
        </div>
      )}

      {/* iOS Coming Soon Modal */}
      <AnimatePresence>
        {showIosModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
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

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 border border-slate-100 dark:border-gray-800 shadow-2xl z-10 overflow-hidden text-slate-800 dark:text-slate-100"
            >
              {/* Close Button */}
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
                {/* Visual Icon */}
                <div className="w-16 h-16 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-gray-700 shadow-sm">
                  {/* Apple Icon */}
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
    </article>
  );
};

export default MedOrthoArticle;
