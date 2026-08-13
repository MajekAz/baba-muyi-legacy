import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusCard } from "@/components/status-card";
import { getCmsPageByPath, getPublishedCmsContent } from "@/lib/cms-store";
import type { CmsContentRecord } from "@/lib/cms-types";

const approvedYouTubeVideos = {
  BW_t_CwFV60: {
    start: 72,
    embedUrl: "https://www.youtube-nocookie.com/embed/BW_t_CwFV60?start=72&rel=0",
    publicUrl: "https://www.youtube.com/watch?v=BW_t_CwFV60&t=72s",
    linkLabel: "Watch this documentary on YouTube",
    iframeTitle: "The Biography of Alhaji Tioluwalase Baba Muyi Majekodunmi - YouTube documentary"
  },
  pszhSQ9SaJo: {
    start: 19,
    embedUrl: "https://www.youtube-nocookie.com/embed/pszhSQ9SaJo?start=19&rel=0",
    publicUrl: "https://www.youtube.com/watch?v=pszhSQ9SaJo&t=19s",
    linkLabel: "Watch the second documentary on YouTube",
    iframeTitle: "The Legacy of Alhaji Tioluwalase Baba Muyi Majekodunmi - YouTube documentary"
  }
} as const;

type ApprovedYouTubeId = keyof typeof approvedYouTubeVideos;

function getApprovedYouTubeId(record: CmsContentRecord): ApprovedYouTubeId | null {
  const source = `${record.externalUrl ?? ""} ${record.mediaUrl ?? ""} ${record.body ?? ""}`;
  if (source.includes("BW_t_CwFV60")) return "BW_t_CwFV60";
  if (source.includes("pszhSQ9SaJo")) return "pszhSQ9SaJo";
  return null;
}

function DocumentaryVideoCard({ record }: { record: CmsContentRecord }) {
  const videoId = getApprovedYouTubeId(record);
  if (!videoId) return null;
  const video = approvedYouTubeVideos[videoId];

  return (
    <article className="grid gap-5 rounded border border-archive-navy/12 bg-white/82 p-5 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">{record.category ?? "Documentary record"}</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight text-archive-navy">{record.title}</h2>
        <p className="mt-3 leading-7 text-slate-700">{record.summary}</p>
      </div>
      <div className="overflow-hidden rounded border border-archive-navy/12 bg-archive-navy">
        <iframe
          src={video.embedUrl}
          title={video.iframeTitle}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
      <div>
        <a
          className="inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-archive-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
          href={video.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {video.linkLabel}
        </a>
      </div>
    </article>
  );
}

function RelatedArchiveLinks({ cards }: { cards: Array<{ id: string; title: string; description: string; href?: string }> }) {
  if (!cards.length) return null;

  return (
    <section className="grid gap-5 md:grid-cols-2" aria-label="Related documentary archive sections">
      {cards.map((card) => {
        const content = <StatusCard title={card.title} description={card.description} />;
        return card.href ? <Link href={card.href} key={card.id}>{content}</Link> : <div key={card.id}>{content}</div>;
      })}
    </section>
  );
}

export async function DocumentariesPublicPage() {
  const page = await getCmsPageByPath("/documentaries");

  if (!page) {
    return (
      <PageShell eyebrow="Documentary Archive" title="Documentaries awaiting publication" description="This section is being prepared for public release.">
        <StatusCard title="Supporting documentary material" description="Additional documentary records will appear after context, permissions, and public-release checks are complete." />
      </PageShell>
    );
  }

  const records = await getPublishedCmsContent("documentary", "/documentaries");
  const videoRecords = records.filter((record) => getApprovedYouTubeId(record));
  const developmentRecords = records.filter((record) => !getApprovedYouTubeId(record));

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title} description={page.description}>
      <div className="grid gap-10">
        {page.body ? (
          <section className="rounded border border-archive-navy/12 bg-white/78 p-6 shadow-sm" aria-label="Documentary introduction">
            <p className="leading-7 text-slate-700">{page.body}</p>
          </section>
        ) : null}

        <section aria-labelledby="watch-documentaries-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-archive-brown">Watch the documentaries</p>
            <h2 id="watch-documentaries-title" className="mt-2 font-serif text-4xl leading-tight text-archive-navy">Approved public recordings</h2>
            <p className="mt-3 leading-7 text-slate-700">
              Approved documentary recordings are available below. Additional transcripts, subtitles, clips, and supporting records will be published after verification and editorial approval.
            </p>
          </div>
          {videoRecords.length ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {videoRecords.map((record) => <DocumentaryVideoCard record={record} key={record.id} />)}
            </div>
          ) : (
            <div className="mt-6">
              <StatusCard title="No approved documentary playback yet" description="Documentary playback will appear after the archive team approves public viewing links." />
            </div>
          )}
        </section>

        {developmentRecords.length ? (
          <section className="grid gap-4" aria-labelledby="documentary-development-title">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-archive-brown">Archive development</p>
              <h2 id="documentary-development-title" className="mt-2 font-serif text-3xl text-archive-navy">Future supporting records</h2>
            </div>
            {developmentRecords.map((record) => (
              <article className="rounded border border-archive-navy/12 bg-white/80 p-6 shadow-sm" key={record.id}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">{record.category ?? "Documentary record"}</p>
                <h3 className="mt-2 font-serif text-2xl text-archive-navy">{record.title}</h3>
                <p className="mt-3 leading-7 text-slate-700">{record.summary}</p>
              </article>
            ))}
          </section>
        ) : null}

        <RelatedArchiveLinks cards={page.cards} />
      </div>
    </PageShell>
  );
}

export const documentaryEmbedTestContract = {
  approvedYouTubeVideos
};
