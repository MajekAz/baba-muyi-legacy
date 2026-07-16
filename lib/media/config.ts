export const mediaSizeLimits = {
  image: 20 * 1024 * 1024,
  document: 50 * 1024 * 1024,
  audio: 100 * 1024 * 1024,
  video_clip: 250 * 1024 * 1024
} as const;

export const mediaMimeTypes = {
  image: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  document: ["application/pdf"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"],
  video_clip: ["video/mp4", "video/webm"]
} as const;

export const mediaExtensions = {
  image: [".jpg", ".jpeg", ".png", ".webp", ".avif"],
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
