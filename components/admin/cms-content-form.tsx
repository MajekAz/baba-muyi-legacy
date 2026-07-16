import type { CmsContentKind, CmsContentRecord } from "@/lib/cms-types";
import { saveCmsContent } from "@/lib/cms-actions";

const kinds: Array<{ value: CmsContentKind; label: string }> = [
  { value: "biography_chapter", label: "Biography chapter" },
  { value: "timeline_event", label: "Timeline event" },
  { value: "lesson", label: "Lesson" },
  { value: "gallery_album", label: "Gallery album" },
  { value: "media_item", label: "Media item" },
  { value: "documentary", label: "Documentary" },
  { value: "documentary_episode", label: "Documentary episode" },
  { value: "blog_post", label: "Blog post" },
  { value: "family_member", label: "Family member" },
  { value: "testimonial", label: "Testimonial" }
];

export function CmsContentForm({ record, kind = "biography_chapter" }: { record?: CmsContentRecord; kind?: CmsContentKind }) {
  return (
    <form action={saveCmsContent} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <input name="id" type="hidden" value={record?.id ?? ""} />
      <input name="createdAt" type="hidden" value={record?.createdAt ?? ""} />
      <fieldset className="grid gap-3 rounded border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-archive-navy">General information</legend>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Content type<select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="kind" defaultValue={record?.kind ?? kind}>
            {kinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Title<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="title" defaultValue={record?.title} placeholder="Title" /></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Slug<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="slug" defaultValue={record?.slug} placeholder="slug" /></label>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Related path<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="relatedPath" defaultValue={record?.relatedPath} placeholder="/related-page" /></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Category<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="category" defaultValue={record?.category} placeholder="Category" /></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Date label<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="dateLabel" defaultValue={record?.dateLabel} placeholder="Date label" /></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Sort order<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="sortOrder" defaultValue={record?.sortOrder ?? 0} type="number" /></label>
        </div>
      </fieldset>
      <fieldset className="grid gap-3 rounded border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-archive-navy">Publishing and visibility</legend>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Status<select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="status" defaultValue={record?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Visibility<select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="visibility" defaultValue={record?.visibility ?? "private"}>
            <option value="public">Public</option>
            <option value="preview">Preview</option>
            <option value="private">Private</option>
            <option value="family_only">Family members</option>
          </select></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Verification status<select className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="verificationStatus" defaultValue={record?.verificationStatus ?? "unverified"}>
            <option value="unverified">Unverified</option>
            <option value="family_memory">Family memory</option>
            <option value="partially_verified">Partially verified</option>
            <option value="verified">Verified</option>
          </select></label>
        </div>
      </fieldset>
      <fieldset className="grid gap-3 rounded border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-archive-navy">Content</legend>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy">Summary<textarea className="min-h-24 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="summary" defaultValue={record?.summary} placeholder="Summary" /></label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy">Body, transcript, or notes<textarea className="min-h-32 rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="body" defaultValue={record?.body} placeholder="Full body, transcript, notes, or description" /></label>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy">Author<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="author" defaultValue={record?.author} placeholder="Author" /></label>
      </fieldset>
      <fieldset className="grid gap-3 rounded border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-archive-navy">Media</legend>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Media URL<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="mediaUrl" defaultValue={record?.mediaUrl} placeholder="Image, audio, video, or document URL" /></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">External playback URL<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="externalUrl" defaultValue={record?.externalUrl} placeholder="External URL or playback URL" /></label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-archive-navy">Featured media ID<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="featuredImageId" defaultValue={record?.featuredImageId} placeholder="Featured image/media ID" /></label>
      </fieldset>
      <fieldset className="grid gap-3 rounded border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-archive-navy">SEO</legend>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">SEO title<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="seoTitle" defaultValue={record?.seoTitle} placeholder="SEO title" /></label>
          <label className="grid gap-2 text-sm font-semibold text-archive-navy">Meta description<input className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-900" name="metaDescription" defaultValue={record?.metaDescription} placeholder="Meta description" /></label>
        </div>
      </fieldset>
      <button className="justify-self-start rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="submit">
        Save changes
      </button>
    </form>
  );
}
