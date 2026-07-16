import { signOut } from "@/lib/auth-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminRole } from "@/lib/auth";
import { platformBrand } from "@/lib/brand";
import type { UserRole } from "@/lib/permissions";
import { getActiveTenantContext } from "@/lib/tenant-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: platformBrand.name,
    template: `%s | ${platformBrand.name}`
  },
  description: platformBrand.tagline
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminRole(["owner", "administrator", "editor", "contributor", "reviewer", "viewer"]);

  if (!session) {
    return (
      <main className="min-h-screen bg-archive-cream">
        <section className="border-b border-archive-navy/10 bg-archive-navy px-4 py-12 text-white sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-archive-gold">Protected admin setup</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Supabase configuration required</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
            Admin routes are protected and require Supabase Auth. Add your Supabase URL and anon key,
            apply the migrations, create the owner account, then restart the app.
          </p>
        </section>
      </main>
    );
  }

  const context = await getActiveTenantContext();
  const adminRole = session.profile.role as UserRole;

  return (
    <AdminShell
      context={context}
      role={adminRole}
      signOutAction={signOut}
      userName={session.profile.display_name ?? session.user.email ?? "LegacyHub user"}
    >
      {children}
    </AdminShell>
  );
}
