import "server-only";

import { redirect } from "next/navigation";
import { allowsLocalFallback, hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { getActiveCmsWorkspaceContext } from "@/lib/cms-store";
import { roleHasPermission, type Permission, type UserRole } from "@/lib/permissions";

export type TenantContext = {
  workspaceId: string;
  workspaceSlug: string;
  workspaceName: string;
  legacyProfileId: string;
  legacyProfileSlug: string;
  legacyProfileName: string;
  role: UserRole;
  source: "supabase" | "local-fallback";
};

export async function getActiveTenantContext(): Promise<TenantContext> {
  if (!hasSupabasePublicEnv()) {
    if (!allowsLocalFallback()) {
      redirect("/login?setup=supabase-required");
    }

    const { workspace, legacyProfile } = await getActiveCmsWorkspaceContext();
    return {
      workspaceId: workspace.id,
      workspaceSlug: workspace.slug,
      workspaceName: workspace.name,
      legacyProfileId: legacyProfile.id,
      legacyProfileSlug: legacyProfile.slug,
      legacyProfileName: legacyProfile.displayName,
      role: "owner",
      source: "local-fallback"
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?reason=admin-access");
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, slug, name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (!membership?.workspace_id) {
    redirect("/unauthorised");
  }

  const { data: profile } = await supabase
    .from("legacy_profiles")
    .select("id, slug, display_name")
    .eq("workspace_id", membership.workspace_id)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!profile) {
    redirect("/unauthorised");
  }

  const workspace = Array.isArray(membership.workspaces) ? membership.workspaces[0] : membership.workspaces;

  return {
    workspaceId: membership.workspace_id,
    workspaceSlug: workspace?.slug ?? "workspace",
    workspaceName: workspace?.name ?? "Workspace",
    legacyProfileId: profile.id,
    legacyProfileSlug: profile.slug,
    legacyProfileName: profile.display_name,
    role: membership.role as UserRole,
    source: "supabase"
  };
}

export async function requireWorkspacePermission(permission: Permission) {
  const context = await getActiveTenantContext();

  if (!roleHasPermission(context.role, permission)) {
    redirect("/unauthorised");
  }

  return context;
}

export async function requireLegacyProfilePermission(permission: Permission) {
  return requireWorkspacePermission(permission);
}
