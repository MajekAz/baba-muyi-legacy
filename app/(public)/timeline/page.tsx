import { CmsPublicPage } from "@/components/cms/cms-public-page";
import { publicCmsPageMetadata } from "@/lib/cms-page-metadata";

export const generateMetadata = () =>
  publicCmsPageMetadata({
    path: "/timeline",
    fallbackTitle: "Baba Muyi Historical Timeline | LegacyHub",
    fallbackDescription: "Explore broad historical phases from the life of Alhaji Tioluwalase “Baba Muyi” Majekodunmi."
  });

export default function TimelinePage() {
  return <CmsPublicPage path="/timeline" />;
}
