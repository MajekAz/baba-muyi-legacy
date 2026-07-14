import Link from "next/link";
import { adminNavigation } from "@/lib/navigation";
import { canSeeAdminItem, type UserRole } from "@/lib/permissions";

export function AdminNavigation({ role }: { role: UserRole | null }) {
  const visibleItems = adminNavigation.filter((item) => canSeeAdminItem(role, item.requiredPermission));

  return (
    <aside className="border-b border-archive-navy/10 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <nav className="grid gap-1 p-4" aria-label="Admin navigation">
        {visibleItems.map((item) => (
          <div key={item.href}>
            <Link className="block rounded px-3 py-2 text-sm font-semibold text-archive-navy hover:bg-archive-cream" href={item.href}>
              {item.label}
            </Link>
            {item.children ? (
              <div className="ml-3 grid border-l border-archive-navy/10 pl-3">
                {item.children.map((child) => (
                  <Link className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-archive-cream" href={child.href} key={child.href}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  );
}
