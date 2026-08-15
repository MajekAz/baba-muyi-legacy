import Image from "next/image";
import Link from "next/link";
import type { CmsCoreRecord } from "@/lib/cms-core";
import {
  archiveCollectionPreviews,
  archiveFooterCtas,
  archiveHomeCtas,
  archiveJourneyPreview,
  archiveLessonThemes,
  babaMuyiArchiveFacts,
} from "@/lib/baba-muyi-public-archive";
import type { CmsMenuItem } from "@/lib/cms-types";
import type { MediaRecord } from "@/lib/media/types";

type HomePageProps = {
  heroImage?: MediaRecord;
  timeline: CmsCoreRecord[];
  lessons: CmsCoreRecord[];
  stories: CmsCoreRecord[];
  documentary?: Pick<CmsCoreRecord, "title" | "summary">;
  galleryImages: MediaRecord[];
  navigation: CmsMenuItem[];
};

const restoredPortrait = {
  src: "/brand/baba-muyi-restored-portrait-cutout.png",
  alt: "Restored portrait of Alhaji Tioluwalase Baba Muyi Majekodunmi"
};

export function BabaMuyiCinematicHome({ timeline, lessons, stories, documentary, galleryImages, navigation }: HomePageProps) {
  const featuredNavigation = navigation.filter((item) => item.href !== "/").slice(0, 8);

  return (
    <main className="bg-[#f8f3e8] text-archive-navy">
      <CinematicHero />
      <ArchiveIntroduction featuredNavigation={featuredNavigation} />
      <BiographyPreview />
      <LifeJourneyPreview timeline={timeline} />
      <FeaturedDocumentary documentary={documentary} />
      <CollectionPreview galleryImages={galleryImages} />
      <LessonsPreview lessons={lessons} />
      <MemoriesPreview stories={stories} />
      <AboutArchive />
      <CuratorNote />
      <ClosingLegacyStatement />
    </main>
  );
}

function CinematicHero() {
  return (
    <section className="relative isolate overflow-hidden bg-archive-charcoal text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_10%,rgba(198,161,91,.22),transparent_34%),linear-gradient(135deg,#07131d,#111111_58%,#201a12)]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:repeating-linear-gradient(135deg,rgba(248,243,232,.36)_0_1px,transparent_1px_34px)]" />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_.88fr] lg:px-8">
        <div className="max-w-3xl py-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-archive-gold">{babaMuyiArchiveFacts.relationship}</p>
          <h1 className="mt-6 max-w-4xl break-words font-serif text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
            {babaMuyiArchiveFacts.heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/82">{babaMuyiArchiveFacts.legacyLine}</p>
          <p className="mt-3 max-w-2xl font-serif text-2xl leading-8 text-archive-gold">{babaMuyiArchiveFacts.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {archiveHomeCtas.map((cta) => (
              <ArchiveButton href={cta.href} key={cta.href} primary={cta.primary} inverse={!cta.primary}>
                {cta.label}
              </ArchiveButton>
            ))}
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 text-sm font-bold text-white/72 sm:grid-cols-5">
            {["Entrepreneur", "Transport pioneer", "Patriarch", "Community leader", "Legacy"].map((word) => (
              <span className="border-l border-archive-gold/45 pl-3" key={word}>{word}</span>
            ))}
          </div>
        </div>

        <figure className="relative mx-auto flex w-full max-w-md items-center justify-center self-center lg:max-w-none lg:justify-self-center">
          <div className="absolute bottom-6 left-1/2 -z-10 h-[78%] w-[82%] -translate-x-1/2 rounded-full border border-archive-gold/30 bg-archive-gold/10 blur-[1px]" />
          <div className="absolute bottom-0 left-1/2 -z-20 h-2/3 w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(198,161,91,.24),transparent_68%)]" />
          <Image
            priority
            className="h-auto w-full max-w-[36rem] object-contain object-center drop-shadow-[0_2rem_2.5rem_rgba(0,0,0,.5)]"
            src={restoredPortrait.src}
            alt={restoredPortrait.alt}
            width={1254}
            height={1254}
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 70vw, 92vw"
          />
        </figure>
      </div>
    </section>
  );
}

function ArchiveIntroduction({ featuredNavigation }: { featuredNavigation: CmsMenuItem[] }) {
  return (
    <ArchiveSection eyebrow="Archive introduction" title="A life preserved with dignity, care and family stewardship.">
      <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
        <div className="max-w-3xl text-lg leading-8 text-slate-700">
          <p>{babaMuyiArchiveFacts.introduction}</p>
          <p className="mt-5">
            Visitors can explore biography chapters, timeline records, photographs, documentary material, lessons, tributes, and reviewed public memories connected to his life.
          </p>
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

function BiographyPreview() {
  return (
    <ArchiveSection eyebrow="Biography preview" title="The Man Behind the Legacy">
      <div className="grid gap-8 lg:grid-cols-[1fr_.55fr] lg:items-start">
        <div className="rounded-sm border border-archive-navy/12 bg-white p-6 shadow-sm">
          <p className="text-lg leading-8 text-slate-700">{babaMuyiArchiveFacts.biographyPreview}</p>
          <div className="mt-6">
            <ArchiveButton href="/biography" primary>Read His Biography</ArchiveButton>
          </div>
        </div>
        <div className="rounded-sm border border-archive-navy/12 bg-[#fffaf0] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-archive-brown">Editorial note</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            The homepage introduces the biography only briefly. Full chapters, corrections, and additional verified context belong on the biography page.
          </p>
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
    <ArchiveSection dark eyebrow="Timeline preview" title="A Life Through Time">
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {source.map((item, index) => (
          <li className="rounded-sm border border-white/12 bg-white/[0.06] p-5" key={`${item.title}-${index}`}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-gold">{item.label}</p>
            <h3 className="mt-3 font-serif text-2xl text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/68">{item.description}</p>
            <Link className="mt-4 inline-flex text-sm font-bold text-archive-gold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold" href={item.href}>
              Explore the Timeline
            </Link>
          </li>
        ))}
      </ol>
    </ArchiveSection>
  );
}

function FeaturedDocumentary({ documentary }: { documentary?: Pick<CmsCoreRecord, "title" | "summary"> }) {
  return (
    <ArchiveSection dark eyebrow="Documentary preview" title="His Story on Film">
      <div className="grid gap-8 lg:grid-cols-[1fr_.7fr]">
        <div className="rounded-sm border border-white/12 bg-white/[0.06] p-6">
          {documentary?.title ? <h3 className="font-serif text-3xl font-semibold text-white">{documentary.title}</h3> : null}
          <p className="max-w-3xl text-lg leading-8 text-white/72">
            {documentary?.summary || babaMuyiArchiveFacts.documentaryPreview}
          </p>
          <div className="mt-6">
            <ArchiveButton href="/documentaries" primary>Watch Documentary</ArchiveButton>
          </div>
        </div>
        <div className="rounded-sm border border-white/12 bg-black/20 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-archive-gold">Film archive</p>
          <p className="mt-3 text-sm leading-6 text-white/68">
            The documentary area is reserved for approved film records, chapters, interviews, clips, transcripts, and narrator attribution.
          </p>
        </div>
      </div>
    </ArchiveSection>
  );
}

function CollectionPreview({ galleryImages }: { galleryImages: MediaRecord[] }) {
  return (
    <ArchiveSection eyebrow="Gallery preview" title="Moments Preserved">
      <div className="grid gap-8">
        {galleryImages.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {galleryImages.map((image) => (
              <figure className="rounded-sm border border-archive-navy/12 bg-white p-3 shadow-sm" key={image.id}>
                {image.mediaType === "image" && image.signedUrl ? (
                  <Image
                    className="aspect-[4/3] w-full rounded-sm object-cover"
                    src={image.signedUrl}
                    alt={image.altText || image.title || "Published Tioluwalase Majekodunmi archive image"}
                    width={640}
                    height={480}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  />
                ) : null}
                <figcaption className="mt-3 text-sm leading-6 text-slate-600">
                  {image.caption || image.description || image.title || "Published archive image. Editorial review may add more identifying context."}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {archiveCollectionPreviews.map((item) => (
            <Link className="rounded-sm border border-archive-navy/12 bg-white/82 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-archive-gold hover:shadow-museum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold motion-reduce:transition-none motion-reduce:hover:translate-y-0" href={item.href} key={item.href}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-brown">{item.label}</p>
              <h3 className="mt-2 font-serif text-2xl text-archive-navy">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
        <div>
          <ArchiveButton href="/gallery" primary>Visit the Gallery</ArchiveButton>
        </div>
      </div>
    </ArchiveSection>
  );
}

function LessonsPreview({ lessons }: { lessons: CmsCoreRecord[] }) {
  return (
    <ArchiveSection dark eyebrow="Legacy and lessons preview" title="Wisdom That Endures">
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
        <div className="grid gap-4 md:grid-cols-3">
          {archiveLessonThemes.map((lesson) => (
            <article className="rounded-sm border border-white/12 bg-white/[0.06] p-5" key={lesson.title}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-archive-gold">Life lesson</p>
              <h3 className="mt-3 font-serif text-2xl text-white">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/68">{lesson.description}</p>
            </article>
          ))}
        </div>
      )}
      <div className="mt-8">
        <ArchiveButton href="/lessons" primary>Explore His Legacy</ArchiveButton>
      </div>
    </ArchiveSection>
  );
}

function MemoriesPreview({ stories }: { stories: CmsCoreRecord[] }) {
  return (
    <ArchiveSection eyebrow="Stories and tributes preview" title="Voices of Those He Touched">
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
        <div className="rounded-sm border border-archive-navy/12 bg-white p-6 shadow-sm">
          <p className="max-w-3xl text-lg leading-8 text-slate-700">
            Relatives, friends, neighbours, associates, and community members are invited to contribute personal memories, photographs, tributes, historical information, corrections, or additional context for editorial review.
          </p>
        </div>
      )}
      <div className="mt-8">
        <ArchiveButton href="/tributes" primary>Share a Memory</ArchiveButton>
      </div>
    </ArchiveSection>
  );
}

function AboutArchive() {
  return (
    <ArchiveSection eyebrow="About the archive" title="Preserving a Life for Future Generations">
      <div className="rounded-sm border border-archive-navy/12 bg-white p-6 shadow-sm">
        <p className="max-w-4xl text-lg leading-8 text-slate-700">{babaMuyiArchiveFacts.archivePurpose}</p>
      </div>
    </ArchiveSection>
  );
}

function CuratorNote() {
  return (
    <section className="bg-[#f8f3e8] text-archive-navy">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-sm border border-archive-navy/12 bg-[#fffaf0] p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-archive-brown">Curator&apos;s note</p>
          <blockquote className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            <p>{babaMuyiArchiveFacts.curatorLine}</p>
          </blockquote>
          <p className="mt-5 font-serif text-2xl font-semibold text-archive-navy">Azeez Adeyemi Majekodunmi</p>
          <p className="text-sm font-bold text-archive-brown">Founder, Tioluwalase Majekodunmi Archive</p>
        </div>
      </div>
    </section>
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

function ArchiveButton({ href, children, primary = false, inverse = false }: { href: string; children: React.ReactNode; primary?: boolean; inverse?: boolean }) {
  return (
    <Link
      className={primary
        ? "inline-flex min-h-11 items-center rounded-sm bg-archive-gold px-5 py-3 text-sm font-black text-archive-navy transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
        : inverse
          ? "inline-flex min-h-11 items-center rounded-sm border border-white/30 px-5 py-3 text-sm font-black text-white transition hover:border-archive-gold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
        : "inline-flex min-h-11 items-center rounded-sm border border-archive-navy/22 px-5 py-3 text-sm font-black text-archive-navy transition hover:border-archive-gold hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"}
      href={href}
    >
      {children}
    </Link>
  );
}
