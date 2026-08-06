import { CmsPublicPage } from "@/components/cms/cms-public-page";
import { publicCmsPageMetadata } from "@/lib/cms-page-metadata";

export const generateMetadata = () =>
  publicCmsPageMetadata({
    path: "/lessons",
    fallbackTitle: "Legacy Lessons from Baba Muyi | LegacyHub",
    fallbackDescription: "Read values and lessons drawn from the approved biography of Alhaji Tioluwalase “Baba Muyi” Majekodunmi."
  });

export default function LessonsPage() {
  return <CmsPublicPage path="/lessons" />;
}
