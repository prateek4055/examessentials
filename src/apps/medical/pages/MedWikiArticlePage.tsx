import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MedWikiLayout from "../components/MedWikiLayout";
import MedOrthoArticle from "../../medortho/components/MedOrthoArticle"; // This can be made generic too later if needed
import { supabase } from "@/integrations/supabase/client";
import { getAppBySlug } from "../data/medicalAppsData";

export interface WikiArticle {
  id: string;
  category: string;
  title: string;
  content: string;
  references: string[];
  lastUpdated: string;
  app_id: string;
}

const MedWikiArticlePage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pathId = params["*"];
  
  // Extract app slug from path (e.g., /medcardio/slug -> medcardio)
  const appSlug = location.pathname.split("/")[1];
  const app = getAppBySlug(appSlug);
  
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!app) {
          setLoading(false);
          return;
      }
      
      setLoading(true);
      const segments = pathId?.split("/") || [];
      const slug = segments[segments.length - 1];

      if (!slug) {
        setArticle(null);
        setLoading(false);
        return;
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
          setArticle({
            id: data.id,
            category: data.category,
            title: data.title,
            content: data.content,
            references: data.references || [],
            lastUpdated: new Date(data.updated_at || data.created_at).toLocaleDateString(),
            app_id: data.app_id,
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
  }, [pathId, app]);

  if (!app) {
      return (
          <div className="flex justify-center items-center h-screen">
              <p className="text-xl font-bold">App Not Found</p>
          </div>
      );
  }

  return (
    <MedWikiLayout app={app}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderTopColor: app.theme.primary }}></div>
        </div>
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
  );
};

export default MedWikiArticlePage;
