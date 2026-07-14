import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MenuManagementForm } from "@/components/admin/menu-management-form";
import { getAllMenuItems } from "@/lib/cms-store";

export default async function MobileMenuPage() {
  const items = await getAllMenuItems("mobile");
  return (
    <main>
      <AdminPageHeader eyebrow="Menus" title="Mobile Menu" description="Manage expandable mobile navigation and touch-friendly menu items." />
      <section className="p-4 sm:p-6 lg:p-8"><MenuManagementForm location="mobile" items={items} /></section>
    </main>
  );
}
