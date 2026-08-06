import { CmsPublicPage } from "@/components/cms/cms-public-page";
import { publicCmsPageMetadata } from "@/lib/cms-page-metadata";

export const generateMetadata = () =>
  publicCmsPageMetadata({
    path: "/documentaries",
    fallbackTitle: "Baba Muyi Documentaries | LegacyHub",
    fallbackDescription: "Documentary materials connected to Baba Muyi’s biography, family memories, historical records, photographs, and transport heritage."
  });

export default function DocumentariesPage() {
  return <CmsPublicPage path="/documentaries" />;
}
