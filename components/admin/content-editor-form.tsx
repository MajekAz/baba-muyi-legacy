import { RichTextEditor } from "@/components/admin/rich-text-editor";

export function ContentEditorForm({ contentType = "Content" }: { contentType?: string }) {
  return (
    <form className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-archive-navy" htmlFor="title">Title</label>
        <input className="rounded border border-slate-300 px-3 py-2" id="title" name="title" placeholder={`${contentType} title`} />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="slug">Slug</label>
          <input className="rounded border border-slate-300 px-3 py-2" id="slug" name="slug" placeholder="approved-content-slug" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="status">Status</label>
          <select className="rounded border border-slate-300 px-3 py-2" id="status" name="status">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <select className="rounded border border-slate-300 px-3 py-2" name="visibility" aria-label="Visibility">
          <option value="private">Private</option>
          <option value="preview">Preview</option>
          <option value="public">Public</option>
          <option value="family_only">Family members</option>
          <option value="specific_users">Specific users</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2" name="verificationStatus" aria-label="Verification status">
          <option value="unverified">Unverified</option>
          <option value="family_memory">Family memory</option>
          <option value="partially_verified">Partially verified</option>
          <option value="verified">Verified</option>
        </select>
        <input className="rounded border border-slate-300 px-3 py-2" name="sortOrder" placeholder="Sort order" type="number" min="0" />
      </div>
      <textarea className="min-h-24 rounded border border-slate-300 px-3 py-2" name="summary" placeholder="Summary" />
      <RichTextEditor name="fullContent" />
      <div className="grid gap-2 md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2" name="seoTitle" placeholder="SEO title" />
        <input className="rounded border border-slate-300 px-3 py-2" name="metaDescription" placeholder="Meta description" />
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="button">Save draft</button>
        <button className="rounded border border-archive-navy/20 px-5 py-3 text-sm font-semibold text-archive-navy" type="button">Preview</button>
        <button className="rounded border border-archive-gold px-5 py-3 text-sm font-semibold text-archive-brown" type="button">Submit for review</button>
      </div>
    </form>
  );
}
