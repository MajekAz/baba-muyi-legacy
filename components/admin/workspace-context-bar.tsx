import { getActiveCmsWorkspaceContext } from "@/lib/cms-store";

export async function WorkspaceContextBar() {
  const { workspace, legacyProfile } = await getActiveCmsWorkspaceContext();

  return (
    <section className="border-b border-archive-navy/10 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">
          <span>Active workspace</span>
          <select className="rounded border border-slate-300 px-3 py-2" value={workspace?.id ?? ""} disabled>
            <option value={workspace?.id ?? ""}>{workspace?.name ?? "No workspace selected"}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">
          <span>Active legacy profile</span>
          <select className="rounded border border-slate-300 px-3 py-2" value={legacyProfile?.id ?? ""} disabled>
            <option value={legacyProfile?.id ?? ""}>{legacyProfile?.displayName ?? "No profile selected"}</option>
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        Local fallback context. Production queries and mutations must use these workspace and legacy-profile scopes.
      </p>
    </section>
  );
}
