import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, BookOpen, Smartphone } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { medicalApps } from "../data/medicalAppsData";

const app = medicalApps.find((a) => a.slug === "medortho")!;
const regions = [
  ["shoulder", "Shoulder"], ["knee", "Knee"], ["hip", "Hip"], ["spine", "Spine"],
  ["elbow", "Elbow"], ["wrist-hand", "Wrist & Hand"], ["ankle-foot", "Ankle & Foot"], ["neurological", "Neurological"],
];
const title = "Orthopedic Special Tests & Examination Library | MedOrtho";
const description = "Explore orthopedic special tests by body region. Find examination procedures, interpretation, reference images and sources in the MedOrtho clinical library.";
const structuredData = {
  "@context": "https://schema.org", "@type": "CollectionPage",
  "@id": "https://examessentials.in/medortho#library", name: title, description,
  url: "https://examessentials.in/medortho", inLanguage: "en",
  mainEntity: { "@type": "ItemList", itemListElement: regions.map(([slug, name], i) => ({
    "@type": "ListItem", position: i + 1, name, url: `https://examessentials.in/medortho/${slug}`,
  })) },
};

type Entry = { title: string; category: string; subCategory?: string };
export default function MedOrthoPage() {
  const [tests, setTests] = useState<Entry[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/medortho/tests/tests_data.json", { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("Library unavailable"); return r.json(); })
      .then((data: Entry[]) => {
        const seen = new Set<string>();
        setTests(data.filter(t => {
          const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          if (seen.has(slug)) return false;
          seen.add(slug); return true;
        }));
      }).catch(() => {});
    return () => controller.abort();
  }, []);
  return <div className="medortho-type min-h-screen bg-[#F4F7FB] text-[#1B3A5C]">
    <SEOHead title={title} description={description} canonical="/medortho" structuredData={structuredData} skipDefaultKeywords isInternational />
    <a href="#library" className="sr-only focus:not-sr-only focus:block focus:p-4">Skip to clinical library</a>
    <header className="border-b border-slate-200 bg-white">
      <nav aria-label="MedOrtho" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <Link to="/medortho" className="flex items-center gap-3 font-bold text-xl"><img src={app.logo} alt="" width="40" height="40" className="rounded-xl" />MedOrtho</Link>
        <Link to="/medortho/special-tests" className="text-sm font-semibold hover:underline">All special tests <span aria-hidden="true">↗</span></Link>
      </nav>
    </header>
    <main id="library" className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <section className="max-w-3xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#2A5A8C]">MedOrtho · Clinical reference library</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">Orthopedic special tests.<br /><span className="text-[#2A5A8C]">Find your next reference.</span></h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">Explore orthopedic special tests by body region. Find examination procedures, interpretation, reference images and sources.</p>
        <form action="/medortho/special-tests" role="search" className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#4AADE4]">
          <Search aria-hidden="true" className="ml-3 hidden h-5 w-5 shrink-0 sm:block" />
          <label htmlFor="library-search" className="sr-only">Search orthopedic special tests</label>
          <input id="library-search" name="q" type="search" placeholder="Search a test, region or condition" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base text-slate-900 outline-none" />
          <button className="rounded-xl bg-[#1B3A5C] px-5 py-3 font-semibold text-white hover:bg-[#2A5A8C]">Search</button>
        </form>
        <p className="mt-4 text-sm text-slate-500">{tests.length ? `${tests.length} tests in the web library · ` : ""}Browse by region or explore the complete directory</p>
      </section>
      <section className="mt-14" aria-labelledby="regions-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Explore the library</p><h2 id="regions-heading" className="text-2xl font-bold md:text-3xl">Browse by body region</h2></div>
          <Link to="/medortho/special-tests#all-tests" className="text-sm font-semibold hover:underline">View A–Z directory →</Link>
        </div>
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-4">
          {regions.map(([slug, name], i) => {
            const count = tests.filter(t => slug === "neurological" ? /neuro/i.test(`${t.category} ${t.subCategory || ""}`) : t.category === name).length;
            return <Link key={slug} to={`/medortho/${slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#4AADE4] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2A5A8C]">
              <div className="mb-7 flex items-center justify-between text-slate-400"><span className="text-xs font-medium">0{i + 1}</span><ArrowRight aria-hidden="true" className="h-5 w-5 text-[#2A5A8C] transition group-hover:translate-x-1" /></div>
              <h3 className="text-lg font-bold">{name}</h3><p className="mt-2 text-sm text-slate-500">{tests.length ? `${count} tests` : "Explore tests"}</p>
            </Link>;
          })}
        </div>
      </section>
      <section className="mt-10 grid gap-6 rounded-2xl bg-[#1B3A5C] p-7 text-white md:grid-cols-2 md:p-10" aria-label="Library and app">
        <div><BookOpen aria-hidden="true" className="mb-4 h-6 w-6 text-[#7CC4ED]" /><h2 className="text-xl font-bold">Every test, one directory</h2><p className="my-3 leading-relaxed text-slate-200">Browse the complete alphabetical index or search for a specific examination.</p><Link to="/medortho/special-tests" className="inline-block py-2 font-semibold underline underline-offset-4">Open the test directory →</Link></div>
        <div className="border-t border-white/20 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0"><Smartphone aria-hidden="true" className="mb-4 h-6 w-6 text-[#7CC4ED]" /><h2 className="text-xl font-bold">MedOrtho on your phone</h2><p className="my-3 leading-relaxed text-slate-200">Explore the MedOrtho Android app alongside the web library.</p><a href={app.playStoreLink} className="inline-block py-2 font-semibold underline underline-offset-4">View on Google Play ↗</a></div>
      </section>
    </main>
    <footer className="border-t border-slate-200 bg-white px-5 py-8 text-sm text-slate-500"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5"><p>MedOrtho · Exam Essentials</p><nav aria-label="Footer" className="flex flex-wrap gap-6"><Link to="/medortho/special-tests">Test directory</Link><Link to="/privacy-policy">Privacy</Link><Link to="/">Exam Essentials</Link></nav></div></footer>
  </div>;
}
