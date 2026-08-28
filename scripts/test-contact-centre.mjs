import fs from "node:fs";

const checks = [];

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function exists(path) {
  return fs.existsSync(path);
}

function expect(name, condition, detail) {
  checks.push({ ok: Boolean(condition), name, detail });
}

const contactPage = read("app/(public)/contact/page.tsx");
const contactForm = read("components/contact/archive-contact-form.tsx");
const contactRoute = read("app/api/contact/route.ts");
const contactValidation = read("lib/contact/validation.ts");
const contactMigration = read("supabase/migrations/0017_contact_submissions.sql");
const contactQueries = read("lib/contact/queries.ts");
const contactActions = read("lib/contact/actions.ts");
const contactNotifications = read("lib/mail/archive-notifications.ts");
const enquiryPage = read("app/admin/enquiries/page.tsx");
const enquiryDetailPage = read("app/admin/enquiries/[id]/page.tsx");
const attachmentRoute = read("app/admin/enquiries/[id]/attachment/route.ts");
const navigation = read("lib/navigation.ts");
const docs = read("docs/CONTACT_CONTRIBUTION_CENTRE.md");

expect(
  "public contact centre copy",
  contactPage.includes("Contact the Tioluwalase Majekodunmi Legacy Archive") &&
    contactPage.includes("Share a memory, submit a correction, offer archive material") &&
    contactPage.includes("Every public contribution is reviewed before it appears in the archive"),
  "Public /contact is a branded archive contact and contribution centre."
);

expect(
  "public form posts to stable API",
  contactForm.includes('fetch("/api/contact"') && !contactForm.includes("useActionState") && !contactForm.includes(" action={"),
  "The public form uses a stable Route Handler endpoint, not a Server Action."
);

expect(
  "contact API route security",
  contactRoute.includes("export async function POST") &&
    contactRoute.includes("Cache-Control") &&
    contactRoute.includes("no-store") &&
    contactRoute.includes("createAdminClient") &&
    contactRoute.includes("website") &&
    contactRoute.includes("isRateLimited"),
  "The API route is no-store, validates server-side, includes honeypot/rate limiting, and uses server-only Supabase access."
);

expect(
  "successful submission triggers notification attempt",
  contactRoute.includes("sendContactSubmissionNotification") &&
    contactRoute.indexOf("contact_submission_received") < contactRoute.lastIndexOf("sendContactSubmissionNotification") &&
    contactRoute.lastIndexOf("sendContactSubmissionNotification") < contactRoute.lastIndexOf("Thank you. Your message has been received by the archive team."),
  "The API attempts email notification only after the enquiry and audit event are saved."
);

expect(
  "attachment validation",
  contactRoute.includes("validateContactAttachment") &&
    contactValidation.includes('contactAttachmentBucket = "tribute-uploads"') &&
    contactRoute.includes("attachment_mime_type") &&
    contactRoute.includes("attachment_size_bytes"),
  "Attachments are validated and stored privately in the existing tribute-uploads bucket."
);

expect(
  "migration table and RLS",
  contactMigration.includes("create table if not exists public.contact_submissions") &&
    contactMigration.includes("alter table public.contact_submissions enable row level security") &&
    contactMigration.includes("reviewers read contact submissions") &&
    contactMigration.includes("reviewers update contact submissions") &&
    !contactMigration.includes("to anon"),
  "The migration creates tenant-scoped submissions with RLS and no anonymous direct table access."
);

expect(
  "tenant scoping",
  contactMigration.includes("workspace_id uuid not null references public.workspaces") &&
    contactMigration.includes("legacy_profile_id uuid not null references public.legacy_profiles") &&
    contactQueries.includes("LEGACYHUB_WORKSPACE_SLUG") &&
    contactQueries.includes("LEGACYHUB_LEGACY_PROFILE_SLUG"),
  "Submissions are scoped to the active workspace and legacy profile."
);

expect(
  "admin enquiry routes",
  exists("app/admin/enquiries/page.tsx") &&
    exists("app/admin/enquiries/[id]/page.tsx") &&
    enquiryPage.includes('requireLegacyProfilePermission("review_submissions")') &&
    enquiryDetailPage.includes('requireLegacyProfilePermission("review_submissions")'),
  "Admin enquiry list and detail routes require review_submissions."
);

expect(
  "admin workflow",
  contactActions.includes("updateContactSubmission") &&
    contactActions.includes("contact_submission_reviewed") &&
    enquiryDetailPage.includes("Save review status") &&
    enquiryDetailPage.includes("Internal notes"),
  "Authorised staff can update status and notes with an audit-log entry."
);

expect(
  "private attachment access",
  attachmentRoute.includes("createSignedUrl") &&
    attachmentRoute.includes('requireLegacyProfilePermission("review_submissions")') &&
    !contactPage.includes("createSignedUrl"),
  "Private attachments are opened through a protected admin route."
);

expect(
  "SMTP failure does not fail saved enquiry",
  contactNotifications.includes("notification failed") &&
    contactNotifications.includes("return { ok: false, skipped: false") &&
    contactRoute.includes("Thank you. Your message has been received by the archive team."),
  "Mail failures are logged safely and the public submission success response is preserved."
);

expect(
  "missing SMTP configuration does not break submissions",
  contactNotifications.includes("smtp-not-configured") &&
    contactNotifications.includes("return { ok: false, skipped: true"),
  "Missing SMTP configuration is treated as a skipped notification, not a contact-form failure."
);

expect(
  "trusted notification recipient",
  contactNotifications.includes("ARCHIVE_NOTIFICATION_EMAIL") &&
    contactNotifications.includes("archive@tioluwalasemajekodunmi.com") &&
    !contactRoute.includes("ARCHIVE_NOTIFICATION_EMAIL") &&
    !contactForm.includes("ARCHIVE_NOTIFICATION_EMAIL"),
  "Notification recipient comes from trusted server configuration, never public form input."
);

expect(
  "notification email privacy",
  contactNotifications.includes("messagePreview") &&
    contactNotifications.includes("slice(0, 317)") &&
    contactNotifications.includes("escapeHtml") &&
    !contactNotifications.includes("attachment_path") &&
    !contactNotifications.includes("signedUrl"),
  "Email content uses a bounded preview, escapes HTML, and excludes private attachment paths or signed URLs."
);

expect(
  "admin enquiry URL included",
  contactNotifications.includes("/admin/enquiries/") && contactNotifications.includes("NEXT_PUBLIC_SITE_URL"),
  "Notification email includes a protected admin enquiry URL built from trusted site configuration."
);

expect(
  "environment placeholders documented",
  read(".env.example").includes("SMTP_HOST=smtp.titan.email") &&
    read(".env.example").includes("SMTP_PASSWORD=your-smtp-password") &&
    read(".env.example").includes("ARCHIVE_NOTIFICATION_EMAIL=archive@tioluwalasemajekodunmi.com"),
  ".env.example documents Titan SMTP variables with placeholders only."
);

expect(
  "notification documentation",
  docs.includes("Email Notifications") &&
    docs.includes("Titan SMTP Setup") &&
    docs.includes("Email delivery is deliberately secondary") &&
    docs.includes("Never commit the real SMTP password"),
  "Contact Centre documentation covers email flow, Titan setup, failure behaviour, and privacy."
);

expect(
  "admin navigation",
  navigation.includes('label: "Enquiries"') &&
    navigation.includes('href: "/admin/enquiries"') &&
    navigation.includes('requiredPermission: "review_submissions"'),
  "Admin navigation exposes Enquiries to authorised reviewers."
);

expect(
  "documentation",
  docs.includes("Archive Contact & Contribution Centre") &&
    docs.includes("No public Supabase writes") &&
    docs.includes("Submitted attachments are not media library records"),
  "Documentation records the submission workflow, security model, and limitations."
);

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}: ${check.detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  process.exitCode = 1;
}
