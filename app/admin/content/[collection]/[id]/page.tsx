import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentEditorForm } from "@/components/admin/content-editor-form";
import { cmsCoreCollections, getCmsCoreRecord, type CmsCoreCollection } from "@/lib/cms-core";
import { roleHasPermission } from "@/lib/permissions";
import { requireLegacyProfilePermission } from "@/lib/tenant-context";

function isCollection(value: string): value is CmsCoreCollection {
  return value in cmsCoreCollections;
}

export default async function EditCmsContentPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection: collectionParam, id } = await params;
  if (!isCollection(collectionParam)) notFound();

  const context = await requireLegacyProfilePermission("edit_assigned_content");
  const record = await getCmsCoreRecord(collectionParam, id, context);
  if (!record) notFound();

  return (
    <main>
      <AdminPageHeader eyebrow="CMS" title={`Edit ${cmsCoreCollections[collectionParam].label.toLowerCase()}`} description="Changes are saved with workspace and legacy-profile isolation." />
      <section className="p-4 sm:p-6 lg:p-8">
        <ContentEditorForm canPublish={roleHasPermission(context.role, "publish_content")} collection={collectionParam} record={record} />
      </section>
    </main>
  );
}
