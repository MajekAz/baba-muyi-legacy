import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createInvitation } from "@/lib/admin-actions";
import { permissions, roles } from "@/lib/permissions";

export default function AdminAccessPage() {
  return (
    <main>
      <AdminPageHeader eyebrow="Users and Access" title="Invitations and permissions" description="Invite users, assign roles, grant scoped permissions, set expiry dates, and revoke access. All access must also be enforced server-side and by RLS." />
      <section className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_.8fr] lg:p-8">
        <form action={createInvitation} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <input className="rounded border border-slate-300 px-3 py-2" name="email" placeholder="Invitee email" type="email" />
          <select className="rounded border border-slate-300 px-3 py-2" name="role" aria-label="Role">
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <input className="rounded border border-slate-300 px-3 py-2" name="expiresAt" type="datetime-local" />
          <textarea className="min-h-28 rounded border border-slate-300 px-3 py-2" name="personalMessage" placeholder="Optional personal message" />
          <button className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="submit">Create invitation</button>
        </form>
        <div className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-archive-navy">Available permissions</h2>
          <div className="mt-4 grid gap-2">
            {permissions.map((permission) => (
              <label className="flex gap-2 text-sm text-slate-700" key={permission}>
                <input type="checkbox" name="permissions" value={permission} />
                <span>{permission}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
