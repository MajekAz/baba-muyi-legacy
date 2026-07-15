import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { PublicNavigation } from "@/components/public-navigation";
import { flagshipArchiveBrand, platformBrand } from "@/lib/brand";
import { getCmsMenus } from "@/lib/cms-store";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const footerMenu = await getCmsMenus("footer");

  return (
    <html lang="en">
      <body className="font-sans">
        <PublicNavigation />
        {children}
        <footer className="bg-archive-navy text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(16rem,24rem)_1fr]">
              <div>
                <p className="font-serif text-3xl font-semibold leading-none text-archive-gold">Baba Muyi Legacy</p>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/72">
                {flagshipArchiveBrand.description}
                </p>
                <div className="mt-6 border-l border-archive-gold/40 pl-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-gold">
                    {flagshipArchiveBrand.relationship}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/70">{platformBrand.tagline}</p>
                </div>
              </div>

              <nav className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-label="Footer navigation">
                {footerMenu.slice(0, 6).map((item) => (
                  <div key={item.id}>
                    <Link
                      className="font-semibold text-white transition hover:text-archive-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                    {item.children?.length ? (
                      <ul className="mt-3 grid gap-2">
                        {item.children.slice(0, 4).map((child) => (
                          <li key={child.href}>
                            <Link
                              className="text-sm leading-6 text-white/62 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold"
                              href={child.href}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </nav>
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/58 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Baba Muyi Legacy.</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <span aria-disabled="true" className="text-white/42">
                  Create a Legacy
                </span>
                <Link className="hover:text-white" href="/contact">Contact</Link>
                <Link className="hover:text-white" href="/privacy">Privacy</Link>
                <Link className="hover:text-white" href="/admin">Admin</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
