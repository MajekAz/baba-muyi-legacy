import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getPublicCmsCoreRecordBySlug } from "@/lib/cms-core";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await getPublicCmsCoreRecordBySlug("blog", slug);
  if (!record) notFound();

  return (
    <PageShell eyebrow="Blog" title={record.title} description={record.summary}>
      <article className="rounded border border-archive-navy/12 bg-white/80 p-6 shadow-sm">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: record.contentHtml || `<p>${record.summary}</p>` }} />
      </article>
    </PageShell>
  );
}
