import SEOHead from "@/components/SEOHead";
import MedAppPage from "../components/MedAppPage";
import { medicalApps } from "../data/medicalAppsData";
import { buildAppStructuredData } from "../data/seoHelpers";

const app = medicalApps.find((a) => a.slug === "medpharma")!;
const structuredData = buildAppStructuredData(app);

const MedPharmaPage = () => (
  <>
    <SEOHead
      title={app.seo.title}
      description={app.seo.description}
      canonical={`/${app.slug}`}
      keywords={app.seo.keywords}
      skipDefaultKeywords
      structuredData={structuredData}
    />
    <MedAppPage app={app} />
  </>
);

export default MedPharmaPage;
