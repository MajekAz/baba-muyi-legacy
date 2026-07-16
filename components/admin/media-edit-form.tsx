import { updateMediaItem } from "@/lib/media/actions";
import type { MediaAlbum, MediaRecord } from "@/lib/media/types";

export function MediaEditForm({ record, albums }: { record: MediaRecord; albums: MediaAlbum[] }) {
  return (
    <form action={updateMediaItem} className="grid gap-5 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
      <input type="hidden" name="id" value={record.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Title<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="title" defaultValue={record.title} required /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Slug<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="slug" defaultValue={record.slug} required /></label>
      </div>
      <label className="grid gap-1 text-sm font-semibold text-archive-navy">Description<textarea className="min-h-24 rounded border border-slate-300 px-3 py-2 font-normal" name="description" defaultValue={record.description} /></label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Caption<textarea className="min-h-20 rounded border border-slate-300 px-3 py-2 font-normal" name="caption" defaultValue={record.caption} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Alt text<textarea className="min-h-20 rounded border border-slate-300 px-3 py-2 font-normal" name="altText" defaultValue={record.altText} /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Date<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="approximateDate" defaultValue={record.approximateDate} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Precision<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="datePrecision" defaultValue={record.datePrecision}>
          <option value="unknown">Unknown</option><option value="year">Year</option><option value="month">Month</option><option value="day">Day</option><option value="circa">Circa</option><option value="range">Range</option>
        </select></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Location<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="location" defaultValue={record.location} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">People shown<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="peopleShown" defaultValue={record.peopleShown.join(", ")} /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Source<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="source" defaultValue={record.source} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Copyright owner<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="copyrightOwner" defaultValue={record.copyrightOwner} /></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Licence<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="licence" defaultValue={record.licence} /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Album<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="albumId" defaultValue={record.albumId ?? ""}>
          <option value="">Unassigned</option>
          {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
        </select></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Verification<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="verificationStatus" defaultValue={record.verificationStatus}>
          <option value="unverified">Unverified</option><option value="family_memory">Family memory</option><option value="partially_verified">Partially verified</option><option value="verified">Verified</option>
        </select></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Visibility<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="visibility" defaultValue={record.visibility}>
          <option value="private">Private</option><option value="family_only">Family only</option><option value="public">Public</option>
        </select></label>
        <label className="grid gap-1 text-sm font-semibold text-archive-navy">Publication<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="publicationStatus" defaultValue={record.publicationStatus}>
          <option value="draft">Draft</option><option value="in_review">In review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select></label>
      </div>
      <input type="hidden" name="moderationStatus" value={record.moderationStatus} />
      <button className="justify-self-start rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" type="submit">Save media metadata</button>
    </form>
  );
}
