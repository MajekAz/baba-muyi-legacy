import Image from "next/image";
import Link from "next/link";
import { galleryImageTypes } from "@/lib/media/config";
import type { MediaAlbum, MediaRecord } from "@/lib/media/types";

function imageTypeLabel(value: string) {
  if (value === "ai_assisted_heritage_reconstruction") return "Heritage reconstruction";
  return galleryImageTypes[value as keyof typeof galleryImageTypes] ?? "";
}

function publicCardDescription(record: MediaRecord) {
  const text = record.caption || record.description || "";
  return text
    .replace(/\bAI-assisted heritage reconstruction\.\s*/gi, "")
    .replace(/\bInterpretive image, not an original family photograph\.\s*/gi, "")
    .trim();
}

function groupedByCategory(records: MediaRecord[]) {
  return records.reduce<Record<string, MediaRecord[]>>((groups, record) => {
    const category = record.galleryCategory || (record.mediaType === "image" ? "Uncategorised archive images" : "Archive media");
    groups[category] = [...(groups[category] ?? []), record];
    return groups;
  }, {});
}

export function PublicMediaGrid({ records }: { records: MediaRecord[] }) {
  if (!records.length) {
    return (
      <div className="rounded border border-archive-navy/12 bg-white/80 p-6">
        <h2 className="font-serif text-2xl text-archive-navy">Images awaiting archive approval</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Approved family photographs and historical images will appear here as they are reviewed, identified, and cleared for public archive use.</p>
      </div>
    );
  }

  const groups = groupedByCategory(records);

  return (
    <div className="grid gap-8">
      {Object.entries(groups).map(([category, items]) => (
        <section className="grid gap-4" key={category} aria-labelledby={`gallery-category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
          <h2 className="font-serif text-2xl text-archive-navy" id={`gallery-category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{category}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {items.map((record) => (
              <article className="rounded border border-archive-navy/12 bg-white/85 p-4 shadow-sm" key={record.id}>
                {record.mediaType === "image" && record.signedUrl ? (
                  <Image className="aspect-[4/3] rounded object-cover" src={record.signedUrl} alt={record.altText || record.title} width={800} height={600} sizes="(min-width: 768px) 33vw, 100vw" />
                ) : null}
                {record.mediaType === "audio" && record.signedUrl ? <audio className="mt-2 w-full" controls src={record.signedUrl} /> : null}
                {record.mediaType === "video_clip" && record.signedUrl ? <video className="mt-2 aspect-video w-full rounded" controls src={record.signedUrl} /> : null}
                {record.mediaType === "document" && record.signedUrl ? <Link className="mt-2 inline-flex rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href={record.signedUrl}>Open PDF preview</Link> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-archive-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-archive-brown">{record.mediaType.replace("_", " ")}</span>
                  {record.imageType ? <span className="rounded-full bg-archive-navy/8 px-3 py-1 text-xs font-semibold text-archive-navy">{imageTypeLabel(record.imageType)}</span> : null}
                </div>
                <h3 className="mt-3 font-serif text-2xl text-archive-navy">{record.title}</h3>
                {publicCardDescription(record) ? <p className="mt-2 text-sm leading-6 text-slate-600">{publicCardDescription(record)}</p> : null}
                {record.contributorCredit ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Credit: {record.contributorCredit}</p> : null}
              </article>
            ))}
          </div>
        </section>
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
