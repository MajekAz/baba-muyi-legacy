import Image from "next/image";
import Link from "next/link";
import type { MediaAlbum, MediaRecord } from "@/lib/media/types";

export function PublicMediaGrid({ records }: { records: MediaRecord[] }) {
  if (!records.length) {
    return (
      <div className="rounded border border-archive-navy/12 bg-white/80 p-6">
        <h2 className="font-serif text-2xl text-archive-navy">No public media yet</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Approved public media will appear here when the archive team publishes it.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {records.map((record) => (
        <article className="rounded border border-archive-navy/12 bg-white/85 p-4 shadow-sm" key={record.id}>
          {record.mediaType === "image" && record.signedUrl ? (
            <Image className="aspect-[4/3] rounded object-cover" src={record.signedUrl} alt={record.altText || record.title} width={800} height={600} sizes="(min-width: 768px) 33vw, 100vw" />
          ) : null}
          {record.mediaType === "audio" && record.signedUrl ? <audio className="mt-2 w-full" controls src={record.signedUrl} /> : null}
          {record.mediaType === "video_clip" && record.signedUrl ? <video className="mt-2 aspect-video w-full rounded" controls src={record.signedUrl} /> : null}
          {record.mediaType === "document" && record.signedUrl ? <Link className="mt-2 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={record.signedUrl}>Open PDF preview</Link> : null}
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">{record.mediaType.replace("_", " ")}</p>
          <h2 className="mt-1 font-serif text-2xl text-archive-navy">{record.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{record.caption || record.description}</p>
        </article>
      ))}
    </div>
  );
}

export function PublicAlbumGrid({ albums }: { albums: MediaAlbum[] }) {
  if (!albums.length) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {albums.map((album) => (
        <Link className="rounded border border-archive-navy/12 bg-white/80 p-5 shadow-sm transition hover:border-archive-gold" href={`/gallery/${album.slug}`} key={album.id}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-archive-brown">Album</p>
          <h2 className="mt-1 font-serif text-2xl text-archive-navy">{album.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{album.description || "Public album prepared by the archive team."}</p>
        </Link>
      ))}
    </div>
  );
}
