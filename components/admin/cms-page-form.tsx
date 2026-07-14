import type { CmsPage } from "@/lib/cms-types";
import { saveCmsPage } from "@/lib/cms-actions";

export function CmsPageForm({ page }: { page: CmsPage }) {
  return (
    <form action={saveCmsPage} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <input name="id" type="hidden" value={page.id} />
      <div className="grid gap-2 md:grid-cols-[.5fr_1fr]">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="path">Path</label>
          <input className="rounded border border-slate-300 px-3 py-2" id="path" name="path" defaultValue={page.path} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-archive-navy" htmlFor="title">Page title</label>
          <input className="rounded border border-slate-300 px-3 py-2" id="title" name="title" defaultValue={page.title} />
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <input className="rounded border border-slate-300 px-3 py-2" name="eyebrow" defaultValue={page.eyebrow} placeholder="Eyebrow" />
        <select className="rounded border border-slate-300 px-3 py-2" name="status" defaultValue={page.status} aria-label="Status">
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2" name="visibility" defaultValue={page.visibility} aria-label="Visibility">
          <option value="public">Public</option>
          <option value="preview">Preview</option>
          <option value="private">Private</option>
          <option value="family_only">Family members</option>
          <option value="registered">Registered</option>
          <option value="invited">Invited</option>
        </select>
      </div>
      <textarea className="min-h-24 rounded border border-slate-300 px-3 py-2" name="description" defaultValue={page.description} placeholder="Hero description" />
      <textarea className="min-h-32 rounded border border-slate-300 px-3 py-2" name="body" defaultValue={page.body} placeholder="Page body" />
      <textarea
        className="min-h-28 rounded border border-slate-300 px-3 py-2"
        name="cards"
        defaultValue={page.cards.map((card) => `${card.title} | ${card.description}${card.href ? ` | ${card.href}` : ""}`).join("\n")}
        placeholder="One card per line: Title | Description | /optional-link"
      />
      <div className="grid gap-2 md:grid-cols-3">
        <select className="rounded border border-slate-300 px-3 py-2" name="verificationStatus" defaultValue={page.verificationStatus} aria-label="Verification status">
          <option value="unverified">Unverified</option>
          <option value="family_memory">Family memory</option>
          <option value="partially_verified">Partially verified</option>
          <option value="verified">Verified</option>
        </select>
        <input className="rounded border border-slate-300 px-3 py-2" name="seoTitle" defaultValue={page.seoTitle} placeholder="SEO title" />
        <input className="rounded border border-slate-300 px-3 py-2" name="metaDescription" defaultValue={page.metaDescription} placeholder="Meta description" />
      </div>
      <button className="justify-self-start rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="submit">
        Save CMS page
      </button>
    </form>
  );
}
