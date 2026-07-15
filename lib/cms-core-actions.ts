"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { canSaveContentAs, cmsCoreCollections, cmsCoreFormSchema, slugifyCms, toTablePayload, type CmsCoreCollection, type CmsWorkflowStatus } from "@/lib/cms-core";
import { createClient } from "@/lib/supabase/server";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const collectionSchema = z.enum(["biography", "timeline", "stories", "lessons", "blog"]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normaliseSlug(formData: FormData) {
  const slug = text(formData, "slug") || slugifyCms(text(formData, "title"));
  formData.set("slug", slug);
}

async function insertAuditLog(action: string, collection: CmsCoreCollection, entityId: string, metadata: Record<string, unknown>) {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from("audit_logs").insert({
    action,
    actor_user_id: user?.id ?? null,
    entity_table: cmsCoreCollections[collection].table,
    entity_id: entityId,
    workspace_id: context.workspaceId,
    legacy_profile_id: context.legacyProfileId,
    metadata
  });
}

function actionForStatus(status: CmsWorkflowStatus, isNew: boolean) {
  if (isNew) return "content_created";
  if (status === "in_review") return "content_submitted_for_review";
  if (status === "published") return "content_published";
  if (status === "archived") return "content_archived";
  if (status === "draft") return "content_returned_or_saved_as_draft";
  return "content_edited";
}

export async function saveCmsCoreContent(_: ActionState, formData: FormData): Promise<ActionState> {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "Sign in again before saving content." };
  }
  normaliseSlug(formData);

  const parsed = cmsCoreFormSchema.safeParse({
    id: text(formData, "id"),
    collection: text(formData, "collection"),
    title: text(formData, "title"),
    slug: text(formData, "slug"),
    summary: text(formData, "summary"),
    contentHtml: text(formData, "contentHtml"),
    status: text(formData, "status"),
    visibility: text(formData, "visibility"),
    verificationStatus: text(formData, "verificationStatus"),
    sortOrder: text(formData, "sortOrder") || "0",
    author: text(formData, "author"),
    category: text(formData, "category"),
    tags: text(formData, "tags"),
    location: text(formData, "location"),
    dateLabel: text(formData, "dateLabel"),
    eventDate: text(formData, "eventDate"),
    seoTitle: text(formData, "seoTitle"),
    metaDescription: text(formData, "metaDescription"),
    scheduledPublicationDate: text(formData, "scheduledPublicationDate"),
    publishedAt: text(formData, "publishedAt")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  if (!canSaveContentAs(context.role, parsed.data.status)) {
    return {
      ok: false,
      message: "Your role can save drafts or review changes, but it cannot publish or archive this content."
    };
  }

  const config = cmsCoreCollections[parsed.data.collection];
  const slugColumn = parsed.data.collection === "biography" || parsed.data.collection === "blog" ? "slug" : "stable_id";
  let slugQuery = supabase
    .from(config.table)
    .select("id")
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .eq(slugColumn, parsed.data.slug)
    .limit(1);

  if (parsed.data.id) {
    slugQuery = slugQuery.neq("id", parsed.data.id);
  }

  const { data: slugMatch, error: slugError } = await slugQuery.maybeSingle();
  if (slugError) {
    return { ok: false, message: "Unable to validate the content slug. Please try again." };
  }
  if (slugMatch) {
    return { ok: false, message: "That slug is already used for this legacy profile." };
  }

  const isNew = !parsed.data.id;
  const payload = toTablePayload(parsed.data, context, user.id, isNew);
  const table = supabase.from(config.table as never) as any;
  const query = parsed.data.id
    ? table.update(payload).eq("id", parsed.data.id).eq("workspace_id", context.workspaceId).eq("legacy_profile_id", context.legacyProfileId).select("id").single()
    : table.insert(payload).select("id").single();

  const { data, error } = await query;
  if (error || !data?.id) {
    return { ok: false, message: "The content could not be saved. Check your permissions and try again." };
  }

  await insertAuditLog(actionForStatus(parsed.data.status, isNew), parsed.data.collection, data.id, {
    title: parsed.data.title,
    status: parsed.data.status,
    visibility: parsed.data.visibility,
    actorUserId: user.id
  });

  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${parsed.data.collection}`);
  revalidatePath(config.publicPath);

  redirect(`/admin/content/${parsed.data.collection}/${data.id}?saved=1`);
}

export async function archiveCmsCoreContent(formData: FormData) {
  const context = await requireLegacyProfilePermission("publish_content");
  const collection = collectionSchema.parse(text(formData, "collection"));
  const id = text(formData, "id");
  const config = cmsCoreCollections[collection];
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const table = supabase.from(config.table as never) as any;

  const { error } = await table
    .update({ publish_state: "archived", last_editor_id: user?.id ?? null })
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  if (!error) {
    await insertAuditLog("content_archived", collection, id, { status: "archived" });
    revalidatePath(`/admin/content/${collection}`);
    revalidatePath(config.publicPath);
  }
}
