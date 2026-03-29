import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MedOrthoLayout from "../layout/MedOrthoLayout";
import MedOrthoArticle from "../components/MedOrthoArticle";
import { supabase } from "@/integrations/supabase/client";

export interface MedOrthoWikiArticle {
  id: string;
  category: string;
  title: string;
  content: string;
  references: string[];
  lastUpdated: string;
}

const MedOrthoWikiArticlePage: React.FC = () => {
  const params = useParams();
  const pathId = params["*"];
  const navigate = useNavigate();
  const [article, setArticle] = useState<MedOrthoWikiArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
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
    
    // Simulate slight delay
    const timer = setTimeout(() => {
        setLoading(false);
        // Scroll to top or specific hash
        if (window.location.hash) {
            const el = document.querySelector(window.location.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathId]);

  return (
    <MedOrthoLayout>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : article ? (
        <MedOrthoArticle article={article} />
      ) : (
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
          <p className="text-gray-500 mb-8">The requested wiki page does not exist or has been moved.</p>
          <button 
            onClick={() => navigate("/medortho")}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      )}
    </MedOrthoLayout>
  );
};

export default MedOrthoWikiArticlePage;
