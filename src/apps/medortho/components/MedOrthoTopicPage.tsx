import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";
import { getAppBySlug } from "../../medical/data/medicalAppsData";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

interface MedOrthoTopicPageProps {
  topicType: "anatomy" | "pathologies";
  topicName: string;
}

const TOPIC_TITLES: Record<string, string> = {
  // Anatomy
  "bones": "Osteology (Bones) Study Guides",
  "joints": "Arthrology (Joints) Study Guides",
  "muscles": "Myology (Muscles) Clinical Notes",
  "ligaments": "Syndesmology (Ligaments) Reference",
  // Pathologies
  "fractures": "Fractures & Dislocations Guide",
  "inflammation": "Inflammatory Joint Conditions",
  "chronic-conditions": "Chronic Orthopedic Pathologies",
};

const TOPIC_DESCRIPTIONS: Record<string, string> = {
  "bones": "Detailed anatomical notes on human skeletal structure, bony landmarks, ossification, and blood supply for orthopedic reference.",
  "joints": "Comprehensive clinical guides covering joint types, biomechanics, range of motion limits, and articular structures.",
  "muscles": "Explanations of muscle groups, origins, insertions, nerve innervations, and testing procedures for orthopedic evaluation.",
  "ligaments": "In-depth clinical reviews of ligamentous structures, attachments, biomechanical functions, and stability parameters.",
  "fractures": "Classification, mechanism of injury, clinical features, and management guidelines for orthopedic fractures and joint dislocations.",
  "inflammation": "Clinical insights on osteomyelitis, septic arthritis, rheumatoid arthritis, bursitis, and tendinitis.",
  "chronic-conditions": "Diagnostic and treatment strategies for chronic conditions like osteoarthritis, osteoporosis, avascular necrosis (AVN), and spinal stenosis.",
};

// Search keywords mapped to topic slugs
const TOPIC_KEYWORDS: Record<string, string> = {
  "bones": "bone",
  "joints": "joint",
  "muscles": "muscle",
  "ligaments": "ligament",
  "fractures": "fractur",
  "inflammation": "inflam",
  "chronic-conditions": "chronic",
};

const MedOrthoTopicPage: React.FC<MedOrthoTopicPageProps> = ({ topicType, topicName }) => {
  const app = getAppBySlug("medortho");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const cleanTopicName = topicName.toLowerCase().replace(/\/$/, "");
  const title = TOPIC_TITLES[cleanTopicName] || `${cleanTopicName.charAt(0).toUpperCase() + cleanTopicName.slice(1)} Articles`;
  const description = TOPIC_DESCRIPTIONS[cleanTopicName] || `Browse articles and revision resources on ${cleanTopicName} for orthopedic education.`;

  useEffect(() => {
    const fetchTopicPosts = async () => {
      setLoading(true);
      try {
        const keyword = TOPIC_KEYWORDS[cleanTopicName] || cleanTopicName;
        
        // Fetch all blog posts for MedOrtho from Supabase
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .eq("category", "MedOrtho");

        if (error) throw error;

        if (data) {
          // Filter matching posts client-side for robust matching
          const filtered = data
            .filter((p: any) => {
              const text = `${p.title} ${p.excerpt} ${p.content}`.toLowerCase();
              return text.includes(keyword);
            })
            .map((p: any) => ({
              id: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              date: p.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
              readTime: p.read_time || "5 min read",
              image: p.image_url || "https://images.unsplash.com/photo-1559757175-9e351c9a1301?w=800&q=80",
            }));
          
          setPosts(filtered);
        }
      } catch (err) {
        console.error("Error fetching topic posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicPosts();
  }, [cleanTopicName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderTopColor: app?.theme.primary, borderBottomColor: app?.theme.primary }}></div>
        <p className="mt-4 text-gray-500 font-medium">Fetching topic resources...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="capitalize border-none font-semibold" style={{ backgroundColor: `${app?.theme.accent}15`, color: app?.theme.primary }}>
            {topicType}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white leading-tight">
          {title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="group flex flex-col bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
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
              <div className="relative h-48 overflow-hidden bg-slate-50">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559757175-9e351c9a1301?w=800&q=80";
                  }}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                </div>
                <h3 
                  className="font-bold text-xl text-gray-900 dark:text-white mb-2 leading-snug transition-colors"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => {
                    if (app) e.currentTarget.style.color = app.theme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "inherit";
                  }}
                >
                  {post.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link 
                  to={`/blog/${post.id}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: app?.theme.accent }}
                  onMouseEnter={(e) => {
                    if (app) e.currentTarget.style.color = app.theme.primary;
                  }}
                  onMouseLeave={(e) => {
                    if (app) e.currentTarget.style.color = app.theme.accent;
                  }}
                >
                  Read Study Guide <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50/50 dark:bg-zinc-900/10 border border-dashed border-gray-250 dark:border-zinc-800 rounded-2xl p-6">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No guides found for this topic yet</h4>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            We are writing high-yield revision resources for {cleanTopicName}. In the meantime, you can explore the Special Tests.
          </p>
          <Link 
            to="/medortho/special-tests"
            className="mt-6 inline-block px-6 py-2.5 text-white text-xs font-bold rounded-full transition-all shadow-md"
            style={{ backgroundColor: app?.theme.primary }}
          >
            Browse Special Tests
          </Link>
        </div>
      )}
    </div>
  );
};

export default MedOrthoTopicPage;
