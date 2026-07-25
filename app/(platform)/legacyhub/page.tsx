import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Layers, Map, ShieldCheck, UsersRound } from "lucide-react";
import { PlatformCTA, PlatformSection } from "@/components/legacyhub/platform-shell";
import { flagshipArchiveBrand } from "@/lib/brand";
import { siteConfig } from "@/lib/site";

const title = "LegacyHub - Preserve Family, Community and Cultural Legacies";
const description =
  "LegacyHub helps families, communities, institutions and organisations preserve stories, photographs, documents, audio, video and historical memories through secure collaborative digital archives.";

const overviewCards = [
  {
    title: "Mission",
    href: "/legacyhub/mission",
    body: "A responsible preservation platform for stories, values, memories, media and historical records.",
    icon: Compass
  },
  {
    title: "Who It Is For",
    href: "/legacyhub/who-it-is-for",
    body: "Families, communities, founders, faith groups, schools, museums and heritage custodians.",
    icon: UsersRound
  },
  {
    title: "Capabilities",
    href: "/legacyhub/capabilities",
    body: "Workspace-aware CMS, media library, roles, review workflows, privacy controls and planned platform growth.",
    icon: Layers
  },
  {
    title: "Flagship Archive",
    href: "/legacyhub/flagship-archive",
    body: "Baba Muyi Legacy is the first public archive demonstrating the LegacyHub platform foundation.",
    icon: BookOpen
  },
  {
    title: "Roadmap",
    href: "/legacyhub/roadmap",
    body: "A milestone-led product path from foundation, CMS and media toward richer public archive experiences.",
    icon: Map
  },
  {
    title: "Early Access",
    href: "/legacyhub/early-access",
    body: "Register interest for review without creating an account, workspace, subscription or public archive.",
    icon: ShieldCheck
  }
] as const;

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

      <PlatformSection eyebrow="Platform overview" title="Choose the part of LegacyHub you want to understand.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {overviewCards.map(({ title, href, body, icon: Icon }) => (
            <Link
              className="group rounded border border-stone-300 bg-white p-5 transition hover:border-amber-700 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" className="size-6 text-amber-800" />
              <h2 className="mt-4 font-serif text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">{body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-800 group-hover:text-slate-950">
                Open {title}
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            </Link>
          ))}
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
