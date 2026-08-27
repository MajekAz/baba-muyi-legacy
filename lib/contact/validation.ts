import { z } from "zod";
import { contactSubmissionTypes } from "@/lib/contact/types";

export const contactAttachmentBucket = "tribute-uploads";
export const contactAttachmentMaxBytes = 25 * 1024 * 1024;

export const contactAttachmentMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "audio/mpeg",
  "video/mp4"
] as const;

const extensionByMimeType: Record<(typeof contactAttachmentMimeTypes)[number], string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "audio/mpeg": [".mp3"],
  "video/mp4": [".mp4"]
};

export const contactFormSchema = z.object({
  senderName: z.string().trim().min(2, "Enter your name.").max(120),
  senderEmail: z.string().trim().email("Enter a valid email address.").max(254),
  relationship: z.string().trim().max(160).optional(),
  submissionType: z.enum(contactSubmissionTypes),
  message: z.string().trim().min(10, "Enter a short message.").max(5000),
  consentToContact: z.literal("on", {
    errorMap: () => ({ message: "Confirm that the archive team may contact you about this submission." })
  })
});

function hasExtension(filename: string, mimeType: (typeof contactAttachmentMimeTypes)[number]) {
  const lower = filename.toLowerCase();
  return extensionByMimeType[mimeType].some((extension) => lower.endsWith(extension));
}

function hasSignature(bytes: Uint8Array, mimeType: (typeof contactAttachmentMimeTypes)[number]) {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (mimeType === "image/webp") {
    return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  }
  if (mimeType === "application/pdf") {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  }
  if (mimeType === "audio/mpeg") {
    return (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  }
  if (mimeType === "video/mp4") {
    return bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
  }
  return false;
}

export function validateContactAttachment(file: File, bytes: Uint8Array) {
  const mimeType = file.type as (typeof contactAttachmentMimeTypes)[number];

  if (!contactAttachmentMimeTypes.includes(mimeType)) {
    return "Upload a JPG, PNG, WebP, PDF, MP3, or MP4 file.";
  }

  if (file.size > contactAttachmentMaxBytes) {
    return "Upload a file smaller than 25MB.";
  }

  if (!hasExtension(file.name, mimeType)) {
    return "The file extension does not match the uploaded file type.";
  }

  if (!hasSignature(bytes, mimeType)) {
    return "The uploaded file could not be verified as the selected file type.";
  }

  return null;
}
