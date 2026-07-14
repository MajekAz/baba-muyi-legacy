import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { PublicNavigation } from "@/components/public-navigation";
import { getCmsMenus } from "@/lib/cms-store";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const footerMenu = await getCmsMenus("footer");

  return (
    <html lang="en">
      <body className="font-sans">
        <header className="sticky top-0 z-[1000] border-b border-white/10 bg-archive-navy/95 text-white backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="grid min-w-0 gap-0.5">
              <span className="font-serif text-2xl font-semibold leading-none text-archive-gold">
                Baba Muyi Legacy
              </span>
              <span className="text-xs text-white/70">Digital museum and family archive</span>
            </Link>
            <PublicNavigation />
            <div className="hidden items-center gap-3 xl:flex">
              <Link
                href="/documentaries"
                className="rounded bg-archive-gold px-4 py-2 text-sm font-semibold text-archive-navy transition hover:bg-white"
              >
                Watch the Documentary
              </Link>
              <Link
                href="/tributes"
                className="rounded border border-archive-gold/70 px-4 py-2 text-sm font-semibold text-archive-gold transition hover:bg-archive-gold hover:text-archive-navy"
              >
                Share a Memory
              </Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="bg-archive-navy text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
            <div>
              <p className="font-serif text-2xl text-archive-gold">Baba Muyi Legacy</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
                A respectful archive preserving family history, transport heritage, documentary
                material, public memories, and the values of Alhaji Tioluwalase Majekodunmi.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {footerMenu.slice(0, 12).map((item) => (
                <Link className="rounded border border-white/15 px-3 py-2 hover:bg-white/10" href={item.href} key={item.id}>
                  {item.label}
                </Link>
              ))}
              <Link className="rounded border border-white/15 px-3 py-2 hover:bg-white/10" href="/admin">Admin</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
