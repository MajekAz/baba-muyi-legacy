import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MenuManagementForm } from "@/components/admin/menu-management-form";
import { getAllMenuItems } from "@/lib/cms-store";

export default async function HeaderMenuPage() {
  const items = await getAllMenuItems("header");
  return (
    <main>
      <AdminPageHeader eyebrow="Menus" title="Header Menu" description="Manage published and scheduled header navigation items." />
      <section className="p-4 sm:p-6 lg:p-8"><MenuManagementForm location="header" items={items} /></section>
    </main>
  );
}
