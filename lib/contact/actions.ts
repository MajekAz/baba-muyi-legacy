"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { contactSubmissionStatuses } from "@/lib/contact/types";
import { createClient } from "@/lib/supabase/server";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

const updateSubmissionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(contactSubmissionStatuses),
  adminNotes: z.string().trim().max(2000).optional()
});

export async function updateContactSubmission(formData: FormData) {
  const context = await requireLegacyProfilePermission("review_submissions");
  const parsed = updateSubmissionSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes")
  });

  if (!parsed.success) {
    redirect("/admin/enquiries?toast=invalid-submission");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("contact_submissions")
    .update({
      status: parsed.data.status,
      admin_notes: parsed.data.adminNotes || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id ?? null
    })
    .eq("id", parsed.data.id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  if (!error) {
    await supabase.from("audit_logs").insert({
      action: "contact_submission_reviewed",
      actor_user_id: user?.id ?? null,
      entity_table: "contact_submissions",
      entity_id: parsed.data.id,
      workspace_id: context.workspaceId,
      legacy_profile_id: context.legacyProfileId,
      metadata: {
        status: parsed.data.status,
        has_admin_notes: Boolean(parsed.data.adminNotes)
      }
    });
  }

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${parsed.data.id}`);
  redirect(`/admin/enquiries/${parsed.data.id}?toast=${error ? "save-failed" : "saved"}`);
}
