import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AlbumManager } from "@/components/admin/media-library";
import { getAdminMediaRecords, getMediaAlbumItems, getMediaAlbums } from "@/lib/media/queries";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

export default async function AdminMediaAlbumsPage() {
  const context = await requireLegacyProfilePermission("access_media_library");
  const [albums, media] = await Promise.all([
    getMediaAlbums(context),
    getAdminMediaRecords(context)
  ]);
  const albumItems = Object.fromEntries(await Promise.all(albums.map(async (album) => [
    album.id,
    await getMediaAlbumItems(context, album.id)
  ])));

  return (
    <main>
      <AdminPageHeader eyebrow="Media Library" title="Albums and collections" description="Create and manage archive albums without duplicating media files." />
      <section className="p-4 sm:p-6 lg:p-8">
        <AlbumManager albums={albums} albumItemsByAlbumId={albumItems} media={media} />
      </section>
    </main>
  );
}
