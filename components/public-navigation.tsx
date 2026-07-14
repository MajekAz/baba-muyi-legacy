import Link from "next/link";
import { MobileNavigation } from "@/components/mobile-navigation";
import { getCmsMenus } from "@/lib/cms-store";

export async function PublicNavigation() {
  const publicNavigation = await getCmsMenus("header");
  const mobileNavigation = await getCmsMenus("mobile");

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
        {publicNavigation.slice(0, 8).map((item) => (
          <div className="group relative" key={item.label}>
            <Link
              href={item.href}
              className="rounded px-3 py-2 text-sm text-white/82 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
            {item.children ? (
              <div className="invisible absolute left-0 top-full z-50 min-w-56 rounded border border-white/10 bg-archive-navy p-2 opacity-0 shadow-museum transition group-hover:visible group-hover:opacity-100">
                {item.children.map((child) => (
                  <Link
                    className="block rounded px-3 py-2 text-sm text-white/78 hover:bg-white/10 hover:text-white"
                    href={child.href}
                    key={child.href}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
      <MobileNavigation items={mobileNavigation.length ? mobileNavigation : publicNavigation} />
    </>
  );
}
