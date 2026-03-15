import SEOHead from "@/components/SEOHead";
import MedAppPage from "../components/MedAppPage";
import { medicalApps } from "../data/medicalAppsData";

const app = medicalApps.find((a) => a.slug === "medortho")!;

const MedOrthoPage = () => (
  <>
    <SEOHead
      title={app.seo.title}
      description={app.seo.description}
      canonical={`/${app.slug}`}
      keywords={app.seo.keywords}
      structuredData={{
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        name: app.name,
        description: app.seo.description,
        applicationCategory: "HealthApplication",
        operatingSystem: "Android",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        installUrl: app.playStoreLink,
        author: { "@type": "Organization", name: "Exam Essentials" },
      }}
    />
    <MedAppPage app={app} />
  </>
);

export default MedOrthoPage;
