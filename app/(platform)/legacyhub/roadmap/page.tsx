import type { Metadata } from "next";
import { Breadcrumbs, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { completedRoadmapStages, futurePhases, milestoneFourAreas } from "@/lib/legacyhub-platform";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub Roadmap - Building the Future of Digital Legacy Preservation";
const description = "The LegacyHub product journey from foundation to future platform capabilities.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/roadmap", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/roadmap", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function RoadmapPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Roadmap" }]} />
      <PlatformPageHero eyebrow="Product roadmap" title="Building carefully, milestone by milestone.">
        <p>LegacyHub is moving from a flagship archive into a reusable platform. Dates are not promised; each phase must pass implementation, security, and acceptance checks.</p>
      </PlatformPageHero>
      <PlatformSection title="Completed and in-progress phases">
        <div className="grid gap-4">
          {completedRoadmapStages.map(([status, stage, description]) => (
            <article className="rounded border border-stone-300 bg-white p-5" key={stage}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{status}</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">{stage}</h2>
              <p className="mt-3 leading-7 text-slate-700">{description}</p>
            </article>
          ))}
        </div>
      </PlatformSection>
      <PlatformSection dark title="Milestone 4 - The Public Experience">
        <p className="max-w-3xl leading-8 text-white/74">Now that the engine is built, the next major objective is to make the Baba Muyi public archive more immersive and emotionally resonant.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {milestoneFourAreas.map((area) => <div className="rounded border border-white/14 bg-white/[0.05] p-4 font-bold text-white/84" key={area}>{area}</div>)}
        </div>
      </PlatformSection>
      <PlatformSection title="Future vision">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {futurePhases.map((phase) => <div className="rounded border border-stone-300 bg-white p-4 font-bold text-slate-800" key={phase}>{phase}</div>)}
        </div>
      </PlatformSection>
    </main>
  );
}
