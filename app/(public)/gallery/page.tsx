import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PublicAlbumGrid, PublicMediaGrid } from "@/components/media/public-media-grid";
import { getPublicAlbums, getPublicMediaRecords } from "@/lib/media/queries";
import { siteConfig } from "@/lib/site";

const title = "Baba Muyi Photo Archive | LegacyHub";
const description =
  "Explore approved Baba Muyi Legacy photographs and albums, including family life, transport heritage, Bariga, Iboogun, Abeokuta roots, and documentary preservation materials.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: new URL("/gallery", siteConfig.url).toString() },
  openGraph: {
    title,
    description,
    url: new URL("/gallery", siteConfig.url).toString(),
    siteName: siteConfig.name,
    type: "website"
  },
  twitter: {
    card: "summary",
    title,
    description
  }
};

export default async function GalleryPage() {
  const [albums, images] = await Promise.all([
    getPublicAlbums(),
    getPublicMediaRecords({ type: "image" })
  ]);

  return (
    <PageShell eyebrow="Gallery" title="Photo archive" description="Published and approved public images from the Baba Muyi Legacy archive.">
      <div className="grid gap-8">
        <PublicAlbumGrid albums={albums} />
        <PublicMediaGrid records={images} />
      </div>
    </PageShell>
  );
}
