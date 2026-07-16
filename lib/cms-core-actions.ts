"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { canSaveContentAs, cmsCoreCollections, cmsCoreFormSchema, slugifyCms, toTablePayload, type CmsCoreCollection, type CmsWorkflowStatus } from "@/lib/cms-core";
import { roleHasPermission } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const collectionSchema = z.enum(["biography", "timeline", "stories", "lessons", "blog"]);
const statusSchema = z.enum(["draft", "in_review", "scheduled", "published", "archived"]);
const workflowActionSchema = z.enum([
  "save_changes",
  "save_draft",
  "submit_review",
  "return_draft",
  "publish",
  "publish_now",
  "schedule",
  "unschedule",
  "unpublish",
  "archive",
  "restore_draft"
]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normaliseSlug(formData: FormData) {
  const slug = text(formData, "slug") || slugifyCms(text(formData, "title"));
  formData.set("slug", slug);
}

function workflowStatusFromAction(action: z.infer<typeof workflowActionSchema>, selectedStatus: string): CmsWorkflowStatus {
  if (action === "save_changes") return selectedStatus as CmsWorkflowStatus;
  if (action === "save_draft" || action === "return_draft" || action === "unschedule" || action === "unpublish" || action === "restore_draft") return "draft";
  if (action === "submit_review") return "in_review";
  if (action === "schedule") return "scheduled";
  if (action === "publish" || action === "publish_now") return "published";
  if (action === "archive") return "archived";
  return selectedStatus as CmsWorkflowStatus;
}

function validatePublicationGuardrails(input: z.infer<typeof cmsCoreFormSchema>, workflowAction: z.infer<typeof workflowActionSchema>): ActionState | null {
  if (input.status === "scheduled" && !input.scheduledPublicationDate) {
    return { ok: false, message: "Add a scheduled publication date before scheduling this content." };
  }

  if (input.status !== "published") {
    return null;
  }

  const textContent = String(input.contentHtml ?? "").replace(/<[^>]+>/g, "").trim();
  const hasRequiredContent = input.collection === "timeline" ? Boolean(input.summary || input.eventDate || textContent) : Boolean(input.summary || textContent);
  if (!input.title || !input.slug) {
    return { ok: false, message: "Add a title and valid slug before publishing." };
  }
  if (!hasRequiredContent) {
    return { ok: false, message: "Add content or a clear summary before publishing." };
  }
  if (input.visibility !== "public") {
    return { ok: false, message: "Set visibility to Public before publishing to the public archive." };
  }
  if (input.verificationStatus === "unverified") {
    return { ok: false, message: "Choose a verification status before publishing. Use Family memory, Partially verified, or Verified." };
  }
  if (workflowAction === "publish_now" && input.scheduledPublicationDate) {
    input.scheduledPublicationDate = "";
  }

  return null;
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
  const workflowAction = workflowActionSchema.catch("save_changes").parse(text(formData, "workflowAction"));
  const currentStatus = statusSchema.catch("draft").parse(text(formData, "currentStatus"));
  const requestedStatus = workflowStatusFromAction(workflowAction, text(formData, "status"));
  formData.set("status", requestedStatus);

  const parsed = cmsCoreFormSchema.safeParse({
    id: text(formData, "id"),
    collection: text(formData, "collection"),
    title: text(formData, "title"),
    slug: text(formData, "slug"),
    summary: text(formData, "summary"),
    contentHtml: text(formData, "contentHtml"),
    status: requestedStatus,
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
    publishedAt: text(formData, "publishedAt"),
    featuredMediaId: text(formData, "featuredMediaId"),
    relatedMediaIds: formData.getAll("relatedMediaIds").map((value) => String(value)).filter(Boolean)
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

  if (["publish", "publish_now", "schedule", "archive", "unpublish", "restore_draft"].includes(workflowAction) && !roleHasPermission(context.role, "publish_content")) {
    return {
      ok: false,
      message: "Your role cannot publish, schedule, unpublish, restore, or archive content."
    };
  }

  if (workflowAction === "save_changes" && currentStatus !== parsed.data.status && (parsed.data.status === "published" || parsed.data.status === "archived" || parsed.data.status === "scheduled")) {
    return {
      ok: false,
      message: "Use the Publish, Schedule, or Archive workflow button for that status change."
    };
  }

  const guardrailError = validatePublicationGuardrails(parsed.data, workflowAction);
  if (guardrailError) {
    return guardrailError;
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

  await syncMediaRelations({
    collection: parsed.data.collection,
    contentId: data.id,
    featuredMediaId: parsed.data.featuredMediaId,
    relatedMediaIds: parsed.data.relatedMediaIds,
    actorUserId: user.id
  });

  await insertAuditLog(actionForStatus(parsed.data.status, isNew), parsed.data.collection, data.id, {
    title: parsed.data.title,
    workflowAction,
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

async function syncMediaRelations({
  collection,
  contentId,
  featuredMediaId,
  relatedMediaIds,
  actorUserId
}: {
  collection: CmsCoreCollection;
  contentId: string;
  featuredMediaId?: string;
  relatedMediaIds: string[];
  actorUserId: string;
}) {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const supabase = await createClient();
  const relatedTable = cmsCoreCollections[collection].table;

  await supabase
    .from("media_relations")
    .delete()
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .eq("related_table", relatedTable)
    .eq("related_id", contentId)
    .in("relation_type", ["featured", "related"]);

  const uniqueRelatedIds = [...new Set(relatedMediaIds.filter((id) => id !== featuredMediaId))];
  const rows = [
    ...(featuredMediaId ? [{
      workspace_id: context.workspaceId,
      legacy_profile_id: context.legacyProfileId,
      media_item_id: featuredMediaId,
      related_table: relatedTable,
      related_id: contentId,
      relation_type: "featured",
      sort_order: 0,
      created_by: actorUserId
    }] : []),
    ...uniqueRelatedIds.map((mediaItemId, index) => ({
      workspace_id: context.workspaceId,
      legacy_profile_id: context.legacyProfileId,
      media_item_id: mediaItemId,
      related_table: relatedTable,
      related_id: contentId,
      relation_type: "related",
      sort_order: index,
      created_by: actorUserId
    }))
  ];

  if (rows.length) {
    await supabase.from("media_relations").insert(rows);
  }

  await insertAuditLog("media_linked_to_content", collection, contentId, {
    featuredMediaLinked: Boolean(featuredMediaId),
    relatedMediaCount: uniqueRelatedIds.length
  });
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
