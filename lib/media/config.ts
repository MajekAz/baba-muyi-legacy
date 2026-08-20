export const mediaSizeLimits = {
  image: 20 * 1024 * 1024,
  document: 50 * 1024 * 1024,
  audio: 100 * 1024 * 1024,
  video_clip: 250 * 1024 * 1024
} as const;

export const mediaMimeTypes = {
  image: ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"],
  video_clip: ["video/mp4", "video/webm"]
} as const;

export const mediaExtensions = {
  image: [".jpg", ".jpeg", ".png", ".webp"],
  document: [".pdf"],
  audio: [".mp3", ".wav", ".m4a"],
  video_clip: [".mp4", ".webm"]
} as const;

export const mediaBuckets = {
  image: "legacy-images",
  document: "legacy-documents",
  audio: "legacy-audio",
  video_clip: "legacy-video"
} as const;

export const mediaTypeLabels = {
  image: "Image",
  document: "Document",
  audio: "Audio",
  video_clip: "Video clip",
  external_video: "External video"
} as const;

export type UploadableMediaType = keyof typeof mediaSizeLimits;

export const galleryCategories = [
  "Family",
  "Early Life",
  "Bariga & Community",
  "Bolekaja / Transport",
  "TIOLUWA LASE",
  "Leadership & Community Service",
  "Later Years",
  "Memorial / Legacy"
] as const;

export const galleryImageTypes = {
  original_family_photograph: "Original family photograph",
  restored_family_photograph: "Restored family photograph",
  documentary_still: "Documentary still",
  ai_assisted_heritage_reconstruction: "AI-assisted heritage reconstruction"
} as const;

export const galleryApprovalStatuses = {
  unreviewed: "Unreviewed",
  family_approved: "Family approved",
  editorial_review: "Editorial review",
  verified_family_memory: "Verified from family memory",
  verified_document_source: "Verified from document/source",
  ai_assisted_interpretive: "AI-assisted / interpretive"
} as const;

export type GalleryCategory = (typeof galleryCategories)[number];
export type GalleryImageType = keyof typeof galleryImageTypes;
export type GalleryApprovalStatus = keyof typeof galleryApprovalStatuses;
