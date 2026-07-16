"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";
import { roleHasPermission, type UserRole } from "@/lib/permissions";
import { bucketForMediaType, createStoragePath, safeFilename } from "@/lib/media/storage";
import { validateMediaUpload } from "@/lib/media/validation";

type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const metadataSchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(1000).optional(),
  caption: z.string().trim().max(500).optional(),
  altText: z.string().trim().max(300).optional(),
  approximateDate: z.string().trim().max(120).optional(),
  datePrecision: z.enum(["unknown", "year", "month", "day", "circa", "range"]),
  location: z.string().trim().max(180).optional(),
  peopleShown: z.string().trim().max(600).optional(),
  source: z.string().trim().max(300).optional(),
  copyrightOwner: z.string().trim().max(180).optional(),
  licence: z.string().trim().max(180).optional(),
  verificationStatus: z.enum(["unverified", "family_memory", "partially_verified", "verified"]),
  visibility: z.enum(["public", "preview", "private", "family_only", "registered", "invited", "specific_users", "password_protected"]),
  publicationStatus: z.enum(["draft", "scheduled", "published", "archived", "in_review"]),
  moderationStatus: z.enum(["pending", "approved", "rejected", "hidden"]),
  albumId: z.string().uuid().optional().or(z.literal(""))
});

const albumSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(1000).optional(),
  sortOrder: z.coerce.number().int().min(0),
  visibility: z.enum(["public", "preview", "private", "family_only", "registered", "invited", "specific_users", "password_protected"]),
  publicationStatus: z.enum(["draft", "scheduled", "published", "archived", "in_review"]),
  coverMediaId: z.string().uuid().optional().or(z.literal(""))
});

const albumItemSchema = z.object({
  albumId: z.string().uuid(),
  mediaItemId: z.string().uuid(),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0)
});

const mediaWorkflowActionSchema = z.enum([
  "save_changes",
  "save_draft",
  "submit_review",
  "approve",
  "approve_publish",
  "publish",
  "unpublish",
  "archive",
  "restore",
  "return_draft"
]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checksum(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex");
}

function slugifyMedia(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140) || "media";
}

function canPublish(role: UserRole) {
  return roleHasPermission(role, "publish_content");
}

function workflowForRole(role: UserRole, requestedPublicationStatus: string, requestedModerationStatus: string) {
  if (canPublish(role)) {
    return {
      publicationStatus: requestedPublicationStatus,
      moderationStatus: requestedPublicationStatus === "published" ? "approved" : requestedModerationStatus,
      publishedAt: requestedPublicationStatus === "published" ? new Date().toISOString() : null
    };
  }

  return {
    publicationStatus: requestedPublicationStatus === "archived" || requestedPublicationStatus === "published" ? "in_review" : requestedPublicationStatus,
    moderationStatus: "pending",
    publishedAt: null
  };
}

function mediaWorkflowForAction({
  action,
  currentPublicationStatus,
  requestedPublicationStatus,
  requestedModerationStatus,
  requestedVisibility,
  requestedVerificationStatus
}: {
  action: z.infer<typeof mediaWorkflowActionSchema>;
  currentPublicationStatus: string;
  requestedPublicationStatus: string;
  requestedModerationStatus: string;
  requestedVisibility: string;
  requestedVerificationStatus: string;
}) {
  const now = new Date().toISOString();
  if (action === "save_changes") {
    return {
      publicationStatus: currentPublicationStatus,
      moderationStatus: requestedModerationStatus,
      visibility: requestedVisibility,
      verificationStatus: requestedVerificationStatus,
      publishedAt: currentPublicationStatus === "published" ? undefined : null,
      archivedAt: currentPublicationStatus === "archived" ? undefined : null,
      auditAction: "media_edited"
    };
  }
  if (action === "save_draft" || action === "return_draft" || action === "unpublish" || action === "restore") {
    return {
      publicationStatus: "draft",
      moderationStatus: action === "unpublish" ? requestedModerationStatus : "pending",
      visibility: "private",
      verificationStatus: requestedVerificationStatus,
      publishedAt: null,
      archivedAt: null,
      auditAction: action === "unpublish" ? "media_unpublished" : action === "restore" ? "media_restored" : "media_edited"
    };
  }
  if (action === "submit_review") {
    return {
      publicationStatus: "in_review",
      moderationStatus: "pending",
      visibility: "private",
      verificationStatus: requestedVerificationStatus,
      publishedAt: null,
      archivedAt: null,
      auditAction: "media_submitted_for_review"
    };
  }
  if (action === "approve") {
    return {
      publicationStatus: "in_review",
      moderationStatus: "approved",
      visibility: requestedVisibility === "public" ? "private" : requestedVisibility,
      verificationStatus: requestedVerificationStatus === "unverified" ? "verified" : requestedVerificationStatus,
      publishedAt: null,
      archivedAt: null,
      auditAction: "media_approved"
    };
  }
  if (action === "publish" || action === "approve_publish") {
    return {
      publicationStatus: "published",
      moderationStatus: "approved",
      visibility: "public",
      verificationStatus: "verified",
      publishedAt: now,
      archivedAt: null,
      auditAction: "media_published"
    };
  }
  return {
    publicationStatus: "archived",
    moderationStatus: requestedModerationStatus,
    visibility: "private",
    verificationStatus: requestedVerificationStatus,
    publishedAt: null,
    archivedAt: now,
    auditAction: "media_archived"
  };
}

async function storageObjectExists(bucket: string, storagePath: string) {
  if (!bucket || !storagePath) return false;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(storagePath, 60);
  return !error && Boolean(data?.signedUrl);
}

async function writeMediaAudit(action: string, entityId: string | null, metadata: Record<string, unknown>, entityTable = "media_items") {
  const context = await requireLegacyProfilePermission("access_media_library");
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from("audit_logs").insert({
    action,
    actor_user_id: user?.id ?? null,
    entity_table: entityTable,
    entity_id: entityId,
    workspace_id: context.workspaceId,
    legacy_profile_id: context.legacyProfileId,
    metadata
  });
}

export async function uploadMediaFiles(_: ActionState, formData: FormData): Promise<ActionState> {
  const context = await requireLegacyProfilePermission("upload_media");
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in again before uploading media." };

  const files = formData.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  if (!files.length) return { ok: false, message: "Choose at least one file to upload." };

  let uploaded = 0;
  const failures: string[] = [];

  for (const file of files) {
    await writeMediaAudit("media_upload_initiated", null, { filename: file.name, size: file.size, mimeType: file.type });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const validation = validateMediaUpload({ filename: file.name, mimeType: file.type, size: file.size, bytes });
    if (!validation.ok) {
      failures.push(`${file.name}: ${validation.message}`);
      await writeMediaAudit("media_upload_failed", null, { filename: file.name, reason: validation.message });
      continue;
    }

    const bucket = bucketForMediaType(validation.mediaType);
    const storagePath = createStoragePath({
      legacyProfileId: context.legacyProfileId,
      mediaKind: validation.mediaType,
      filename: file.name
    });

    const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, file, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      failures.push(`${file.name}: upload failed`);
      await writeMediaAudit("media_upload_failed", null, { filename: file.name, reason: uploadError.message });
      continue;
    }

    const safe = safeFilename(file.name);
    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Untitled media";
    const workflow = workflowForRole(context.role, "in_review", "pending");
    const { data, error } = await supabase
      .from("media_items")
      .insert({
        workspace_id: context.workspaceId,
        legacy_profile_id: context.legacyProfileId,
        kind: validation.mediaType,
        media_type: validation.mediaType,
        title,
        stable_id: `${slugifyMedia(title)}-${crypto.randomUUID().slice(0, 8)}`,
        original_filename: file.name,
        generated_filename: safe,
        bucket,
        storage_bucket: bucket,
        storage_path: storagePath,
        archival_storage_path: storagePath,
        mime_type: file.type,
        file_size_bytes: file.size,
        file_size: file.size,
        uploaded_by: user.id,
        owner_user_id: user.id,
        last_editor_id: user.id,
        moderation_state: workflow.moderationStatus,
        privacy_state: "private",
        visibility: "private",
        publish_state: workflow.publicationStatus,
        publication_status: workflow.publicationStatus,
        original_checksum: checksum(bytes),
        scan_status: "not_scanned"
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      failures.push(`${file.name}: record creation failed`);
      await writeMediaAudit("media_upload_failed", null, { filename: file.name, reason: "record_creation_failed" });
      continue;
    }

    await supabase.from("media_versions").insert({
      workspace_id: context.workspaceId,
      legacy_profile_id: context.legacyProfileId,
      media_item_id: data.id,
      version_type: "original",
      storage_bucket: bucket,
      storage_path: storagePath,
      mime_type: file.type,
      file_size: file.size,
      checksum: checksum(bytes),
      created_by: user.id
    });

    await writeMediaAudit("media_upload_completed", data.id, { filename: file.name, mediaType: validation.mediaType, bucket });
    await writeMediaAudit("media_created", data.id, { filename: file.name, mediaType: validation.mediaType });
    uploaded += 1;
  }

  revalidatePath("/admin/media");

  return {
    ok: uploaded > 0 && failures.length === 0,
    message: failures.length ? `${uploaded} uploaded. ${failures.join(" ")}` : `${uploaded} file${uploaded === 1 ? "" : "s"} uploaded for review.`
  };
}

export async function updateMediaItem(formData: FormData) {
  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const id = text(formData, "id");
  const workflowAction = mediaWorkflowActionSchema.catch("save_changes").parse(text(formData, "workflowAction"));
  const currentPublicationStatus = text(formData, "currentPublicationStatus") || "draft";
  const parsed = metadataSchema.safeParse({
    title: text(formData, "title"),
    slug: text(formData, "slug") || slugifyMedia(text(formData, "title")),
    description: text(formData, "description"),
    caption: text(formData, "caption"),
    altText: text(formData, "altText"),
    approximateDate: text(formData, "approximateDate"),
    datePrecision: text(formData, "datePrecision") || "unknown",
    location: text(formData, "location"),
    peopleShown: text(formData, "peopleShown"),
    source: text(formData, "source"),
    copyrightOwner: text(formData, "copyrightOwner"),
    licence: text(formData, "licence"),
    verificationStatus: text(formData, "verificationStatus"),
    visibility: text(formData, "visibility"),
    publicationStatus: text(formData, "publicationStatus"),
    moderationStatus: text(formData, "moderationStatus"),
    albumId: text(formData, "albumId")
  });

  if (!parsed.success) redirect(`/admin/media/${id}?toast=check-required-fields`);
  if (["approve", "approve_publish", "publish", "unpublish", "archive", "restore"].includes(workflowAction) && !canPublish(context.role)) {
    redirect(`/admin/media/${id}?toast=denied`);
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: existing } = await supabase
    .from("media_items")
    .select("visibility, publication_status, storage_bucket, bucket, storage_path")
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .maybeSingle();
  if (!existing) redirect(`/admin/media/${id}?toast=media-not-found`);

  const workflow = mediaWorkflowForAction({
    action: workflowAction,
    currentPublicationStatus,
    requestedPublicationStatus: parsed.data.publicationStatus,
    requestedModerationStatus: parsed.data.moderationStatus,
    requestedVisibility: parsed.data.visibility,
    requestedVerificationStatus: parsed.data.verificationStatus
  });

  if (workflow.publicationStatus === "published") {
    if (!parsed.data.title) redirect(`/admin/media/${id}?toast=title-required`);
    if (!parsed.data.altText) redirect(`/admin/media/${id}?toast=alt-text-required`);
    const exists = await storageObjectExists(existing.storage_bucket ?? existing.bucket ?? "", existing.storage_path ?? "");
    if (!exists) redirect(`/admin/media/${id}?toast=storage-object-missing`);
  }

  if (workflowAction === "save_changes" && currentPublicationStatus !== parsed.data.publicationStatus && ["published", "archived"].includes(parsed.data.publicationStatus)) {
    redirect(`/admin/media/${id}?toast=use-workflow-button`);
  }

  await supabase
    .from("media_items")
    .update({
      title: parsed.data.title,
      stable_id: parsed.data.slug,
      description: parsed.data.description,
      caption: parsed.data.caption,
      alt_text: parsed.data.altText,
      approximate_date: parsed.data.approximateDate,
      date_precision: parsed.data.datePrecision,
      location: parsed.data.location,
      people_shown: parsed.data.peopleShown ? parsed.data.peopleShown.split(",").map((item) => item.trim()).filter(Boolean) : [],
      source: parsed.data.source,
      source_reference: parsed.data.source,
      copyright_owner: parsed.data.copyrightOwner,
      licence: parsed.data.licence,
      copyright_status: parsed.data.licence,
      verification_state: workflow.verificationStatus,
      privacy_state: workflow.visibility,
      visibility: workflow.visibility,
      publish_state: workflow.publicationStatus,
      publication_status: workflow.publicationStatus,
      moderation_state: workflow.moderationStatus,
      album_id: parsed.data.albumId || null,
      ...(workflow.publishedAt !== undefined ? { published_at: workflow.publishedAt } : {}),
      ...(workflow.archivedAt !== undefined ? { archived_at: workflow.archivedAt } : {}),
      last_editor_id: user?.id ?? null
    })
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  await writeMediaAudit(workflow.auditAction, id, {
    title: parsed.data.title,
    workflowAction,
    visibility: workflow.visibility,
    publicationStatus: workflow.publicationStatus,
    moderationStatus: workflow.moderationStatus
  });

  if (existing?.visibility && existing.visibility !== workflow.visibility) {
    await writeMediaAudit("media_visibility_changed", id, {
      from: existing.visibility,
      to: workflow.visibility
    });
  }

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${id}`);
  revalidatePath("/gallery");
  revalidatePath("/archive");
  revalidatePath("/archive/images");
  revalidatePath("/archive/audio");
  revalidatePath("/archive/documents");
  redirect(`/admin/media/${id}?saved=1&toast=${workflow.auditAction === "media_published" ? "published" : workflow.auditAction === "media_archived" ? "archived" : "saved"}`);
}

export async function createMediaAlbum(formData: FormData) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const parsed = albumSchema.safeParse({
    title: text(formData, "title"),
    slug: text(formData, "slug") || slugifyMedia(text(formData, "title")),
    description: text(formData, "description"),
    sortOrder: text(formData, "sortOrder") || "0",
    visibility: text(formData, "visibility") || "private",
    publicationStatus: text(formData, "publicationStatus") || "draft",
    coverMediaId: text(formData, "coverMediaId")
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  const { data, error } = await supabase.from("media_albums").insert({
    workspace_id: context.workspaceId,
    legacy_profile_id: context.legacyProfileId,
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    sort_order: parsed.data.sortOrder,
    privacy_state: parsed.data.visibility,
    publish_state: parsed.data.publicationStatus,
    cover_media_id: parsed.data.coverMediaId || null
  }).select("id").single();

  if (!error) {
    await writeMediaAudit("album_created", data?.id ?? null, { title: parsed.data.title }, "media_albums");
  }

  revalidatePath("/admin/media/albums");
}

export async function updateMediaAlbum(formData: FormData) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const parsed = albumSchema.safeParse({
    id: text(formData, "id"),
    title: text(formData, "title"),
    slug: text(formData, "slug") || slugifyMedia(text(formData, "title")),
    description: text(formData, "description"),
    sortOrder: text(formData, "sortOrder") || "0",
    visibility: text(formData, "visibility") || "private",
    publicationStatus: text(formData, "publicationStatus") || "draft",
    coverMediaId: text(formData, "coverMediaId")
  });
  if (!parsed.success || !parsed.data.id) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("media_albums")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      sort_order: parsed.data.sortOrder,
      privacy_state: parsed.data.visibility,
      publish_state: parsed.data.publicationStatus,
      cover_media_id: parsed.data.coverMediaId || null,
      archived_at: parsed.data.publicationStatus === "archived" ? new Date().toISOString() : null
    })
    .eq("id", parsed.data.id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  if (!error) {
    await writeMediaAudit("album_edited", parsed.data.id, {
      title: parsed.data.title,
      visibility: parsed.data.visibility,
      publicationStatus: parsed.data.publicationStatus
    }, "media_albums");
  }

  revalidatePath("/admin/media/albums");
  revalidatePath("/gallery");
}

export async function archiveMediaAlbum(formData: FormData) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("media_albums")
    .update({ publish_state: "archived", archived_at: new Date().toISOString() })
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  if (!error) {
    await writeMediaAudit("album_archived", id, {}, "media_albums");
  }

  revalidatePath("/admin/media/albums");
  revalidatePath("/gallery");
}

export async function addMediaToAlbum(formData: FormData) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const parsed = albumItemSchema.safeParse({
    albumId: text(formData, "albumId"),
    mediaItemId: text(formData, "mediaItemId"),
    sortOrder: text(formData, "sortOrder") || "0"
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  const { error } = await supabase.from("media_album_items").upsert({
    workspace_id: context.workspaceId,
    legacy_profile_id: context.legacyProfileId,
    album_id: parsed.data.albumId,
    media_item_id: parsed.data.mediaItemId,
    sort_order: parsed.data.sortOrder
  }, { onConflict: "album_id,media_item_id" });

  if (!error) {
    await writeMediaAudit("media_added_to_album", parsed.data.mediaItemId, {
      albumId: parsed.data.albumId,
      sortOrder: parsed.data.sortOrder
    });
  }

  revalidatePath("/admin/media/albums");
  revalidatePath("/gallery");
}

export async function removeMediaFromAlbum(formData: FormData) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const id = text(formData, "id");
  const mediaItemId = text(formData, "mediaItemId");
  const supabase = await createClient();
  const { error } = await supabase
    .from("media_album_items")
    .delete()
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  if (!error) {
    await writeMediaAudit("media_removed_from_album", mediaItemId || null, { albumItemId: id });
  }

  revalidatePath("/admin/media/albums");
  revalidatePath("/gallery");
}

export async function archiveMediaItem(formData: FormData) {
  const context = await requireLegacyProfilePermission("delete_media");
  const id = text(formData, "id");
  const supabase = await createClient();
  await supabase
    .from("media_items")
    .update({
      publish_state: "archived",
      publication_status: "archived",
      archived_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId);

  await writeMediaAudit("media_archived", id, {});
  revalidatePath("/admin/media");
}
