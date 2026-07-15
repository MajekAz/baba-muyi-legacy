import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { allowsLocalFallback, hasSupabasePublicEnv } from "@/lib/env";
import { roleHasPermission, type Permission, type UserRole } from "@/lib/permissions";

export async function requireAdminRole(allowed: UserRole[] = ["owner", "editor"]) {
  if (!hasSupabasePublicEnv()) {
    if (!allowsLocalFallback()) {
      return null;
    }

    const localProfile = {
      id: "local-owner",
      role: "owner" as UserRole,
      display_name: "Local CMS owner"
    };

    return {
      user: { id: "local-owner", email: "local@babamuyilegacy.test" },
      profile: localProfile
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?reason=admin-access");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, role, display_name")
    .eq("id", user.id)
    .single();

  if (error || !profile || !allowed.includes(profile.role as UserRole)) {
    redirect("/unauthorised");
  }

  return { user, profile };
}

export async function requirePermission(permission: Permission) {
  const session = await requireAdminRole(["owner", "administrator", "editor", "contributor", "reviewer", "viewer"]);

  if (!session) {
    return null;
  }

  const role = session.profile.role as UserRole;
  if (!roleHasPermission(role, permission)) {
    redirect("/unauthorised");
  }

  return session;
}

export function canManageSecurity(role: UserRole) {
  return role === "owner";
}

export function canPublishContent(role: UserRole) {
  return roleHasPermission(role, "publish_content");
}

export function canSubmitContent(role: UserRole) {
  return role === "owner" || role === "editor" || role === "contributor";
}
