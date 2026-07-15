import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { cmsCoreCollections, getCmsCoreRecord, type CmsCoreCollection } from "@/lib/cms-core";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

function isCollection(value: string): value is CmsCoreCollection {
  return value in cmsCoreCollections;
}

export default async function PreviewCmsContentPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection: collectionParam, id } = await params;
  if (!isCollection(collectionParam)) notFound();

  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const record = await getCmsCoreRecord(collectionParam, id, context);
  if (!record) notFound();

  return (
    <main>
      <AdminPageHeader eyebrow="Authenticated preview" title={record.title} description={record.summary || "Preview is only available to authorised workspace members."} />
      <section className="p-4 sm:p-6 lg:p-8">
        <article className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">
            {record.status} · {record.visibility} · {record.verificationStatus}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Created by: {record.createdBy || "not recorded"} · Last editor: {record.lastEditorId || "not recorded"}
          </p>
          <div className="prose mt-5 max-w-none" dangerouslySetInnerHTML={{ __html: record.contentHtml || `<p>${record.summary}</p>` }} />
        </article>
      </section>
    </main>
  );
}
