import type { Metadata } from "next";
import { Breadcrumbs, PlatformCTA, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { legacyHubValues, missionStatement } from "@/lib/legacyhub-platform";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub Mission - Preserving Lives and Connecting Generations";
const description = "Learn how LegacyHub helps families, communities, founders, institutions and organisations preserve meaningful histories with structure, privacy and editorial care.";

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
      <PlatformPageHero eyebrow="LegacyHub mission" title="Preserving lives, protecting memories, and connecting generations.">
        <p>{missionStatement}</p>
      </PlatformPageHero>
      <PlatformSection title="Origin of the platform.">
        <p className="max-w-3xl text-lg leading-8 text-slate-700">
          The platform was inspired by the effort to preserve the life and legacy of Alhaji Tioluwalase &quot;Baba Muyi&quot; Majekodunmi. What began as one family&apos;s determination to protect an important history is being developed into a structured digital-preservation platform for future generations.
        </p>
      </PlatformSection>
      <PlatformSection title="Why preservation matters now.">
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            ["Memories disappear when they are not preserved", "Stories are often held by a few people, scattered across devices, albums, boxes, conversations, and private family knowledge. When they are not gathered with care, they can fade."],
            ["Every life contains history", "Families, founders, communities, and institutions carry stories that future generations deserve to understand through attributed and responsibly preserved records."],
            ["Families need more than temporary posts", "A lasting archive needs roles, review, privacy, attribution, source notes, and a clear distinction between private material and public storytelling."],
            ["Baba Muyi Legacy is the first flagship archive", "Baba Muyi Legacy is the first working example through which LegacyHub’s preservation, moderation, media, CMS, and multi-workspace capabilities are being developed."]
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
