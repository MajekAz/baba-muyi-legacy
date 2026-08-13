import { DocumentariesPublicPage } from "@/components/public-archive/documentaries-public-page";
import { getCmsPageByPath } from "@/lib/cms-store";
import { siteConfig } from "@/lib/site";

export async function generateMetadata() {
  const path = "/documentaries";
  const page = await getCmsPageByPath(path);
  const title = page?.seoTitle || page?.title || "Baba Muyi Documentaries | Baba Muyi Legacy";
  const description = page?.metaDescription || page?.description || "Watch approved documentary records exploring Baba Muyi’s biography, family memories, transport heritage, community service, and enduring legacy.";
  const url = new URL(path, siteConfig.url).toString();

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

export default function DocumentariesPage() {
  return <DocumentariesPublicPage />;
}
