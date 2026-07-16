import { PageShell } from "@/components/page-shell";
import { PublicMediaGrid } from "@/components/media/public-media-grid";
import { getPublicMediaRecords } from "@/lib/media/queries";

export default async function ArchiveDocumentsPage() {
  return (
    <PageShell eyebrow="Archive" title="Documents" description="Approved public documents from the archive.">
      <PublicMediaGrid records={await getPublicMediaRecords({ type: "document" })} />
    </PageShell>
  );
}
