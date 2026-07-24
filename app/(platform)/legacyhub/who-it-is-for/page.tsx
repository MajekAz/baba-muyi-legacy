import type { Metadata } from "next";
import { Breadcrumbs, PlatformCTA, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { audienceGroups } from "@/lib/legacyhub-platform";
import { siteConfig } from "@/lib/site";

const title = "Who LegacyHub Is For - Families, Communities and Institutions";
const description = "Explore how LegacyHub can support families, royal families, museums, schools, faith communities, veterans, non-profits and founders.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/who-it-is-for", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/who-it-is-for", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function WhoItIsForPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Who It Is For" }]} />
      <PlatformPageHero eyebrow="Who it is for" title="Archives for people carrying memory on behalf of others.">
        <p>LegacyHub is being prepared for families, communities, institutions, founders, and heritage custodians who need more than a simple page.</p>
      </PlatformPageHero>
      <PlatformSection>
        <div className="grid gap-5">
          {audienceGroups.map(([audience, preserve, contributors, publicUse, protection]) => (
            <article className="rounded border border-stone-300 bg-white p-6" key={audience}>
              <h2 className="font-serif text-3xl font-semibold">{audience}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoBlock label="May preserve" text={preserve} />
                <InfoBlock label="May contribute" text={contributors} />
                <InfoBlock label="Public archive use" text={publicUse} />
                <InfoBlock label="Protection" text={protection} />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8"><PlatformCTA href="/legacyhub/early-access">Register your interest</PlatformCTA></div>
      </PlatformSection>
    </main>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}
