import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/lib/tenant-context";
import type { CmsCoreTable } from "@/lib/cms-core-config";
import type { MediaAlbum, MediaAlbumItem, MediaRecord, MediaRelationOption, MediaRelationState } from "@/lib/media/types";

function normalizeMedia(row: Record<string, any>, signedUrl?: string): MediaRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug ?? row.stable_id ?? row.id,
    description: row.description ?? "",
    caption: row.caption ?? "",
    altText: row.alt_text ?? "",
    mediaType: row.media_type ?? row.kind,
    mimeType: row.mime_type ?? "",
    fileSize: Number(row.file_size ?? row.file_size_bytes ?? 0),
    storageBucket: row.storage_bucket ?? row.bucket ?? "",
    storagePath: row.storage_path ?? "",
    thumbnailStoragePath: row.thumbnail_storage_path ?? "",
    width: row.width ?? null,
    height: row.height ?? null,
    duration: row.duration ?? row.duration_seconds ?? null,
    approximateDate: row.approximate_date ?? "",
    datePrecision: row.date_precision ?? "unknown",
    location: row.location ?? "",
    peopleShown: row.people_shown ?? [],
    source: row.source ?? row.source_reference ?? "",
    copyrightOwner: row.copyright_owner ?? "",
    licence: row.licence ?? row.copyright_status ?? "",
    verificationStatus: row.verification_state ?? "unverified",
    moderationStatus: row.moderation_state ?? "pending",
    visibility: row.visibility ?? row.privacy_state ?? "private",
    publicationStatus: row.publication_status ?? row.publish_state ?? "draft",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? "",
    archivedAt: row.archived_at ?? "",
    albumId: row.album_id ?? "",
    albumTitle: Array.isArray(row.album) ? row.album[0]?.title : row.album?.title,
    signedUrl
  };
}

function normalizeAlbum(row: Record<string, any>): MediaAlbum {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    sortOrder: row.sort_order ?? 0,
    visibility: row.privacy_state ?? "private",
    publicationStatus: row.publish_state ?? "draft",
    coverMediaId: row.cover_media_id ?? "",
    itemCount: row.media_album_items?.[0]?.count ?? 0
  };
}

export async function getAdminMediaRecords(context: Pick<TenantContext, "workspaceId" | "legacyProfileId">, filters: { type?: string; search?: string; visibility?: string; status?: string; verification?: string; albumId?: string } = {}) {
  noStore();
  if (!hasSupabasePublicEnv()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("media_items")
    .select("*, album:media_albums!media_items_album_id_fkey(title)")
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (filters.type) query = query.eq("media_type", filters.type as never);
  if (filters.visibility) query = query.eq("visibility", filters.visibility as never);
  if (filters.status) query = query.eq("publication_status", filters.status as never);
  if (filters.verification) query = query.eq("verification_state", filters.verification as never);
  if (filters.albumId) query = query.eq("album_id", filters.albumId);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw new Error("Unable to load media records.");
  return (data ?? []).map((row) => normalizeMedia(row));
}

export async function getAdminMediaRecord(context: Pick<TenantContext, "workspaceId" | "legacyProfileId">, id: string) {
  noStore();
  if (!hasSupabasePublicEnv()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_items")
    .select("*, album:media_albums!media_items_album_id_fkey(title)")
    .eq("id", id)
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .maybeSingle();

  if (error) throw new Error("Unable to load media record.");
  return data ? normalizeMedia(data) : null;
}

export async function getMediaAlbums(context: Pick<TenantContext, "workspaceId" | "legacyProfileId">) {
  noStore();
  if (!hasSupabasePublicEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_albums")
    .select("*, media_album_items(count)")
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .is("archived_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw new Error("Unable to load media albums.");
  return (data ?? []).map((row) => normalizeAlbum(row));
}

export async function getMediaAlbumItems(context: Pick<TenantContext, "workspaceId" | "legacyProfileId">, albumId: string): Promise<MediaAlbumItem[]> {
  noStore();
  if (!hasSupabasePublicEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_album_items")
    .select("id, album_id, media_item_id, sort_order, media_items(title, media_type, kind)")
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error("Unable to load album media.");
  return (data ?? []).map((row: any) => {
    const media = Array.isArray(row.media_items) ? row.media_items[0] : row.media_items;
    return {
      id: row.id,
      albumId: row.album_id,
      mediaItemId: row.media_item_id,
      title: media?.title ?? "Untitled media",
      mediaType: media?.media_type ?? media?.kind ?? "media",
      sortOrder: row.sort_order ?? 0
    };
  });
}

export async function getSelectableMedia(context: Pick<TenantContext, "workspaceId" | "legacyProfileId">): Promise<MediaRelationOption[]> {
  noStore();
  if (!hasSupabasePublicEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_items")
    .select("id, title, media_type, kind")
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) return [];
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title ?? "Untitled media",
    mediaType: row.media_type ?? row.kind ?? "media"
  }));
}

export async function getMediaRelationState(context: Pick<TenantContext, "workspaceId" | "legacyProfileId">, table: CmsCoreTable, contentId: string): Promise<MediaRelationState> {
  noStore();
  if (!hasSupabasePublicEnv()) return { featuredMediaId: "", relatedMediaIds: [] };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_relations")
    .select("media_item_id, relation_type")
    .eq("workspace_id", context.workspaceId)
    .eq("legacy_profile_id", context.legacyProfileId)
    .eq("related_table", table)
    .eq("related_id", contentId);

  if (error) return { featuredMediaId: "", relatedMediaIds: [] };
  const featured = (data ?? []).find((row) => row.relation_type === "featured")?.media_item_id ?? "";
  const related = (data ?? []).filter((row) => row.relation_type === "related").map((row) => row.media_item_id);
  return { featuredMediaId: featured, relatedMediaIds: related };
}

export async function getPublicFeaturedMediaForContent(table: CmsCoreTable, contentIds: string[]) {
  noStore();
  if (!hasSupabasePublicEnv() || !contentIds.length) return new Map<string, MediaRecord>();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_relations")
    .select("related_id, media_items(*)")
    .eq("related_table", table)
    .eq("relation_type", "featured")
    .in("related_id", contentIds);

  if (error) return new Map<string, MediaRecord>();
  const admin = createAdminClient();
  const entries = await Promise.all((data ?? []).map(async (row: any) => {
    const media = Array.isArray(row.media_items) ? row.media_items[0] : row.media_items;
    if (!media || media.publication_status !== "published" || media.visibility !== "public" || media.moderation_state !== "approved") return null;
    const bucket = media.storage_bucket ?? media.bucket;
    const path = media.thumbnail_storage_path ?? media.web_storage_path ?? media.storage_path;
    let signedUrl = "";
    if (bucket && path) {
      const { data: urlData } = await admin.storage.from(bucket).createSignedUrl(path, 60 * 30);
      signedUrl = urlData?.signedUrl ?? "";
    }
    return [row.related_id, normalizeMedia(media, signedUrl)] as const;
  }));

  return new Map(entries.filter((entry): entry is readonly [string, MediaRecord] => Boolean(entry)));
}

export async function getPublicMediaRecords(filters: { type?: string; albumSlug?: string } = {}) {
  noStore();
  if (!hasSupabasePublicEnv()) return [];

  const supabase = await createClient();
  let albumId = "";
  if (filters.albumSlug) {
    const { data: album } = await supabase
      .from("media_albums")
      .select("id")
      .eq("slug", filters.albumSlug)
      .eq("publish_state", "published")
      .eq("privacy_state", "public")
      .is("archived_at", null)
      .maybeSingle();
    if (!album?.id) return [];
    albumId = album.id;
  }

  let query = supabase
    .from("media_items")
    .select("*, album:media_albums!media_items_album_id_fkey(title, slug)")
    .eq("publication_status", "published")
    .eq("visibility", "public")
    .eq("moderation_state", "approved")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (filters.type) query = query.eq("media_type", filters.type as never);
  if (albumId) query = query.eq("album_id", albumId);

  const { data, error } = await query;
  if (error) return [];

  const admin = createAdminClient();
  return Promise.all((data ?? []).map(async (row) => {
    const bucket = row.storage_bucket ?? row.bucket;
    const path = row.web_storage_path ?? row.storage_path;
    let signedUrl = "";
    if (bucket && path) {
      const { data: urlData } = await admin.storage.from(bucket).createSignedUrl(path, 60 * 30);
      signedUrl = urlData?.signedUrl ?? "";
    }
    return normalizeMedia(row, signedUrl);
  }));
}

export async function getPublicAlbums() {
  noStore();
  if (!hasSupabasePublicEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_albums")
    .select("*, media_album_items(count)")
    .eq("publish_state", "published")
    .eq("privacy_state", "public")
    .is("archived_at", null)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []).map((row) => normalizeAlbum(row));
}
