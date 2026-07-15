import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { requireAdminRole } from "@/lib/auth";
import { cmsCoreCollections, getCmsCoreRecords, type CmsCoreCollection } from "@/lib/cms-core";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

export default async function AdminPage() {
  const session = await requireAdminRole(["owner", "administrator", "editor", "contributor", "reviewer", "viewer"]);

  if (!session) {
    return null;
  }

  const { profile } = session;
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const collections = Object.keys(cmsCoreCollections) as CmsCoreCollection[];
  const recordsByCollection = await Promise.all(collections.map(async (collection) => getCmsCoreRecords(collection, context)));
  const records = recordsByCollection.flat();
  const recent = records
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);
  const counts = {
    draft: records.filter((record) => record.status === "draft").length,
    inReview: records.filter((record) => record.status === "in_review").length,
    published: records.filter((record) => record.status === "published").length,
    archived: records.filter((record) => record.status === "archived").length
  };

  return (
    <main className="min-h-screen bg-archive-cream">
      <section className="bg-archive-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-archive-gold">
            <ShieldCheck aria-hidden="true" />
          <p className="text-sm font-bold uppercase tracking-[0.18em]">LegacyHub administration</p>
        </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold">Archive control room</h1>
          <p className="mt-4 max-w-2xl text-white/72">
            Signed in as {profile.display_name ?? "an authorised user"} with the {profile.role} role.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          <article className="rounded border border-archive-navy/12 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">Drafts</p>
            <p className="mt-2 font-serif text-4xl text-archive-navy">{counts.draft}</p>
          </article>
          <article className="rounded border border-archive-navy/12 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">In review</p>
            <p className="mt-2 font-serif text-4xl text-archive-navy">{counts.inReview}</p>
          </article>
          <article className="rounded border border-archive-navy/12 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">Published</p>
            <p className="mt-2 font-serif text-4xl text-archive-navy">{counts.published}</p>
          </article>
          <article className="rounded border border-archive-navy/12 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">Archived</p>
            <p className="mt-2 font-serif text-4xl text-archive-navy">{counts.archived}</p>
          </article>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <section className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-archive-navy">Recent content</h2>
            <div className="mt-4 divide-y divide-slate-200">
              {recent.length ? recent.map((record) => (
                <Link className="block py-4" href={`/admin/content/${record.collection}/${record.id}`} key={record.id}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{cmsCoreCollections[record.collection as CmsCoreCollection].label} · {record.status}</p>
                  <h3 className="mt-1 font-serif text-xl text-archive-navy">{record.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{record.summary || "No summary yet."}</p>
                </Link>
              )) : (
                <p className="py-4 text-sm text-slate-600">No written content records have been created yet.</p>
              )}
            </div>
          </section>
          <aside className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-archive-navy">Quick create</h2>
            <div className="mt-4 grid gap-2">
              {collections.map((collection) => (
                <Link className="rounded border border-slate-200 px-4 py-3 text-sm font-semibold text-archive-navy hover:bg-archive-cream" href={`/admin/content/${collection}/new`} key={collection}>
                  {cmsCoreCollections[collection].label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
