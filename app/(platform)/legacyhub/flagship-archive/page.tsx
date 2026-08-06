import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { flagshipPreviews } from "@/lib/legacyhub-platform";
import { siteConfig } from "@/lib/site";

const title = "The Legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi";
const description =
  "Baba Muyi Legacy is the first public digital archive powered by LegacyHub, preserving the life, family history, transport heritage, documentary materials, oral histories, photographs, and lessons of Alhaji Tioluwalase “Baba Muyi” Majekodunmi.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/flagship-archive", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/flagship-archive", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function FlagshipArchivePage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Flagship Archive" }]} />
      <PlatformPageHero eyebrow="The first LegacyHub flagship archive" title="The Legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi">
        <p>
          Baba Muyi Legacy is the first public digital archive powered by LegacyHub. It preserves the life, entrepreneurial journey, family history, transport heritage, community service, photographs, documentary materials, oral histories, and enduring lessons of Alhaji Tioluwalase &quot;Baba Muyi&quot; Majekodunmi.
        </p>
      </PlatformPageHero>
      <PlatformSection title="A real archive demonstrating a reusable platform.">
        <p className="max-w-3xl text-lg leading-8 text-slate-700">
          The archive serves as the first working example through which LegacyHub&apos;s biography, timeline, media, oral-history, moderation, privacy, editorial, and multi-workspace capabilities are being developed for future families and organisations.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flagshipPreviews.map(([heading, body, href]) => (
            <article className="rounded border border-stone-300 bg-white p-5" key={heading}>
              <h2 className="font-serif text-2xl font-semibold">{heading}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">{body}</p>
              <Link className="mt-4 inline-block text-sm font-black text-amber-800 hover:text-slate-950" href={href}>Open route</Link>
            </article>
          ))}
        </div>
      </PlatformSection>
      <PlatformSection dark title="Explore the flagship archive">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ArchiveLink href="/biography" label="Explore Baba Muyi Legacy" />
          <ArchiveLink href="/timeline" label="Explore the timeline" />
          <ArchiveLink href="/gallery" label="Explore the photo archive" />
          <ArchiveLink href="/tioluwa-lase-molue" label="Discover the transport legacy" />
        </div>
      </PlatformSection>
    </main>
  );
}

function ArchiveLink({ href, label }: { href: string; label: string }) {
  return <Link className="rounded border border-white/18 p-4 font-bold text-white transition hover:bg-white hover:text-slate-950" href={href}>{label}</Link>;
}
