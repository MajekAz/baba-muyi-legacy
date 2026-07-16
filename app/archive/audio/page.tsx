import { PageShell } from "@/components/page-shell";
import { PublicMediaGrid } from "@/components/media/public-media-grid";
import { getPublicMediaRecords } from "@/lib/media/queries";

export default async function ArchiveAudioPage() {
  return (
    <PageShell eyebrow="Archive" title="Audio recordings" description="Approved public audio records from the archive.">
      <PublicMediaGrid records={await getPublicMediaRecords({ type: "audio" })} />
    </PageShell>
  );
}
