import SEOHead from "@/components/SEOHead";
import MedAppPage from "../components/MedAppPage";
import { medicalApps } from "../data/medicalAppsData";

const app = medicalApps.find((a) => a.slug === "medphysio")!;

const MedPhysioPage = () => (
  <>
    <SEOHead
      title={app.seo.title}
      description={app.seo.description}
      canonical={`/${app.slug}`}
      keywords={app.seo.keywords}
      structuredData={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: app.name,
        description: app.seo.description,
        applicationCategory: "HealthApplication",
        author: { "@type": "Organization", name: "Exam Essentials" },
      }}
    />
    <MedAppPage app={app} />
  </>
);

export default MedPhysioPage;
