"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NavItem } from "@/lib/navigation";

export function MobileNavigation({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

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
            <p className="font-serif text-3xl font-semibold leading-none text-archive-gold">Baba Muyi Legacy</p>
            <p className="text-xs text-white/70">Digital museum and family archive</p>
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
        <nav className="grid flex-1 gap-2 overflow-y-auto px-4 py-5 pb-28" aria-label="Mobile navigation">
          {items.map((item) => {
            const isExpanded = expanded.includes(item.label);
            return (
              <div className="rounded border border-white/10 bg-white/[0.03]" key={item.label}>
                <div className="flex items-center gap-2">
                  <Link
                    className="flex min-h-12 flex-1 items-center rounded px-4 text-base font-semibold hover:bg-white/10"
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                      className="mr-2 min-h-10 rounded border border-white/15 px-3 text-sm"
                      onClick={() => toggle(item.label)}
                      type="button"
                    >
                      {isExpanded ? "Hide" : "Show"}
                    </button>
                  ) : null}
                </div>
                {item.children && isExpanded ? (
                  <div className="grid gap-1 border-t border-white/10 px-3 py-2">
                    {item.children.map((child) => (
                      <Link
                        className="min-h-11 rounded px-4 py-2 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white"
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
            Watch the Documentary
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
    <div className="lg:hidden">
      <button
        aria-expanded={open}
        aria-label="Open navigation menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-white/15 text-white"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu aria-hidden="true" />
      </button>
      {drawer}
    </div>
  );
}
