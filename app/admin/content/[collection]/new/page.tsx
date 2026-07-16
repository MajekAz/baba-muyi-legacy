import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentEditorForm } from "@/components/admin/content-editor-form";
import { cmsCoreCollections, type CmsCoreCollection } from "@/lib/cms-core";
import { roleHasPermission } from "@/lib/permissions";
import { getSelectableMedia } from "@/lib/media/queries";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

function isCollection(value: string): value is CmsCoreCollection {
  return value in cmsCoreCollections;
}

export default async function NewCmsContentPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionParam } = await params;
  if (!isCollection(collectionParam)) notFound();

  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const config = cmsCoreCollections[collectionParam];
  const mediaOptions = await getSelectableMedia(context);

  return (
    <main>
      <AdminPageHeader eyebrow="CMS" title={`Create ${config.label.toLowerCase()}`} description="Save as a draft first, then submit for review or publish if your role allows it." />
      <section className="p-4 sm:p-6 lg:p-8">
        <ContentEditorForm canPublish={roleHasPermission(context.role, "publish_content")} collection={collectionParam} mediaOptions={mediaOptions} />
      </section>
    </main>
  );
}
