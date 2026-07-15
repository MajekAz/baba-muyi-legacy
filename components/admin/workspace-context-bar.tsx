import { getActiveTenantContext } from "@/lib/tenant-context";

export async function WorkspaceContextBar() {
  const context = await getActiveTenantContext();

  return (
    <section className="border-b border-archive-navy/10 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">
          <span>Active workspace</span>
          <select className="rounded border border-slate-300 px-3 py-2" value={context.workspaceId} disabled>
            <option value={context.workspaceId}>{context.workspaceName}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">
          <span>Active legacy profile</span>
          <select className="rounded border border-slate-300 px-3 py-2" value={context.legacyProfileId} disabled>
            <option value={context.legacyProfileId}>{context.legacyProfileName}</option>
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        {context.source === "local-fallback" ? "Local fallback context." : "Supabase workspace context."} All CMS queries and mutations use these workspace and legacy-profile scopes.
      </p>
    </section>
  );
}
