import { BabaMuyiCinematicHome } from "@/components/public-archive/homepage";
import { getCmsCoreRecords } from "@/lib/cms-core";
import { getCmsMenus, getPublishedCmsContent, getActiveCmsWorkspaceContext } from "@/lib/cms-store";
import { getPublicMediaRecords } from "@/lib/media/queries";
import type { CmsCoreCollection, CmsCoreRecord } from "@/lib/cms-core";

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
      heroImage={images[0]}
      lessons={lessons}
      navigation={navigation}
      stories={stories}
      timeline={timeline}
    />
  );
}
