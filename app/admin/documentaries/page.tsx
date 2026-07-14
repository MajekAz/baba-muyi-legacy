import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CmsContentForm } from "@/components/admin/cms-content-form";
import { getCmsContent } from "@/lib/cms-store";

export default async function AdminDocumentariesPage() {
  const documentaries = await getCmsContent("documentary");
  const episodes = await getCmsContent("documentary_episode");

  return (
    <main>
      <AdminPageHeader eyebrow="Documentary Centre" title="Documentary management" description="Manage documentaries, episodes, trailers, clips, transcripts, subtitles, chapters, related media, and video-provider playback IDs." />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <div className="rounded border border-archive-navy/12 bg-white p-6">
          <h2 className="font-serif text-2xl text-archive-navy">Provider policy</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">Use YouTube, Vimeo, Cloudflare Stream, or Mux for full documentaries. Supabase Storage is reserved for smaller clips and supporting files.</p>
        </div>
        <CmsContentForm kind="documentary" />
        <div className="grid gap-3 rounded border border-archive-navy/12 bg-white p-6">
          <h2 className="font-serif text-2xl text-archive-navy">Documentary records</h2>
          {[...documentaries, ...episodes].map((record) => (
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
