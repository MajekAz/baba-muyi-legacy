import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CmsContentForm } from "@/components/admin/cms-content-form";
import { MediaUploader } from "@/components/admin/media-uploader";
import { getCmsContent } from "@/lib/cms-store";

export default async function AdminMediaPage() {
  const media = await getCmsContent("media_item");
  const albums = await getCmsContent("gallery_album");

  return (
    <main>
      <AdminPageHeader eyebrow="Media Library" title="Upload and organise media" description="Validate files, preview uploads, and prepare metadata before saving to Supabase Storage. Private and unreviewed files stay private by default." />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <MediaUploader />
        <CmsContentForm kind="media_item" />
        <div className="grid gap-3 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-archive-navy">Media and album records</h2>
          {[...albums, ...media].map((record) => (
            <article className="rounded border border-slate-200 p-4" key={record.id}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{record.kind} · {record.status}</p>
              <h3 className="mt-1 font-serif text-xl text-archive-navy">{record.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{record.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
