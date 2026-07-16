"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  BookOpen,
  ChevronDown,
  FileStack,
  FolderOpen,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import { platformBrand } from "@/lib/brand";
import { adminNavigation, type NavItem } from "@/lib/navigation";
import { canSeeAdminItem, type UserRole } from "@/lib/permissions";
import type { TenantContext } from "@/lib/tenant-context";

type AdminShellProps = {
  children: React.ReactNode;
  context: TenantContext;
  userName: string;
  role: UserRole;
  signOutAction: () => Promise<void>;
};

const iconMap: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  Dashboard: LayoutDashboard,
  "Legacy Profiles": FileStack,
  Content: BookOpen,
  "Media Library": ImageIcon,
  Documentaries: Archive,
  Family: Users,
  Contributions: FolderOpen,
  "Users and Access": ShieldCheck,
  Menus: Menu,
  Settings,
  "Audit Activity": Archive
};

function routeMatches(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function sectionMatches(pathname: string, item: NavItem) {
  return routeMatches(pathname, item.href) || Boolean(item.children?.some((child) => routeMatches(pathname, child.href)));
}

function getBreadcrumbs(pathname: string) {
  const crumbs: { label: string; href?: string }[] = [{ label: "Dashboard", href: "/admin" }];
  if (pathname === "/admin") return crumbs.map((crumb, index) => ({ ...crumb, current: index === 0 }));

  const parts = pathname.split("/").filter(Boolean).slice(1);
  let href = "/admin";
  for (const part of parts) {
    href += `/${part}`;
    const label = part
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    crumbs.push({ label: label === "Id" ? "Edit Record" : label, href });
  }

  return crumbs.map((crumb, index) => ({
    ...crumb,
    href: index === crumbs.length - 1 ? undefined : crumb.href,
    current: index === crumbs.length - 1
  }));
}

function toastCopy(value: string | null) {
  if (!value) return null;
  const messages: Record<string, { tone: string; text: string }> = {
    saved: { tone: "success", text: "Changes saved." },
    published: { tone: "success", text: "Published successfully." },
    archived: { tone: "success", text: "Archived successfully." },
    uploaded: { tone: "success", text: "Upload completed." },
    denied: { tone: "error", text: "You do not have permission to complete that action." },
    expired: { tone: "warning", text: "Your session expired. Please sign in again." }
  };
  return messages[value] ?? { tone: "info", text: value.replaceAll("-", " ") };
}

export function AdminShell({ children, context, userName, role, signOutAction }: AdminShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const visibleNavigation = useMemo(
    () => adminNavigation.filter((item) => canSeeAdminItem(role, item.requiredPermission)),
    [role]
  );
  const breadcrumbs = getBreadcrumbs(pathname ?? "/admin");
  const toast = toastCopy(searchParams.get("toast"));

  useEffect(() => {
    const stored = window.localStorage.getItem("legacyhub-admin-sidebar-collapsed");
    if (stored) setCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("legacyhub-admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    setToastVisible(true);
  }, [toast?.text]);

  const sidebar = (
    <aside
      className={[
        "flex h-full flex-col border-r border-slate-200 bg-white shadow-sm transition-all",
        collapsed ? "lg:w-20" : "lg:w-72"
      ].join(" ")}
      aria-label="LegacyHub admin sidebar"
    >
      <div className="flex min-h-16 items-center justify-between border-b border-slate-200 px-4">
        <Link className="min-w-0 focus-visible:rounded" href="/admin">
          <span className={collapsed ? "sr-only" : "block font-serif text-2xl font-semibold text-archive-navy"}>{platformBrand.name}</span>
          <span className={collapsed ? "grid size-10 place-items-center rounded bg-archive-navy text-sm font-bold text-white" : "text-xs font-bold uppercase tracking-[0.14em] text-archive-brown"}>
            {collapsed ? "LH" : "Administration"}
          </span>
        </Link>
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden rounded p-2 text-slate-600 hover:bg-archive-cream lg:inline-flex"
          onClick={() => setCollapsed((value) => !value)}
          type="button"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <button
          aria-label="Close admin menu"
          className="rounded p-2 text-slate-600 hover:bg-archive-cream lg:hidden"
          onClick={() => {
            setMobileOpen(false);
            menuButtonRef.current?.focus();
          }}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
        {visibleNavigation.map((item) => {
          const Icon = iconMap[item.label] ?? Home;
          const active = sectionMatches(pathname ?? "/admin", item);
          const content = (
            <span className="flex min-h-11 items-center gap-3">
              <Icon aria-hidden={true} className="size-5 shrink-0" />
              <span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span>
              {item.planned && !collapsed ? <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-[0.68rem] font-semibold text-slate-600">Planned</span> : null}
              {item.children?.length && !collapsed ? <ChevronDown aria-hidden="true" className="ml-auto size-4" /> : null}
            </span>
          );

          return (
            <div className="mb-1" key={item.href}>
              {item.planned ? (
                <span
                  aria-disabled="true"
                  className={[
                    "block rounded px-3 py-2 text-sm font-semibold text-slate-500",
                    active ? "bg-archive-cream" : ""
                  ].join(" ")}
                  title={collapsed ? `${item.label} planned` : undefined}
                >
                  {content}
                </span>
              ) : (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={[
                    "block rounded px-3 py-2 text-sm font-semibold transition hover:bg-archive-cream",
                    active ? "bg-archive-navy text-white hover:bg-archive-navy" : "text-archive-navy"
                  ].join(" ")}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                >
                  {content}
                </Link>
              )}
              {item.children?.length && !collapsed ? (
                <div className="ml-5 mt-1 grid border-l border-slate-200 pl-3">
                  {item.children.map((child) => {
                    const childActive = routeMatches(pathname ?? "/admin", child.href);
                    return (
                      <Link
                        aria-current={childActive ? "page" : undefined}
                        className={[
                          "rounded px-3 py-2 text-sm transition hover:bg-archive-cream",
                          childActive ? "font-semibold text-archive-navy" : "text-slate-600"
                        ].join(" ")}
                        href={child.href}
                        key={child.href}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">{sidebar}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button className="absolute inset-0 bg-slate-950/40" aria-label="Close admin menu" onClick={() => setMobileOpen(false)} type="button" />
          <div className="relative h-full w-[min(22rem,88vw)]">{sidebar}</div>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label="Open admin menu"
                className="rounded p-2 text-archive-navy hover:bg-archive-cream lg:hidden"
                onClick={() => setMobileOpen(true)}
                ref={menuButtonRef}
                type="button"
              >
                <Menu aria-hidden="true" className="size-6" />
              </button>
              <div className="min-w-0">
                <p className="font-serif text-2xl font-semibold leading-none text-archive-navy">{platformBrand.name}</p>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">Administration</p>
              </div>
            </div>

            <div className="min-w-0 text-sm text-slate-700">
              <p className="truncate font-semibold text-archive-navy">{context.workspaceName}</p>
              <p className="truncate">Active legacy profile: {context.legacyProfileName}</p>
            </div>

            <div className="flex items-center gap-2">
              <Link className="hidden min-h-11 items-center rounded border border-slate-200 px-3 text-sm font-semibold text-archive-navy hover:bg-archive-cream sm:inline-flex" href="/">
                View public archive
              </Link>
              <details className="relative">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded border border-slate-200 px-3 text-sm font-semibold text-archive-navy hover:bg-archive-cream">
                  <span className="hidden max-w-36 truncate sm:inline">{userName}</span>
                  <span className="rounded bg-archive-cream px-2 py-1 text-xs uppercase tracking-[0.12em] text-archive-brown">{role}</span>
                </summary>
                <div className="absolute right-0 mt-2 w-64 rounded border border-slate-200 bg-white p-3 text-sm shadow-lg">
                  <p className="font-semibold text-archive-navy">{userName}</p>
                  <p className="mt-1 text-slate-600">Role: {role}</p>
                  <Link className="mt-3 flex min-h-10 items-center rounded px-2 font-semibold text-archive-navy hover:bg-archive-cream sm:hidden" href="/">
                    View public archive
                  </Link>
                  <form action={signOutAction}>
                    <button className="mt-2 flex min-h-10 w-full items-center gap-2 rounded px-2 font-semibold text-red-700 hover:bg-red-50" type="submit">
                      <LogOut aria-hidden="true" className="size-4" />
                      Sign out
                    </button>
                  </form>
                </div>
              </details>
            </div>
          </div>
          <nav className="flex min-h-10 items-center overflow-hidden border-t border-slate-100 px-4 text-sm sm:px-6 lg:px-8" aria-label="Admin breadcrumbs">
            <ol className="flex min-w-0 items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li className="flex min-w-0 items-center gap-2" key={`${crumb.label}-${index}`}>
                  {index ? <span className="text-slate-400">/</span> : null}
                  {crumb.href ? (
                    <Link className="truncate font-semibold text-slate-600 hover:text-archive-navy" href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page" className="truncate font-semibold text-archive-navy">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {toast && toastVisible ? (
          <div aria-live="polite" className="fixed right-4 top-20 z-50 max-w-sm rounded border border-slate-200 bg-white p-4 text-sm shadow-lg" role={toast.tone === "error" ? "alert" : "status"}>
            <div className="flex gap-3">
              <p className="font-semibold text-archive-navy">{toast.text}</p>
              <button className="rounded text-slate-500 hover:text-slate-900" onClick={() => setToastVisible(false)} type="button">
                <span className="sr-only">Dismiss notification</span>
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        ) : null}

        <div id="admin-main" className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
