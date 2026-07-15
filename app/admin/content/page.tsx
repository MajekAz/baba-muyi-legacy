import { AdminPageHeader } from "@/components/admin/admin-page-header";
import Link from "next/link";
import { cmsCoreCollections, getCmsCoreRecords, type CmsCoreCollection } from "@/lib/cms-core";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

export default async function AdminContentPage() {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const collections = Object.keys(cmsCoreCollections) as CmsCoreCollection[];
  const summaries = await Promise.all(collections.map(async (collection) => {
    const records = await getCmsCoreRecords(collection, context);
    return {
      collection,
      config: cmsCoreCollections[collection],
      total: records.length,
      drafts: records.filter((record) => record.status === "draft").length,
      inReview: records.filter((record) => record.status === "in_review").length,
      published: records.filter((record) => record.status === "published").length,
      archived: records.filter((record) => record.status === "archived").length
    };
  }));

  return (
    <main>
      <AdminPageHeader eyebrow="CMS" title="Written content management" description="Create, review, publish, archive, reorder, and preview database-backed legacy content." />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summaries.map((summary) => (
            <article className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm" key={summary.collection}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{summary.config.publicPath}</p>
              <h2 className="mt-2 font-serif text-2xl text-archive-navy">{summary.config.pluralLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{summary.config.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                <span className="rounded bg-archive-cream px-3 py-2">{summary.total} total</span>
                <span className="rounded bg-slate-100 px-3 py-2">{summary.drafts} drafts</span>
                <span className="rounded bg-amber-50 px-3 py-2 text-amber-800">{summary.inReview} in review</span>
                <span className="rounded bg-green-50 px-3 py-2 text-green-800">{summary.published} published</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link className="rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={`/admin/content/${summary.collection}`}>
                  Manage
                </Link>
                <Link className="rounded border border-archive-navy/20 px-4 py-2 text-sm font-semibold text-archive-navy" href={`/admin/content/${summary.collection}/new`}>
                  Quick create
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
