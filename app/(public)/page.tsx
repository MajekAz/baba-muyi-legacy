import { BabaMuyiCinematicHome } from "@/components/public-archive/homepage";
import { getCmsCoreRecords } from "@/lib/cms-core";
import { getCmsMenus, getPublishedCmsContent, getActiveCmsWorkspaceContext } from "@/lib/cms-store";
import { getPublicMediaRecords } from "@/lib/media/queries";
import type { CmsCoreCollection, CmsCoreRecord } from "@/lib/cms-core";
import type { Metadata } from "next";

const homepageTitle = "Baba Muyi Legacy | The Life of Alhaji Tioluwalase Majekodunmi";
const homepageDescription =
  "Explore the life, transport history, family story, values and enduring legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi through biography, photographs, documentary film, memories and historical records.";

export const metadata: Metadata = {
  title: {
    absolute: homepageTitle
  },
  description: homepageDescription,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    type: "website",
    url: "/"
  },
  twitter: {
    card: "summary",
    title: homepageTitle,
    description: homepageDescription
  }
};

async function getHomepagePreviewRecords(collection: CmsCoreCollection, context: { workspaceId: string; legacyProfileId: string }): Promise<CmsCoreRecord[]> {
  try {
    return await getCmsCoreRecords(collection, context, { publicOnly: true });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [{ workspace, legacyProfile }, navigation, images, documentaries] = await Promise.all([
    getActiveCmsWorkspaceContext(),
    getCmsMenus("header"),
    getPublicMediaRecords({ type: "image" }),
    getPublishedCmsContent("documentary", "/documentaries")
  ]);
  const context = { workspaceId: workspace.id, legacyProfileId: legacyProfile.id };
  const [timeline, lessons, stories] = await Promise.all([
    getHomepagePreviewRecords("timeline", context),
    getHomepagePreviewRecords("lessons", context),
    getHomepagePreviewRecords("stories", context)
  ]);

  return (
    <BabaMuyiCinematicHome
      documentary={documentaries[0] ? { title: documentaries[0].title, summary: documentaries[0].summary } : undefined}
      galleryImages={images.slice(1, 4)}
      heroImage={images[0]}
      lessons={lessons}
      navigation={navigation}
      stories={stories}
      timeline={timeline}
    />
  );
}
