import { mediaExtensions, mediaMimeTypes, mediaSizeLimits, type UploadableMediaType } from "@/lib/media/config";

export type MediaValidationInput = {
  filename: string;
  mimeType: string;
  size: number;
  bytes?: Uint8Array;
};

const signatures: Record<UploadableMediaType, Array<{ mimeType: string; test: (bytes: Uint8Array) => boolean }>> = {
  image: [
    { mimeType: "image/jpeg", test: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
    { mimeType: "image/png", test: (bytes) => bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 },
    { mimeType: "image/webp", test: (bytes) => text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 12) === "WEBP" },
    { mimeType: "image/avif", test: (bytes) => text(bytes, 4, 12).includes("ftypavif") || text(bytes, 4, 12).includes("ftypavis") }
  ],
  document: [
    { mimeType: "application/pdf", test: (bytes) => text(bytes, 0, 5) === "%PDF-" }
  ],
  audio: [
    { mimeType: "audio/mpeg", test: (bytes) => bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0 || text(bytes, 0, 3) === "ID3" },
    { mimeType: "audio/wav", test: (bytes) => text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 12) === "WAVE" },
    { mimeType: "audio/mp4", test: (bytes) => text(bytes, 4, 8) === "ftyp" },
    { mimeType: "audio/x-m4a", test: (bytes) => text(bytes, 4, 8) === "ftyp" }
  ],
  video_clip: [
    { mimeType: "video/mp4", test: (bytes) => text(bytes, 4, 8) === "ftyp" },
    { mimeType: "video/webm", test: (bytes) => bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3 }
  ]
};

function text(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end));
}

export function inferMediaType(mimeType: string): UploadableMediaType | null {
  for (const [type, mimeTypes] of Object.entries(mediaMimeTypes)) {
    if ((mimeTypes as readonly string[]).includes(mimeType)) return type as UploadableMediaType;
  }

  return null;
}

export function extensionFor(filename: string) {
  const match = filename.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

export function validateMediaUpload(input: MediaValidationInput) {
  const mediaType = inferMediaType(input.mimeType);
  if (!mediaType) return { ok: false as const, message: `Unsupported file type: ${input.mimeType || "unknown"}` };

  const extension = extensionFor(input.filename);
  if (!mediaExtensions[mediaType].includes(extension as never)) {
    return { ok: false as const, message: "The file extension does not match an allowed media type." };
  }

  if (input.size > mediaSizeLimits[mediaType]) {
    return { ok: false as const, message: "File is larger than the configured limit for this media type." };
  }

  if (input.bytes?.length) {
    const matchesSignature = signatures[mediaType].some((signature) => signature.mimeType === input.mimeType && signature.test(input.bytes!));
    if (!matchesSignature) {
      return { ok: false as const, message: "The file signature does not match the declared media type." };
    }
  }

  return { ok: true as const, mediaType };
}
