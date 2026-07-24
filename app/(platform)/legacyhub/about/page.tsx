import type { Metadata } from "next";
import { Breadcrumbs, PlatformCTA, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { siteConfig } from "@/lib/site";

const title = "About LegacyHub - Preserving Human History One Legacy at a Time";
const description = "About LegacyHub, the platform inspired by the Baba Muyi Legacy flagship archive.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/about", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/about", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function AboutPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "About" }]} />
      <PlatformPageHero eyebrow="About LegacyHub" title="From one archive into a reusable platform.">
        <p>LegacyHub was shaped by the work of building Baba Muyi Legacy as a serious family and public archive.</p>
      </PlatformPageHero>
      <PlatformSection title="Why LegacyHub was created">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded border border-stone-300 bg-white p-6">
            <h2 className="font-serif text-3xl font-semibold">Baba Muyi Legacy inspired the platform.</h2>
            <p className="mt-3 leading-8 text-slate-700">The flagship archive showed that family history, public memory, transport heritage, values, media, and documentary material need a structured and respectful home.</p>
          </article>
          <article className="rounded border border-stone-300 bg-white p-6">
            <h2 className="font-serif text-3xl font-semibold">LegacyHub is the reusable foundation.</h2>
            <p className="mt-3 leading-8 text-slate-700">The platform separates workspace, legacy profile, users, roles, content, media, privacy, and publication workflows so future archives can be managed carefully.</p>
          </article>
        </div>
      </PlatformSection>
      <PlatformSection dark title="We are no longer building a single website.">
        <p className="max-w-3xl text-2xl font-bold leading-9 text-white">We are building a platform that helps preserve human history - one legacy at a time.</p>
      </PlatformSection>
      <PlatformSection title="Commitments">
        <div className="grid gap-4 md:grid-cols-2">
          {["Authenticity", "Stewardship", "Culture", "Long-term preservation"].map((item) => (
            <div className="rounded border border-stone-300 bg-white p-5" key={item}>
              <h2 className="font-serif text-2xl font-semibold">{item}</h2>
              <p className="mt-2 leading-7 text-slate-700">LegacyHub must support truthful, reviewed, culturally respectful, and durable archive work.</p>
            </div>
          ))}
        </div>
        <div className="mt-8"><PlatformCTA href="/legacyhub/mission" secondary>Read the mission</PlatformCTA></div>
      </PlatformSection>
    </main>
  );
}
