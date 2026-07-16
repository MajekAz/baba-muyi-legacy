import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaFilters, MediaLibraryGrid } from "@/components/admin/media-library";
import { getAdminMediaRecords, getMediaAlbums } from "@/lib/media/queries";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

type AdminMediaPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const params = await searchParams;
  const albums = await getMediaAlbums(context);
  const media = await getAdminMediaRecords(context, {
    type: value(params.type),
    search: value(params.search),
    visibility: value(params.visibility),
    status: value(params.status),
    verification: value(params.verification),
    albumId: value(params.albumId)
  });

  return (
    <main>
      <AdminPageHeader eyebrow="Media Library" title="Digital archive media" description="Upload, review, organise, publish, and preserve archive images, documents, audio, and short clips." />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-3">
          <Link className="rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href="/admin/media/upload">Upload media</Link>
          <Link className="rounded border border-archive-navy/20 px-4 py-2 text-sm font-semibold text-archive-navy" href="/admin/media/albums">Manage albums</Link>
        </div>
        <MediaFilters albums={albums} />
        <MediaLibraryGrid records={media} />
      </section>
    </main>
  );
}
