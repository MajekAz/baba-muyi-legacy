import type { Metadata } from "next";
import { Breadcrumbs, PlatformCTA, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { legacyHubValues, missionStatement } from "@/lib/legacyhub-platform";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub Mission - Preserving Stories for Future Generations";
const description = "Learn the LegacyHub mission for preserving family, community and cultural stories through responsible digital archives.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/mission", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/mission", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function MissionPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Mission" }]} />
      <PlatformPageHero eyebrow="LegacyHub mission" title="Our Mission">
        <p>{missionStatement}</p>
      </PlatformPageHero>
      <PlatformSection title="Why preservation matters now.">
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            ["Memories are fragile", "Stories are often held by a few people, scattered across devices, albums, boxes, conversations, and private family knowledge. When they are not gathered with care, they can fade."],
            ["Preservation is responsibility", "Families and institutions carry obligations to those who came before and to those who will inherit the record later."],
            ["Stewardship needs structure", "A lasting archive needs roles, review, privacy, attribution, source notes, and a clear distinction between private material and public storytelling."],
            ["Access should outlive trends", "LegacyHub is shaped to make meaningful histories easier to find, understand, and pass forward across generations."]
          ].map(([heading, body]) => (
            <article className="rounded border border-stone-300 bg-white p-6" key={heading}>
              <h2 className="font-serif text-3xl font-semibold">{heading}</h2>
              <p className="mt-3 leading-8 text-slate-700">{body}</p>
            </article>
          ))}
        </div>
      </PlatformSection>
      <PlatformSection dark title="Collaboration without losing editorial control.">
        <p className="max-w-3xl text-lg leading-8 text-white/74">
          LegacyHub supports invited contributors, assigned roles, review workflows, private records, and public publishing controls. The goal is to help people contribute while preserving the judgement of the family, community, institution, or archive custodian.
        </p>
      </PlatformSection>
      <PlatformSection eyebrow="Core values" title="Principles before product polish.">
        <div className="grid gap-4">
          {legacyHubValues.map(([value, explanation]) => (
            <article className="rounded border border-stone-300 bg-white p-5" key={value}>
              <h2 className="font-serif text-2xl font-semibold">{value}</h2>
              <p className="mt-2 leading-7 text-slate-700">{explanation}</p>
            </article>
          ))}
        </div>
        <div className="mt-8"><PlatformCTA href="/legacyhub/early-access">Register your interest</PlatformCTA></div>
      </PlatformSection>
    </main>
  );
}
