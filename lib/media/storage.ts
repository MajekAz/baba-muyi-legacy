import "server-only";
import { createClient } from "@/lib/supabase/server";

const bucketByMimePrefix = [
  { prefix: "image/", bucket: "legacy-images" },
  { prefix: "audio/", bucket: "legacy-audio" },
  { prefix: "video/", bucket: "legacy-video-clips" }
] as const;

export function safeFilename(filename: string) {
  const parts = filename.toLowerCase().split(".");
  const extension = parts.length > 1 ? `.${parts.pop()}` : "";
  const base = parts
    .join(".")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${base || "file"}${extension}`;
}

export function bucketForMimeType(mimeType: string) {
  if (mimeType === "application/pdf") {
    return "legacy-documents";
  }

  return bucketByMimePrefix.find((item) => mimeType.startsWith(item.prefix))?.bucket ?? "tribute-uploads";
}

export function createStoragePath({
  legacyProfileId,
  mediaKind,
  filename
}: {
  legacyProfileId: string;
  mediaKind: string;
  filename: string;
}) {
  return `${legacyProfileId}/${mediaKind}/${crypto.randomUUID()}-${safeFilename(filename)}`;
}

export async function createSignedReadUrl(bucket: string, path: string, expiresInSeconds = 60 * 10) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);

  if (error) {
    throw new Error("Unable to create signed URL for private media.");
  }

  return data.signedUrl;
}

export async function removeStorageObject(bucket: string, path: string) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error("Unable to delete storage object.");
  }
}
