"use server";

import { randomBytes, createHash } from "node:crypto";
import { hasSupabasePublicEnv } from "@/lib/env";
import { requireWorkspacePermission } from "@/lib/tenant-context";
import { createClient } from "@/lib/supabase/server";
import { invitationSchema } from "@/lib/validation/admin";

export async function createInvitation(formData: FormData) {
  const context = await requireWorkspacePermission("manage_users");

  const parsed = invitationSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
    legacyProfileId: formData.get("legacyProfileId") || context.legacyProfileId,
    permissions: formData.getAll("permissions"),
    personalMessage: formData.get("personalMessage") || undefined,
    expiresAt: formData.get("expiresAt")
  });

  if (!parsed.success) {
    return;
  }

  if (!hasSupabasePublicEnv()) {
    return;
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = await createClient();

  const { error } = await supabase.from("invitations").insert({
    workspace_id: context.workspaceId,
    invitee_email: parsed.data.email,
    role: parsed.data.role,
    legacy_profile_id: parsed.data.legacyProfileId,
    permissions: parsed.data.permissions,
    personal_message: parsed.data.personalMessage,
    expires_at: parsed.data.expiresAt,
    token_hash: tokenHash,
    invited_by: null
  });

  const { error: workspaceInvitationError } = await supabase.from("workspace_invitations").insert({
    workspace_id: context.workspaceId,
    invitee_email: parsed.data.email,
    role: parsed.data.role,
    personal_message: parsed.data.personalMessage,
    expires_at: parsed.data.expiresAt,
    token_hash: tokenHash,
    invited_by: null
  });

  if (error && workspaceInvitationError) {
    return;
  }

  await writeAuditLog("user_invited", "invitations", null, {
    invitee_email: parsed.data.email,
    role: parsed.data.role
  });

  return;
}

export async function writeAuditLog(action: string, entityTable: string, entityId: string | null, metadata = {}) {
  if (!hasSupabasePublicEnv()) {
    console.info("Audit log skipped until Supabase is configured", { action, entityTable, entityId });
    return;
  }

  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    action,
    entity_table: entityTable,
    entity_id: entityId,
    metadata
  });
}
