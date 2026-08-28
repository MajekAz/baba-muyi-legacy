# Archive Contact & Contribution Centre

## Purpose

The public Contact page is the intake point for archive enquiries, memories, corrections, documentary contact, and approved material offered for review.

The page belongs to the Tioluwalase Majekodunmi Legacy Archive public experience. It is not public registration, and it does not create accounts, workspaces, media records, or published content.

## Public Submission Flow

1. A visitor completes `/contact`.
2. The form submits to `POST /api/contact`.
3. The Route Handler validates all text fields server-side.
4. The honeypot field silently accepts suspected bot submissions without creating records.
5. A lightweight process-local rate limit reduces repeated submissions.
6. Optional attachments are validated by MIME type, extension, size, and file signature where practical.
7. Attachments are uploaded privately to the existing `tribute-uploads` bucket.
8. A row is created in `public.contact_submissions`.
9. A minimal audit-log entry records the submission event without storing the full private message body in audit metadata.
10. The server attempts a single email notification to the archive mailbox.

## Supported Attachment Types

The current public contribution form supports:

- JPG
- PNG
- WebP
- PDF
- MP3
- MP4

The maximum attachment size is 25MB.

DOC, DOCX, and TXT are not enabled in this implementation because the existing Supabase storage bucket policy is already limited to the safer archive media/document types above. Those file types should be added only after a separate storage-policy review.

## Storage Strategy

Submitted attachments are stored in:

`tribute-uploads/{legacy_profile_id}/contact-submissions/{submission_id}/{safe_filename}`

Submitted attachments are not media library records and are not published automatically. If the editorial team approves an attachment for public archive use, it should be processed through the Media Library workflow separately.

## Security Controls

- No public Supabase writes are granted for `contact_submissions`.
- Browser code never receives `SUPABASE_SERVICE_ROLE_KEY`.
- Browser code never receives SMTP credentials.
- Public submissions use a stable Route Handler, not a Next.js Server Action.
- API responses are `Cache-Control: no-store`.
- Public error messages are generic.
- Server logs must not include passwords, tokens, keys, full message bodies, or signed URLs.
- `contact_submissions` is tenant-scoped by `workspace_id` and `legacy_profile_id`.
- RLS permits authenticated users with `review_submissions` to read and update submissions.
- Attachments are only opened by authorised staff through a short-lived signed URL route.
- Notification emails do not include attachment bytes, private storage paths, or signed URLs.
- Contributor-controlled values are escaped before rendering in the HTML email.

## Admin Review Flow

Authorised staff use:

- `/admin/enquiries`
- `/admin/enquiries/[id]`

Statuses:

- New
- In review
- Resolved
- Archived

Reviewers can update status and internal notes. Updates create a `contact_submission_reviewed` audit event containing status and whether internal notes exist, but not the full private content body.

## Email Notifications

When a valid enquiry is saved successfully, the server attempts to notify the archive mailbox.

Default recipient:

`archive@tioluwalasemajekodunmi.com`

The email includes:

- contributor name
- contributor email
- relationship, if supplied
- submission type
- submission date/time
- a short bounded message preview
- whether an attachment was submitted
- a protected admin enquiry link

The email does not include:

- uploaded files
- private Supabase Storage URLs
- signed URLs
- credentials
- raw database errors
- sensitive internal metadata

Email delivery is deliberately secondary. If SMTP is missing or delivery fails, the enquiry remains saved and the public visitor still receives the normal success message.

## Titan SMTP Setup

Production mail delivery uses Titan Email over SMTP.

Hostinger environment variables:

```bash
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<full Titan mailbox>
SMTP_PASSWORD=<secret>
ARCHIVE_NOTIFICATION_EMAIL=archive@tioluwalasemajekodunmi.com
```

Use port `465` with SSL/TLS for production. Port `587` with STARTTLS may be used only if required by the mailbox configuration.

Never commit the real SMTP password. Never add it to `NEXT_PUBLIC_` variables.

## Migration

Migration `0017_contact_submissions.sql` creates:

- `public.contact_submissions`
- tenant, status, type, sender, message, consent, attachment, and review fields
- indexes for tenant/status review lists and created date sorting
- updated-at trigger
- RLS policies for authenticated reviewers

Apply the migration with the normal Supabase release workflow before deploying the public form.

## Limitations

- The rate limit is process-local and should be replaced with a durable limiter if submission volume increases.
- Email notification uses one direct SMTP attempt. A durable queue/retry system is deferred.
- Attachments remain private review assets until manually promoted through the Media Library workflow.
- DOC, DOCX, and TXT support is deferred pending storage-policy review.

## Hostinger Deployment Checklist

After this feature is merged and deployed:

1. Add or verify all Titan SMTP environment variables in Hostinger.
2. Rebuild and restart the application.
3. Submit a test enquiry from `/contact`.
4. Confirm the enquiry appears in Admin -> Enquiries.
5. Confirm the notification arrives at `archive@tioluwalasemajekodunmi.com`.
6. Confirm any uploaded file is not attached to the email.
7. Confirm the protected admin review link opens after sign-in.
8. Temporarily remove or invalidate SMTP configuration only in a safe test window, submit another enquiry, and confirm the enquiry remains saved even though notification delivery is skipped or fails.
