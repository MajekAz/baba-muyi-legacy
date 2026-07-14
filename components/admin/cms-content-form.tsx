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
      <div className="grid gap-2 md:grid-cols-3">
        <select className="rounded border border-slate-300 px-3 py-2" name="kind" defaultValue={record?.kind ?? kind} aria-label="Content type">
          {kinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <input className="rounded border border-slate-300 px-3 py-2" name="title" defaultValue={record?.title} placeholder="Title" />
        <input className="rounded border border-slate-300 px-3 py-2" name="slug" defaultValue={record?.slug} placeholder="slug" />
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        <input className="rounded border border-slate-300 px-3 py-2" name="relatedPath" defaultValue={record?.relatedPath} placeholder="/related-page" />
        <input className="rounded border border-slate-300 px-3 py-2" name="category" defaultValue={record?.category} placeholder="Category" />
        <input className="rounded border border-slate-300 px-3 py-2" name="dateLabel" defaultValue={record?.dateLabel} placeholder="Date label" />
        <input className="rounded border border-slate-300 px-3 py-2" name="sortOrder" defaultValue={record?.sortOrder ?? 0} type="number" />
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <input className="rounded border border-slate-300 px-3 py-2" name="author" defaultValue={record?.author} placeholder="Author" />
        <input className="rounded border border-slate-300 px-3 py-2" name="featuredImageId" defaultValue={record?.featuredImageId} placeholder="Featured image/media ID" />
        <input className="rounded border border-slate-300 px-3 py-2" name="seoTitle" defaultValue={record?.seoTitle} placeholder="SEO title" />
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <select className="rounded border border-slate-300 px-3 py-2" name="status" defaultValue={record?.status ?? "draft"} aria-label="Status">
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2" name="visibility" defaultValue={record?.visibility ?? "private"} aria-label="Visibility">
          <option value="public">Public</option>
          <option value="preview">Preview</option>
          <option value="private">Private</option>
          <option value="family_only">Family members</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2" name="verificationStatus" defaultValue={record?.verificationStatus ?? "unverified"} aria-label="Verification status">
          <option value="unverified">Unverified</option>
          <option value="family_memory">Family memory</option>
          <option value="partially_verified">Partially verified</option>
          <option value="verified">Verified</option>
        </select>
      </div>
      <textarea className="min-h-24 rounded border border-slate-300 px-3 py-2" name="summary" defaultValue={record?.summary} placeholder="Summary" />
      <textarea className="min-h-32 rounded border border-slate-300 px-3 py-2" name="body" defaultValue={record?.body} placeholder="Full body, transcript, notes, or description" />
      <div className="grid gap-2 md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2" name="mediaUrl" defaultValue={record?.mediaUrl} placeholder="Image, audio, video, or document URL" />
        <input className="rounded border border-slate-300 px-3 py-2" name="externalUrl" defaultValue={record?.externalUrl} placeholder="External URL or playback URL" />
      </div>
      <input className="rounded border border-slate-300 px-3 py-2" name="metaDescription" defaultValue={record?.metaDescription} placeholder="Meta description" />
      <button className="justify-self-start rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="submit">
        Save CMS record
      </button>
    </form>
  );
}
