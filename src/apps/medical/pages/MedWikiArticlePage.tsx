import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MedWikiLayout from "../components/MedWikiLayout";
import MedOrthoArticle from "../../medortho/components/MedOrthoArticle"; // This can be made generic too later if needed
import MedOrthoSpecialTestsIndex from "../../medortho/components/MedOrthoSpecialTestsIndex";
import MedOrthoTopicPage from "../../medortho/components/MedOrthoTopicPage";
import { supabase } from "@/integrations/supabase/client";
import { getAppBySlug } from "../data/medicalAppsData";
import SEOHead from "@/components/SEOHead";
import { buildWikiArticleStructuredData } from "../data/seoHelpers";

export interface WikiArticle {
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

const MedWikiArticlePage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pathId = params["*"];
  
  // Extract app slug from path (e.g., /medcardio/slug -> medcardio)
  const appSlug = location.pathname.split("/")[1];
  const app = getAppBySlug(appSlug);
  
  const segments = pathId?.split("/") || [];
  const slug = segments[segments.length - 1] || "";
  
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [loading, setLoading] = useState(true);

  const isSpecialTestsIndex = pathId?.toLowerCase().replace(/\/$/, "") === "special-tests";
  const isCategoryPage = ["shoulder", "knee", "hip", "spine", "elbow", "wrist-hand", "wrist", "ankle-foot", "ankle", "neurological"].includes(segments[0]?.toLowerCase().replace(/\/$/, ""));
  const isAnatomyPage = segments[0]?.toLowerCase() === "anatomy" && segments[1];
  const isPathologyPage = segments[0]?.toLowerCase() === "pathologies" && segments[1];

  useEffect(() => {
    const fetchArticle = async () => {
      if (!app) {
          setLoading(false);
          return;
      }
      
      setLoading(true);
      const segments = pathId?.split("/") || [];
      const slug = segments[segments.length - 1];

      // If it's a special directory/category/anatomy route, do not fetch a single article
      if (isSpecialTestsIndex || isCategoryPage || isAnatomyPage || isPathologyPage) {
        setArticle(null);
        setLoading(false);
        return;
      }

      if (!slug) {
        setArticle(null);
        setLoading(false);
        return;
      }

      // Fallback/direct check for MedOrtho local JSON database
      if (app.id === "medortho") {
        try {
          const response = await fetch("/medortho/tests/tests_data.json");
          if (response.ok) {
            const list: any[] = await response.json();
            const match = list.find((item) => {
              const testSlug = (item.title || "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              return testSlug === slug;
            });

            if (match) {
              let content = "";
              if (match.usedFor) {
                content += `## What is it used for?\n${match.usedFor}\n\n`;
              }
              if (match.howTo) {
                content += `## How to Perform\n${match.howTo}\n\n`;
              }
              if (match.result) {
                content += `## Interpretation of Results\n${match.result}\n\n`;
              }
              if (match.accuracy && match.accuracy.trim() !== "") {
                content += `## Diagnostic Accuracy\n${match.accuracy}\n\n`;
              }
              if (match.extra && match.extra.trim() !== "") {
                content += `## Clinical Tips & Notes\n${match.extra}\n\n`;
              }

              let references: string[] = [];
              if (match.references) {
                const liMatches = match.references.match(/<li>(.*?)<\/li>/g);
                if (liMatches) {
                  references = liMatches.map((li: string) => li.replace(/<\/?li>/g, "").replace(/<[^>]*>/g, ""));
                } else {
                  references = [match.references.replace(/<[^>]*>/g, "")];
                }
              }

              if (match.image1) {
                const filename = match.image1.split("/").pop();
                const imgUrl = `/medortho/tests/images/${filename}`;
                content = `![${match.title}](${imgUrl})\n\n` + content;
              }

              const cleanDescription = match.usedFor 
                ? match.usedFor.replace(/<[^>]*>/g, "").substring(0, 160).trim() + "..."
                : `Learn how to perform the ${match.title} orthopedic special test including indications, procedure, and accuracy.`;

              const imageUrl = match.image1 
                ? `https://examessentials.in/medortho/tests/images/${match.image1.split("/").pop()}`
                : undefined;

              setArticle({
                id: match.id || "",
                category: match.category || "Special Tests",
                title: match.title || "",
                content: content,
                references: references,
                lastUpdated: "Today",
                app_id: "medortho",
                description: cleanDescription,
                image: imageUrl,
                evidence: match.evidence,
                subCategory: match.subCategory,
                accuracy: match.accuracy,
                usedFor: match.usedFor,
                howTo: match.howTo,
                result: match.result,
                extra: match.extra,
                youtube: match.youtube,
              });
              setLoading(false);
              return;
            }
          }
        } catch (jsonErr) {
          console.error("Error loading tests_data.json in wiki page:", jsonErr);
        }
      }

      try {
        const { data, error } = await (supabase as any)
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .eq("app_id", app.id)
          .eq("published", true)
          .maybeSingle();

        if (data) {
          const cleanDesc = data.content 
            ? data.content.replace(/[#*`]/g, "").substring(0, 160).trim() + "..."
            : undefined;
          setArticle({
            id: data.id,
            category: data.category,
            title: data.title,
            content: data.content,
            references: data.references || [],
            lastUpdated: new Date(data.updated_at || data.created_at).toLocaleDateString(),
            app_id: data.app_id,
            description: cleanDesc,
          });
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [pathId, app, isSpecialTestsIndex, isCategoryPage, isAnatomyPage, isPathologyPage]);

  if (!app) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p className="text-xl font-bold">App Not Found</p>
          </div>
      );
  }

  const getFallbackTitle = (slugStr: string) => {
    if (!slugStr || slugStr === "tests") return "";
    return slugStr
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Define unique title and descriptions for category/topic pages
  let pageTitle = `${app.name} Wiki - Medical Education`;
  let pageDescription = `Search and read medical special tests and articles in the ${app.name} Wiki.`;
  const cleanPathId = pathId ? pathId.replace(/\/$/, "") : "";
  let pageCanonical = `/${app.slug}${cleanPathId ? `/${cleanPathId}` : ""}`;
  let pageKeywords = `${app.name}, medical education, wiki, special tests`;
  let pageNoIndex = false;

  if (isSpecialTestsIndex) {
    pageTitle = `Orthopedic Special Tests Directory | MedOrtho`;
    pageDescription = `Browse and search all 700+ orthopedic physical examination special tests, clinical diagnostics, sensitivity, specificity, and procedures.`;
    pageKeywords = `orthopedic special tests, physical examination tests, clinical tests, orthopedic wiki`;
  } else if (isCategoryPage) {
    const rawCat = segments[0]?.toLowerCase().replace(/\/$/, "");
    const formattedCat = rawCat === "wrist" || rawCat === "wrist-hand" ? "Wrist & Hand" :
                         rawCat === "ankle" || rawCat === "ankle-foot" ? "Ankle & Foot" :
                         rawCat === "neurological" ? "Neurological Tests" :
                         rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
    pageTitle = `${formattedCat} Special Tests & Clinical Examination | MedOrtho`;
    pageDescription = `Master diagnostic physical examination special tests for ${formattedCat}. Sensitivity, specificity, and step-by-step performance guidelines.`;
    pageKeywords = `${formattedCat} special tests, ${formattedCat} exam, orthopedic tests`;
  } else if (isAnatomyPage) {
    const topic = segments[1]?.toLowerCase().replace(/\/$/, "");
    const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    pageTitle = `${formattedTopic} Study Guide & Clinical Notes | MedOrtho`;
    pageDescription = `Read educational notes, anatomical reviews, and pathology guides for orthopedic students on ${formattedTopic}.`;
    pageKeywords = `orthopedic anatomy, ${topic}, medical revision notes`;
  } else if (isPathologyPage) {
    const topic = segments[1]?.toLowerCase().replace(/\/$/, "");
    const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    pageTitle = `${formattedTopic} Pathology Guide & Clinical Notes | MedOrtho`;
    pageDescription = `Read diagnostic guidelines, classifications, and clinical notes for orthopedic pathologies: ${formattedTopic}.`;
    pageKeywords = `orthopedic pathology, ${topic}, bone pathology, joint pathologies`;
  } else if (article) {
    pageTitle = `${article.title} – ${article.category} | ${app.name}`;
    pageDescription = article.description || `Learn how to perform the ${article.title} orthopedic special test including indications, procedure, and accuracy.`;
    pageCanonical = `/${app.slug}/tests/${slug}`;
    pageKeywords = `${article.title}, ${article.category} test, orthopedic special test, medortho wiki, ${app.name} education`;
  } else if (slug && slug !== "tests") {
    if (!loading && !article) {
      pageTitle = "Article Not Found | Exam Essentials";
      pageDescription = "The requested medical article or special test was not found.";
      pageCanonical = `/${app.slug}/tests/${slug}`;
      pageNoIndex = true;
    } else {
      const fallbackTitle = getFallbackTitle(slug);
      pageTitle = `${fallbackTitle} – Special Test | ${app.name}`;
      pageDescription = `Read details of the ${fallbackTitle} assessment on ${app.name} Wiki.`;
      pageCanonical = `/${app.slug}/tests/${slug}`;
      pageKeywords = `${fallbackTitle}, special test, ${app.name} wiki, medical education`;
    }
  } else if (!loading && !article) {
    pageTitle = "Page Not Found | Exam Essentials";
    pageDescription = "The requested page was not found.";
    pageNoIndex = true;
  }

  const pageStructuredData = article 
    ? buildWikiArticleStructuredData(app.slug, article, slug)
    : undefined;

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={pageCanonical}
        ogImage={article?.image}
        ogType={article ? "article" : "website"}
        structuredData={pageStructuredData}
        skipDefaultKeywords={true}
        keywords={pageKeywords}
        noIndex={pageNoIndex}
      />
      <MedWikiLayout app={app}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: app.theme.primary }}></div>
        </div>
      ) : isSpecialTestsIndex ? (
        <MedOrthoSpecialTestsIndex />
      ) : isCategoryPage ? (
        <MedOrthoSpecialTestsIndex 
          initialCategory={
            segments[0].toLowerCase() === "wrist" || segments[0].toLowerCase() === "wrist-hand" ? "Wrist & Hand" :
            segments[0].toLowerCase() === "ankle" || segments[0].toLowerCase() === "ankle-foot" ? "Ankle & Foot" :
            segments[0].toLowerCase() === "neurological" ? "Neurological" :
            segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
          } 
          isCategoryLocked={true} 
        />
      ) : isAnatomyPage ? (
        <MedOrthoTopicPage topicType="anatomy" topicName={segments[1]} />
      ) : isPathologyPage ? (
        <MedOrthoTopicPage topicType="pathologies" topicName={segments[1]} />
      ) : article ? (
        <MedOrthoArticle article={article as any} /> 
      ) : (
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
          <p className="text-gray-500 mb-8">The requested wiki page does not exist in {app.name} or has been moved.</p>
          <button 
            onClick={() => navigate(`/${app.slug}`)}
            className="px-6 py-2 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: app.theme.primary }}
          >
            Return to {app.name}
          </button>
        </div>
      )}
      </MedWikiLayout>
    </>
  );
};

export default MedWikiArticlePage;
