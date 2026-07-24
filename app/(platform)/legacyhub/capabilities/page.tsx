import type { Metadata } from "next";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Breadcrumbs, PlatformCTA, PlatformPageHero, PlatformSection } from "@/components/legacyhub/platform-shell";
import { collaborationSteps, currentCapabilities, plannedCapabilities } from "@/lib/legacyhub-platform";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub Capabilities - Collaborative Digital Archive Platform";
const description = "Current and planned LegacyHub capabilities for secure collaborative digital legacy archives.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub/capabilities", siteConfig.url).toString() },
  openGraph: { title, description, url: new URL("/legacyhub/capabilities", siteConfig.url).toString(), siteName: "LegacyHub", type: "website" },
  robots: { index: false, follow: true }
};

export default function CapabilitiesPage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <Breadcrumbs items={[{ label: "Capabilities" }]} />
      <PlatformPageHero eyebrow="Platform capabilities" title="A secure foundation for collaborative digital archives.">
        <p>LegacyHub separates what is already built from what is planned next, so families and organisations can understand the platform honestly.</p>
      </PlatformPageHero>
      <PlatformSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <CapabilityList title="Current foundation" label="Current foundation" items={currentCapabilities} current />
          <CapabilityList title="Planned capabilities" label="Planned capabilities" items={plannedCapabilities} />
        </div>
      </PlatformSection>
      <PlatformSection dark title="How collaboration works">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collaborationSteps.map((step, index) => (
            <li className="rounded border border-white/14 bg-white/[0.05] p-4" key={step}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Step {index + 1}</span>
              <p className="mt-2 font-bold text-white">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl leading-8 text-white/72">Public registration is not enabled. Access is role-based and permission-aware.</p>
      </PlatformSection>
    </main>
  );
}

function CapabilityList({ title, label, items, current = false }: { title: string; label: string; items: readonly string[]; current?: boolean }) {
  return (
    <article className="rounded border border-stone-300 bg-white p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-800">{label}</p>
      <h2 className="mt-2 font-serif text-3xl font-semibold">{title}</h2>
      <ul className="mt-6 grid gap-3">
        {items.map((item) => (
          <li className="flex min-w-0 gap-3 text-sm leading-6 text-slate-700" key={item}>
            {current ? <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700" /> : <Sparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-700" />}
            <span className="min-w-0 break-words">{item}{current ? null : <span className="ml-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-black uppercase tracking-[0.12em] text-amber-900">Planned</span>}</span>
          </li>
        ))}
      </ul>
      {!current ? <p className="mt-5 text-sm font-bold text-slate-700">These planned items are not currently available.</p> : null}
      {current ? <div className="mt-6"><PlatformCTA href="/legacyhub/early-access" secondary>Discuss your archive</PlatformCTA></div> : null}
    </article>
  );
}
