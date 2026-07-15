"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { MobileNavigation } from "@/components/mobile-navigation";
import { flagshipArchiveBrand } from "@/lib/brand";
import type { NavItem } from "@/lib/navigation";

export function PublicHeaderClient({ items, mobileItems }: { items: NavItem[]; mobileItems: NavItem[] }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuBaseId = useId().replace(/:/g, "");
  const activeClass = "bg-white/10 text-archive-gold";
  const inactiveClass = "text-white/80 hover:bg-white/10 hover:text-white";

  function isActive(item: NavItem) {
    return item.href === pathname || item.children?.some((child) => child.href === pathname);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-[1000] border-b border-white/10 bg-archive-navy/95 text-white backdrop-blur transition-[padding,background-color] motion-reduce:transition-none ${scrolled ? "shadow-sm" : ""}`}>
      <div className={`mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8 ${scrolled ? "py-3" : "py-4"}`}>
        <Link href="/" className="grid min-w-0 gap-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-archive-gold">
          <span className="whitespace-nowrap font-serif text-[1.65rem] font-semibold leading-none text-archive-gold">
            {flagshipArchiveBrand.name}
          </span>
          <span className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/64">{flagshipArchiveBrand.descriptor}</span>
        </Link>

        <nav ref={navRef} className="hidden items-center justify-center gap-1 min-[1080px]:flex" aria-label="Primary navigation">
          {items.map((item) => {
            const panelId = `${menuBaseId}-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            const isOpen = openMenu === item.label;
            const active = isActive(item);
            if (!item.children?.length) {
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold ${active ? activeClass : inactiveClass}`}
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div className="relative" key={item.label} onMouseEnter={() => setOpenMenu(item.label)}>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className={`inline-flex min-h-10 items-center gap-1 whitespace-nowrap rounded px-3 py-2 text-sm font-semibold transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold ${active ? activeClass : inactiveClass}`}
                  onClick={() => setOpenMenu((current) => current === item.label ? null : item.label)}
                  type="button"
                >
                  {item.label}
                  <ChevronDown aria-hidden="true" className={`size-4 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  aria-label={`${item.label} menu`}
                  className={`absolute left-1/2 top-[calc(100%+.5rem)] z-50 w-64 -translate-x-1/2 rounded border border-white/12 bg-archive-navy p-2 shadow-lg transition motion-reduce:transition-none ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
                  id={panelId}
                  onMouseLeave={() => setOpenMenu(null)}
                  role="menu"
                >
                  <Link
                    className="block rounded px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-archive-gold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold"
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
                    role="menuitem"
                  >
                    {item.label} overview
                  </Link>
                  <div className="my-1 border-t border-white/10" />
                  {item.children.map((child) => (
                    <Link
                      className="block rounded px-3 py-2.5 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold"
                      aria-current={child.href === pathname ? "page" : undefined}
                      href={child.href}
                      key={child.href}
                      onClick={() => setOpenMenu(null)}
                      role="menuitem"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center justify-end gap-2 min-[1080px]:flex">
          <Link className="whitespace-nowrap rounded bg-archive-gold px-3.5 py-2 text-sm font-bold text-archive-navy transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold" href="/documentaries">
            Watch Film
          </Link>
          <Link className="whitespace-nowrap rounded border border-archive-gold/70 px-3.5 py-2 text-sm font-bold text-archive-gold transition hover:bg-archive-gold hover:text-archive-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold" href="/tributes">
            Share a Memory
          </Link>
        </div>

        <div className="justify-self-end min-[1080px]:hidden">
          <MobileNavigation items={mobileItems} />
        </div>
      </div>
    </header>
  );
}
