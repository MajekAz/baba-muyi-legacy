import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { archiveCmsCoreContent } from "@/lib/cms-core-actions";
import { cmsCoreCollections, getCmsCoreRecords, type CmsCoreCollection } from "@/lib/cms-core";
import { roleHasPermission } from "@/lib/permissions";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

function isCollection(value: string): value is CmsCoreCollection {
  return value in cmsCoreCollections;
}

export default async function CmsCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionParam } = await params;
  if (!isCollection(collectionParam)) notFound();

  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const records = await getCmsCoreRecords(collectionParam, context);
  const config = cmsCoreCollections[collectionParam];
  const canPublish = roleHasPermission(context.role, "publish_content");

  return (
    <main>
      <AdminPageHeader eyebrow="CMS" title={config.pluralLabel} description={config.description} />
      <section className="grid gap-5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="rounded bg-white px-3 py-2">{records.length} total</span>
            <span className="rounded bg-white px-3 py-2">{records.filter((record) => record.status === "draft").length} drafts</span>
            <span className="rounded bg-white px-3 py-2">{records.filter((record) => record.status === "in_review").length} in review</span>
            <span className="rounded bg-white px-3 py-2">{records.filter((record) => record.status === "published").length} published</span>
          </div>
          <Link className="rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={`/admin/content/${collectionParam}/new`}>
            Create {config.label.toLowerCase()}
          </Link>
        </div>

        <div className="overflow-hidden rounded border border-archive-navy/12 bg-white shadow-sm">
          {records.length ? (
            <div className="divide-y divide-slate-200">
              {records.map((record) => (
                <article className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center" key={record.id}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{record.status} · {record.visibility} · {record.verificationStatus}</p>
                    <h2 className="mt-1 font-serif text-2xl text-archive-navy">{record.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{record.summary || "No summary yet."}</p>
                    <p className="mt-2 text-xs text-slate-500">Slug: {record.slug || "not set"} · Updated {record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "unknown"}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Created by: {record.createdBy || "not recorded"} · Last editor: {record.lastEditorId || "not recorded"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link className="rounded border border-archive-navy/20 px-3 py-2 text-xs font-semibold text-archive-navy" href={`/admin/content/${collectionParam}/${record.id}`}>
                      Edit
                    </Link>
                    <Link className="rounded border border-archive-navy/20 px-3 py-2 text-xs font-semibold text-archive-navy" href={`/admin/content/${collectionParam}/${record.id}/preview`}>
                      Preview
                    </Link>
                    {canPublish && record.status !== "archived" ? (
                      <form action={archiveCmsCoreContent}>
                        <input name="collection" type="hidden" value={collectionParam} />
                        <input name="id" type="hidden" value={record.id} />
                        <button className="rounded border border-red-200 px-3 py-2 text-xs font-semibold text-red-700" type="submit">
                          Archive
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-sm leading-6 text-slate-600">
              No {config.pluralLabel.toLowerCase()} have been added yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
