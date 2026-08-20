import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaFilters, MediaLibraryGrid } from "@/components/admin/media-library";
import { getAdminMediaRecords, getMediaAlbums } from "@/lib/media/queries";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

type AdminGalleryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}

export default async function AdminGalleryPage({ searchParams }: AdminGalleryPageProps) {
  const context = await requireLegacyProfilePermission("access_media_library");
  const params = await searchParams;
  const albums = await getMediaAlbums(context);
  const images = await getAdminMediaRecords(context, {
    type: "image",
    search: value(params.search),
    visibility: value(params.visibility),
    status: value(params.status),
    verification: value(params.verification),
    albumId: value(params.albumId),
    category: value(params.category),
    imageType: value(params.imageType),
    approval: value(params.approval)
  });

  return (
    <main>
      <AdminPageHeader
        eyebrow="Gallery Management"
        title="Archive images"
        description="Upload, classify, review, approve, and publish Baba Muyi archive images without mixing originals, restorations, documentary stills, or AI-assisted reconstructions."
      />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-3">
          <Link className="rounded bg-archive-navy px-4 py-2 text-sm font-semibold text-white" href="/admin/media/upload">Upload images</Link>
          <Link className="rounded border border-archive-navy/20 px-4 py-2 text-sm font-semibold text-archive-navy" href="/admin/media/albums">Manage albums</Link>
          <Link className="rounded border border-archive-navy/20 px-4 py-2 text-sm font-semibold text-archive-navy" href="/gallery" target="_blank">View public gallery</Link>
        </div>
        <MediaFilters albums={albums} fixedType="image" />
        <MediaLibraryGrid records={images} />
      </section>
    </main>
  );
}
