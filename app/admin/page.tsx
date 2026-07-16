import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { requireAdminRole } from "@/lib/auth";
import { cmsCoreCollections, getCmsCoreRecords, type CmsCoreCollection } from "@/lib/cms-core";
import { getAdminMediaRecords } from "@/lib/media/queries";
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
  const mediaRecords = await getAdminMediaRecords(context);
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
  const pendingReviews = [
    ...records.filter((record) => record.status === "in_review"),
    ...mediaRecords.filter((record) => record.publicationStatus === "in_review" || record.moderationStatus === "pending")
  ].slice(0, 6);
  const recentMedia = mediaRecords.slice(0, 5);

  return (
    <main className="min-h-screen bg-archive-cream">
      <section className="bg-archive-navy text-white">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-archive-gold">
            <ShieldCheck aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-[0.18em]">LegacyHub administration</p>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">Archive control room</h1>
          <p className="mt-4 max-w-2xl text-white/72">
            Signed in as {profile.display_name ?? "an authorised user"} with the {profile.role} role for {context.workspaceName}.
          </p>
        </div>
      </section>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
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

        <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_22rem]">
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
                <div className="py-4">
                  <AdminEmptyState
                    actionHref="/admin/content/biography/new"
                    actionLabel="Create first chapter"
                    description="Begin with a biography chapter, timeline event, story, lesson, or blog post."
                    title="No written content yet"
                  />
                </div>
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
              <Link className="rounded border border-slate-200 px-4 py-3 text-sm font-semibold text-archive-navy hover:bg-archive-cream" href="/admin/media/upload">
                Upload media
              </Link>
              <Link className="rounded border border-slate-200 px-4 py-3 text-sm font-semibold text-archive-navy hover:bg-archive-cream" href="/admin/media/albums">
                Create album
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <section className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-archive-navy">Pending review</h2>
            <div className="mt-4 divide-y divide-slate-200">
              {pendingReviews.length ? pendingReviews.map((item) => (
                <div className="py-3 text-sm" key={item.id}>
                  <p className="font-semibold text-archive-navy">{item.title}</p>
                  <p className="text-slate-600">Awaiting review or moderation.</p>
                </div>
              )) : (
                <AdminEmptyState
                  description="There are currently no submissions awaiting review for this workspace and legacy profile."
                  title="No pending reviews"
                />
              )}
            </div>
          </section>

          <section className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-archive-navy">Recent media</h2>
            <div className="mt-4 divide-y divide-slate-200">
              {recentMedia.length ? recentMedia.map((media) => (
                <Link className="block py-3 text-sm" href={`/admin/media/${media.id}`} key={media.id}>
                  <p className="font-semibold text-archive-navy">{media.title}</p>
                  <p className="text-slate-600">{media.mediaType.replace("_", " ")} · {media.publicationStatus} · {media.visibility}</p>
                </Link>
              )) : (
                <AdminEmptyState
                  actionHref="/admin/media/upload"
                  actionLabel="Upload media"
                  description="Upload photographs, documents, audio, or short clips when source material is ready."
                  title="No media uploaded yet"
                />
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
