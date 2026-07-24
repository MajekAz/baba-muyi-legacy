"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { platformBrand } from "@/lib/brand";
import { platformNavItems } from "@/lib/legacyhub-platform";

function isActive(pathname: string, href: string) {
  if (href === "/login") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PlatformHeader() {
  const pathname = usePathname();
  const logoActive = pathname === "/legacyhub";

  return (
    <header className="border-b border-slate-950/10 bg-[#111827] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            aria-current={logoActive ? "page" : undefined}
            className={`w-fit rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${logoActive ? "outline outline-2 outline-amber-300/40" : ""}`}
            href="/legacyhub"
          >
            <span className="block font-serif text-3xl font-semibold leading-none text-amber-300">{platformBrand.name}</span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-white/62">{platformBrand.tagline}</span>
          </Link>

          <details className="rounded border border-white/16 p-3 md:hidden">
            <summary className="cursor-pointer text-sm font-black text-white">Platform menu</summary>
            <nav aria-label="LegacyHub mobile platform navigation" className="mt-3 grid gap-2">
              {platformNavItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-3 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${active ? "bg-amber-300 text-slate-950" : "text-white/78 hover:bg-white/10 hover:text-white"}`}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </details>

          <nav aria-label="LegacyHub platform navigation" className="hidden flex-wrap gap-2 md:flex">
            {platformNavItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`rounded px-3 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${active ? "bg-amber-300 text-slate-950" : "text-white/78 hover:bg-white/10 hover:text-white"}`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
