import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createInvitation } from "@/lib/admin-actions";
import { permissions, roles } from "@/lib/permissions";

export default function AdminAccessPage() {
  return (
    <main>
      <AdminPageHeader eyebrow="Users and Access" title="Invitations and permissions" description="Invite users, assign roles, grant scoped permissions, set expiry dates, and revoke access. All access must also be enforced server-side and by RLS." />
      <section className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_.8fr] lg:p-8">
        <form action={createInvitation} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">
            Invitee email
            <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="email" placeholder="name@example.com" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">
            Role
            <select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="role">
              {roles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">
            Access expiry
            <input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="expiresAt" type="datetime-local" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">
            Personal message
            <textarea className="min-h-28 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="personalMessage" placeholder="Optional note for the invited user" />
          </label>
          <button className="min-h-11 rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="submit">Create invitation</button>
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
