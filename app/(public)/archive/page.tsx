import { PageShell } from "@/components/page-shell";
import { PublicMediaGrid } from "@/components/media/public-media-grid";
import { getPublicMediaRecords } from "@/lib/media/queries";

export default async function ArchivePage() {
  const records = await getPublicMediaRecords();

  return (
    <PageShell eyebrow="Archive" title="Digital archive" description="Approved public media records from the Baba Muyi Legacy archive.">
      <PublicMediaGrid records={records} />
    </PageShell>
  );
}
