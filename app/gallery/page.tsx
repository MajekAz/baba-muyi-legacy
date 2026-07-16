import { PageShell } from "@/components/page-shell";
import { PublicAlbumGrid, PublicMediaGrid } from "@/components/media/public-media-grid";
import { getPublicAlbums, getPublicMediaRecords } from "@/lib/media/queries";

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
