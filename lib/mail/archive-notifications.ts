import "server-only";

import nodemailer from "nodemailer";
import { getPublicEnv } from "@/lib/env";
import { contactTypeLabels, type ContactSubmissionType } from "@/lib/contact/types";

type ContactNotificationInput = {
  submissionId: string;
  submissionType: ContactSubmissionType;
  senderName: string;
  senderEmail: string;
  relationship: string | null;
  message: string;
  hasAttachment: boolean;
  submittedAt: Date;
};

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  recipient: string;
};

const defaultRecipient = "archive@tioluwalasemajekodunmi.com";

function clean(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed.startsWith("<") || trimmed.includes("placeholder")) return undefined;
  return trimmed;
}

function getMailConfig(): MailConfig | null {
  const host = clean(process.env.SMTP_HOST);
  const portValue = clean(process.env.SMTP_PORT);
  const secureValue = clean(process.env.SMTP_SECURE);
  const user = clean(process.env.SMTP_USER);
  const password = clean(process.env.SMTP_PASSWORD);
  const recipient = clean(process.env.ARCHIVE_NOTIFICATION_EMAIL) ?? defaultRecipient;

  if (!host || !portValue || !user || !password) {
    return null;
  }

  const port = Number.parseInt(portValue, 10);
  if (!Number.isInteger(port) || port <= 0) {
    return null;
  }

  return {
    host,
    port,
    secure: secureValue ? secureValue === "true" : port === 465,
    user,
    password,
    recipient
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function messagePreview(message: string) {
  const normalized = message.replace(/\s+/g, " ").trim();
  return normalized.length > 320 ? `${normalized.slice(0, 317)}...` : normalized;
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/London"
  }).format(date);
}

function adminEnquiryUrl(submissionId: string) {
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;
  return new URL(`/admin/enquiries/${submissionId}`, siteUrl).toString();
}

function buildEmail(input: ContactNotificationInput) {
  const typeLabel = contactTypeLabels[input.submissionType];
  const submitted = formatSubmittedAt(input.submittedAt);
  const preview = messagePreview(input.message);
  const reviewUrl = adminEnquiryUrl(input.submissionId);
  const relationship = input.relationship?.trim() || "Not supplied";

  const text = [
    "Tioluwalase Majekodunmi Legacy Archive",
    "",
    "New Archive Enquiry",
    "",
    `Submission type: ${typeLabel}`,
    `Contributor: ${input.senderName}`,
    `Email: ${input.senderEmail}`,
    `Relationship: ${relationship}`,
    `Submitted: ${submitted}`,
    `Attachment: ${input.hasAttachment ? "Yes" : "No"}`,
    "",
    "Message preview:",
    preview,
    "",
    `Review enquiry: ${reviewUrl}`,
    "",
    "This message was generated automatically by the Tioluwalase Majekodunmi Legacy Archive Contact Centre."
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #132235; line-height: 1.6;">
      <p style="margin: 0 0 12px; color: #9a6a19; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;">Tioluwalase Majekodunmi Legacy Archive</p>
      <h1 style="margin: 0 0 20px; color: #081522; font-family: Georgia, serif; font-size: 28px;">New Archive Enquiry</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tbody>
          <tr><td style="padding: 8px 0; font-weight: 700;">Submission type:</td><td style="padding: 8px 0;">${escapeHtml(typeLabel)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Contributor:</td><td style="padding: 8px 0;">${escapeHtml(input.senderName)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Email:</td><td style="padding: 8px 0;">${escapeHtml(input.senderEmail)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Relationship:</td><td style="padding: 8px 0;">${escapeHtml(relationship)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Submitted:</td><td style="padding: 8px 0;">${escapeHtml(submitted)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Attachment:</td><td style="padding: 8px 0;">${input.hasAttachment ? "Yes" : "No"}</td></tr>
        </tbody>
      </table>
      <h2 style="margin: 24px 0 8px; color: #081522; font-size: 16px;">Message preview</h2>
      <p style="margin: 0 0 24px; max-width: 640px;">${escapeHtml(preview)}</p>
      <p><a href="${escapeHtml(reviewUrl)}" style="display: inline-block; background: #081522; color: #ffffff; padding: 12px 18px; text-decoration: none; font-weight: 700;">Review enquiry</a></p>
      <p style="margin-top: 28px; color: #53657a; font-size: 12px;">This message was generated automatically by the Tioluwalase Majekodunmi Legacy Archive Contact Centre.</p>
    </div>
  `;

  return {
    subject: `New archive enquiry: ${typeLabel}`,
    text,
    html
  };
}

function logNotification(action: string, submissionId: string, extra?: Record<string, unknown>) {
  console.info("[contact-email]", action, {
    submission: submissionId,
    ...extra
  });
}

export async function sendContactSubmissionNotification(input: ContactNotificationInput) {
  const config = getMailConfig();

  if (!config) {
    logNotification("notification skipped", input.submissionId, { reason: "smtp-not-configured" });
    return { ok: false, skipped: true as const };
  }

  const email = buildEmail(input);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password
    }
  });

  try {
    await transporter.sendMail({
      from: config.user,
      to: config.recipient,
      subject: email.subject,
      text: email.text,
      html: email.html
    });
    logNotification("notification sent", input.submissionId);
    return { ok: true, skipped: false as const };
  } catch (error) {
    const mailError = error as { code?: string; responseCode?: number };
    console.warn("[contact-email] notification failed", {
      submission: input.submissionId,
      code: mailError.code ?? null,
      status: mailError.responseCode ?? null
    });
    return { ok: false, skipped: false as const };
  }
}

export const contactNotificationInternals = {
  buildEmail,
  messagePreview,
  getMailConfig
};
