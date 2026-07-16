import Link from "next/link";
import { Archive, FileAudio, FileText, ImageIcon, Video } from "lucide-react";
import { addMediaToAlbum, archiveMediaAlbum, archiveMediaItem, createMediaAlbum, removeMediaFromAlbum, updateMediaAlbum } from "@/lib/media/actions";
import { mediaTypeLabels } from "@/lib/media/config";
import type { MediaAlbum, MediaAlbumItem, MediaRecord } from "@/lib/media/types";

function IconForType({ type }: { type: string }) {
  if (type === "image") return <ImageIcon aria-hidden="true" className="size-5" />;
  if (type === "audio") return <FileAudio aria-hidden="true" className="size-5" />;
  if (type === "video_clip") return <Video aria-hidden="true" className="size-5" />;
  return <FileText aria-hidden="true" className="size-5" />;
}

export function MediaFilters({ albums }: { albums: MediaAlbum[] }) {
  return (
    <form className="grid gap-3 rounded border border-archive-navy/12 bg-white p-4 shadow-sm md:grid-cols-6">
      <label className="grid gap-1 text-sm font-semibold text-archive-navy">
        Search
        <input className="rounded border border-slate-300 px-3 py-2 font-normal" name="search" placeholder="Title" />
      </label>
      <label className="grid gap-1 text-sm font-semibold text-archive-navy">
        Type
        <select className="rounded border border-slate-300 px-3 py-2 font-normal" name="type">
          <option value="">All</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="audio">Audio</option>
          <option value="video_clip">Video</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold text-archive-navy">
        Album
        <select className="rounded border border-slate-300 px-3 py-2 font-normal" name="albumId">
          <option value="">All</option>
          {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold text-archive-navy">
        Visibility
        <select className="rounded border border-slate-300 px-3 py-2 font-normal" name="visibility">
          <option value="">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="family_only">Family</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold text-archive-navy">
        Status
        <select className="rounded border border-slate-300 px-3 py-2 font-normal" name="status">
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="in_review">In review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <button className="self-end rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" type="submit">Apply</button>
    </form>
  );
}

export function MediaLibraryGrid({ records }: { records: MediaRecord[] }) {
  if (!records.length) {
    return (
      <div className="rounded border border-dashed border-archive-navy/20 bg-white p-8 text-center">
        <p className="font-serif text-2xl text-archive-navy">No media yet</p>
        <p className="mt-2 text-sm text-slate-600">Upload images, documents, audio, or short clips to start building the archive.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {records.map((record) => (
        <article className="rounded border border-archive-navy/12 bg-white p-4 shadow-sm" key={record.id}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded bg-archive-cream text-archive-brown"><IconForType type={record.mediaType} /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{mediaTypeLabels[record.mediaType as keyof typeof mediaTypeLabels] ?? record.mediaType}</p>
                <h2 className="font-serif text-xl text-archive-navy">{record.title}</h2>
              </div>
            </div>
            <input aria-label={`Select ${record.title}`} type="checkbox" className="mt-2 size-4" />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-slate-500">Status</dt><dd className="font-semibold text-archive-navy">{record.publicationStatus}</dd></div>
            <div><dt className="text-slate-500">Visibility</dt><dd className="font-semibold text-archive-navy">{record.visibility}</dd></div>
            <div><dt className="text-slate-500">Review</dt><dd className="font-semibold text-archive-navy">{record.moderationStatus}</dd></div>
            <div><dt className="text-slate-500">Album</dt><dd className="font-semibold text-archive-navy">{record.albumTitle || "Unassigned"}</dd></div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="rounded bg-archive-navy px-3 py-2 text-sm font-semibold text-white" href={`/admin/media/${record.id}`}>Edit</Link>
            <form action={archiveMediaItem}>
              <input type="hidden" name="id" value={record.id} />
              <button className="inline-flex items-center gap-1 rounded border border-archive-navy/20 px-3 py-2 text-sm font-semibold text-archive-navy" type="submit">
                <Archive aria-hidden="true" className="size-4" />
                Archive
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}

export function AlbumManager({ albums, media, albumItemsByAlbumId = {} }: { albums: MediaAlbum[]; media: MediaRecord[]; albumItemsByAlbumId?: Record<string, MediaAlbumItem[]> }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
      <section className="rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl text-archive-navy">Albums</h2>
        <div className="mt-4 grid gap-3">
          {albums.length ? albums.map((album) => (
            <article className="grid gap-4 rounded border border-slate-200 p-4" key={album.id}>
              <form action={updateMediaAlbum} className="grid gap-3">
                <input name="id" type="hidden" value={album.id} />
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{album.publicationStatus} · {album.visibility}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold text-archive-navy">Title<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="title" defaultValue={album.title} required /></label>
                  <label className="grid gap-1 text-sm font-semibold text-archive-navy">Slug<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="slug" defaultValue={album.slug} required /></label>
                </div>
                <label className="grid gap-1 text-sm font-semibold text-archive-navy">Description<textarea className="min-h-20 rounded border border-slate-300 px-3 py-2 font-normal" name="description" defaultValue={album.description} /></label>
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="grid gap-1 text-sm font-semibold text-archive-navy">Sort<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="sortOrder" type="number" defaultValue={album.sortOrder} /></label>
                  <label className="grid gap-1 text-sm font-semibold text-archive-navy">Cover<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="coverMediaId" defaultValue={album.coverMediaId}>
                    <option value="">No cover</option>
                    {media.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                  </select></label>
                  <label className="grid gap-1 text-sm font-semibold text-archive-navy">Visibility<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="visibility" defaultValue={album.visibility}>
                    <option value="private">Private</option><option value="family_only">Family only</option><option value="public">Public</option>
                  </select></label>
                  <label className="grid gap-1 text-sm font-semibold text-archive-navy">Status<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="publicationStatus" defaultValue={album.publicationStatus}>
                    <option value="draft">Draft</option><option value="in_review">In review</option><option value="published">Published</option><option value="archived">Archived</option>
                  </select></label>
                </div>
                <button className="justify-self-start rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" type="submit">Save album</button>
              </form>
              <form action={addMediaToAlbum} className="grid gap-3 rounded bg-archive-cream/45 p-3 md:grid-cols-[1fr_6rem_auto] md:items-end">
                <input name="albumId" type="hidden" value={album.id} />
                <label className="grid gap-1 text-sm font-semibold text-archive-navy">Add media<select className="rounded border border-slate-300 px-3 py-2 font-normal" name="mediaItemId" required>
                  <option value="">Choose media</option>
                  {media.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select></label>
                <label className="grid gap-1 text-sm font-semibold text-archive-navy">Order<input className="rounded border border-slate-300 px-3 py-2 font-normal" name="sortOrder" type="number" defaultValue={0} /></label>
                <button className="rounded border border-archive-navy/20 px-3 py-2 text-sm font-semibold text-archive-navy" type="submit">Add</button>
              </form>
              <div className="grid gap-2">
                {(albumItemsByAlbumId[album.id] ?? []).length ? (albumItemsByAlbumId[album.id] ?? []).map((item) => (
                  <form action={removeMediaFromAlbum} className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 px-3 py-2 text-sm" key={item.id}>
                    <input name="id" type="hidden" value={item.id} />
                    <input name="mediaItemId" type="hidden" value={item.mediaItemId} />
                    <span><strong className="text-archive-navy">{item.sortOrder}</strong> · {item.title} ({item.mediaType.replace("_", " ")})</span>
                    <button className="text-sm font-semibold text-red-700" type="submit">Remove</button>
                  </form>
                )) : <p className="text-sm text-slate-600">No media assigned yet.</p>}
              </div>
              <form action={archiveMediaAlbum}>
                <input name="id" type="hidden" value={album.id} />
                <button className="inline-flex items-center gap-1 rounded border border-red-200 px-3 py-2 text-sm font-semibold text-red-700" type="submit">
                  <Archive aria-hidden="true" className="size-4" />
                  Archive album
                </button>
              </form>
            </article>
          )) : <p className="text-sm text-slate-600">No albums have been created yet.</p>}
        </div>
      </section>
      <form action={createMediaAlbum} className="grid gap-3 rounded border border-archive-navy/12 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl text-archive-navy">Create album</h2>
        <input className="rounded border border-slate-300 px-3 py-2" name="title" placeholder="Album title" required />
        <input className="rounded border border-slate-300 px-3 py-2" name="slug" placeholder="album-slug" required />
        <textarea className="min-h-24 rounded border border-slate-300 px-3 py-2" name="description" placeholder="Description" />
        <input className="rounded border border-slate-300 px-3 py-2" name="sortOrder" type="number" defaultValue={0} />
        <select className="rounded border border-slate-300 px-3 py-2" name="visibility" defaultValue="private" aria-label="Album visibility">
          <option value="private">Private</option>
          <option value="family_only">Family only</option>
          <option value="public">Public</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2" name="publicationStatus" defaultValue="draft" aria-label="Album status">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <button className="rounded bg-archive-navy px-4 py-3 text-sm font-semibold text-white" type="submit">Create album</button>
      </form>
    </div>
  );
}
