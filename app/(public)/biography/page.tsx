import type { Metadata } from "next";
import { BiographyPublicPage } from "@/components/public-archive/biography-public-page";
import { getPublicCmsCoreRecords } from "@/lib/cms-core";
import { getActiveCmsWorkspaceContext, getCmsPageByPath } from "@/lib/cms-store";
import { getPublicFeaturedMediaForContent } from "@/lib/media/queries";
import { siteConfig } from "@/lib/site";

const fallbackTitle = "Alhaji Tioluwalase “Baba Muyi” Majekodunmi | Official Biography";
const fallbackDescription = "Family-reviewed biography chapters from the Tioluwalase Majekodunmi archive will appear here when they are ready for public release.";

export async function generateMetadata(): Promise<Metadata> {
  const [{ workspace, legacyProfile }, page] = await Promise.all([
    getActiveCmsWorkspaceContext(),
    getCmsPageByPath("/biography")
  ]);
  const context = { workspaceId: workspace.id, legacyProfileId: legacyProfile.id };
  const records = await getPublicCmsCoreRecords("biography", context);
  const featuredMedia = records.length
    ? await getPublicFeaturedMediaForContent("biography_chapters", records.map((record) => record.id))
    : new Map();
  const title = page?.seoTitle || page?.title || fallbackTitle;
  const description = page?.metaDescription || page?.description || fallbackDescription;
  const url = new URL("/biography", siteConfig.url).toString();
  const image = [...featuredMedia.values()].find((item) => item.mediaType === "image" && item.signedUrl);
  const openGraphImage = image?.signedUrl
    ? [{ url: image.signedUrl, alt: image.altText || image.title || "Tioluwalase Majekodunmi biography image" }]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: "/biography"
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url,
      siteName: siteConfig.name,
      images: openGraphImage
    },
    twitter: {
      card: openGraphImage ? "summary_large_image" : "summary",
      title,
      description,
      images: openGraphImage
    }
  };
}

export default function BiographyPage() {
  return <BiographyPublicPage />;
}
