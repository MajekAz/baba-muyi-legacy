import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PlatformCTA, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { siteConfig } from "@/lib/site";

const title = "Contact LegacyHub";
const description = "Contact LegacyHub about early access, platform enquiries, or the Baba Muyi Legacy flagship archive.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/contact", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/contact", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function PlatformContactPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <PlatformPageHero eyebrow="Contact" title="Contact LegacyHub">
        <p>Use the supported project routes below to express interest, ask a platform question, or return to the Baba Muyi Legacy flagship archive.</p>
      </PlatformPageHero>
      <PlatformSection title="Enquiry routes">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded border border-stone-300 bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold">Early access</h2>
            <p className="mt-3 leading-7 text-slate-700">Use the reviewed early-access form for archive, family, community, institution, or organisation enquiries.</p>
            <div className="mt-5"><PlatformCTA href="/legacyhub/early-access" secondary>Register interest</PlatformCTA></div>
          </article>
          <article className="rounded border border-stone-300 bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold">Baba Muyi Legacy</h2>
            <p className="mt-3 leading-7 text-slate-700">Visit the flagship archive to explore the current public implementation.</p>
            <Link className="mt-5 inline-block text-sm font-black text-amber-800 hover:text-slate-950" href="/">View Baba Muyi Legacy</Link>
          </article>
          <article className="rounded border border-stone-300 bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold">Existing contact route</h2>
            <p className="mt-3 leading-7 text-slate-700">The existing Baba Muyi public contact route remains available for archive-related messages.</p>
            <Link className="mt-5 inline-block text-sm font-black text-amber-800 hover:text-slate-950" href="/contact">Open contact page</Link>
          </article>
        </div>
        <p className="mt-8 text-sm leading-6 text-slate-600">No telephone number, office address, or support team claim is provided until those details are formally configured.</p>
      </PlatformSection>
    </main>
  );
}
