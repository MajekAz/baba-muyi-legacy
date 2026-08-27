import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { updateContactSubmission } from "@/lib/contact/actions";
import { contactStatusLabels, contactTypeLabels, type ContactSubmissionStatus, type ContactSubmissionType } from "@/lib/contact/types";
import { getContactSubmission } from "@/lib/contact/queries";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

type EnquiryDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const context = await requireLegacyProfilePermission("review_submissions");
  const { id } = await params;
  const submission = await getContactSubmission(context, id);

  if (!submission) {
    notFound();
  }

  return (
    <main>
      <AdminPageHeader
        eyebrow="Enquiries"
        title="Review contact submission"
        description="Review contributor context, record internal notes, and keep submitted attachments private until editorial approval."
      />
      <section className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_.72fr] lg:p-8">
        <article className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <Link className="text-sm font-bold text-archive-brown underline-offset-4 hover:underline" href="/admin/enquiries">
            Back to enquiries
          </Link>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">
                {contactTypeLabels[submission.submission_type as ContactSubmissionType] ?? submission.submission_type}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-archive-navy">{submission.sender_name}</h2>
              <p className="mt-1 text-sm text-slate-600">{submission.sender_email}</p>
              {submission.relationship ? <p className="mt-1 text-sm text-slate-600">{submission.relationship}</p> : null}
            </div>
            <span className="rounded-full bg-archive-gold/15 px-3 py-1 text-xs font-bold text-archive-navy">
              {contactStatusLabels[submission.status as ContactSubmissionStatus] ?? submission.status}
            </span>
          </div>

          <div className="mt-8 rounded bg-archive-cream p-5">
            <h3 className="text-sm font-bold text-archive-navy">Message</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">{submission.message}</p>
          </div>

          {submission.attachment_path ? (
            <div className="mt-6 rounded border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-archive-navy">Private attachment</h3>
              <p className="mt-2 text-sm text-slate-700">
                {submission.attachment_filename ?? "Attachment"} · {submission.attachment_mime_type ?? "Unknown type"} · {formatBytes(submission.attachment_size_bytes)}
              </p>
              <Link
                className="mt-4 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-bold text-white"
                href={`/admin/enquiries/${submission.id}/attachment`}
              >
                Open private attachment
              </Link>
            </div>
          ) : null}
        </article>

        <aside className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-archive-navy">Review workflow</h2>
          <form action={updateContactSubmission} className="mt-5 grid gap-5">
            <input type="hidden" name="id" value={submission.id} />
            <label className="grid gap-2 text-sm font-semibold text-archive-navy">
              Status
              <select className="min-h-11 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="status" defaultValue={submission.status}>
                {(Object.keys(contactStatusLabels) as ContactSubmissionStatus[]).map((status) => (
                  <option key={status} value={status}>{contactStatusLabels[status]}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-archive-navy">
              Internal notes
              <textarea
                className="min-h-36 rounded border border-slate-300 px-3 py-2 font-normal leading-6 text-slate-900"
                defaultValue={submission.admin_notes ?? ""}
                maxLength={2000}
                name="adminNotes"
              />
            </label>
            <button className="min-h-11 rounded bg-archive-navy px-5 py-3 text-sm font-bold text-white" type="submit">
              Save review status
            </button>
          </form>
          <dl className="mt-6 grid gap-3 border-t border-slate-200 pt-5 text-sm">
            <div>
              <dt className="font-bold text-archive-navy">Received</dt>
              <dd className="text-slate-700">{new Date(submission.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-bold text-archive-navy">Consent</dt>
              <dd className="text-slate-700">{submission.consent_to_contact ? "Contributor consented to follow-up." : "No follow-up consent recorded."}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
