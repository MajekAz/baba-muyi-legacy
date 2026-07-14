import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MenuManagementForm } from "@/components/admin/menu-management-form";
import { getAllMenuItems } from "@/lib/cms-store";

export default async function AdminMenuPage() {
  const items = await getAllMenuItems("admin");
  return (
    <main>
      <AdminPageHeader eyebrow="Menus" title="Admin Menu" description="Manage role-restricted admin navigation entries." />
      <section className="p-4 sm:p-6 lg:p-8"><MenuManagementForm location="admin" items={items} /></section>
    </main>
  );
}
