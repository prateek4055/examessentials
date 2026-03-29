import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Eye, Trash2, Search, Link as LinkIcon, Loader2, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { medicalApps } from "@/apps/medical/data/medicalAppsData";

const categories = ["Anatomy", "Pathology", "Biomechanics", "Special Tests", "Pharmacology"];


interface WikiArticleData {
  title: string;
  slug: string;
  app_id: string;
  category: string;
  content: string;
  keywords: string;
  published: boolean;
}


const AdminWikiEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const isEditing = id !== "new" && id !== undefined;

  const [formData, setFormData] = useState<WikiArticleData>({
    title: "",
    slug: "",
    app_id: "medortho",
    category: "Anatomy",
    content: "",
    keywords: "",
    published: false,
  });

  const [loading, setLoading] = useState(false);
  const [allSlugs, setAllSlugs] = useState<{title: string, slug: string}[]>([]);
  const [slugSearch, setSlugSearch] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && id) {
      fetchArticle();
    }
    fetchAllSlugs();
  }, [id, isEditing]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          app_id: data.app_id || "medortho",
          category: data.category,
          content: data.content,
          keywords: data.keywords || "",
          published: data.published,
        });

      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSlugs = async () => {
    const { data } = await (supabase as any).from("articles").select("title, slug");
    if (data) setAllSlugs(data as any);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSave = async (published: boolean) => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in all required fields (Title, Slug, Content)");
      return;
    }

    setLoading(true);
    const articleData = {
      ...formData,
      published,
      updated_at: new Date().toISOString(),
    };

    try {
      let error;
      if (isEditing) {
        ({ error } = await (supabase as any)
          .from("articles")
          .update(articleData)
          .eq("id", id));
      } else {
        ({ error } = await (supabase as any).from("articles").insert(articleData));
      }

      if (error) throw error;
      toast.success(published ? "Article published!" : "Draft saved!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    setLoading(true);
    try {
      const { error } = await (supabase as any).from("articles").delete().eq("id", id);
      if (error) throw error;
      toast.success("Article deleted");
      navigate("/admin");
    } catch (error) {
      toast.error("Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  const filteredSlugs = allSlugs.filter(s => 
    s.title.toLowerCase().includes(slugSearch.toLowerCase()) || 
    s.slug.toLowerCase().includes(slugSearch.toLowerCase())
  );

  if (authLoading || (isEditing && loading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* CMS Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-display font-bold text-lg hidden md:block">
            {isEditing ? "Edit Wiki Article" : "New Wiki Article"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={loading}>
            Save Draft
          </Button>
          <Button variant="gradient" onClick={() => handleSave(true)} disabled={loading}>
            Publish Article
          </Button>
          {isEditing && (
            <Button variant="destructive" size="icon" onClick={handleDelete} disabled={loading}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Split Pane Layout */}
      <main className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-1/2 border-r border-border flex flex-col overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Anterior Cruciate Ligament (ACL)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                  placeholder="e.g. acl-injury"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target App</Label>
                <Select
                  value={formData.app_id}
                  onValueChange={(val) => setFormData(p => ({ ...p, app_id: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select App" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalApps.map(app => (
                      <SelectItem key={app.id} value={app.id}>{app.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData(p => ({ ...p, category: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData(p => ({ ...p, keywords: e.target.value }))}
                placeholder="knee, ligament, surgery"
              />
            </div>


            {/* Interlinking Helper */}
            <div className="bg-secondary/30 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-white/70">
                <LinkIcon className="w-4 h-4" />
                Interlinking Helper
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  className="pl-9 bg-black/20 border-white/10 text-sm h-9"
                  placeholder="Search articles..."
                  value={slugSearch}
                  onChange={(e) => setSlugSearch(e.target.value)}
                />
              </div>
              {slugSearch && (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filteredSlugs.map(s => (
                    <button
                      key={s.slug}
                      onClick={() => {
                        navigator.clipboard.writeText(`[${s.title}](/${formData.app_id}/${s.slug})`);

                        toast.success("Link copied!");
                      }}
                      className="w-full text-left px-2 py-1 text-xs hover:bg-white/5 rounded transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{s.title}</span>
                      <span className="text-white/20 group-hover:text-white/40">{s.slug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Markdown Editor */}
            <div className="space-y-2">
              <Label>Main Content (Markdown)</Label>
              <div className="prose-none">
                <SimpleMDE
                  value={formData.content}
                  onChange={(val) => setFormData(p => ({ ...p, content: val }))}
                  options={{
                    spellChecker: false,
                    placeholder: "Write your medical wiki article here...",
                    styleSelectedText: true,
                    minHeight: "400px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="w-1/2 bg-secondary/10 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-accent">
              <Eye className="w-4 h-4" />
              Live Wiki Preview
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl wiki-content min-h-full">
              <h1 className="text-4xl font-display font-bold text-foreground mb-6">
                {formData.title || "Article Title"}
              </h1>
              
              <div className="px-4 py-2 bg-secondary/50 rounded-lg border border-border inline-block text-sm font-medium text-muted-foreground mb-8">
                Category: <span className="text-foreground">{formData.category}</span>
              </div>

              {/* Real Table of Contents for Preview */}
              {formData.content && (
                <div className="bg-secondary/30 border border-border rounded-lg p-6 mb-8 max-w-sm">
                  <p className="font-bold text-sm mb-4 border-b border-white/10 pb-2">Contents</p>
                  <ul className="space-y-2">
                    {formData.content.split("\n")
                      .filter(line => line.startsWith("##"))
                      .map((line, idx) => {
                        const level = line.startsWith("###") ? 3 : 2;
                        const title = line.replace(/^#+\s+/, "");
                        return (
                          <li 
                            key={idx} 
                            className={`text-accent hover:underline cursor-default ${level === 3 ? "ml-4 text-xs opacity-70" : "text-sm font-medium"}`}
                          >
                            {title}
                          </li>
                        );
                      })
                    }
                  </ul>
                  {formData.content.split("\n").filter(line => line.startsWith("##")).length === 0 && (
                    <p className="text-xs text-white/20 italic">No headings found (use ## or ###)</p>
                  )}
                </div>
              )}

              <div className="prose prose-invert prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formData.content || "*Start writing to see the preview...*"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminWikiEditor;
