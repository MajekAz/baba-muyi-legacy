import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { StatusCard } from "@/components/status-card";
import { getPublicCmsCoreRecords } from "@/lib/cms-core";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

const title = "Baba Muyi Stories and Memories | LegacyHub";
const description = "Reviewed public stories and memories connected to the Baba Muyi Legacy archive.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: new URL("/stories", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/stories", siteConfig.url).toString(), siteName: siteConfig.name, type: "website" },
  twitter: { card: "summary", title, description }
};

export default async function StoriesPage() {
  const records = await getPublicCmsCoreRecords("stories");

  return (
    <PageShell eyebrow="Stories" title="Published Stories" description="Family-approved and publicly shared memories from the archive.">
      <div className="grid gap-4">
        {records.length ? records.map((record) => (
          <article className="rounded border border-archive-navy/12 bg-white/80 p-6 shadow-sm" key={record.id}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">{record.author || "Story"}</p>
            <h2 className="mt-2 font-serif text-3xl text-archive-navy">{record.title}</h2>
            <p className="mt-3 leading-7 text-slate-700">{record.summary}</p>
            <Link className="mt-4 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={`/stories/${record.slug}`}>
              Read story
            </Link>
          </article>
        )) : (
          <StatusCard title="No public stories yet" description="Reviewed memories will appear here only after consent, attribution, and public-release checks are complete." />
        )}
      </div>
    </PageShell>
  );
}
