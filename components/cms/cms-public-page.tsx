import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusCard } from "@/components/status-card";
import { getPublicCmsCoreRecords, type CmsCoreCollection } from "@/lib/cms-core";
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

const coreCollectionByPath: Record<string, CmsCoreCollection> = {
  "/biography": "biography",
  "/timeline": "timeline",
  "/lessons": "lessons",
  "/blog": "blog"
};

export async function CmsPublicPage({ path, children }: { path: string; children?: React.ReactNode }) {
  const page = await getCmsPageByPath(path);

  if (!page) {
    return (
      <PageShell eyebrow="Archive" title="Page awaiting publication" description="This section is being prepared for public release.">
        <StatusCard title="Content in preparation" description="Family-reviewed material will appear here when it is ready." />
      </PageShell>
    );
  }

  const coreCollection = coreCollectionByPath[path];
  const coreRecords = coreCollection ? await getPublicCmsCoreRecords(coreCollection) : [];
  const relatedKinds = coreCollection ? [] : relatedKindsByPath[path] ?? [];
  const related = coreRecords.length ? [] : (await Promise.all(relatedKinds.map((kind) => getPublishedCmsContent(kind, path)))).flat();

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

        {coreCollection ? (
          <div className="grid gap-4">
            {coreRecords.length ? coreRecords.map((record) => (
              <article className="rounded border border-archive-navy/12 bg-white/80 p-6 shadow-sm" key={record.id}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">
                  {record.dateLabel || record.category || record.publishedAt ? (record.dateLabel || record.category || new Date(record.publishedAt).toLocaleDateString()) : "Published record"}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-archive-navy">{record.title}</h2>
                <p className="mt-3 leading-7 text-slate-700">{record.summary}</p>
                {record.contentHtml ? <div className="prose mt-4 max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: record.contentHtml }} /> : null}
                {(path === "/lessons" || path === "/blog") && record.slug ? (
                  <Link className="mt-4 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={`${path}/${record.slug}`}>
                    Read more
                  </Link>
                ) : null}
              </article>
            )) : (
              <StatusCard title="No public records yet" description="Approved public records will appear here after the family archive team publishes them." />
            )}
          </div>
        ) : related.length ? (
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
