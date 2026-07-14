import { signOut } from "@/lib/auth-actions";
import { AdminNavigation } from "@/components/admin-navigation";
import { WorkspaceContextBar } from "@/components/admin/workspace-context-bar";
import { requireAdminRole } from "@/lib/auth";
import type { UserRole } from "@/lib/permissions";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminRole(["owner", "administrator", "editor", "contributor", "reviewer", "viewer"]);
  const role = session ? (session.profile.role as UserRole) : null;

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

  return (
    <div className="lg:flex">
      <AdminNavigation role={role} />
      <form action={signOut} className="fixed bottom-4 right-4 z-50">
        <button className="rounded bg-archive-charcoal px-4 py-2 text-sm font-semibold text-white shadow-museum" type="submit">
          Sign out
        </button>
      </form>
      <div className="min-w-0 flex-1">
        <WorkspaceContextBar />
        {children}
      </div>
    </div>
  );
}
