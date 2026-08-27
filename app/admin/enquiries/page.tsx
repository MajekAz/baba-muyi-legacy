import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { contactStatusLabels, contactTypeLabels, type ContactSubmissionStatus, type ContactSubmissionType } from "@/lib/contact/types";
import { getContactSubmissionCounts, getContactSubmissions } from "@/lib/contact/queries";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

type EnquiriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}

function preview(message: string) {
  return message.length > 150 ? `${message.slice(0, 147)}...` : message;
}

export default async function EnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const context = await requireLegacyProfilePermission("review_submissions");
  const params = await searchParams;
  const status = value(params.status) ?? "all";
  const search = value(params.search) ?? "";
  const [submissions, counts] = await Promise.all([
    getContactSubmissions(context, { status, search }),
    getContactSubmissionCounts(context)
  ]);

  return (
    <main>
      <AdminPageHeader
        eyebrow="Enquiries"
        title="Archive contact submissions"
        description="Review memories, corrections, archive material, documentary enquiries, and sensitive contact messages submitted through the public archive."
      />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-3 sm:grid-cols-4">
          {(Object.keys(contactStatusLabels) as ContactSubmissionStatus[]).map((key) => (
            <Link
              key={key}
              className="rounded border border-archive-navy/12 bg-white p-4 shadow-sm hover:border-archive-gold"
              href={`/admin/enquiries?status=${key}`}
            >
              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-archive-brown">{contactStatusLabels[key]}</span>
              <span className="mt-2 block font-serif text-3xl font-semibold text-archive-navy">{counts[key]}</span>
            </Link>
          ))}
        </div>

        <form className="flex flex-col gap-3 rounded border border-archive-navy/12 bg-white p-4 shadow-sm sm:flex-row" action="/admin/enquiries">
          <label className="grid flex-1 gap-2 text-sm font-semibold text-archive-navy">
            Search enquiries
            <input className="min-h-11 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="search" defaultValue={search} placeholder="Name, email, or message..." />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">
            Status
            <select className="min-h-11 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="status" defaultValue={status}>
              <option value="all">All statuses</option>
              {(Object.keys(contactStatusLabels) as ContactSubmissionStatus[]).map((key) => (
                <option key={key} value={key}>{contactStatusLabels[key]}</option>
              ))}
            </select>
          </label>
          <button className="self-end rounded bg-archive-navy px-5 py-3 text-sm font-bold text-white" type="submit">Filter</button>
        </form>

        <div className="overflow-hidden rounded border border-archive-navy/12 bg-white shadow-sm">
          {submissions.length ? (
            <div className="divide-y divide-slate-200">
              {submissions.map((submission) => (
                <Link key={submission.id} className="grid gap-3 p-5 hover:bg-archive-cream/70 lg:grid-cols-[1fr_11rem_9rem]" href={`/admin/enquiries/${submission.id}`}>
                  <div>
                    <p className="text-sm font-bold text-archive-navy">{submission.sender_name}</p>
                    <p className="mt-1 text-xs text-slate-500">{submission.sender_email}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{preview(submission.message)}</p>
                    {submission.attachment_filename ? <p className="mt-2 text-xs font-semibold text-archive-brown">Attachment included</p> : null}
                  </div>
                  <div className="text-sm text-slate-700">{contactTypeLabels[submission.submission_type as ContactSubmissionType] ?? submission.submission_type}</div>
                  <div>
                    <span className="inline-flex rounded-full bg-archive-gold/15 px-3 py-1 text-xs font-bold text-archive-navy">
                      {contactStatusLabels[submission.status as ContactSubmissionStatus] ?? submission.status}
                    </span>
                    <p className="mt-2 text-xs text-slate-500">{new Date(submission.created_at).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold text-archive-navy">No enquiries found</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">New archive contact submissions will appear here for authorised reviewers.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
