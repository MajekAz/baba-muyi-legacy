import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact/validation";
import {
  contactAttachmentBucket,
  contactAttachmentMaxBytes,
  validateContactAttachment
} from "@/lib/contact/validation";
import { getSubmissionTenant } from "@/lib/contact/queries";
import { hasSupabasePublicEnv } from "@/lib/env";
import { sendContactSubmissionNotification } from "@/lib/mail/archive-notifications";
import { safeFilename } from "@/lib/media/storage";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type ContactResponse = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const windowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;

function contactJson(body: ContactResponse, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

function clientFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > maxSubmissionsPerWindow;
}

function logContactError(action: string, error: { name?: string; code?: string; status?: number; message?: string }) {
  console.warn("[contact]", action, {
    name: error.name,
    code: error.code,
    status: error.status,
    message: error.message
  });
}

function fieldErrors(error: ReturnType<typeof contactFormSchema.safeParse>) {
  if (error.success) return undefined;
  return error.error.flatten().fieldErrors;
}

export async function POST(request: Request) {
  let uploadedAttachment: { bucket: string; path: string } | null = null;

  try {
    if (!hasSupabasePublicEnv()) {
      return contactJson({ ok: false, message: "The archive contact form is not configured yet." }, { status: 503 });
    }

    const fingerprint = clientFingerprint(request);
    if (isRateLimited(fingerprint)) {
      return contactJson({ ok: false, message: "Please wait before sending another message." }, { status: 429 });
    }

    const formData = await request.formData();

    if (String(formData.get("website") ?? "").trim()) {
      return contactJson({
        ok: true,
        message: "Thank you. Your message has been received by the archive team."
      });
    }

    const parsed = contactFormSchema.safeParse({
      senderName: formData.get("senderName"),
      senderEmail: formData.get("senderEmail"),
      relationship: formData.get("relationship"),
      submissionType: formData.get("submissionType"),
      message: formData.get("message"),
      consentToContact: formData.get("consentToContact")
    });

    if (!parsed.success) {
      return contactJson(
        {
          ok: false,
          message: "Please check the highlighted fields and try again.",
          fieldErrors: fieldErrors(parsed)
        },
        { status: 400 }
      );
    }

    const file = formData.get("attachment");
    const admin = createAdminClient();
    const tenant = await getSubmissionTenant();
    const submissionId = randomUUID();
    let attachmentMetadata: {
      attachment_bucket: string | null;
      attachment_path: string | null;
      attachment_filename: string | null;
      attachment_mime_type: string | null;
      attachment_size_bytes: number | null;
    } = {
      attachment_bucket: null,
      attachment_path: null,
      attachment_filename: null,
      attachment_mime_type: null,
      attachment_size_bytes: null
    };

    if (file instanceof File && file.size > 0) {
      if (file.size > contactAttachmentMaxBytes) {
        return contactJson({ ok: false, message: "Upload a file smaller than 25MB." }, { status: 400 });
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      const attachmentError = validateContactAttachment(file, bytes);
      if (attachmentError) {
        return contactJson({ ok: false, message: attachmentError }, { status: 400 });
      }

      const filename = safeFilename(file.name);
      const storagePath = `${tenant.legacyProfileId}/contact-submissions/${submissionId}/${filename}`;
      const { error: uploadError } = await admin.storage.from(contactAttachmentBucket).upload(storagePath, file, {
        contentType: file.type,
        upsert: false
      });

      if (uploadError) {
        logContactError("attachment upload failed", uploadError);
        return contactJson({ ok: false, message: "The attachment could not be uploaded. Please try again." }, { status: 400 });
      }

      uploadedAttachment = { bucket: contactAttachmentBucket, path: storagePath };
      attachmentMetadata = {
        attachment_bucket: contactAttachmentBucket,
        attachment_path: storagePath,
        attachment_filename: filename,
        attachment_mime_type: file.type,
        attachment_size_bytes: file.size
      };
    }

    const { error: insertError } = await admin.from("contact_submissions").insert({
      id: submissionId,
      workspace_id: tenant.workspaceId,
      legacy_profile_id: tenant.legacyProfileId,
      submission_type: parsed.data.submissionType,
      sender_name: parsed.data.senderName,
      sender_email: parsed.data.senderEmail,
      relationship: parsed.data.relationship || null,
      message: parsed.data.message,
      consent_to_contact: true,
      ...attachmentMetadata
    });

    if (insertError) {
      if (uploadedAttachment) {
        await admin.storage.from(uploadedAttachment.bucket).remove([uploadedAttachment.path]);
      }
      logContactError("submission insert failed", insertError);
      return contactJson({ ok: false, message: "Your message could not be saved. Please try again." }, { status: 400 });
    }

    await admin.from("audit_logs").insert({
      action: "contact_submission_received",
      actor_user_id: null,
      entity_table: "contact_submissions",
      entity_id: submissionId,
      workspace_id: tenant.workspaceId,
      legacy_profile_id: tenant.legacyProfileId,
      metadata: {
        submission_type: parsed.data.submissionType,
        has_attachment: Boolean(attachmentMetadata.attachment_path),
        attachment_mime_type: attachmentMetadata.attachment_mime_type
      }
    });

    await sendContactSubmissionNotification({
      submissionId,
      submissionType: parsed.data.submissionType,
      senderName: parsed.data.senderName,
      senderEmail: parsed.data.senderEmail,
      relationship: parsed.data.relationship || null,
      message: parsed.data.message,
      hasAttachment: Boolean(attachmentMetadata.attachment_path),
      submittedAt: new Date()
    });

    return contactJson({
      ok: true,
      message: "Thank you. Your message has been received by the archive team."
    });
  } catch (error) {
    if (uploadedAttachment) {
      try {
        const admin = createAdminClient();
        await admin.storage.from(uploadedAttachment.bucket).remove([uploadedAttachment.path]);
      } catch {
        // Best-effort cleanup only; avoid exposing storage details to the visitor.
      }
    }
    logContactError("unexpected contact error", error instanceof Error ? error : { message: "Unknown contact error" });
    return contactJson({ ok: false, message: "Your message could not be sent. Please try again later." }, { status: 400 });
  }
}
