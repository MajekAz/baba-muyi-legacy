import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/lib/tenant-context";
import type { ContactSubmissionStatus } from "@/lib/contact/types";

export async function getSubmissionTenant() {
  const admin = createAdminClient();
  const workspaceSlug = process.env.LEGACYHUB_WORKSPACE_SLUG?.trim() || "baba-muyi-family-archive";
  const legacyProfileSlug = process.env.LEGACYHUB_LEGACY_PROFILE_SLUG?.trim() || "baba-muyi";

  const { data: workspace, error: workspaceError } = await admin
    .from("workspaces")
    .select("id, slug, name")
    .eq("slug", workspaceSlug)
    .single();

  if (workspaceError || !workspace) {
    throw new Error("Active archive workspace could not be found.");
  }

  const { data: legacyProfile, error: profileError } = await admin
    .from("legacy_profiles")
    .select("id, slug, display_name")
    .eq("workspace_id", workspace.id)
    .eq("slug", legacyProfileSlug)
    .single();

  if (profileError || !legacyProfile) {
    throw new Error("Active archive profile could not be found.");
  }

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    legacyProfileId: legacyProfile.id,
    legacyProfileName: legacyProfile.display_name
  };
}

export async function getContactSubmissions(
  context: TenantContext,
  filters: { status?: string; search?: string }
) {
  const supabase = await createClient();
  let query = supabase
    .from("contact_submissions")
    .select("id, submission_type, status, sender_name, sender_email, relationship, message, attachment_filename, attachment_mime_type, created_at, updated_at")
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.search) {
    const safeSearch = filters.search.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(`sender_name.ilike.%${safeSearch}%,sender_email.ilike.%${safeSearch}%,message.ilike.%${safeSearch}%`);
  }

  const { data, error } = await query.limit(100);
  if (error) {
    throw new Error("Contact submissions could not be loaded.");
  }
  return data ?? [];
}

export async function getContactSubmission(context: TenantContext, id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .maybeSingle();

  if (error) {
    throw new Error("Contact submission could not be loaded.");
  }

  return data;
}

export async function getContactSubmissionCounts(context: TenantContext) {
  const supabase = await createClient();
  const counts = await Promise.all(
    (["new", "in_review", "resolved", "archived"] as ContactSubmissionStatus[]).map(async (status) => {
      const { count } = await supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", context.workspaceId)
        .eq("legacy_profile_id", context.legacyProfileId)
        .eq("status", status);

      return [status, count ?? 0] as const;
    })
  );

  return Object.fromEntries(counts) as Record<ContactSubmissionStatus, number>;
}
