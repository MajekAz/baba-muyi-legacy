import Image from "next/image";
import Link from "next/link";
import type { CmsCoreRecord } from "@/lib/cms-core";
import {
  archiveCollectionPreviews,
  archiveFooterCtas,
  archiveHomeCtas,
  archiveJourneyPreview,
  babaMuyiArchiveFacts,
  transportHeritageLinks
} from "@/lib/baba-muyi-public-archive";
import type { CmsMenuItem } from "@/lib/cms-types";
import type { MediaRecord } from "@/lib/media/types";

type HomePageProps = {
  heroImage?: MediaRecord;
  timeline: CmsCoreRecord[];
  lessons: CmsCoreRecord[];
  stories: CmsCoreRecord[];
  documentary?: Pick<CmsCoreRecord, "title" | "summary">;
  navigation: CmsMenuItem[];
};

export function BabaMuyiCinematicHome({ heroImage, timeline, lessons, stories, documentary, navigation }: HomePageProps) {
  const featuredNavigation = navigation.filter((item) => item.href !== "/").slice(0, 8);

  return (
    <main className="bg-[#f8f3e8] text-archive-navy">
      <CinematicHero heroImage={heroImage} />
      <ArchiveIntroduction featuredNavigation={featuredNavigation} />
      <LifeJourneyPreview timeline={timeline} />
      <TransportHeritageFeature />
      <FeaturedDocumentary documentary={documentary} />
      <CollectionPreview />
      <LessonsPreview lessons={lessons} />
      <MemoriesPreview stories={stories} />
      <ClosingLegacyStatement />
    </main>
  );
}

function CinematicHero({ heroImage }: { heroImage?: MediaRecord }) {
  return (
    <section className="relative isolate overflow-hidden bg-archive-charcoal text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_10%,rgba(198,161,91,.22),transparent_34%),linear-gradient(135deg,#07131d,#111111_58%,#201a12)]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:repeating-linear-gradient(135deg,rgba(248,243,232,.36)_0_1px,transparent_1px_34px)]" />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_.88fr] lg:px-8">
        <div className="max-w-3xl py-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-archive-gold">{babaMuyiArchiveFacts.relationship}</p>
          <h1 className="mt-6 max-w-4xl break-words font-serif text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
            {babaMuyiArchiveFacts.fullName}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/82">{babaMuyiArchiveFacts.legacyLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {archiveHomeCtas.map((cta) => (
              <ArchiveButton href={cta.href} key={cta.href} primary={cta.primary}>
                {cta.label}
              </ArchiveButton>
            ))}
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 text-sm font-bold text-white/72 sm:grid-cols-5">
            {["Father", "Entrepreneur", "Leader", "Philanthropist", "Legacy"].map((word) => (
              <span className="border-l border-archive-gold/45 pl-3" key={word}>{word}</span>
            ))}
          </div>
        </div>

        <figure className="relative">
          {heroImage?.mediaType === "image" && heroImage.signedUrl ? (
            <>
              <Image
                priority
                className="aspect-[4/5] w-full rounded-sm border border-white/18 object-cover shadow-2xl"
                src={heroImage.signedUrl}
                alt={heroImage.altText || heroImage.title}
                width={960}
                height={1200}
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <figcaption className="mt-3 text-sm leading-6 text-white/68">
                {heroImage.caption || heroImage.description || heroImage.title}
                {heroImage.source ? <span className="block text-white/48">Source: {heroImage.source}</span> : null}
              </figcaption>
            </>
          ) : (
            <div className="aspect-[4/5] rounded-sm border border-white/18 bg-[#1c2530] p-6 shadow-2xl">
              <div className="flex h-full flex-col justify-between border border-archive-gold/28 p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-archive-gold">Archive portrait pending</p>
                <div>
                  <p className="font-serif text-4xl leading-none text-white">Baba Muyi Legacy</p>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/66">
                    An approved public portrait will appear here when the family archive team publishes one.
                  </p>
                </div>
              </div>
            </div>
          )}
        </figure>
      </div>
    </section>
  );
}

function ArchiveIntroduction({ featuredNavigation }: { featuredNavigation: CmsMenuItem[] }) {
  return (
    <ArchiveSection eyebrow="Archive introduction" title="A family-led public archive, built with care.">
      <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
        <div className="max-w-3xl text-lg leading-8 text-slate-700">
          <p>{babaMuyiArchiveFacts.introduction}</p>
          <p className="mt-5">{babaMuyiArchiveFacts.curatorLine}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredNavigation.map((item) => (
            <Link className="rounded-sm border border-archive-navy/12 bg-white/72 p-4 shadow-sm transition hover:border-archive-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold" href={item.href} key={item.href}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-brown">Explore</p>
              <h3 className="mt-2 font-serif text-2xl text-archive-navy">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description || "Family-reviewed public archive section."}</p>
            </Link>
          ))}
        </div>
      </div>
    </ArchiveSection>
  );
}

function LifeJourneyPreview({ timeline }: { timeline: CmsCoreRecord[] }) {
  const source = timeline.length
    ? timeline.slice(0, 4).map((event) => ({
      label: event.dateLabel || event.category || "Published timeline",
      title: event.title,
      description: event.summary,
      href: "/timeline"
    }))
    : archiveJourneyPreview;

  return (
    <ArchiveSection dark eyebrow="Life journey preview" title="The story opens through roots, work, community and memory.">
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {source.map((item, index) => (
          <li className="rounded-sm border border-white/12 bg-white/[0.06] p-5" key={`${item.title}-${index}`}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-gold">{item.label}</p>
            <h3 className="mt-3 font-serif text-2xl text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/68">{item.description}</p>
            <Link className="mt-4 inline-flex text-sm font-bold text-archive-gold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold" href={item.href}>
              Continue this chapter
            </Link>
          </li>
        ))}
      </ol>
    </ArchiveSection>
  );
}

function TransportHeritageFeature() {
  return (
    <ArchiveSection eyebrow="Transport heritage" title="Bolekaja, Molue and the TIOLUWA LASE road memory.">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-sm border border-archive-navy/12 bg-white p-6 shadow-sm">
          <p className="text-lg leading-8 text-slate-700">
            The transport section is prepared for approved stories about enterprise, routes, passengers, drivers, conductors, community connection, and the TIOLUWA LASE bus identity.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {transportHeritageLinks.map((item) => (
            <Link className="rounded-sm border border-archive-navy/12 bg-[#fffaf0] p-5 transition hover:border-archive-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold" href={item.href} key={item.href}>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-archive-brown">Transport route</span>
              <span className="mt-2 block font-serif text-2xl text-archive-navy">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </ArchiveSection>
  );
}

function FeaturedDocumentary({ documentary }: { documentary?: Pick<CmsCoreRecord, "title" | "summary"> }) {
  return (
    <ArchiveSection dark eyebrow="Featured documentary" title={documentary?.title ?? "Documentary material will appear when approved."}>
      <div className="grid gap-8 lg:grid-cols-[1fr_.7fr]">
        <div className="rounded-sm border border-white/12 bg-white/[0.06] p-6">
          <p className="max-w-3xl text-lg leading-8 text-white/72">
            {documentary?.summary || "The documentary centre is ready to present published film records, episodes, clips, credits, transcripts and narrator attribution when the archive team approves them for public release."}
          </p>
          <div className="mt-6">
            <ArchiveButton href="/documentaries" primary>Open documentary centre</ArchiveButton>
          </div>
        </div>
        <div className="rounded-sm border border-white/12 bg-black/20 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-archive-gold">Publication rule</p>
          <p className="mt-3 text-sm leading-6 text-white/68">Private, draft, review-stage or unpublished media is not embedded on the public homepage.</p>
        </div>
      </div>
    </ArchiveSection>
  );
}

function CollectionPreview() {
  return (
    <ArchiveSection eyebrow="Featured archive collections" title="A museum-style path through photographs, records, stories and lessons.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {archiveCollectionPreviews.map((item) => (
          <Link className="rounded-sm border border-archive-navy/12 bg-white/82 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-archive-gold hover:shadow-museum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold motion-reduce:transition-none motion-reduce:hover:translate-y-0" href={item.href} key={item.href}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-brown">{item.label}</p>
            <h3 className="mt-2 font-serif text-2xl text-archive-navy">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </ArchiveSection>
  );
}

function LessonsPreview({ lessons }: { lessons: CmsCoreRecord[] }) {
  return (
    <ArchiveSection dark eyebrow="Values and life lessons" title="Lessons are preserved as inheritance, not decoration.">
      {lessons.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {lessons.slice(0, 3).map((lesson) => (
            <article className="rounded-sm border border-white/12 bg-white/[0.06] p-5" key={lesson.id}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-gold">{lesson.category || "Lesson"}</p>
              <h3 className="mt-3 font-serif text-2xl text-white">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/68">{lesson.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <ArchiveEmptyState inverse title="Lessons awaiting publication" description="Approved public lessons will appear here when the archive team publishes them." />
      )}
    </ArchiveSection>
  );
}

function MemoriesPreview({ stories }: { stories: CmsCoreRecord[] }) {
  return (
    <ArchiveSection eyebrow="Family and community memories" title="Reviewed memories can become part of the public record.">
      {stories.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {stories.slice(0, 2).map((story) => (
            <article className="rounded-sm border border-archive-navy/12 bg-white p-6 shadow-sm" key={story.id}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-brown">{story.author || "Published memory"}</p>
              <h3 className="mt-3 font-serif text-2xl text-archive-navy">{story.title}</h3>
              <p className="mt-3 leading-7 text-slate-700">{story.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <ArchiveEmptyState title="No public memories yet" description="Family and community memories will appear only after review and publication." />
      )}
    </ArchiveSection>
  );
}

function ClosingLegacyStatement() {
  return (
    <section className="bg-[#efe4d0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-y border-archive-navy/16 py-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-archive-brown">Closing archive statement</p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-archive-navy sm:text-5xl">{babaMuyiArchiveFacts.closing}</h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:max-w-xs">
            {archiveFooterCtas.map((cta) => (
              <ArchiveButton href={cta.href} key={cta.href}>{cta.label}</ArchiveButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchiveSection({ eyebrow, title, children, dark = false }: { eyebrow: string; title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? "bg-archive-navy text-white" : "bg-[#f8f3e8] text-archive-navy"}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className={dark ? "text-xs font-black uppercase tracking-[0.2em] text-archive-gold" : "text-xs font-black uppercase tracking-[0.2em] text-archive-brown"}>{eyebrow}</p>
        <h2 className="mt-4 max-w-4xl break-words font-serif text-4xl font-semibold leading-tight sm:text-5xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function ArchiveButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link
      className={primary
        ? "inline-flex min-h-11 items-center rounded-sm bg-archive-gold px-5 py-3 text-sm font-black text-archive-navy transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
        : "inline-flex min-h-11 items-center rounded-sm border border-archive-navy/22 px-5 py-3 text-sm font-black text-archive-navy transition hover:border-archive-gold hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"}
      href={href}
    >
      {children}
    </Link>
  );
}

function ArchiveEmptyState({ title, description, inverse = false }: { title: string; description: string; inverse?: boolean }) {
  return (
    <div className={inverse ? "rounded-sm border border-white/12 bg-white/[0.06] p-6" : "rounded-sm border border-archive-navy/12 bg-white/78 p-6"}>
      <h3 className={inverse ? "font-serif text-2xl text-white" : "font-serif text-2xl text-archive-navy"}>{title}</h3>
      <p className={inverse ? "mt-2 text-sm leading-6 text-white/68" : "mt-2 text-sm leading-6 text-slate-600"}>{description}</p>
    </div>
  );
}
