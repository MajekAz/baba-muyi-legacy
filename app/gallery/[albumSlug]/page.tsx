import { PageShell } from "@/components/page-shell";
import { PublicMediaGrid } from "@/components/media/public-media-grid";
import { getPublicMediaRecords } from "@/lib/media/queries";

export default async function GalleryAlbumPage({ params }: { params: Promise<{ albumSlug: string }> }) {
  const { albumSlug } = await params;
  const records = await getPublicMediaRecords({ albumSlug });

  return (
    <PageShell eyebrow="Gallery" title="Album" description="Published public media from this archive album.">
      <PublicMediaGrid records={records} />
    </PageShell>
  );
}
