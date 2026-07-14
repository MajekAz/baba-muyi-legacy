import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusCard } from "@/components/status-card";
import { getCmsPageByPath, getPublishedCmsContent } from "@/lib/cms-store";
import type { CmsContentKind } from "@/lib/cms-types";

const relatedKindsByPath: Record<string, CmsContentKind[]> = {
  "/biography": ["biography_chapter"],
  "/timeline": ["timeline_event"],
  "/documentaries": ["documentary", "documentary_episode"],
  "/english-documentary": ["documentary"],
  "/documentary-episodes": ["documentary_episode"],
  "/transcripts": ["documentary_episode"],
  "/gallery": ["gallery_album", "media_item"],
  "/portraits": ["gallery_album", "media_item"],
  "/family": ["gallery_album", "media_item"],
  "/bolekaja-gallery": ["gallery_album", "media_item"],
  "/molue-gallery": ["gallery_album", "media_item"],
  "/community-gallery": ["gallery_album", "media_item"],
  "/restored-images": ["gallery_album", "media_item"],
  "/transport-gallery": ["gallery_album", "media_item"],
  "/lessons": ["lesson"],
  "/blog": ["blog_post"],
  "/family-tree": ["family_member"],
  "/children": ["family_member"],
  "/grandchildren": ["family_member"],
  "/family-memories": ["testimonial"],
  "/tributes": ["testimonial"],
  "/archive": ["media_item"],
  "/documents": ["media_item"]
};

export async function CmsPublicPage({ path, children }: { path: string; children?: React.ReactNode }) {
  const page = await getCmsPageByPath(path);

  if (!page) {
    return (
      <PageShell eyebrow="CMS" title="Page awaiting publication" description="This route exists, but its CMS page is not published yet.">
        <StatusCard title="Draft page" description="Publish this page from Administration > Content management when the copy is ready." />
      </PageShell>
    );
  }

  const relatedKinds = relatedKindsByPath[path] ?? [];
  const related = (await Promise.all(relatedKinds.map((kind) => getPublishedCmsContent(kind, path)))).flat();

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title} description={page.description}>
      <div className="grid gap-8">
        {page.body ? (
          <div className="rounded border border-archive-navy/12 bg-white/78 p-6 shadow-sm">
            <p className="leading-7 text-slate-700">{page.body}</p>
          </div>
        ) : null}

        {page.cards.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {page.cards.map((card) => {
              const content = <StatusCard title={card.title} description={card.description} />;
              return card.href ? <Link href={card.href} key={card.id}>{content}</Link> : <div key={card.id}>{content}</div>;
            })}
          </div>
        ) : null}

        {related.length ? (
          <div className="grid gap-4">
            {related.map((record) => (
              <article className="rounded border border-archive-navy/12 bg-white/80 p-6 shadow-sm" key={record.id}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">
                  {record.dateLabel ?? record.category ?? record.kind}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-archive-navy">{record.title}</h2>
                <p className="mt-3 leading-7 text-slate-700">{record.summary}</p>
                {record.body ? <p className="mt-3 text-sm leading-6 text-slate-600">{record.body}</p> : null}
                {record.externalUrl ? (
                  <Link className="mt-4 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={record.externalUrl}>
                    Open record
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {children}
      </div>
    </PageShell>
  );
}
