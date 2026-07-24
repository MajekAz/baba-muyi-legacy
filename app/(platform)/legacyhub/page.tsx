import type { Metadata } from "next";
import Link from "next/link";
import { Archive, CheckCircle2, Sparkles, UsersRound } from "lucide-react";
import { PlatformCTA, PlatformSection } from "@/components/legacyhub/platform-shell";
import { flagshipArchiveBrand } from "@/lib/brand";
import {
  currentCapabilities,
  missionStatement,
  milestoneFourAreas,
  plannedCapabilities,
  processSteps,
  audienceGroups
} from "@/lib/legacyhub-platform";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub - Preserve Family, Community and Cultural Legacies";
const description =
  "LegacyHub helps families, communities, institutions and organisations preserve stories, photographs, documents, audio, video and historical memories through secure collaborative digital archives.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: new URL("/legacyhub", siteConfig.url).toString() },
  openGraph: {
    title,
    description,
    url: new URL("/legacyhub", siteConfig.url).toString(),
    siteName: "LegacyHub",
    type: "website"
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: false, follow: true }
};

export default function LegacyHubHomePage() {
  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <section className="border-b border-slate-950/10 bg-[#111827] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Welcome to LegacyHub Phase 2</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
              Preserve the stories that should never be forgotten.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              LegacyHub helps families, communities, institutions, and organisations preserve meaningful histories through beautiful, secure, and collaborative digital archives.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PlatformCTA href="/">Explore Baba Muyi Legacy</PlatformCTA>
              <Link className="rounded border border-white/28 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white hover:text-slate-950" href="/legacyhub/early-access">
                Join the Early Access List
              </Link>
            </div>
          </div>
          <div className="grid content-end gap-4">
            <div className="rounded border border-white/18 bg-white/[0.06] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Platform relationship</p>
              <p className="mt-3 font-serif text-3xl text-white">{flagshipArchiveBrand.name}</p>
              <p className="mt-3 leading-7 text-white/72">
                The first flagship archive powered by LegacyHub. The platform is being prepared for future families and organisations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Workspace-aware", "Moderated", "Media-ready", "Private controls"].map((label) => (
                <div className="rounded border border-white/16 bg-white/[0.04] p-4 text-sm font-bold text-white/78" key={label}>{label}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PlatformSection eyebrow="Mission preview" title="Technology in service of memory.">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-3xl text-lg leading-8 text-slate-700">{missionStatement}</p>
          <PlatformCTA href="/legacyhub/mission" secondary>Learn about our mission</PlatformCTA>
        </div>
      </PlatformSection>

      <PlatformSection eyebrow="Who LegacyHub is for" title="Archives for families, communities and institutions.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {audienceGroups.slice(0, 4).map(([title, description]) => (
            <article className="rounded border border-stone-300 bg-white p-5" key={title}>
              <UsersRound aria-hidden="true" className="size-6 text-amber-800" />
              <h2 className="mt-4 font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <PlatformCTA href="/legacyhub/who-it-is-for" secondary>Explore who LegacyHub is for</PlatformCTA>
        </div>
      </PlatformSection>

      <PlatformSection dark eyebrow="How LegacyHub works" title="A moderated collaboration model.">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <li className="rounded border border-white/14 bg-white/[0.05] p-4" key={step}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Step {index + 1}</span>
              <p className="mt-2 font-bold text-white">{step}</p>
            </li>
          ))}
        </ol>
      </PlatformSection>

      <PlatformSection eyebrow="Capability preview" title="A foundation now, a wider platform over time.">
        <div className="grid gap-6 lg:grid-cols-2">
          <CapabilityPreview title="Current foundation" items={currentCapabilities.slice(0, 5)} current />
          <CapabilityPreview title="Planned capabilities" items={plannedCapabilities.slice(0, 5)} />
        </div>
        <div className="mt-8">
          <PlatformCTA href="/legacyhub/capabilities" secondary>View all capabilities</PlatformCTA>
        </div>
      </PlatformSection>

      <PlatformSection dark eyebrow="Flagship archive preview" title="Baba Muyi Legacy demonstrates the platform.">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-3xl text-lg leading-8 text-white/74">
            Baba Muyi Legacy preserves the life, transport heritage, family history, public memories, values, and documentary material connected to Alhaji Tioluwalase &quot;Baba Muyi&quot; Majekodunmi.
          </p>
          <Link className="rounded border border-white/28 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white hover:text-slate-950" href="/legacyhub/flagship-archive">
            Discover the flagship archive
          </Link>
        </div>
      </PlatformSection>

      <PlatformSection eyebrow="Roadmap preview" title="Milestone 4 will focus on the public experience.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {milestoneFourAreas.slice(0, 4).map((item) => (
            <div className="rounded border border-stone-300 bg-white p-4 font-bold text-slate-800" key={item}>{item}</div>
          ))}
        </div>
        <div className="mt-8">
          <PlatformCTA href="/legacyhub/roadmap" secondary>View the LegacyHub roadmap</PlatformCTA>
        </div>
      </PlatformSection>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Early access</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Interested in a digital legacy archive?</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-700">
              Register interest for review. This does not create an account, subscription, workspace, or public archive.
            </p>
          </div>
          <PlatformCTA href="/legacyhub/early-access">Register your interest</PlatformCTA>
        </div>
      </section>
    </main>
  );
}

function CapabilityPreview({ title, items, current = false }: { title: string; items: readonly string[]; current?: boolean }) {
  return (
    <article className="rounded border border-stone-300 bg-white p-6">
      <div className="flex items-start gap-3">
        {current ? <CheckCircle2 aria-hidden="true" className="mt-1 size-6 text-emerald-700" /> : <Sparkles aria-hidden="true" className="mt-1 size-6 text-amber-700" />}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-800">{current ? "Available foundation" : "Planned, not yet available"}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">{title}</h2>
        </div>
      </div>
      <ul className="mt-6 grid gap-3">
        {items.map((item) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
            <Archive aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-800" />
            <span>{item}{current ? null : <span className="font-bold text-slate-950"> - Planned</span>}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
