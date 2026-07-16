import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getCmsPageByPath, getCmsMenus, getPublishedCmsContent } from "@/lib/cms-store";

export default async function HomePage() {
  const page = await getCmsPageByPath("/");
  const features = await getCmsMenus("header");
  const timeline = await getPublishedCmsContent("timeline_event", "/timeline");

  if (!page) {
    return null;
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-archive-navy text-white">
        <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(135deg,rgba(198,161,91,.35)_0_1px,transparent_1px_26px)]" />
        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-end gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div className="pb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-archive-gold">
              {page.eyebrow}
            </p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-none sm:text-7xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">{page.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded bg-archive-gold px-5 py-3 text-sm font-bold text-archive-navy" href="/biography">
                Read the biography
              </Link>
              <Link className="rounded border border-white/20 px-5 py-3 text-sm font-bold text-white" href="/tributes">
                Share a memory
              </Link>
            </div>
          </div>
          <div className="rounded border border-white/12 bg-white/8 p-6 backdrop-blur">
            <p className="font-serif text-3xl text-archive-gold">Archive principles</p>
            <div className="mt-6 grid gap-3">
              {page.cards.map((card) => (
                <div key={card.id} className="rounded border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/84">
                  <p className="font-semibold">{card.title}</p>
                  <p className="mt-1 text-white/64">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Public release" title="A museum-style archive built for one family first, then many families later.">
          <p>
            Baba Muyi is the first legacy profile. The underlying structure is prepared for future
            families, role-based contributors, moderated submissions, and private media review.
          </p>
        </SectionHeading>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.filter((feature) => feature.href !== "/").slice(0, 6).map((feature) => (
            <Link
              className="rounded border border-archive-navy/12 bg-white/78 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-museum"
              href={feature.href}
              key={feature.href}
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">Archive section</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-archive-navy">{feature.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">{feature.description ?? "Family-reviewed material will appear here when it is ready."}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-archive-charcoal text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Timeline preview" title="The first chapters to curate" inverse />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {timeline.map((event) => (
              <article className="rounded border border-white/10 bg-white/8 p-6" key={event.id}>
                <p className="text-sm font-bold text-archive-gold">{event.dateLabel}</p>
                <h3 className="mt-3 font-serif text-2xl">{event.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/72">{event.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
