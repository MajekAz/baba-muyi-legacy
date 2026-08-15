import Link from "next/link";
import { StatusCard } from "@/components/status-card";
import { getPublicCmsCoreRecords, type CmsCoreRecord } from "@/lib/cms-core";
import { getActiveCmsWorkspaceContext, getCmsPageByPath } from "@/lib/cms-store";

const expectedBiographyChapters = [
  "A Life Worth Remembering",
  "Early Life: The Roots That Shaped a Leader",
  "From Iboogun to Bariga: The Journey That Changed Everything",
  "Building a Dream: The Birth of an Entrepreneur",
  "From Bolekaja to TIOLUWA LASE: A Legacy on the Roads of Lagos",
  "Beyond Business: A Leader Who Served His Community",
  "Family, Responsibility and Sacrifice",
  "When Blind Trust Became the Price of Doing Good",
  "Later Years: Resilience Through Change",
  "An Enduring Legacy"
] as const;

const expectedBiographyAnchorIds = [
  "a-life-worth-remembering",
  "early-life-the-roots-that-shaped-a-leader",
  "from-iboogun-to-bariga-the-journey-that-changed-everything",
  "building-a-dream-the-birth-of-an-entrepreneur",
  "from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos",
  "beyond-business-a-leader-who-served-his-community",
  "family-responsibility-and-sacrifice",
  "the-price-of-blind-trust",
  "later-years-resilience-through-change",
  "an-enduring-legacy"
] as const;

const chapterWordLabels = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

type BiographyChapter = {
  id: string;
  label: string;
  title: string;
  bodyHtml: string;
};

function decodeEntities(value: string) {
  return value
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function textFromHtml(value: string) {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyAnchor(value: string) {
  return textFromHtml(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeChapterTitle(value: string) {
  return textFromHtml(value).replace(/^Chapter\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten):\s*/i, "");
}

function parseBiographyChapters(record: CmsCoreRecord): BiographyChapter[] {
  const contentHtml = record.contentHtml;
  const headings = [...contentHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];

  if (!headings.length) {
    return [{
      id: record.slug || slugifyAnchor(record.title),
      label: "Biography chapter",
      title: record.title,
      bodyHtml: contentHtml
    }];
  }

  return headings.map((heading, index) => {
    const headingHtml = heading[0];
    const headingText = heading[1];
    const start = (heading.index ?? 0) + headingHtml.length;
    const next = headings[index + 1]?.index ?? contentHtml.length;
    const title = normalizeChapterTitle(headingText);

    return {
      id: expectedBiographyAnchorIds[index] ?? slugifyAnchor(title),
      label: `Chapter ${index + 1}`,
      title,
      bodyHtml: contentHtml.slice(start, next).trim()
    };
  });
}

function readingTimeLabel(records: CmsCoreRecord[]) {
  const words = records
    .map((record) => textFromHtml(record.contentHtml))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function getBiographyChapters(records: CmsCoreRecord[]) {
  return records.flatMap(parseBiographyChapters);
}

function chapterNumberLabel(index: number) {
  return chapterWordLabels[index] ? `Chapter ${chapterWordLabels[index]}` : `Chapter ${index + 1}`;
}

function BiographyContents({ chapters }: { chapters: BiographyChapter[] }) {
  const list = (
    <ol className="grid gap-3 md:grid-cols-2">
      {chapters.map((chapter, index) => (
        <li key={chapter.id}>
          <Link
            className="group flex h-full gap-4 rounded border border-archive-navy/10 bg-white/80 p-4 text-left shadow-sm transition hover:border-archive-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
            href={`#${chapter.id}`}
          >
            <span className="font-serif text-2xl font-semibold leading-none text-archive-gold">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">{chapterNumberLabel(index)}</span>
              <span className="mt-1 block font-serif text-lg leading-6 text-archive-navy group-hover:underline">{chapter.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );

  return (
    <section className="mx-auto max-w-5xl scroll-mt-28" id="biography-contents" aria-labelledby="biography-contents-title">
      <div className="hidden md:block">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-archive-brown">Biography contents</p>
            <h2 id="biography-contents-title" className="mt-2 font-serif text-3xl text-archive-navy">Read by chapter</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-slate-600">Jump directly to the chapter you want to read.</p>
        </div>
        {list}
      </div>

      <details className="rounded border border-archive-navy/12 bg-white/85 p-4 shadow-sm md:hidden">
        <summary className="cursor-pointer font-serif text-2xl font-semibold text-archive-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold">
          Biography chapters
        </summary>
        <div className="mt-5">{list}</div>
      </details>
    </section>
  );
}

function ChapterNavigation({ chapters, index }: { chapters: BiographyChapter[]; index: number }) {
  const previous = chapters[index - 1];
  const next = chapters[index + 1];

  return (
    <nav className="mt-12 border-t border-archive-navy/10 pt-6" aria-label={`Chapter navigation for ${chapters[index].title}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            className="rounded border border-archive-navy/10 bg-white/78 p-4 transition hover:border-archive-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
            href={`#${previous.id}`}
          >
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">Previous chapter</span>
            <span className="mt-1 block font-serif text-lg leading-6 text-archive-navy">{previous.title}</span>
          </Link>
        ) : <span aria-hidden="true" />}
        {next ? (
          <Link
            className="rounded border border-archive-navy/10 bg-white/78 p-4 transition hover:border-archive-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold sm:text-right"
            href={`#${next.id}`}
          >
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">Next chapter</span>
            <span className="mt-1 block font-serif text-lg leading-6 text-archive-navy">{next.title}</span>
          </Link>
        ) : (
          <Link
            className="rounded border border-archive-navy/10 bg-white/78 p-4 transition hover:border-archive-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold sm:text-right"
            href="#biography-contents"
          >
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">Back to contents</span>
            <span className="mt-1 block font-serif text-lg leading-6 text-archive-navy">Biography chapters</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

function BiographyChapterSection({ chapter, index, chapters }: { chapter: BiographyChapter; index: number; chapters: BiographyChapter[] }) {
  return (
    <section
      className="scroll-mt-28 border-t border-archive-navy/12 py-14 first:border-t-0 first:pt-0"
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-archive-brown">{chapterNumberLabel(index)}</p>
      <h2 id={`${chapter.id}-title`} className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-archive-navy sm:text-5xl">
        {chapter.title}
      </h2>
      <div
        className="biography-prose mt-8 max-w-[78ch] text-lg leading-8 text-slate-700"
        dangerouslySetInnerHTML={{ __html: chapter.bodyHtml }}
      />
      <ChapterNavigation chapters={chapters} index={index} />
    </section>
  );
}

function RelatedArchiveLinks({ cards }: { cards: Array<{ id: string; title: string; description: string; href?: string }> }) {
  if (!cards.length) return null;

  return (
    <section className="mx-auto max-w-5xl border-t border-archive-navy/12 pt-12" aria-labelledby="related-archive-links">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-archive-brown">Continue exploring</p>
      <h2 id="related-archive-links" className="mt-2 font-serif text-3xl text-archive-navy">Related archive sections</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {cards.map((card) => {
          const content = <StatusCard title={card.title} description={card.description} />;
          return card.href ? <Link href={card.href} key={card.id}>{content}</Link> : <div key={card.id}>{content}</div>;
        })}
      </div>
    </section>
  );
}

export async function BiographyLongformPage() {
  const page = await getCmsPageByPath("/biography");

  if (!page) {
    return (
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <StatusCard title="Biography awaiting publication" description="This biography will appear after reviewed material is approved for public release." />
        </section>
      </main>
    );
  }

  const { workspace, legacyProfile } = await getActiveCmsWorkspaceContext();
  const records = await getPublicCmsCoreRecords("biography", { workspaceId: workspace.id, legacyProfileId: legacyProfile.id });
  const chapters = getBiographyChapters(records);

  return (
    <main>
      <section className="bg-archive-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-archive-gold">{page.eyebrow || "Authentic Biography"}</p>
            <h1 className="mt-5 font-serif text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-white/82">{page.description}</p>
            <dl className="mt-8 flex flex-wrap gap-3 text-sm text-white/76">
              <div className="rounded border border-white/15 px-4 py-3">
                <dt className="sr-only">Source note</dt>
                <dd>Biography Editorial Pack v1.0</dd>
              </div>
              <div className="rounded border border-white/15 px-4 py-3">
                <dt className="sr-only">Chapter count</dt>
                <dd>{chapters.length || expectedBiographyChapters.length} chapters</dd>
              </div>
              <div className="rounded border border-white/15 px-4 py-3">
                <dt className="sr-only">Estimated reading time</dt>
                <dd>{readingTimeLabel(records)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-archive-cream px-4 py-12 sm:px-6 lg:px-8">
        <BiographyContents chapters={chapters} />
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {chapters.length ? chapters.map((chapter, index) => (
            <BiographyChapterSection chapter={chapter} chapters={chapters} index={index} key={chapter.id} />
          )) : (
            <StatusCard title="No public biography chapters yet" description="This biography will remain quiet until reviewed material is approved for public release." />
          )}
        </div>
      </section>

      <section className="bg-archive-cream px-4 py-14 sm:px-6 lg:px-8">
        <RelatedArchiveLinks cards={page.cards} />
      </section>
    </main>
  );
}

export const biographyLongformTestContract = {
  expectedBiographyChapters,
  expectedAnchorIds: expectedBiographyAnchorIds
};
