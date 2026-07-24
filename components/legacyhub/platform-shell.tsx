import Link from "next/link";
import { platformBrand } from "@/lib/brand";
import { PlatformHeader } from "@/components/legacyhub/platform-header";

type Breadcrumb = {
  label: string;
  href?: string;
};

export function PlatformShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PlatformHeader />
      {children}
      <PlatformFooter />
    </>
  );
}

export function PlatformFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className="font-serif text-3xl font-semibold text-amber-300">{platformBrand.name}</p>
          <p className="mt-2 font-bold text-white/82">{platformBrand.tagline}</p>
          <p className="mt-4 max-w-xl leading-7 text-white/62">Powered by thoughtful technology and responsible stewardship.</p>
        </div>
        <nav aria-label="LegacyHub footer navigation" className="flex flex-wrap gap-3 lg:justify-end">
          <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/legacyhub/mission">Mission</Link>
          <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/">Baba Muyi Legacy</Link>
          <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/legacyhub/privacy">Privacy</Link>
          <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/legacyhub/contact">Contact</Link>
          <Link className="rounded px-3 py-2 text-sm font-bold text-white/74 hover:bg-white/10 hover:text-white" href="/login">Sign In</Link>
        </nav>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-8 text-sm font-bold text-slate-600 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap gap-2">
        <li>
          <Link className="text-amber-800 hover:text-slate-950" href="/legacyhub">LegacyHub</Link>
        </li>
        {items.map((item) => (
          <li className="flex gap-2" key={item.label}>
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link className="text-amber-800 hover:text-slate-950" href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-slate-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PlatformPageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-slate-950/10 bg-[#111827] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl break-words font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl">{title}</h1>
        <div className="mt-6 max-w-3xl text-lg leading-8 text-white/76">{children}</div>
      </div>
    </section>
  );
}

export function PlatformSection({ eyebrow, title, children, dark = false }: { eyebrow?: string; title?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? "bg-[#111827] py-16 text-white" : "py-16"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow ? <p className={dark ? "text-xs font-black uppercase tracking-[0.2em] text-amber-300" : "text-xs font-black uppercase tracking-[0.2em] text-amber-800"}>{eyebrow}</p> : null}
        {title ? <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold">{title}</h2> : null}
        <div className={title || eyebrow ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}

export function PlatformCTA({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return (
    <Link
      className={secondary
        ? "rounded border border-slate-950/20 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-slate-950 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
        : "rounded bg-amber-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"}
      href={href}
    >
      {children}
    </Link>
  );
}
