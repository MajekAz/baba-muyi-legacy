import { z } from "zod";
import { permissions, roles } from "@/lib/permissions";

export const publishStateSchema = z.enum(["draft", "scheduled", "published", "archived"]);
export const visibilitySchema = z.enum([
  "public",
  "preview",
  "private",
  "family_only",
  "registered",
  "invited",
  "specific_users",
  "password_protected"
]);
export const verificationSchema = z.enum(["unverified", "family_memory", "partially_verified", "verified"]);

export const contentItemSchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().max(500).optional(),
  fullContent: z.string().trim().max(100000).optional(),
  author: z.string().trim().max(120).optional(),
  status: publishStateSchema,
  visibility: visibilitySchema,
  verificationStatus: verificationSchema,
  copyrightStatus: z.string().trim().max(180).optional(),
  source: z.string().trim().max(300).optional(),
  seoTitle: z.string().trim().max(180).optional(),
  metaDescription: z.string().trim().max(300).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const invitationSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(roles),
  legacyProfileId: z.string().uuid().optional(),
  permissions: z.array(z.enum(permissions)).default([]),
  personalMessage: z.string().trim().max(1000).optional(),
  expiresAt: z.string().trim().min(1)
});

export const mediaUploadMetadataSchema = z.object({
  caption: z.string().trim().max(300).optional(),
  altText: z.string().trim().max(300).optional(),
  description: z.string().trim().max(1000).optional(),
  approximateDate: z.string().trim().max(120).optional(),
  location: z.string().trim().max(180).optional(),
  peopleShown: z.string().trim().max(500).optional(),
  source: z.string().trim().max(300).optional(),
  copyrightOwner: z.string().trim().max(180).optional(),
  visibility: visibilitySchema,
  verificationStatus: verificationSchema
});

export const documentarySchema = contentItemSchema.extend({
  language: z.string().trim().max(80).optional(),
  durationSeconds: z.coerce.number().min(0).optional(),
  releaseDate: z.string().trim().optional(),
  director: z.string().trim().max(120).optional(),
  writer: z.string().trim().max(120).optional(),
  narrator: z.string().trim().max(120).optional(),
  producer: z.string().trim().max(120).optional(),
  provider: z.enum(["youtube", "vimeo", "cloudflare_stream", "mux", "supabase_storage", "external"]).optional(),
  playbackUrlOrId: z.string().trim().max(500).optional()
});

export const menuItemSchema = z.object({
  label: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(100),
  url: z.string().trim().max(500).optional(),
  linkType: z.enum(["internal", "external", "documentary", "biography_section", "timeline_section", "album", "document_download"]),
  visibility: visibilitySchema,
  requiredRole: z.enum(roles).optional(),
  status: publishStateSchema,
  sortOrder: z.coerce.number().int().min(0).default(0),
  openInNewTab: z.coerce.boolean().default(false),
  icon: z.string().trim().max(80).optional(),
  badge: z.string().trim().max(80).optional(),
  description: z.string().trim().max(240).optional()
});

export const allowedUploadTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "application/pdf"
]);

export function validateUploadFile(file: File) {
  const maxBytes = file.type.startsWith("video/") ? 250 * 1024 * 1024 : 50 * 1024 * 1024;

  if (!allowedUploadTypes.has(file.type)) {
    return `Unsupported file type: ${file.type || "unknown"}`;
  }

  if (file.size > maxBytes) {
    return "File is larger than the allowed size for this media type.";
  }

  return null;
}
