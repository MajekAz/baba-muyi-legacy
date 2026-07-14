import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MenuManagementForm } from "@/components/admin/menu-management-form";
import { getAllMenuItems } from "@/lib/cms-store";

export default async function SecondaryMenuPage() {
  const items = await getAllMenuItems("secondary");
  return (
    <main>
      <AdminPageHeader eyebrow="Menus" title="Secondary Menu" description="Manage secondary navigation groups and contextual links." />
      <section className="p-4 sm:p-6 lg:p-8"><MenuManagementForm location="secondary" items={items} /></section>
    </main>
  );
}
