import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MenuManagementForm } from "@/components/admin/menu-management-form";
import { getAllMenuItems } from "@/lib/cms-store";

export default async function AdminMenusPage() {
  const items = await getAllMenuItems();

  return (
    <main>
      <AdminPageHeader eyebrow="Menus" title="Menu management" description="Create header, mobile, footer, secondary, documentary, and admin menus with nested items, role restrictions, schedule states, icons, and badges." />
      <section className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <MenuManagementForm items={items} />
      </section>
    </main>
  );
}
