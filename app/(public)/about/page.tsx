import { CmsPublicPage } from "@/components/cms/cms-public-page";
import { publicCmsPageMetadata } from "@/lib/cms-page-metadata";

export const generateMetadata = () =>
  publicCmsPageMetadata({
    path: "/curator",
    fallbackTitle: "About Alhaji Tioluwalase “Baba Muyi” Majekodunmi",
    fallbackDescription: "Learn about Baba Muyi Legacy, the archive preserving Alhaji Tioluwalase “Baba Muyi” Majekodunmi’s life and legacy."
  });

export default function AboutPage() {
  return <CmsPublicPage path="/curator" />;
}
