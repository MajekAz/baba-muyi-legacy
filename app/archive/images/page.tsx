import { PageShell } from "@/components/page-shell";
import { PublicMediaGrid } from "@/components/media/public-media-grid";
import { getPublicMediaRecords } from "@/lib/media/queries";

export default async function ArchiveImagesPage() {
  return (
    <PageShell eyebrow="Archive" title="Images" description="Approved public images from the archive.">
      <PublicMediaGrid records={await getPublicMediaRecords({ type: "image" })} />
    </PageShell>
  );
}
