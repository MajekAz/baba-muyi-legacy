import { ShieldCheck } from "lucide-react";
import { requireAdminRole } from "@/lib/auth";
import { getCmsCollectionSummaries } from "@/lib/cms-store";

export default async function AdminPage() {
  const session = await requireAdminRole(["owner", "administrator", "editor", "contributor", "reviewer", "viewer"]);

  if (!session) {
    return null;
  }

  const { profile } = session;
  const collections = await getCmsCollectionSummaries();

  return (
    <main className="min-h-screen bg-archive-cream">
      <section className="bg-archive-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-archive-gold">
            <ShieldCheck aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-[0.18em]">Protected administration</p>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold">Archive control room</h1>
          <p className="mt-4 max-w-2xl text-white/72">
            Signed in as {profile.display_name ?? "an authorised user"} with the {profile.role} role.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <article className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm" key={collection.kind}>
              <h2 className="font-serif text-2xl text-archive-navy">{collection.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {collection.description}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
                <span className="rounded bg-archive-cream px-2 py-2">{collection.count} total</span>
                <span className="rounded bg-green-50 px-2 py-2 text-green-800">{collection.published} live</span>
                <span className="rounded bg-amber-50 px-2 py-2 text-amber-800">{collection.drafts} drafts</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
