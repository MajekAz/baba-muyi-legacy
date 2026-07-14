import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CmsContentForm } from "@/components/admin/cms-content-form";
import { CmsPageForm } from "@/components/admin/cms-page-form";
import { archiveCmsContent } from "@/lib/cms-actions";
import { getAllCmsPages, getCmsContent } from "@/lib/cms-store";

export default async function AdminContentPage() {
  const pages = await getAllCmsPages();
  const content = await getCmsContent();
  const homepage = pages.find((page) => page.path === "/") ?? pages[0];

  return (
    <main>
      <AdminPageHeader eyebrow="CMS" title="Content management" description="Edit every public page and every reusable biography, timeline, lesson, gallery, documentary, family, testimonial, and blog record." />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-archive-navy">CMS page records</h2>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {pages.map((page) => (
              <article className="rounded border border-slate-200 p-4" key={page.id}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{page.path}</p>
                <h3 className="mt-2 font-serif text-xl text-archive-navy">{page.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{page.status} · {page.visibility} · {page.verificationStatus}</p>
              </article>
            ))}
          </div>
        </div>
        {homepage ? <CmsPageForm page={homepage} /> : null}
        <CmsContentForm />
        <div className="grid gap-3 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-archive-navy">Reusable CMS records</h2>
          {content.map((record) => (
            <article className="rounded border border-slate-200 p-4" key={record.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{record.kind}</p>
                  <h3 className="mt-1 font-serif text-xl text-archive-navy">{record.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{record.summary}</p>
                </div>
                <span className="rounded bg-archive-cream px-3 py-1 text-xs font-semibold text-archive-brown">{record.status}</span>
              </div>
              <form action={archiveCmsContent} className="mt-4">
                <input name="id" type="hidden" value={record.id} />
                <input name="relatedPath" type="hidden" value={record.relatedPath ?? ""} />
                <button className="rounded border border-archive-navy/20 px-3 py-2 text-xs font-semibold text-archive-navy" type="submit">
                  Archive record
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
