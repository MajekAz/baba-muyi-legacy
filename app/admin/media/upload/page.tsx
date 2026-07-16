import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaUploader } from "@/components/admin/media-uploader";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

export default async function AdminMediaUploadPage() {
  await requireLegacyProfilePermission("upload_media");

  return (
    <main>
      <AdminPageHeader eyebrow="Media Library" title="Upload archive media" description="Upload files safely. Originals remain preserved and uploaded items start private and under review." />
      <section className="p-4 sm:p-6 lg:p-8">
        <MediaUploader />
      </section>
    </main>
  );
}
