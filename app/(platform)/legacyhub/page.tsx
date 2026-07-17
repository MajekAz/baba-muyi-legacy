import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  Building2,
  Camera,
  CheckCircle2,
  Church,
  FileAudio,
  Flag,
  GraduationCap,
  Landmark,
  Milestone,
  ScrollText,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import { EarlyAccessForm } from "@/components/legacyhub/early-access-form";
import { flagshipArchiveBrand, platformBrand } from "@/lib/brand";
import { siteConfig } from "@/lib/site";

const platformNavigation = [
  ["Mission", "#mission"],
  ["Who It Is For", "#who"],
  ["Capabilities", "#capabilities"],
  ["Flagship Archive", "#flagship"],
  ["Roadmap", "#roadmap"],
  ["About", "#about"],
  ["Early Access", "#early-access"],
  ["Sign In", "/login"]
] as const;

const visionCategories = [
  ["Family legacies", "Parents, grandparents, children, oral histories, photographs, values, and memories.", UsersRound],
  ["Community history", "Neighbourhoods, associations, public service, local leadership, and collective memory.", Landmark],
  ["Cultural heritage", "Traditional records, ceremonies, language, identity, and intergenerational knowledge.", ScrollText],
  ["Documentary archives", "Films, transcripts, production notes, interviews, and contextual evidence.", Camera],
  ["Historical photographs", "Restored images, captions, provenance, albums, and rights-aware publication.", Archive],
  ["Oral histories", "Audio recordings, interviews, testimonies, and voice-led remembrance.", FileAudio],
  ["Military service records", "Service stories, documents, photographs, medals, and community remembrance.", Flag],
  ["Founders' stories", "Entrepreneurial journeys, business records, family enterprise, and institutional memory.", Building2],
  ["Educational institutions", "Schools, universities, alumni stories, founders, milestones, and archives.", GraduationCap],
  ["Religious and traditional heritage", "Churches, mosques, royal families, leaders, records, and teaching legacies.", Church]
] as const;

const values = [
  ["Preserve before it is forgotten.", "Legacy work is time-sensitive. Memories, photographs, documents, and voices deserve careful preservation before they disappear."],
  ["Tell authentic stories.", "Archives should be honest, attributed, reviewed, and respectful of the people and communities they represent."],
  ["Build for generations, not trends.", "LegacyHub is shaped for long-term stewardship, not disposable campaign pages or short-lived publishing tools."],
  ["Respect history and culture.", "Every archive carries family, cultural, religious, legal, and emotional context that must be treated with care."],
  ["Make technology serve humanity.", "The platform exists to support memory, dignity, collaboration, and responsible access."]
] as const;

const processSteps = [
  "Create a legacy archive",
  "Invite trusted contributors",
  "Add stories, photographs, audio, video, and documents",
  "Review and approve submissions",
  "Publish a beautiful public archive",
  "Preserve it for future generations"
] as const;

const audiences = [
  ["Families preserving their history", "Collect photographs, documents, biography chapters, memories, and values around parents, grandparents, and loved ones."],
  ["Traditional rulers and royal families", "Preserve lineage, cultural history, leadership records, ceremonies, photographs, and community contributions."],
  ["Museums and heritage centres", "Prepare curated digital collections with media, documents, captions, access control, and publication workflows."],
  ["Churches and mosques", "Document founders, elders, sermons, institutional milestones, oral histories, and community memory."],
  ["Schools and universities", "Build alumni, founder, campus, and milestone archives with careful moderation and permissions."],
  ["Veterans' associations", "Protect service stories, documents, photographs, interviews, and remembrance material."],
  ["Non-profits and community organisations", "Preserve projects, leaders, community impact, testimonies, records, and historical media."],
  ["Founders, entrepreneurs, and family businesses", "Record enterprise history, values, products, people, milestones, and succession stories."]
] as const;

const currentCapabilities = [
  "Secure authentication",
  "Role-based permissions",
  "Collaborative CMS",
  "Publishing and review workflows",
  "Media library",
  "Photo, audio, document, and video archive",
  "Albums and galleries",
  "Audit logs",
  "Workspace and legacy-profile separation",
  "Private and public content controls"
] as const;

const plannedCapabilities = [
  "Family and relationship graph",
  "Documentary centre",
  "Community contributions",
  "Advanced search",
  "Interactive maps and timelines",
  "Custom domains",
  "Subscription plans",
  "Self-service onboarding",
  "AI-assisted archive tools"
] as const;

const milestoneFourItems = [
  "A cinematic homepage",
  "Interactive biography",
  "Historical timeline",
  "TIOLUWA LASE transport legacy",
  "Documentary centre",
  "Family gallery",
  "Community memories",
  "Rich storytelling"
] as const;

export const metadata: Metadata = {
  title: {
    absolute: "LegacyHub - Preserve Family, Community and Cultural Legacies"
  },
  description:
    "LegacyHub helps families, communities, institutions and organisations preserve stories, photographs, documents, audio, video and historical memories through secure collaborative digital archives.",
  alternates: {
    canonical: new URL("/legacyhub", siteConfig.url).toString()
  },
  openGraph: {
    title: "LegacyHub - Preserve Family, Community and Cultural Legacies",
    description:
      "A platform for beautiful, secure, collaborative digital legacy archives for families, communities, institutions and organisations.",
    url: new URL("/legacyhub", siteConfig.url).toString(),
    siteName: platformBrand.name,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "LegacyHub - Preserve Family, Community and Cultural Legacies",
    description:
      "Preserve stories, photographs, documents, audio, video and historical memories through secure collaborative digital archives."
  },
  robots: {
    index: false,
    follow: true
  }
};

export default function LegacyHubPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: platformBrand.name,
    applicationCategory: "ContentManagementSystem",
    description:
      "LegacyHub is a platform for creating and managing secure, collaborative digital legacy archives.",
    url: new URL("/legacyhub", siteConfig.url).toString(),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      priceSpecification: "Pricing is planned and not yet launched."
    }
  };

  return (
    <main className="bg-[#f8f3e8] text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="border-b border-slate-950/10 bg-[#111827] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link className="w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400" href="/legacyhub">
              <span className="block font-serif text-3xl font-semibold leading-none text-amber-300">{platformBrand.name}</span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-white/62">{platformBrand.tagline}</span>
            </Link>
            <details className="rounded border border-white/16 p-3 md:hidden">
              <summary className="cursor-pointer text-sm font-black text-white">Platform menu</summary>
              <nav aria-label="LegacyHub mobile platform navigation" className="mt-3 grid gap-2">
                {platformNavigation.map(([label, href]) => (
                  <Link
                    className="rounded px-3 py-2 text-sm font-bold text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                    href={href}
                    key={href}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
            <nav aria-label="LegacyHub platform navigation" className="hidden flex-wrap gap-2 md:flex">
              {platformNavigation.map(([label, href]) => (
                <Link
                  className="rounded px-3 py-2 text-sm font-bold text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

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
              <Link className="rounded bg-amber-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-white" href="/">
                Explore Baba Muyi Legacy
              </Link>
              <Link className="rounded border border-white/28 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white hover:text-slate-950" href="#early-access">
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
                <div className="rounded border border-white/16 bg-white/[0.04] p-4 text-sm font-bold text-white/78" key={label}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8" id="mission">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Mission</p>
        <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          To preserve the stories, values, achievements, and memories of individuals, families, communities, and organisations for future generations through beautiful, secure, and collaborative digital archives.
        </h2>
      </section>

      <section className="bg-white py-16" id="about">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Vision</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">LegacyHub will become more than a website builder.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              It will become a trusted place where people preserve meaningful records with care, context, review, and permission-aware publishing.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {visionCategories.map(([title, description, Icon]) => (
              <article className="rounded border border-stone-200 bg-[#fbf7ef] p-4" key={title}>
                <Icon aria-hidden="true" className="size-6 text-amber-800" />
                <h3 className="mt-4 text-base font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Core values</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Principles before product polish.</h2>
          </div>
          <div className="grid gap-4">
            {values.map(([title, description]) => (
              <article className="rounded border border-stone-300 bg-white p-5" key={title}>
                <h3 className="font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-700">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111827] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">How LegacyHub works</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <h2 className="font-serif text-4xl font-semibold">Moderated collaboration, not open posting.</h2>
              <p className="mt-4 leading-8 text-white/72">
                LegacyHub is being prepared for future families and organisations. Contributors can be invited, roles can be limited, and publication can remain reviewed before public release.
              </p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {processSteps.map((step, index) => (
                <li className="rounded border border-white/14 bg-white/[0.05] p-4" key={step}>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Step {index + 1}</span>
                  <p className="mt-2 font-bold text-white">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="who">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Who it is for</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold">Built for people and institutions carrying memory on behalf of others.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map(([title, description]) => (
            <article className="rounded border border-stone-300 bg-white p-5" key={title}>
              <h3 className="font-bold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16" id="capabilities">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <CapabilityList title="Current foundation" label="Available foundation" items={currentCapabilities} icon="current" />
          <CapabilityList title="Planned capabilities" label="Planned, not yet available" items={plannedCapabilities} icon="planned" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="flagship">
        <div className="grid gap-8 rounded border border-stone-300 bg-[#111827] p-6 text-white sm:p-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">The first LegacyHub flagship archive</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">{flagshipArchiveBrand.name}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/74">
              Baba Muyi Legacy preserves the life, transport heritage, family history, public memories, values, and documentary material connected to Alhaji Tioluwalase &quot;Baba Muyi&quot; Majekodunmi.
            </p>
          </div>
          <div className="grid content-center gap-3 sm:grid-cols-2">
            <Link className="rounded border border-white/18 p-4 font-bold text-white transition hover:bg-white hover:text-slate-950" href="/">
              View the archive
            </Link>
            <Link className="rounded border border-white/18 p-4 font-bold text-white transition hover:bg-white hover:text-slate-950" href="/biography">
              Read the biography
            </Link>
            <Link className="rounded border border-white/18 p-4 font-bold text-white transition hover:bg-white hover:text-slate-950" href="/gallery">
              Explore the Photo Archive
            </Link>
            <Link className="rounded border border-white/18 p-4 font-bold text-white transition hover:bg-white hover:text-slate-950" href="/tioluwa-lase-molue">
              Discover the Transport Legacy
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#15120d] py-16 text-white" id="roadmap">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">What comes next</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold">Milestone 4 - The Public Experience</h2>
          <p className="mt-4 max-w-3xl leading-8 text-white/74">
            Now that the engine is built, the next phase will create an experience that makes visitors pause, explore, and connect emotionally with Baba Muyi&apos;s story.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {milestoneFourItems.map((item) => (
              <div className="rounded border border-white/14 bg-white/[0.05] p-4 font-bold text-white/84" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Product discipline</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">We are no longer building a single website.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              We are building a platform that helps preserve human history - one legacy at a time.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Vision", "Milestone objectives", "Technical architecture", "User stories", "Acceptance criteria", "Release notes", "Deployment checklist", "Future backlog"].map((item) => (
              <div className="rounded border border-stone-300 bg-white p-4 font-bold text-slate-800" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="early-access">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.85fr_1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Early access</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Register interest without creating an account.</h2>
            <p className="mt-4 leading-8 text-slate-700">
              The current workflow is a reviewed interest form. It does not enable public registration, billing, self-service onboarding, or automatic workspace creation.
            </p>
            <div className="mt-6 rounded border border-amber-700/30 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              For now, each enquiry is reviewed before any follow-up. This protects families, institutions, and sensitive legacy material from rushed onboarding.
            </div>
          </div>
          <EarlyAccessForm />
        </div>
      </section>

      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="font-serif text-3xl font-semibold text-amber-300">{platformBrand.name}</p>
            <p className="mt-2 font-bold text-white/82">{platformBrand.tagline}</p>
            <p className="mt-4 max-w-xl leading-7 text-white/62">Powered by thoughtful technology and responsible stewardship.</p>
          </div>
          <nav aria-label="LegacyHub footer navigation" className="flex flex-wrap gap-3 lg:justify-end">
            <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="#mission">Mission</Link>
            <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/">Baba Muyi Legacy</Link>
            <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/privacy">Privacy</Link>
            <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/contact">Contact</Link>
            <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/login">Sign In</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function CapabilityList({ title, label, items, icon }: { title: string; label: string; items: readonly string[]; icon: "current" | "planned" }) {
  const Icon = icon === "current" ? ShieldCheck : Milestone;

  return (
    <article className="rounded border border-stone-300 bg-[#fbf7ef] p-6">
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className="mt-1 size-6 text-amber-800" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-800">{label}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">{title}</h2>
        </div>
      </div>
      <ul className="mt-6 grid gap-3">
        {items.map((item) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
            {icon === "current" ? (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700" />
            ) : (
              <Sparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-700" />
            )}
            <span>
              {item}
              {icon === "planned" ? <span className="font-bold text-slate-950"> - planned</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
