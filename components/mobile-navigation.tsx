"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { flagshipArchiveBrand } from "@/lib/brand";
import type { NavItem } from "@/lib/navigation";

export function MobileNavigation({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
          )
        ).filter((element) => !element.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLButtonElement>("button, a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function toggle(label: string) {
    setExpanded((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  }

  function isActive(item: NavItem) {
    return item.href === pathname || item.children?.some((child) => child.href === pathname);
  }

  const drawer = open && mounted ? createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-archive-navy text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Primary navigation"
    >
      <div ref={panelRef} className="flex h-dvh flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="grid gap-0.5">
            <p className="font-serif text-3xl font-semibold leading-none text-archive-gold">{flagshipArchiveBrand.name}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">{flagshipArchiveBrand.descriptor}</p>
          </div>
          <button
            aria-label="Close navigation menu"
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded border border-white/15 bg-white/5"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav className="grid flex-1 content-start gap-2 overflow-y-auto px-4 py-5 pb-36" aria-label="Mobile navigation">
          {items.map((item) => {
            const isExpanded = expanded.includes(item.label);
            const active = isActive(item);
            const submenuId = `mobile-submenu-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <div className="rounded border border-white/10 bg-white/[0.03]" key={item.label}>
                <div className="flex items-center gap-2">
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 flex-1 items-center rounded px-4 text-base font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold ${active ? "text-archive-gold" : ""}`}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      aria-controls={submenuId}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                      className="mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-white/15 text-white/85 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold"
                      onClick={() => toggle(item.label)}
                      type="button"
                    >
                      <ChevronDown aria-hidden="true" className={`size-5 transition-transform motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  ) : null}
                </div>
                {item.children && isExpanded ? (
                  <div className="grid gap-1 border-t border-white/10 px-3 py-2" id={submenuId}>
                    {item.children.map((child) => (
                      <Link
                        aria-current={child.href === pathname ? "page" : undefined}
                        className={`min-h-11 rounded px-4 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold ${child.href === pathname ? "text-archive-gold" : "text-white/78"}`}
                        href={child.href}
                        key={child.href}
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <div className="fixed bottom-0 left-0 right-0 grid gap-2 border-t border-white/10 bg-archive-navy p-4 sm:grid-cols-2">
          <Link
            className="rounded bg-archive-gold px-4 py-3 text-center text-sm font-bold text-archive-navy"
            href="/documentaries"
            onClick={() => setOpen(false)}
          >
            Watch Film
          </Link>
          <Link
            className="rounded border border-archive-gold/70 px-4 py-3 text-center text-sm font-bold text-archive-gold"
            href="/tributes"
            onClick={() => setOpen(false)}
          >
            Share a Memory
          </Link>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="min-[1080px]:hidden">
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-label="Open navigation menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-white/15 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-archive-gold"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu aria-hidden="true" />
      </button>
      {drawer}
    </div>
  );
}
