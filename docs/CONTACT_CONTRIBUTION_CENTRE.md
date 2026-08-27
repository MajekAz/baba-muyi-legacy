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
- Public submissions use a stable Route Handler, not a Next.js Server Action.
- API responses are `Cache-Control: no-store`.
- Public error messages are generic.
- Server logs must not include passwords, tokens, keys, full message bodies, or signed URLs.
- `contact_submissions` is tenant-scoped by `workspace_id` and `legacy_profile_id`.
- RLS permits authenticated users with `review_submissions` to read and update submissions.
- Attachments are only opened by authorised staff through a short-lived signed URL route.

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
- Email notification is not included yet.
- Attachments remain private review assets until manually promoted through the Media Library workflow.
- DOC, DOCX, and TXT support is deferred pending storage-policy review.
