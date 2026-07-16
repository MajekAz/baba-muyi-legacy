import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaEditForm } from "@/components/admin/media-edit-form";
import { getAdminMediaRecord, getMediaAlbums } from "@/lib/media/queries";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

export default async function AdminMediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const { id } = await params;
  const [record, albums] = await Promise.all([
    getAdminMediaRecord(context, id),
    getMediaAlbums(context)
  ]);

  if (!record) notFound();

  return (
    <main>
      <AdminPageHeader eyebrow="Media Library" title={record.title} description="Edit archive metadata, privacy, review state, publication state, and album assignment." />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <div className="rounded border border-archive-navy/12 bg-white p-5 text-sm text-slate-600 shadow-sm">
          <p><strong className="text-archive-navy">Original path:</strong> {record.storageBucket}/{record.storagePath}</p>
          <p className="mt-1"><strong className="text-archive-navy">MIME:</strong> {record.mimeType || "Unknown"} · <strong className="text-archive-navy">Size:</strong> {Math.round(record.fileSize / 1024)} KB</p>
          <Link className="mt-4 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={`/admin/media/${record.id}/view`} target="_blank">
            Open secure preview
          </Link>
        </div>
        <MediaEditForm record={record} albums={albums} />
      </section>
    </main>
  );
}
