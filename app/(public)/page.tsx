import { BabaMuyiCinematicHome } from "@/components/public-archive/homepage";
import { getCmsCoreRecords } from "@/lib/cms-core";
import { getCmsMenus, getPublishedCmsContent, getActiveCmsWorkspaceContext } from "@/lib/cms-store";
import { getPublicMediaRecords } from "@/lib/media/queries";
import type { CmsCoreCollection, CmsCoreRecord } from "@/lib/cms-core";
import type { Metadata } from "next";

const homepageTitle = "Baba Muyi Legacy | The Life of Alhaji Tioluwalase Majekodunmi";
const homepageDescription =
  "Explore the life, transport history, family story, values and enduring legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi through biography, photographs, documentary film, memories and historical records.";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://babamuyilegacy.com";
}

export async function generateMetadata(): Promise<Metadata> {
  const [image] = await getPublicMediaRecords({ type: "image" });
  const openGraphImage = image?.signedUrl
    ? [{ url: image.signedUrl, alt: image.altText || image.title || "Baba Muyi Legacy archive image" }]
    : undefined;

  return {
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
      url: "/",
      images: openGraphImage
    },
    twitter: {
      card: openGraphImage ? "summary_large_image" : "summary",
      title: homepageTitle,
      description: homepageDescription,
      images: openGraphImage?.map((item) => item.url)
    }
  };
}

function homepageJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#baba-muyi`,
        name: "Alhaji Tioluwalase Majekodunmi",
        alternateName: "Baba Muyi",
        url: siteUrl
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Baba Muyi Legacy",
        url: siteUrl,
        description: homepageDescription,
        about: {
          "@id": `${siteUrl}/#baba-muyi`
        }
      }
    ]
  };
}

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
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd()) }}
      />
      <BabaMuyiCinematicHome
        documentary={documentaries[0] ? { title: documentaries[0].title, summary: documentaries[0].summary } : undefined}
        galleryImages={images.slice(1, 4)}
        heroImage={images[0]}
        lessons={lessons}
        navigation={navigation}
        stories={stories}
        timeline={timeline}
      />
    </>
  );
}
