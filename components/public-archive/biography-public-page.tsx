import { BiographyLongformPage } from "@/components/public-archive/biography-longform-page";
import { getPublicCmsCoreRecords } from "@/lib/cms-core";
import { getActiveCmsWorkspaceContext } from "@/lib/cms-store";
import { getPublicFeaturedMediaForContent } from "@/lib/media/queries";
import { siteConfig } from "@/lib/site";

function biographyUrl() {
  return new URL("/biography", siteConfig.url).toString();
}

async function biographyJsonLd() {
  const { workspace, legacyProfile } = await getActiveCmsWorkspaceContext();
  const records = await getPublicCmsCoreRecords("biography", { workspaceId: workspace.id, legacyProfileId: legacyProfile.id });
  const featuredMedia = records.length
    ? await getPublicFeaturedMediaForContent("biography_chapters", records.map((record) => record.id))
    : new Map();
  const image = [...featuredMedia.values()].find((item) => item.mediaType === "image" && item.signedUrl);
  const url = biographyUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name: "Alhaji Tioluwalase Majekodunmi",
        url,
        ...(image?.signedUrl ? { image: image.signedUrl } : {}),
        subjectOf: {
          "@id": `${url}#webpage`
        }
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: "Tioluwalase Majekodunmi Biography",
        url,
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url
        },
        about: {
          "@id": `${url}#person`
        }
      }
    ]
  };
}

export async function BiographyPublicPage() {
  const jsonLd = await biographyJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BiographyLongformPage />
    </>
  );
}
