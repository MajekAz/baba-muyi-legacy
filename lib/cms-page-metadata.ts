import type { Metadata } from "next";
import { getCmsPageByPath } from "@/lib/cms-store";
import { siteConfig } from "@/lib/site";

type PublicCmsMetadataInput = {
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
};

export async function publicCmsPageMetadata({ path, fallbackTitle, fallbackDescription }: PublicCmsMetadataInput): Promise<Metadata> {
  const page = await getCmsPageByPath(path);
  const title = page?.seoTitle || page?.title || fallbackTitle;
  const description = page?.metaDescription || page?.description || fallbackDescription;
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
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
